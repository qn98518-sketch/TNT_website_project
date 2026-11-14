import type { CmsLead, CmsUser } from "@/lib/cms-contract";
import type { Queryable } from "./database";

export type UserRow = {
  id: number; username: string; display_name: string; email: string; password_hash: string;
  role: CmsUser["role"]; active: boolean; auth_version: number; version: number; created_at: Date;
};
export type LeadRow = {
  id: number; name: string; email_or_phone: string; company: string; interest: string;
  industry: string; company_size: string; message: string; consent: boolean;
  context: CmsLead["context"]; source: string; details: CmsLead["details"];
  status: CmsLead["status"]; notes: string; version: number; created_at: Date; updated_at: Date;
  payload_hash: string | null;
};
export function safeUser(user: UserRow): CmsUser {
  return { id: user.id, username: user.username, displayName: user.display_name, email: user.email, role: user.role, active: user.active, version: user.version, createdAt: user.created_at.toISOString() };
}
export function safeLead(lead: LeadRow): CmsLead {
  return { id: lead.id, name: lead.name, emailOrPhone: lead.email_or_phone, company: lead.company,
    interest: lead.interest, industry: lead.industry, companySize: lead.company_size, message: lead.message,
    consent: lead.consent, context: lead.context, source: lead.source, details: lead.details, status: lead.status,
    notes: lead.notes, version: lead.version, createdAt: lead.created_at.toISOString(), updatedAt: lead.updated_at.toISOString() };
}
export async function audit(sql: Queryable, actor: number | null, action: string, type: string, id: number | null, metadata = {}) {
  await sql.unsafe("INSERT INTO tnt_cms.audit_log (actor_id, action, entity_type, entity_id, metadata) VALUES ($1,$2,$3,$4,$5::text::jsonb)", [actor, action, type, id, JSON.stringify(metadata)]);
}
