export function cmsHeaders() {
  return { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" };
}
export class RequestError extends Error {
  constructor(public code: string, message: string, public status: number, public fields: Record<string, string> = {}, public retryAfter?: number) { super(message); }
}
export function apiError(code: string, message: string, status: number, fields: Record<string, string> = {}) {
  return Response.json({ error: { code, message, ...(Object.keys(fields).length ? { fields } : {}) } }, { status, headers: cmsHeaders() });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  if (!origin) return true;
  try {
    const incoming = new URL(origin);
    const host = request.headers.get("host") || new URL(request.url).host;
    const publicOrigin = new URL(`${incoming.protocol}//${host}`).origin;
    const localHttp = !process.env.VERCEL && incoming.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(incoming.hostname);
    return origin === incoming.origin && incoming.origin === publicOrigin && (incoming.protocol === "https:" || localHttp);
  } catch { return false; }
}
export async function readJson(request: Request): Promise<unknown> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) throw new RequestError("UNSUPPORTED_MEDIA_TYPE", "Yêu cầu phải dùng application/json.", 415);
  if (Number(request.headers.get("content-length")) > 32768) throw new RequestError("PAYLOAD_TOO_LARGE", "Dữ liệu tối đa 32 KB.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("INVALID_JSON", "Thiếu dữ liệu JSON.", 400);
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > 32768) { await reader.cancel(); throw new RequestError("PAYLOAD_TOO_LARGE", "Dữ liệu tối đa 32 KB.", 413); }
    chunks.push(value);
  }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
  catch { throw new RequestError("INVALID_JSON", "Dữ liệu gửi lên không phải JSON hợp lệ.", 400); }
}
