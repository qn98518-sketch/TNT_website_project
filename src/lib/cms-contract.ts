import type { LeadSubmission } from "@/server/leads/contract";
export const statuses = { new: "Mới tiếp nhận", contacted: "Đã liên hệ", in_progress: "Đang xử lý", closed: "Hoàn tất", spam: "Spam" } as const;
export const roles = { admin: "Admin", editor: "Nhân viên xử lý", viewer: "Chỉ xem" } as const;
export type CmsUser = { id: number; username: string; displayName: string; email: string; role: keyof typeof roles; active: boolean; version: number; createdAt: string };
export type CmsLead = LeadSubmission & { id: number; status: keyof typeof statuses; notes: string; version: number; createdAt: string; updatedAt: string };
export type SessionResult = { user: CmsUser | null; csrfToken: string };
export type AccountInput = { username: string; displayName: string; email: string; role: "editor" | "viewer"; active: boolean; password?: string; version?: number };
export function passwordError(value: unknown): string | undefined {
  if (typeof value !== "string" || new TextEncoder().encode(value).length < 12 || new TextEncoder().encode(value).length > 72 || value.includes("\0") || !/\p{L}/u.test(value) || !/\p{N}/u.test(value)) return "Mật khẩu cần 12–72 byte, có chữ và số, không chứa ký tự null.";
}
export function loginErrors(username: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!/^[a-z0-9][a-z0-9._-]{2,49}$/.test(username)) errors.username = "Tên đăng nhập gồm 3–50 ký tự thường, số, dấu chấm, gạch dưới hoặc gạch ngang.";
  if (!password || new TextEncoder().encode(password).length > 72 || password.includes("\0")) errors.password = "Vui lòng nhập mật khẩu (tối đa 72 byte).";
  return errors;
}
export function accountErrors(input: AccountInput, updating: boolean): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!/^[a-z0-9][a-z0-9._-]{2,49}$/.test(input.username)) errors.username = "Tên đăng nhập gồm 3–50 ký tự thường, số, dấu chấm, gạch dưới hoặc gạch ngang.";
  if (!input.displayName || Array.from(input.displayName).length > 120 || /[\u0000-\u001F\u007F]/u.test(input.displayName)) errors.displayName = "Họ tên không hợp lệ (tối đa 120 ký tự).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(input.email) || input.email.length > 254) errors.email = "Email không hợp lệ.";
  if (!["editor", "viewer"].includes(input.role)) errors.role = "Vai trò không hợp lệ.";
  if (typeof input.active !== "boolean") errors.active = "Trạng thái không hợp lệ.";
  if (!updating || input.password !== undefined) { const error = passwordError(input.password); if (error) errors.password = error; }
  return errors;
}
