import { createHash } from "node:crypto";
import type { LeadSubmission } from "@/server/leads/contract";
import { leadContexts } from "@/lib/lead-options";
import { statuses } from "@/lib/cms-contract";
import { database } from "./database";
import { audit, safeLead, type LeadRow } from "./records";
import { lockActor, type Session } from "./auth";
import { RequestError } from "./http";
import { invalid, managedLeadInput, objectInput, positiveInt, type ManagedLead } from "./validation";

export function payloadHash(data: LeadSubmission) {
  const normalized = { ...data, details: Object.fromEntries(Object.entries(data.details).sort(([a], [b]) => a.localeCompare(b))) };
  return createHash("sha256").update(JSON.stringify(Object.fromEntries(Object.entries(normalized).sort(([a], [b]) => a.localeCompare(b))))).digest("hex");
}
const leadParameters = (data: LeadSubmission) => [data.name, data.emailOrPhone, data.company, data.interest, data.industry, data.companySize, data.message, data.consent, data.context, data.source, JSON.stringify(data.details)];
export async function createLead(data: LeadSubmission | ManagedLead, session?: Session, submissionId?: string) {
  const key = submissionId ? createHash("sha256").update(submissionId).digest("hex") : null;
  const managed = data as Partial<ManagedLead>;
  return database().begin(async sql => {
    const actor = session ? await lockActor(sql, session) : null;
    const [lead] = await sql.unsafe<LeadRow[]>(
      "INSERT INTO tnt_cms.leads (name,email_or_phone,company,interest,industry,company_size,message,consent,context,source,details,status,notes,created_by,updated_by,submission_key,payload_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::text::jsonb,$12,$13,$14,$14,$15,$16) ON CONFLICT (submission_key) DO NOTHING RETURNING *",
      [...leadParameters(data), managed.status ?? "new", managed.notes ?? "", actor?.id ?? null, key, key ? payloadHash(data) : null]);
    if (!lead) {
      const [existing] = await sql.unsafe<LeadRow[]>("SELECT * FROM tnt_cms.leads WHERE submission_key=$1", [key]);
      if (!existing || existing.payload_hash !== payloadHash(data)) throw new RequestError("IDEMPOTENCY_CONFLICT", "Mã gửi đã được dùng cho một nội dung khác.", 409);
      return safeLead(existing);
    }
    await audit(sql, actor?.id ?? null, "create", "lead", lead.id, { channel: actor ? "cms" : "website" });
    return safeLead(lead);
  });
}
export async function getLead(id: number) {
  const [lead] = await database().unsafe<LeadRow[]>("SELECT * FROM tnt_cms.leads WHERE id=$1", [id]);
  if (!lead) throw new RequestError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
  return { lead: safeLead(lead) };
}
function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number(value.slice(0, 4)) >= 1 && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export async function listLeads(search: URLSearchParams) {
  const allowed = ["q", "context", "status", "from", "to", "page", "perPage"];
  for (const key of search.keys()) if (!allowed.includes(key) || search.getAll(key).length > 1) invalid({ filters: "Bộ lọc không hợp lệ." });
  const q = (search.get("q") ?? "").trim(), context = search.get("context") ?? "", status = search.get("status") ?? "";
  const from = search.get("from") ?? "", to = search.get("to") ?? "";
  if (Array.from(q).length > 160) invalid({ q: "Từ khóa tối đa 160 ký tự." });
  if (context && !(leadContexts as readonly string[]).includes(context)) invalid({ context: "Ngữ cảnh không hợp lệ." });
  if (status && !Object.hasOwn(statuses, status)) invalid({ status: "Trạng thái không hợp lệ." });
  if (from && !validDate(from)) invalid({ from: "Ngày phải đúng định dạng YYYY-MM-DD." });
  if (to && !validDate(to)) invalid({ to: "Ngày phải đúng định dạng YYYY-MM-DD." });
  if (from && to && from > to) invalid({ from: "Ngày bắt đầu phải trước ngày kết thúc." });
  const integer = (key: string, fallback: number, max: number) => {
    const value = search.get(key); if (value === null) return fallback;
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > max) invalid({ [key]: "Phân trang không hợp lệ." });
    return Number(value);
  };
  const page = integer("page", 1, 1000000), perPage = integer("perPage", 15, 100);
  const where: string[] = [], params: (string | number)[] = [];
  const parameter = (value: string | number) => { params.push(value); return `$${params.length}`; };
  if (q) { const term = parameter(`%${q.replace(/[\\%_]/g, "\\$&")}%`); where.push(`(name ILIKE ${term} OR company ILIKE ${term} OR email_or_phone ILIKE ${term})`); }
  if (context) where.push(`context=${parameter(context)}`);
  if (status) where.push(`status=${parameter(status)}`);
  if (from) where.push(`created_at>=${parameter(from + "T00:00:00Z")}::timestamptz`);
  if (to) { const end = new Date(to); end.setUTCDate(end.getUTCDate() + 1); where.push(`created_at<${parameter(end.toISOString())}::timestamptz`); }
  const clause = where.length ? " WHERE " + where.join(" AND ") : "";
  return database().begin("isolation level repeatable read read only", async sql => {
    const [count] = await sql.unsafe<{ total: number }[]>(`SELECT count(*)::integer AS total FROM tnt_cms.leads${clause}`, params);
    const items = await sql.unsafe<LeadRow[]>(`SELECT * FROM tnt_cms.leads${clause} ORDER BY created_at DESC,id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, perPage, (page - 1) * perPage]);
    const stats = await sql.unsafe<{ status: string; total: number }[]>("SELECT status,count(*)::integer AS total FROM tnt_cms.leads GROUP BY status");
    return { items: items.map(safeLead), total: count.total, page, perPage, stats: Object.fromEntries(stats.map(row => [row.status, row.total])) };
  });
}
export async function updateLead(id: number, body: unknown, session: Session) {
  const data = managedLeadInput(body, true);
  return database().begin(async sql => {
    const actor = await lockActor(sql, session);
    const [lead] = await sql.unsafe<LeadRow[]>("SELECT * FROM tnt_cms.leads WHERE id=$1 FOR UPDATE", [id]);
    if (!lead) throw new RequestError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
    if (lead.version !== data.version) throw new RequestError("VERSION_CONFLICT", "Yêu cầu đã được cập nhật. Vui lòng đóng và mở lại để tải bản mới.", 409);
    const [updated] = await sql.unsafe<LeadRow[]>("UPDATE tnt_cms.leads SET name=$1,email_or_phone=$2,company=$3,interest=$4,industry=$5,company_size=$6,message=$7,consent=$8,context=$9,source=$10,details=$11::text::jsonb,status=$12,notes=$13,updated_by=$14,version=version+1,updated_at=now() WHERE id=$15 RETURNING *", [...leadParameters(data), data.status, data.notes, actor.id, id]);
    await audit(sql, actor.id, "update", "lead", id);
    return { lead: safeLead(updated) };
  });
}
export async function deleteLead(id: number, body: unknown, session: Session) {
  const version = positiveInt(objectInput(body, ["version"]).version);
  return database().begin(async sql => {
    const actor = await lockActor(sql, session);
    const [lead] = await sql.unsafe<LeadRow[]>("SELECT * FROM tnt_cms.leads WHERE id=$1 FOR UPDATE", [id]);
    if (!lead) throw new RequestError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
    if (lead.version !== version) throw new RequestError("VERSION_CONFLICT", "Yêu cầu đã thay đổi. Vui lòng tải lại trước khi xóa.", 409);
    await sql.unsafe("DELETE FROM tnt_cms.leads WHERE id=$1", [id]);
    await audit(sql, actor.id, "delete", "lead", id);
    return { deleted: true };
  });
}
