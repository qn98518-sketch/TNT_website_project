import { companySizes, contextDetailKeys, detailOptions, interestsFor, leadContexts, type LeadDetailKey } from "@/lib/lead-options";
export { leadContexts } from "@/lib/lead-options";
export type { LeadDetailKey } from "@/lib/lead-options";
export type LeadContext = (typeof leadContexts)[number];
export interface LeadSubmission {
  name: string; emailOrPhone: string; company: string; interest: string;
  industry: string; companySize: string; message: string; consent: boolean;
  context: LeadContext; source: string; details: Partial<Record<LeadDetailKey, string>>;
}
export type LeadValidationResult = { success: true; data: LeadSubmission } | { success: false; fieldErrors: Record<string, string> };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const phonePattern = /^\+?[\d\s().-]+$/u;
export function validateLeadSubmission(value: unknown): LeadValidationResult {
  const errors: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return { success: false, fieldErrors: { name: "Dữ liệu phải là một đối tượng JSON." } };
  const input = value as Record<string, unknown>;
  const keys = ["name", "emailOrPhone", "company", "interest", "industry", "companySize", "message", "consent", "context", "source", "details"];
  if (Object.keys(input).some(key => !keys.includes(key))) errors.form = "Dữ liệu có trường không được hỗ trợ.";
  function string(key: string, max: number, required = false) {
    if (input[key] === undefined && !required) return "";
    if (typeof input[key] !== "string") { errors[key] = "Trường này phải là chuỗi ký tự."; return ""; }
    const text = (input[key] as string).trim();
    if ((required && !text) || Array.from(text).length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text)) errors[key] = `Vui lòng nhập thông tin hợp lệ (tối đa ${max} ký tự).`;
    return text;
  }
  const name = string("name", 120, true), company = string("company", 160, true);
  const emailOrPhone = string("emailOrPhone", 254, true), interest = string("interest", 160, true);
  const industry = string("industry", 160), companySize = string("companySize", 80), message = string("message", 4000);
  const source = string("source", 300, true), context = input.context as LeadContext;
  if (!emailPattern.test(emailOrPhone) && !(phonePattern.test(emailOrPhone) && /^\d{7,15}$/.test(emailOrPhone.replace(/\D/g, "")))) errors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại hợp lệ (7–15 chữ số).";
  if (typeof context !== "string" || !leadContexts.includes(context)) errors.context = "Ngữ cảnh gửi yêu cầu không hợp lệ.";
  else if (!interestsFor(context).includes(interest)) errors.interest = "Vui lòng chọn một lĩnh vực hợp lệ.";
  if (companySize && !(companySizes as readonly string[]).includes(companySize)) errors.companySize = "Quy mô công ty không hợp lệ.";
  if (!/^\/(?!\/)[^\s?#\\]*$/u.test(source)) errors.source = "Nguồn yêu cầu phải là đường dẫn nội bộ hợp lệ.";
  if (input.consent !== true) errors.consent = "Vui lòng xác nhận đồng ý để TNT liên hệ.";
  const details: LeadSubmission["details"] = {};
  if (input.details !== undefined && (!input.details || typeof input.details !== "object" || Array.isArray(input.details))) errors.details = "Thông tin chi tiết phải là đối tượng JSON.";
  else for (const [key, detail] of Object.entries((input.details ?? {}) as Record<string, unknown>)) {
    if (!(leadContexts.includes(context) ? contextDetailKeys[context] : []).includes(key as LeadDetailKey) || typeof detail !== "string" || !(detailOptions[key as LeadDetailKey] as readonly string[] | undefined)?.includes(detail.trim())) errors.details = "Thông tin chi tiết không thuộc lựa chọn được hỗ trợ.";
    else details[key as LeadDetailKey] = detail.trim();
  }
  return Object.keys(errors).length ? { success: false, fieldErrors: errors } : {
    success: true, data: { name, company, emailOrPhone, interest, industry, companySize, message, source, context, consent: true, details },
  };
}
