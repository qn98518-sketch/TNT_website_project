export class CmsApiError extends Error {
  constructor(message: string, public code = "REQUEST_FAILED", public fields: Record<string, string> = {}) { super(message); }
}
export type Api = <T>(path: string, method?: string, body?: unknown, signal?: AbortSignal) => Promise<T>;
export function errorsFrom(error: unknown) {
  return error instanceof CmsApiError ? { message: error.message, fields: error.fields } : { message: "Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.", fields: {} };
}
export function createCmsApi(callbacks: { expired: () => void; refreshed: (error?: string) => void }): Api {
  let csrfToken = "";
  return async <T,>(path: string, method = "GET", body?: unknown, signal?: AbortSignal): Promise<T> => {
    const response = await fetch(`/api/cms/${path}`, {
      method, credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json", ...(method !== "GET" ? { "X-CSRF-Token": csrfToken } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body), signal: signal ?? AbortSignal.timeout(16000),
    });
    const result = await response.json();
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new CmsApiError("Phản hồi máy chủ không hợp lệ.");
    if (!response.ok) {
      if (["UNAUTHENTICATED", "CSRF_REJECTED"].includes(result.error?.code)) {
        if (result.error.code === "UNAUTHENTICATED") callbacks.expired();
        // Refresh the rotated CSRF token, without retrying the failed mutation.
        try {
          const fresh = await fetch("/api/cms/session", { cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(16000) });
          const session = await fresh.json();
          if (!fresh.ok || typeof session.csrfToken !== "string" || !/^[a-f0-9]{64}$/.test(session.csrfToken)) throw new Error("Invalid session response");
          csrfToken = session.csrfToken; callbacks.refreshed();
        } catch { callbacks.refreshed("Không thể làm mới phiên đăng nhập. Vui lòng tải lại trang."); }
      }
      const fields = Object.fromEntries(Object.entries(result.error?.fields ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
      throw new CmsApiError(typeof result.error?.message === "string" ? result.error.message : "Không thể hoàn tất thao tác.", result.error?.code, fields);
    }
    if (typeof result.csrfToken === "string" && /^[a-f0-9]{64}$/.test(result.csrfToken)) csrfToken = result.csrfToken;
    if (["session", "login", "password", "logout"].includes(path) && (typeof result.csrfToken !== "string" || !/^[a-f0-9]{64}$/.test(result.csrfToken) || !(result.user === null || (result.user && Number.isInteger(result.user.id) && ["admin", "editor", "viewer"].includes(result.user.role))))) throw new CmsApiError("Phản hồi phiên đăng nhập không hợp lệ.");
    return result as T;
  };
}
