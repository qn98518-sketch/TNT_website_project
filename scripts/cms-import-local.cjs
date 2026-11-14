const fs = require('node:fs');
const path = require('node:path');
const { connect, safeError, root } = require('./cms-db.cjs');
const { importData } = require('./cms-import-mysql.cjs');
require('@next/env').loadEnvConfig(root);

async function main() {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'backend/storage/local-postgres.json'), 'utf8'));
  if (config.port !== 5433 || config.user !== 'tnt_local' || !/^[a-f0-9]{48}$/.test(config.password)) throw new Error('Không tìm thấy cấu hình PostgreSQL local của TNT.');
  const sourceUrl = `postgresql://${config.user}:${config.password}@127.0.0.1:5433/tnt_cms_local`;
  const destination = process.env.CMS_MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
  if (!destination || new URL(destination).hostname === '127.0.0.1' && new URL(destination).port === '5433' && new URL(destination).pathname === '/tnt_cms_local') throw new Error('Đặt DATABASE_URL của Supabase làm đích trước khi nhập dữ liệu local.');
  const source = connect(sourceUrl), target = connect(destination);
  try {
    const snapshot = await source.begin('isolation level repeatable read read only', async sql => ({
      users: await sql.unsafe('SELECT * FROM tnt_cms.users ORDER BY id'),
      leads: await sql.unsafe('SELECT * FROM tnt_cms.leads ORDER BY id'),
      audit: await sql.unsafe('SELECT * FROM tnt_cms.audit_log ORDER BY id'),
    }));
    console.log('Nhập PostgreSQL local: ' + JSON.stringify(await importData(target, snapshot)));
  } finally { await Promise.allSettled([source.end({ timeout: 5 }), target.end({ timeout: 5 })]); }
}
main().catch(error => { console.error(safeError(error)); process.exitCode = 1; });
