export const leadContexts = [
  "general",
  "food-processing",
  "erp",
  "outsourcing",
  "body-shop",
] as const;

export type LeadContext = (typeof leadContexts)[number];

export type LeadDetailKey =
  | "erpNeed"
  | "projectType"
  | "estimatedTiming"
  | "role"
  | "headcount"
  | "foodPriority";

export interface LeadSubmission {
  name: string;
  emailOrPhone: string;
  company: string;
  interest: string;
  industry: string;
  companySize: string;
  message: string;
  consent: boolean;
  context: LeadContext;
  source: string;
  details: Partial<Record<LeadDetailKey, string>>;
}

export type LeadValidationResult =
  | { success: true; data: LeadSubmission }
  | { success: false; fieldErrors: Partial<Record<keyof LeadSubmission, string>> };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s().-]{6,24}$/;

export function validateLeadSubmission(value: unknown): LeadValidationResult {
  const errors: Partial<Record<keyof LeadSubmission, string>> = {};

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      success: false,
      fieldErrors: { name: "Dữ liệu gửi lên không hợp lệ." },
    };
  }

  const input = value as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const emailOrPhone =
    typeof input.emailOrPhone === "string" ? input.emailOrPhone.trim() : "";
  const company = typeof input.company === "string" ? input.company.trim() : "";
  const interest = typeof input.interest === "string" ? input.interest.trim() : "";
  const industry = typeof input.industry === "string" ? input.industry.trim() : "";
  const companySize =
    typeof input.companySize === "string" ? input.companySize.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const source = typeof input.source === "string" ? input.source.trim() : "";
  const context = input.context;
  const consent = input.consent;
  const allowedDetailKeys: readonly LeadDetailKey[] = [
    "erpNeed",
    "projectType",
    "estimatedTiming",
    "role",
    "headcount",
    "foodPriority",
  ];
  const detailsInput =
    typeof input.details === "object" &&
    input.details !== null &&
    !Array.isArray(input.details)
      ? (input.details as Record<string, unknown>)
      : {};
  const details: Partial<Record<LeadDetailKey, string>> = {};

  for (const [key, detail] of Object.entries(detailsInput)) {
    if (!allowedDetailKeys.includes(key as LeadDetailKey)) {
      errors.details = "Thông tin chi tiết gửi lên không hợp lệ.";
      continue;
    }

    if (typeof detail !== "string" || detail.trim().length > 160) {
      errors.details = "Thông tin chi tiết không hợp lệ.";
      continue;
    }

    details[key as LeadDetailKey] = detail.trim();
  }

  if (!name || name.length > 120) {
    errors.name = "Vui lòng nhập họ tên (tối đa 120 ký tự).";
  }
  if (
    !emailOrPhone ||
    emailOrPhone.length > 254 ||
    (!emailPattern.test(emailOrPhone) && !phonePattern.test(emailOrPhone))
  ) {
    errors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại hợp lệ.";
  }
  if (!company || company.length > 160) {
    errors.company = "Vui lòng nhập tên công ty (tối đa 160 ký tự).";
  }
  if (!interest || interest.length > 160) {
    errors.interest = "Vui lòng chọn lĩnh vực quan tâm.";
  }
  if (industry.length > 160) errors.industry = "Ngành nghề quá dài.";
  if (companySize.length > 80) errors.companySize = "Quy mô công ty quá dài.";
  if (message.length > 4000) errors.message = "Nội dung không được vượt quá 4.000 ký tự.";
  if (typeof context !== "string" || !leadContexts.includes(context as LeadContext)) {
    errors.context = "Ngữ cảnh gửi yêu cầu không hợp lệ.";
  }
  if (!source || source.length > 300 || !source.startsWith("/")) {
    errors.source = "Nguồn yêu cầu không hợp lệ.";
  }
  if (consent !== true) errors.consent = "Vui lòng xác nhận đồng ý để TNT liên hệ.";

  if (Object.keys(errors).length > 0) {
    return { success: false, fieldErrors: errors };
  }

  return {
    success: true,
    data: {
      name,
      emailOrPhone,
      company,
      interest,
      industry,
      companySize,
      message,
      consent: true,
      context: context as LeadContext,
      source,
      details,
    },
  };
}
