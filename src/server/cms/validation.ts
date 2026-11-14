import { accountErrors, loginErrors, passwordError, statuses, type AccountInput } from "@/lib/cms-contract";
import { validateLeadSubmission, type LeadSubmission } from "@/server/leads/contract";
import { RequestError } from "./http";

export function invalid(fields: Record<string, string>): never {
  throw new RequestError("VALIDATION_FAILED", "Vui lòng kiểm tra lại thông tin.", 422, fields);
}
export function objectInput(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid({ form: "Dữ liệu phải là một đối tượng JSON." });
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !keys.includes(key))) invalid({ form: "Dữ liệu có trường không được hỗ trợ." });
  return input;
}
export function positiveInt(value: unknown, key = "version"): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 2147483647) invalid({ [key]: "Giá trị phải là số nguyên dương." });
  return value;
}
export function loginInput(value: unknown) {
  const input = objectInput(value, ["username", "password"]);
  const username = typeof input.username === "string" ? input.username.trim() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const errors = loginErrors(username, password);
  if (Object.keys(errors).length) invalid(errors);
  return { username, password };
}
export function passwordInput(value: unknown) {
  const input = objectInput(value, ["currentPassword", "newPassword", "confirmPassword"]);
  const errors: Record<string, string> = {};
  const currentPassword = typeof input.currentPassword === "string" ? input.currentPassword : "";
  const newPassword = typeof input.newPassword === "string" ? input.newPassword : "";
  if (!currentPassword || Buffer.byteLength(currentPassword) > 72 || currentPassword.includes("\0")) errors.currentPassword = "Mật khẩu hiện tại không hợp lệ.";
  const error = passwordError(newPassword); if (error) errors.newPassword = error;
  if (input.confirmPassword !== newPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  if (currentPassword === newPassword) errors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại.";
  if (Object.keys(errors).length) invalid(errors);
  return { currentPassword, newPassword };
}
export function accountInput(value: unknown, updating = false): AccountInput {
  const input = objectInput(value, ["username", "displayName", "email", "role", "active", "password", ...(updating ? ["version"] : [])]);
  const data: AccountInput = {
    username: typeof input.username === "string" ? input.username.trim() : "",
    displayName: typeof input.displayName === "string" ? input.displayName.trim() : "",
    email: typeof input.email === "string" ? input.email.trim().toLowerCase() : "",
    role: input.role as AccountInput["role"], active: input.active as boolean,
    ...(Object.hasOwn(input, "password") ? { password: input.password as string } : {}),
    ...(updating ? { version: positiveInt(input.version) } : {}),
  };
  const errors = accountErrors(data, updating);
  if (Object.keys(errors).length) invalid(errors);
  return data;
}
export type ManagedLead = LeadSubmission & { status: keyof typeof statuses; notes: string; version?: number };
export function managedLeadInput(value: unknown, updating = false): ManagedLead {
  const input = objectInput(value, ["name", "emailOrPhone", "company", "interest", "industry", "companySize", "message", "consent", "context", "source", "details", "status", "notes", ...(updating ? ["version"] : [])]);
  const { status, notes = "", version, ...lead } = input;
  const validation = validateLeadSubmission(lead);
  if (!validation.success) invalid(validation.fieldErrors);
  if (typeof status !== "string" || !Object.hasOwn(statuses, status)) invalid({ status: "Trạng thái không hợp lệ." });
  if (typeof notes !== "string" || Array.from(notes.trim()).length > 4000 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(notes)) invalid({ notes: "Ghi chú tối đa 4.000 ký tự và không chứa ký tự điều khiển." });
  return { ...validation.data, status: status as ManagedLead["status"], notes: notes.trim(), ...(updating ? { version: positiveInt(version) } : {}) };
}
