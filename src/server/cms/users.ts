import { database } from "./database";
import { hashPassword, lockActor, requireUser, type Session } from "./auth";
import { audit, safeUser, type UserRow } from "./records";
import { RequestError } from "./http";
import { accountInput, objectInput, positiveInt } from "./validation";

export async function listUsers() {
  const users = await database().unsafe<UserRow[]>("SELECT * FROM tnt_cms.users ORDER BY id");
  return { items: users.map(safeUser) };
}
export async function getUser(id: number) {
  const [user] = await database().unsafe<UserRow[]>("SELECT * FROM tnt_cms.users WHERE id=$1", [id]);
  if (!user) throw new RequestError("NOT_FOUND", "Không tìm thấy tài khoản.", 404);
  return { user: safeUser(user) };
}
export async function createUser(body: unknown, session: Session) {
  const data = accountInput(body), encoded = await hashPassword(data.password!);
  return database().begin(async sql => {
    const actor = await lockActor(sql, session, "admin");
    const [user] = await sql.unsafe<UserRow[]>("INSERT INTO tnt_cms.users (username,display_name,email,role,active,password_hash) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [data.username, data.displayName, data.email, data.role, data.active, encoded]);
    await audit(sql, actor.id, "create", "user", user.id, { role: user.role });
    return { user: safeUser(user) };
  });
}
export async function updateUser(id: number, body: unknown, session: Session) {
  return database().begin(async sql => {
    const actor = await lockActor(sql, session, "admin");
    const [target] = await sql.unsafe<UserRow[]>("SELECT * FROM tnt_cms.users WHERE id=$1 FOR UPDATE", [id]);
    if (!target) throw new RequestError("NOT_FOUND", "Không tìm thấy tài khoản.", 404);
    if (target.role === "admin") throw new RequestError("FIXED_ADMIN", "Tài khoản admin cố hữu không thể đổi định danh hoặc quyền. Hãy dùng mục Đổi mật khẩu.", 403);
    const data = accountInput(body, true);
    if (target.version !== data.version) throw new RequestError("VERSION_CONFLICT", "Tài khoản đã được cập nhật. Vui lòng tải lại.", 409);
    const encoded = data.password === undefined ? target.password_hash : await hashPassword(data.password);
    const [user] = await sql.unsafe<UserRow[]>("UPDATE tnt_cms.users SET username=$1,display_name=$2,email=$3,role=$4,active=$5,password_hash=$6,auth_version=auth_version+1,version=version+1,updated_at=now() WHERE id=$7 RETURNING *", [data.username, data.displayName, data.email, data.role, data.active, encoded, id]);
    await audit(sql, actor.id, "update", "user", id, { role: user.role, active: user.active, passwordReset: data.password !== undefined });
    return { user: safeUser(user) };
  });
}
export async function deleteUser(id: number, body: unknown, session: Session) {
  const version = positiveInt(objectInput(body, ["version"]).version);
  if (id === requireUser(session, "admin").id) throw new RequestError("SELF_DELETE_FORBIDDEN", "Bạn không thể tự xóa tài khoản của mình.", 403);
  return database().begin(async sql => {
    const actor = await lockActor(sql, session, "admin");
    const [target] = await sql.unsafe<UserRow[]>("SELECT * FROM tnt_cms.users WHERE id=$1 FOR UPDATE", [id]);
    if (!target) throw new RequestError("NOT_FOUND", "Không tìm thấy tài khoản.", 404);
    if (target.role === "admin") throw new RequestError("FIXED_ADMIN", "Không thể xóa admin cố hữu.", 403);
    if (target.version !== version) throw new RequestError("VERSION_CONFLICT", "Tài khoản đã thay đổi. Vui lòng tải lại.", 409);
    await sql.unsafe("DELETE FROM tnt_cms.users WHERE id=$1", [id]);
    await audit(sql, actor.id, "delete", "user", id);
    return { deleted: true };
  });
}
