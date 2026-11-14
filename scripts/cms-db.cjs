const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const root = path.resolve(__dirname, '..');

function connect(url = process.env.CMS_MIGRATION_DATABASE_URL || process.env.DATABASE_URL) {
  if (!url) throw new Error('Thiếu DATABASE_URL. Xem docs/CMS_SUPABASE.md.');
  const parsed = new URL(url);
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) throw new Error('DATABASE_URL phải là PostgreSQL.');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname) && !process.env.VERCEL;
  return postgres(url, { prepare: false, ssl: local ? false : { rejectUnauthorized: true, ...(process.env.DATABASE_SSL_CA ? { ca: process.env.DATABASE_SSL_CA.replaceAll('\\n', '\n') } : {}) }, max: 1, connect_timeout: 10, idle_timeout: 5, connection: { application_name: 'tnt-cms-tools', statement_timeout: 60000 }, onnotice: () => {} });
}
async function migrate(sql) {
  const directory = path.join(root, 'supabase/migrations');
  await sql.begin(async tx => {
    await tx`SELECT pg_advisory_xact_lock(814620261114)`;
    await tx.unsafe('CREATE SCHEMA IF NOT EXISTS tnt_cms; REVOKE ALL ON SCHEMA tnt_cms FROM PUBLIC; CREATE TABLE IF NOT EXISTS tnt_cms.migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now()); ALTER TABLE tnt_cms.migrations ENABLE ROW LEVEL SECURITY;');
    for (const name of fs.readdirSync(directory).filter(name => /^\d+_.+\.sql$/.test(name)).sort()) {
      const source = fs.readFileSync(path.join(directory, name), 'utf8');
      const checksum = crypto.createHash('sha256').update(source).digest('hex');
      const [existing] = await tx`SELECT checksum FROM tnt_cms.migrations WHERE name=${name}`;
      if (existing) {
        if (existing.checksum !== checksum) throw new Error('Migration đã áp dụng bị thay đổi: ' + name + '. Tạo migration mới, không sửa dữ liệu hiện có.');
        continue;
      }
      await tx.unsafe(source);
      await tx`INSERT INTO tnt_cms.migrations (name, checksum) VALUES (${name}, ${checksum})`;
      console.log('Applied ' + name);
    }
  });
}
async function createAdmin(sql, { username, displayName, email, password }) {
  if (!/^[a-z0-9][a-z0-9._-]{2,49}$/.test(username || '')) throw new Error('Tên đăng nhập admin không hợp lệ.');
  if (typeof displayName !== 'string' || !displayName.trim() || Array.from(displayName).length > 120) throw new Error('Tên hiển thị admin không hợp lệ.');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Email admin không hợp lệ.');
  if (typeof password !== 'string' || Buffer.byteLength(password) < 12 || Buffer.byteLength(password) > 72 || password.includes('\0') || !/\p{L}/u.test(password) || !/\p{N}/u.test(password)) throw new Error('Mật khẩu cần 12–72 byte, gồm chữ và số.');
  const encoded = await bcrypt.hash(password, 12);
  await sql.begin(async tx => {
    await tx`SELECT pg_advisory_xact_lock(814620261115)`;
    if ((await tx`SELECT id FROM tnt_cms.users WHERE role='admin'`).length) throw new Error('Admin đã tồn tại; tài khoản và mật khẩu hiện tại được giữ nguyên.');
    await tx`INSERT INTO tnt_cms.users (username,display_name,email,password_hash,role) VALUES (${username},${displayName.trim()},${email.trim().toLowerCase()},${encoded},'admin')`;
  });
  console.log('Đã tạo admin. Mật khẩu không được ghi vào log.');
}
function safeError(error) {
  // Driver errors may contain connection strings or SQL parameters. Print only a known message/code.
  if (error instanceof postgres.PostgresError || error?.code) return 'Không thể hoàn tất thao tác database (' + String(error.code || 'DATABASE_ERROR').replace(/[^A-Z0-9_]/g, '') + '). Kiểm tra kết nối/cấu trúc dữ liệu.';
  let message = error instanceof Error ? error.message : 'Không thể hoàn tất thao tác.';
  for (const key of ['DATABASE_URL', 'CMS_MIGRATION_DATABASE_URL', 'CMS_SESSION_SECRET', 'CMS_ADMIN_PASSWORD']) if (process.env[key]) message = message.replaceAll(process.env[key], '[REDACTED]');
  return message;
}
module.exports = { connect, migrate, createAdmin, safeError, root };
