const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const path = require('node:path');
const { connect, safeError, root } = require('./cms-db.cjs');

const jsonValue = value => typeof value === 'string' ? JSON.parse(value) : value;
function publicPayload(row) {
  return { name: row.name, emailOrPhone: row.email_or_phone, company: row.company, interest: row.interest, industry: row.industry, companySize: row.company_size, message: row.message, consent: Boolean(Number(row.consent)), context: row.context, source: row.source, details: jsonValue(row.details) };
}
function payloadHash(row) {
  const data = publicPayload(row);
  data.details = Object.fromEntries(Object.entries(data.details).sort(([a], [b]) => a.localeCompare(b)));
  return crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b))))).digest('hex');
}
const utc = value => value instanceof Date ? value.toISOString() : new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(value) ? value : value.replace(' ', 'T') + 'Z').toISOString();
async function importData(sql, data) {
  if (!Array.isArray(data.users) || !Array.isArray(data.leads) || !Array.isArray(data.audit) || data.users.filter(user => user.role === 'admin').length !== 1) throw new Error('Dữ liệu nguồn cần đúng một admin và đủ các bảng CMS.');
  for (const user of data.users) if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password_hash)) throw new Error('Có mật khẩu cũ không dùng bcrypt; dữ liệu đích chưa được thay đổi.');
  const sourceHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  return sql.begin(async tx => {
    await tx`SELECT pg_advisory_xact_lock(814620261115)`;
    await tx.unsafe('LOCK TABLE tnt_cms.users, tnt_cms.leads, tnt_cms.audit_log IN EXCLUSIVE MODE');
    if ((await tx`SELECT 1 FROM tnt_cms.legacy_imports WHERE source_hash=${sourceHash}`).length) return { skipped: true, users: data.users.length, leads: data.leads.length };
    const [existing] = await tx`SELECT (SELECT count(*) FROM tnt_cms.users) + (SELECT count(*) FROM tnt_cms.leads) + (SELECT count(*) FROM tnt_cms.audit_log) AS total`;
    if (Number(existing.total) !== 0) throw new Error('Database đích đã có dữ liệu. Không ghi đè hoặc trộn dữ liệu; dùng database trống để nhập.');
    for (const user of data.users) {
      await tx`INSERT INTO tnt_cms.users (id,username,display_name,email,password_hash,role,active,auth_version,version,created_at,updated_at) VALUES (${Number(user.id)},${user.username},${user.display_name},${user.email.toLowerCase()},${user.password_hash},${user.role},${Boolean(Number(user.active))},${Number(user.auth_version)},${Number(user.version)},${utc(user.created_at)},${utc(user.updated_at)})`;
    }
    for (const lead of data.leads) {
      await tx`INSERT INTO tnt_cms.leads (id,name,email_or_phone,company,interest,industry,company_size,message,consent,context,source,details,status,notes,submission_key,payload_hash,version,created_by,updated_by,created_at,updated_at) VALUES (${Number(lead.id)},${lead.name},${lead.email_or_phone},${lead.company},${lead.interest},${lead.industry},${lead.company_size},${lead.message},${Boolean(Number(lead.consent))},${lead.context},${lead.source},${tx.json(jsonValue(lead.details))},${lead.status},${lead.notes},${lead.submission_key},${lead.submission_key ? payloadHash(lead) : null},${Number(lead.version)},${lead.created_by === null ? null : Number(lead.created_by)},${lead.updated_by === null ? null : Number(lead.updated_by)},${utc(lead.created_at)},${utc(lead.updated_at)})`;
    }
    for (const event of data.audit) {
      await tx`INSERT INTO tnt_cms.audit_log (id,actor_id,action,entity_type,entity_id,metadata,created_at) VALUES (${String(event.id)},${event.actor_id === null ? null : Number(event.actor_id)},${event.action},${event.entity_type},${event.entity_id === null ? null : Number(event.entity_id)},${tx.json(jsonValue(event.metadata))},${utc(event.created_at)})`;
    }
    for (const table of ['users', 'leads', 'audit_log']) await tx.unsafe(`SELECT setval(pg_get_serial_sequence('tnt_cms.${table}', 'id'), COALESCE(max(id),1), max(id) IS NOT NULL) FROM tnt_cms.${table}`);
    await tx`INSERT INTO tnt_cms.legacy_imports (source_hash,user_count,lead_count) VALUES (${sourceHash},${data.users.length},${data.leads.length})`;
    return { skipped: false, users: data.users.length, leads: data.leads.length };
  });
}
async function importMysql(sql) {
  const php = process.env.CMS_LOCAL_PHP || 'C:/xampp/php/php.exe';
  const result = spawnSync(php, [path.join(root, 'scripts/export-legacy-cms.php')], { cwd: root, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error('Không thể đọc MySQL cũ. Bật dịch vụ MySQL 3307 để nhập một lần; database nguồn không bị sửa.');
  return importData(sql, JSON.parse(result.stdout));
}
module.exports = { importData, importMysql, payloadHash };
if (require.main === module) {
  require('@next/env').loadEnvConfig(root);
  const sql = connect();
  importMysql(sql).then(result => console.log('Nhập MySQL: ' + JSON.stringify(result))).catch(error => { console.error(safeError(error)); process.exitCode = 1; }).finally(() => sql.end({ timeout: 5 }));
}
