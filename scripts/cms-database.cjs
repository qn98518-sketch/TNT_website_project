const fs = require('node:fs');
require('@next/env').loadEnvConfig(process.cwd());
const { connect, migrate, createAdmin, safeError } = require('./cms-db.cjs');

async function main() {
  const command = process.argv[2] || 'check';
  const sql = command === 'check' ? connect(process.env.DATABASE_URL) : connect();
  try {
    if (command === 'migrate') await migrate(sql);
    else if (command === 'create-admin') {
      let password = process.env.CMS_ADMIN_PASSWORD;
      if (!password) {
        if (process.stdin.isTTY) throw new Error('Truyền mật khẩu qua stdin bằng Get-Credential; xem docs/CMS_SUPABASE.md. Không đặt mật khẩu trong dòng lệnh.');
        password = fs.readFileSync(0, 'utf8').replace(/\r?\n$/, '');
      }
      await createAdmin(sql, { username: process.env.CMS_ADMIN_USERNAME, displayName: process.env.CMS_ADMIN_NAME, email: process.env.CMS_ADMIN_EMAIL, password });
    } else if (command === 'check') {
      const [result] = await sql`SELECT (SELECT count(*)::integer FROM tnt_cms.users WHERE role='admin') AS admins, (SELECT count(*)::integer FROM tnt_cms.leads) AS leads, (SELECT count(*)::integer FROM tnt_cms.migrations) AS migrations`;
      console.log(JSON.stringify({ database: 'connected', sessions: 'PostgreSQL', ...result }));
      if (result.admins !== 1) throw new Error('Cần đúng một admin. Nhập dữ liệu cũ hoặc chạy npm run cms:admin.');
    } else throw new Error('Lệnh hỗ trợ: migrate, create-admin, check.');
  } finally { await sql.end({ timeout: 5 }); }
}
main().catch(error => { console.error(safeError(error)); process.exitCode = 1; });
