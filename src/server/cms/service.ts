import { randomBytes } from "node:crypto";
import { validateLeadSubmission } from "@/server/leads/contract";
import { cmsHeaders, apiError, readJson, RequestError, sameOrigin } from "./http";
import { CmsUnavailableError, database } from "./database";
import { changePassword, clientKey, csrf, loadSession, login, logout, requireUser, throttle, type Session } from "./auth";
import { safeUser } from "./records";
import { createLead, deleteLead, getLead, listLeads, updateLead } from "./leads";
import { createUser, deleteUser, getUser, listUsers, updateUser } from "./users";
import { invalid, managedLeadInput, objectInput, positiveInt } from "./validation";

const endpoints: Record<string, RegExp> = {
  GET: /^(session|leads|leads\/[1-9]\d*|users|users\/[1-9]\d*)$/,
  POST: /^(login|logout|password|leads|users)$/,
  PATCH: /^(leads|users)\/[1-9]\d*$/,
  DELETE: /^(leads|users)\/[1-9]\d*$/,
};
const sessionResult = (session: Session) => ({ user: session.user ? safeUser(session.user) : null, csrfToken: session.csrfToken });
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: cmsHeaders() });
function failure(error: unknown, intake = false) {
  if (error instanceof RequestError) {
    const response = apiError(error.code, error.message, error.status, error.fields);
    if (error.retryAfter) response.headers.set("Retry-After", String(error.retryAfter));
    return response;
  }
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "23505") return apiError("DUPLICATE_USER", "Tên đăng nhập hoặc email đã được sử dụng.", 409, { username: "Kiểm tra tên đăng nhập và email bị trùng.", email: "Kiểm tra tên đăng nhập và email bị trùng." });
  const reference = randomBytes(6).toString("hex");
  console.error("TNT CMS", reference, error instanceof CmsUnavailableError ? "NOT_CONFIGURED" : /^[A-Z0-9_]{2,40}$/.test(code) ? code : "REQUEST_FAILED");
  return apiError(intake ? "LEAD_DELIVERY_UNAVAILABLE" : "CMS_UNAVAILABLE", intake ? "Hiện chưa thể gửi yêu cầu. Vui lòng thử lại sau hoặc liên hệ TNT qua hotline/email." : "CMS chưa sẵn sàng. Vui lòng liên hệ người quản trị hệ thống.", 503);
}
export async function handleCms(request: Request, path: string) {
  if (!endpoints[request.method]?.test(path)) return apiError("NOT_FOUND", "Không tìm thấy chức năng.", 404);
  if (!sameOrigin(request)) return apiError("ORIGIN_REJECTED", "Nguồn yêu cầu không hợp lệ.", 403);
  let session: Session | undefined;
  try {
    const body = request.method === "GET" ? undefined : await readJson(request);
    if (body !== undefined && (!body || typeof body !== "object" || Array.isArray(body))) invalid({ form: "Dữ liệu phải là một đối tượng JSON." });
    session = await loadSession(request);
    if (path !== "session" && path !== "login") requireUser(session, path.startsWith("users") ? "admin" : request.method === "GET" || ["logout", "password"].includes(path) ? "read" : "write");
    if (request.method !== "GET") csrf(request, session);
    let response: Response;
    if (path === "session") response = json(sessionResult(session));
    else if (path === "login") { session = await login(request, session, body); response = json(sessionResult(session)); }
    else if (path === "logout") { objectInput(body, []); session = await logout(request, session); response = json(sessionResult(session)); }
    else if (path === "password") { session = await changePassword(request, session, body); response = json(sessionResult(session)); }
    else if (path === "leads") response = request.method === "GET" ? json(await listLeads(new URL(request.url).searchParams)) : json({ lead: await createLead(managedLeadInput(body), session) }, 201);
    else if (path === "users") response = request.method === "GET" ? json(await listUsers()) : json(await createUser(body, session), 201);
    else {
      const [entity, rawId] = path.split("/"), id = positiveInt(Number(rawId), "id");
      if (entity === "leads") response = json(request.method === "GET" ? await getLead(id) : request.method === "PATCH" ? await updateLead(id, body, session) : await deleteLead(id, body, session));
      else response = json(request.method === "GET" ? await getUser(id) : request.method === "PATCH" ? await updateUser(id, body, session) : await deleteUser(id, body, session));
    }
    if (session.cookie) response.headers.set("Set-Cookie", session.cookie);
    return response;
  } catch (error) {
    const response = failure(error);
    if (session?.cookie) response.headers.set("Set-Cookie", session.cookie);
    return response;
  }
}
export async function handleIntake(request: Request) {
  if (!sameOrigin(request)) return apiError("ORIGIN_REJECTED", "Nguồn yêu cầu không hợp lệ.", 403);
  try {
    const validation = validateLeadSubmission(await readJson(request));
    if (!validation.success) invalid(validation.fieldErrors);
    const submissionId = request.headers.get("x-submission-id") || undefined;
    if (submissionId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(submissionId)) invalid({ form: "Mã gửi không hợp lệ." });
    database();
    await throttle(`intake:${clientKey(request)}`, 10, 600);
    await createLead(validation.data, undefined, submissionId);
    return json({ accepted: true }, 202);
  } catch (error) { return failure(error, true); }
}
