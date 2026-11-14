import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { compare, hash } from "bcryptjs";
import type postgres from "postgres";
import { database, type Queryable } from "./database";
import { RequestError } from "./http";
import { audit, type UserRow } from "./records";
import { invalid, loginInput, passwordInput } from "./validation";

export type Session = { tokenHash: string; csrfToken: string; user: UserRow | null; cookie?: string };
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
// PHP PASSWORD_DEFAULT creates $2y$ bcrypt hashes; bcryptjs uses the same format.
export const verifyPassword = (password: string, encoded: string) => compare(password, encoded.replace(/^\$2y\$/, "$2b$"));
export const hashPassword = (password: string) => hash(password, 12);

export function clientKey(request: Request) {
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") : request.headers.get("x-forwarded-for");
  return createHmac("sha256", process.env.CMS_SESSION_SECRET!).update((ip?.split(",")[0]?.trim() || "local").slice(0, 200)).digest("hex");
}
export async function throttle(scope: string, limit: number, seconds: number) {
  const now = Math.floor(Date.now() / 1000), window = Math.floor(now / seconds);
  const bucket = createHmac("sha256", process.env.CMS_SESSION_SECRET!).update(`${scope}:${window}`).digest("hex");
  const [result] = await database().unsafe<{ hits: number }[]>(
    "INSERT INTO tnt_cms.rate_limits (bucket, expires_at) VALUES ($1, to_timestamp($2)) ON CONFLICT (bucket) DO UPDATE SET hits = tnt_cms.rate_limits.hits + 1 RETURNING hits",
    [bucket, (window + 1) * seconds]);
  if (result.hits > limit) throw new RequestError("RATE_LIMITED", "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.", 429, {}, seconds - now % seconds);
}
export async function createSession(sql: Queryable, request: Request, user: UserRow | null = null): Promise<Session> {
  const token = randomBytes(32).toString("hex"), csrfToken = randomBytes(32).toString("hex"), tokenHash = digest(token);
  await sql.unsafe("INSERT INTO tnt_cms.sessions (token_hash, csrf_token, user_id, auth_version) VALUES ($1,$2,$3,$4)", [tokenHash, csrfToken, user?.id ?? null, user?.auth_version ?? null]);
  const url = new URL(request.url);
  const local = !process.env.VERCEL && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && url.protocol === "http:";
  return { tokenHash, csrfToken, user, cookie: `tnt_cms=${token}; Path=/api/cms; HttpOnly; SameSite=Strict${local ? "" : "; Secure"}` };
}
export async function loadSession(request: Request): Promise<Session> {
  const sql = database();
  const token = request.headers.get("cookie")?.split(";").map(value => value.trim()).find(value => /^tnt_cms=[a-f0-9]{64}$/.test(value))?.slice(8);
  if (token) {
    const tokenHash = digest(token);
    const [session] = await sql.unsafe<{ csrf_token: string; user_id: number | null; auth_version: number | null }[]>(
      "UPDATE tnt_cms.sessions SET last_seen = now() WHERE token_hash=$1 AND expires_at > now() AND last_seen > now() - interval '30 minutes' RETURNING csrf_token, user_id, auth_version", [tokenHash]);
    if (session) {
      if (session.user_id === null) return { tokenHash, csrfToken: session.csrf_token, user: null };
      const [user] = await sql.unsafe<UserRow[]>("SELECT * FROM tnt_cms.users WHERE id=$1 AND active AND auth_version=$2", [session.user_id, session.auth_version]);
      if (user) return { tokenHash, csrfToken: session.csrf_token, user };
    }
    await sql.unsafe("DELETE FROM tnt_cms.sessions WHERE token_hash=$1", [tokenHash]);
  }
  await throttle(`session:${clientKey(request)}`, 120, 600);
  await sql.unsafe("DELETE FROM tnt_cms.sessions WHERE token_hash IN (SELECT token_hash FROM tnt_cms.sessions WHERE expires_at < now() OR last_seen < now() - interval '30 minutes' LIMIT 100)");
  await sql.unsafe("DELETE FROM tnt_cms.rate_limits WHERE expires_at < now()");
  return createSession(sql, request);
}
export function requireUser(session: Session, permission: "read" | "write" | "admin" = "read"): UserRow {
  if (!session.user) throw new RequestError("UNAUTHENTICATED", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401);
  if ((permission === "admin" && session.user.role !== "admin") || (permission === "write" && session.user.role === "viewer")) throw new RequestError("FORBIDDEN", "Tài khoản không có quyền thực hiện thao tác này.", 403);
  return session.user;
}
export async function lockActor(sql: Queryable, session: Session, permission: "read" | "write" | "admin" = "write") {
  const [user] = await sql.unsafe<UserRow[]>("SELECT u.* FROM tnt_cms.users u JOIN tnt_cms.sessions s ON s.user_id=u.id AND s.auth_version=u.auth_version WHERE s.token_hash=$1 AND u.active AND s.expires_at>now() AND s.last_seen>now()-interval '30 minutes' FOR SHARE OF u,s", [session.tokenHash]);
  return requireUser({ ...session, user: user ?? null }, permission);
}
export function csrf(request: Request, session: Session) {
  const token = request.headers.get("x-csrf-token") ?? "";
  if (!/^[a-f0-9]{64}$/.test(token) || !timingSafeEqual(Buffer.from(token), Buffer.from(session.csrfToken))) throw new RequestError("CSRF_REJECTED", "Phiên bảo vệ biểu mẫu không hợp lệ. Vui lòng tải lại trang.", 403);
}
export async function login(request: Request, session: Session, body: unknown) {
  const input = loginInput(body);
  await throttle(`login-ip:${clientKey(request)}`, 20, 900);
  await throttle(`login-user:${digest(input.username)}`, 5, 900);
  return database().begin(async sql => {
    const [user] = await sql.unsafe<UserRow[]>("SELECT * FROM tnt_cms.users WHERE username=$1 FOR UPDATE", [input.username]);
    const valid = await verifyPassword(input.password, user?.password_hash ?? "$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.");
    if (!valid || !user?.active) throw new RequestError("INVALID_CREDENTIALS", "Tên đăng nhập hoặc mật khẩu không đúng.", 401);
    await sql.unsafe("DELETE FROM tnt_cms.sessions WHERE token_hash=$1", [session.tokenHash]);
    await audit(sql, user.id, "login", "user", user.id);
    return createSession(sql, request, user);
  });
}
export async function logout(request: Request, session: Session) {
  return database().begin(async sql => {
    const user = await lockActor(sql, session, "read");
    await audit(sql, user.id, "logout", "user", user.id);
    await sql.unsafe("DELETE FROM tnt_cms.sessions WHERE token_hash=$1", [session.tokenHash]);
    return createSession(sql, request);
  });
}
export async function changePassword(request: Request, session: Session, body: unknown): Promise<Session> {
  const input = passwordInput(body), actor = requireUser(session);
  await throttle(`password:${actor.id}:${clientKey(request)}`, 5, 900);
  const newHash = await hashPassword(input.newPassword);
  return database().begin(async (sql: postgres.TransactionSql) => {
    const [user] = await sql.unsafe<UserRow[]>("SELECT u.* FROM tnt_cms.users u JOIN tnt_cms.sessions s ON s.user_id=u.id AND s.auth_version=u.auth_version WHERE u.id=$1 AND s.token_hash=$2 AND s.expires_at>now() AND s.last_seen>now()-interval '30 minutes' FOR UPDATE OF u FOR SHARE OF s", [actor.id, session.tokenHash]);
    if (!user?.active || user.auth_version !== actor.auth_version) throw new RequestError("UNAUTHENTICATED", "Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại.", 401);
    if (!await verifyPassword(input.currentPassword, user.password_hash)) invalid({ currentPassword: "Mật khẩu hiện tại không đúng." });
    const [updated] = await sql.unsafe<UserRow[]>("UPDATE tnt_cms.users SET password_hash=$1, auth_version=auth_version+1, version=version+1, updated_at=now() WHERE id=$2 RETURNING *", [newHash, user.id]);
    await sql.unsafe("DELETE FROM tnt_cms.sessions WHERE user_id=$1", [user.id]);
    await audit(sql, user.id, "change_password", "user", user.id);
    return createSession(sql, request, updated);
  });
}
