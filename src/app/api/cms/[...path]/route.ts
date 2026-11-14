import { handleCms } from "@/server/cms/service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const path = (await context.params).path.join("/");
  return handleCms(request, path);
}
export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
