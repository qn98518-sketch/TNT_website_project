/* PostgreSQL + Next.js launcher. Cloud deployments use Supabase and need no local service. */
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { connect, migrate, createAdmin, safeError, root } = require('./cms-db.cjs');
const { importMysql } = require('./cms-import-mysql.cjs');
require('@next/env').loadEnvConfig(root);
const storage = path.join(root, 'backend/storage');
const configFile = path.join(storage, 'local-postgres.json');
const stateFile = path.join(storage, 'local-next-processes.json');
const dataDir = path.join(storage, 'postgres-data');
const pgBin = process.env.CMS_LOCAL_POSTGRES_BIN || 'C:/Program Files/PostgreSQL/18/bin';
const executable = name => path.join(pgBin, name + (process.platform === 'win32' ? '.exe' : ''));
const site = 'http://localhost:3000';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function listening(port) { return new Promise(resolve => { const socket = net.connect(port, '127.0.0.1'); socket.setTimeout(1000); socket.once('connect', () => { socket.destroy(); resolve(true); }); socket.once('error', () => resolve(false)); socket.once('timeout', () => { socket.destroy(); resolve(false); }); }); }
function readConfig() {
  const value = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  if (value.port !== 5433 || value.user !== 'tnt_local' || !/^[a-f0-9]{48}$/.test(value.password) || path.resolve(value.dataDir) !== path.resolve(dataDir)) throw new Error('Cấu hình PostgreSQL local không hợp lệ. Không thay đổi dịch vụ hiện có.');
  return value;
}
function runPg(name, args) {
  const log = fs.openSync(path.join(storage, 'postgres-tools.log'), 'a');
  let result;
  try { result = spawnSync(executable(name), args, { cwd: root, windowsHide: true, stdio: ['ignore', log, log] }); }
  finally { fs.closeSync(log); }
  if (result.error || result.status !== 0) throw new Error('PostgreSQL ' + name + ' thất bại. Xem backend/storage/postgres.log; kiểm tra CMS_LOCAL_POSTGRES_BIN.');
}
async function ensurePostgres() {
  fs.mkdirSync(storage, { recursive: true });
  if (!fs.existsSync(executable('pg_ctl'))) throw new Error('Chưa tìm thấy PostgreSQL. Đặt DATABASE_URL của Supabase hoặc cài PostgreSQL rồi đặt CMS_LOCAL_POSTGRES_BIN.');
  if (!fs.existsSync(configFile)) {
    if (await listening(5433)) throw new Error('Cổng 5433 đang được dịch vụ khác sử dụng. Không thay đổi dịch vụ đó.');
    fs.writeFileSync(configFile, JSON.stringify({ port: 5433, user: 'tnt_local', password: crypto.randomBytes(24).toString('hex'), dataDir }), { mode: 0o600 });
  }
  const config = readConfig();
  if (!fs.existsSync(path.join(dataDir, 'PG_VERSION'))) {
    const passwordFile = path.join(storage, 'postgres-init-password.txt');
    fs.writeFileSync(passwordFile, config.password + '\n', { mode: 0o600 });
    try { runPg('initdb', ['-D', dataDir, '-U', config.user, '--pwfile=' + passwordFile, '--auth=scram-sha-256', '--encoding=UTF8', '--locale=C']); }
    finally { fs.unlinkSync(passwordFile); }
  }
  if (!await listening(config.port)) runPg('pg_ctl', ['-D', dataDir, '-l', path.join(storage, 'postgres.log'), '-o', '-h 127.0.0.1 -p 5433', '-w', '-t', '30', 'start']);
  const base = `postgresql://${config.user}:${config.password}@127.0.0.1:${config.port}/`;
  const bootstrap = connect(base + 'postgres');
  try { if (!(await bootstrap`SELECT 1 FROM pg_database WHERE datname='tnt_cms_local'`).length) await bootstrap.unsafe('CREATE DATABASE tnt_cms_local'); }
  finally { await bootstrap.end({ timeout: 5 }); }
  return base + 'tnt_cms_local';
}
function updateEnvironment(values) {
  const file = path.join(root, '.env.local');
  let source = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  for (const [key, value] of Object.entries(values)) {
    if (/[\r\n]/.test(value)) throw new Error('Giá trị môi trường không hợp lệ.');
    const rule = new RegExp('^' + key + '=.*$', 'm');
    source = rule.test(source) ? source.replace(rule, () => key + '=' + value) : source + (source.endsWith('\n') || !source ? '' : '\n') + key + '=' + value + '\n';
    process.env[key] = value;
  }
  fs.writeFileSync(file, source, { mode: 0o600 });
}
async function setup() {
  const existing = process.env.DATABASE_URL;
  if (existing && !['localhost', '127.0.0.1', '[::1]'].includes(new URL(existing).hostname)) { console.log('Đang dùng database cloud. Chạy cms:migrate và cms:import:mysql hoặc cms:admin để khởi tạo.'); return; }
  const url = await ensurePostgres();
  if (existing && existing !== url) throw new Error('DATABASE_URL local khác cấu hình helper; cấu hình hiện tại được giữ nguyên.');
  const sql = connect(url);
  try {
    await migrate(sql);
    const [count] = await sql`SELECT count(*)::integer AS total FROM tnt_cms.users`;
    if (!count.total) {
      if (fs.existsSync(path.join(root, 'backend/.env'))) {
        console.log('Nhập tài khoản và yêu cầu từ MySQL cũ (chỉ đọc dữ liệu nguồn)...');
        console.log(JSON.stringify(await importMysql(sql)));
      } else {
        const password = 'Tnt1!' + crypto.randomBytes(18).toString('base64url');
        await createAdmin(sql, { username: 'admin', displayName: 'TNT Admin', email: 'admin@tnt.example', password });
        fs.writeFileSync(path.join(storage, 'local-admin.txt'), `TNT CMS - LOCAL ONLY\nURL: ${site}/cms\nUsername: admin\nInitial password: ${password}\n`, { mode: 0o600 });
      }
    }
    updateEnvironment({ DATABASE_URL: url, CMS_SESSION_SECRET: process.env.CMS_SESSION_SECRET || crypto.randomBytes(32).toString('hex') });
    console.log('CMS local đã chuyển sang PostgreSQL. Tài khoản và dữ liệu hiện có được giữ nguyên.');
  } finally { await sql.end({ timeout: 5 }); }
}
async function start() {
  fs.mkdirSync(storage, { recursive: true });
  if (!process.env.DATABASE_URL) await setup();
  else if (fs.existsSync(configFile)) { const config = readConfig(), url = new URL(process.env.DATABASE_URL); if (url.hostname === '127.0.0.1' && Number(url.port) === config.port && url.username === config.user) await ensurePostgres(); }
  if (!process.env.CMS_SESSION_SECRET || process.env.CMS_SESSION_SECRET.length < 32) throw new Error('Thiếu CMS_SESSION_SECRET (tối thiểu 32 ký tự).');
  const sql = connect(process.env.DATABASE_URL);
  try { await sql`SELECT 1 FROM tnt_cms.users LIMIT 1`; } finally { await sql.end({ timeout: 5 }); }
  if (!await listening(3000)) {
    const stdout = fs.openSync(path.join(storage, 'website.log'), 'a'), stderr = fs.openSync(path.join(storage, 'website-error.log'), 'a');
    const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3000'], { cwd: root, env: process.env, detached: true, windowsHide: true, stdio: ['ignore', stdout, stderr] });
    child.unref(); fs.closeSync(stdout); fs.closeSync(stderr);
    fs.writeFileSync(stateFile, JSON.stringify({ pid: child.pid, startedAt: Date.now() }));
  }
  for (let i = 0; i < 20; i++) { try { const response = await fetch(site + '/api/cms/session', { signal: AbortSignal.timeout(10000) }); if (response.ok && typeof (await response.json()).csrfToken === 'string') { console.log(`Website: ${site}\nCMS: ${site}/cms\nBackend: Next.js + PostgreSQL (không cần PHP/XAMPP)`); return; } } catch {} await delay(1000); }
  throw new Error('CMS chưa sẵn sàng. Khởi động lại terminal Next.js để nạp DATABASE_URL mới, rồi chạy cms:start.');
}
async function status() {
  console.log('Website: ' + (await listening(3000) ? 'running' : 'stopped'));
  if (!process.env.DATABASE_URL) { console.log('Database: chưa cấu hình'); return; }
  const sql = connect(process.env.DATABASE_URL);
  try { await sql`SELECT 1 FROM tnt_cms.users LIMIT 1`; console.log('Database: connected (PostgreSQL)'); } finally { await sql.end({ timeout: 5 }); }
}
function stop() {
  if (fs.existsSync(stateFile)) {
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    if (Number.isInteger(state.pid) && process.platform === 'win32') { const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', `$p=Get-Process -Id ${state.pid} -ErrorAction SilentlyContinue; if ($p) { $p.StartTime.ToUniversalTime().ToString('o') }`], { encoding: 'utf8', windowsHide: true }); if (Math.abs(Date.parse(result.stdout.trim()) - state.startedAt) < 5000) { try { process.kill(state.pid); } catch {} } }
    fs.unlinkSync(stateFile);
  }
  if (fs.existsSync(configFile)) { readConfig(); const status = spawnSync(executable('pg_ctl'), ['-D', dataDir, 'status'], { windowsHide: true }); if (status.status === 0) runPg('pg_ctl', ['-D', dataDir, '-m', 'fast', '-w', '-t', '30', 'stop']); }
  console.log('Đã dừng dịch vụ do helper quản lý. File database được giữ nguyên.');
}
if (require.main === module) (async () => { const command = process.argv[2] || 'start'; if (command === 'setup') await setup(); else if (command === 'start') await start(); else if (command === 'status') await status(); else if (command === 'stop') stop(); else throw new Error('Lệnh hỗ trợ: setup, start, status, stop.'); })().catch(error => { console.error(safeError(error)); process.exitCode = 1; });
module.exports = { setup, start, status, stop };
