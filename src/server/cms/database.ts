import postgres from "postgres";

export class CmsUnavailableError extends Error {}
export type Queryable = Pick<postgres.Sql, "unsafe">;

const globalDatabase = globalThis as typeof globalThis & { tntCmsDatabase?: postgres.Sql };

export function cmsConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.CMS_SESSION_SECRET && process.env.CMS_SESSION_SECRET.length >= 32);
}

export function database() {
  if (!cmsConfigured()) throw new CmsUnavailableError("CMS chưa được cấu hình.");
  if (!globalDatabase.tntCmsDatabase) {
    const url = new URL(process.env.DATABASE_URL!);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new CmsUnavailableError("DATABASE_URL không hợp lệ.");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && !process.env.VERCEL;
    // Supavisor transaction pooling does not support prepared statements.
    globalDatabase.tntCmsDatabase = postgres(url.toString(), {
      prepare: false,
      ssl: local ? false : { rejectUnauthorized: true, ...(process.env.DATABASE_SSL_CA ? { ca: process.env.DATABASE_SSL_CA.replaceAll("\\n", "\n") } : {}) },
      max: 3,
      connect_timeout: 10,
      idle_timeout: 20,
      max_lifetime: 60 * 5,
      connection: { application_name: "tnt-cms", statement_timeout: 12000 },
      onnotice: () => {},
    });
  }
  return globalDatabase.tntCmsDatabase;
}
