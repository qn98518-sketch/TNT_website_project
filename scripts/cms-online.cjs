// Production migration helper. Credentials are read from ignored Vercel files and never logged.
const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');
const { X509Certificate, randomBytes } = require('node:crypto');
const { spawn } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const { compare } = require('bcryptjs');
const { connect, migrate, safeError, root } = require('./cms-db.cjs');
const { importData } = require('./cms-import-mysql.cjs');

function productionEnvironment() {
  const file = path.join(root, '.vercel/.env.production.local');
  if (!fs.existsSync(file)) throw new Error('Pull the linked Vercel production environment first.');
  const env = parseEnv(fs.readFileSync(file, 'utf8'));
  const certificateFile = path.join(root, '.vercel/supabase-ca.crt');
  if (!env.DATABASE_SSL_CA && fs.existsSync(certificateFile)) env.DATABASE_SSL_CA = fs.readFileSync(certificateFile, 'utf8');
  return env;
}
function cloudUrl(env) {
  const value = env.DATABASE_URL || env.POSTGRES_URL;
  if (!value) throw new Error('No DATABASE_URL or POSTGRES_URL was found in the linked Vercel project.');
  const url = new URL(value);
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname.endsWith('.supabase.com') && !url.hostname.endsWith('.supabase.co')) throw new Error('The production database is not an expected Supabase PostgreSQL host. No data was changed.');
  return value;
}
async function inspect() {
  const env = productionEnvironment();
  const url = new URL(cloudUrl(env));
  console.log(JSON.stringify({ databaseVariable: env.DATABASE_URL ? 'DATABASE_URL' : 'POSTGRES_URL', host: url.hostname, port: url.port || '5432', database: url.pathname.slice(1), queryKeys: [...url.searchParams.keys()], cmsSecretPresent: Boolean(env.CMS_SESSION_SECRET), siteUrl: env.NEXT_PUBLIC_SITE_URL, variables: Object.keys(env).filter(key => key !== 'VERCEL_OIDC_TOKEN') }, null, 2));
  if (env.DATABASE_SSL_CA) process.env.DATABASE_SSL_CA = env.DATABASE_SSL_CA;
  const sql = connect(cloudUrl(env));
  try {
    const [result] = await sql`SELECT current_database() AS database, to_regclass('tnt_cms.users')::text AS users_table, to_regclass('tnt_cms.leads')::text AS leads_table`;
    console.log(JSON.stringify(result));
    if (result.users_table && result.leads_table) console.log(JSON.stringify((await sql`SELECT (SELECT count(*)::integer FROM tnt_cms.users) AS users, (SELECT count(*)::integer FROM tnt_cms.leads) AS leads`)[0]));
  } finally { await sql.end({ timeout: 5 }); }
}
async function trust() {
  let response;
  for (const url of ['https://supabase.com/downloads/prod-ca-2021.crt', 'https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt']) {
    response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'follow' });
    console.log('Supabase CA download: ' + response.status + ' ' + new URL(url).hostname);
    if (response.ok) break;
  }
  if (!response?.ok) throw new Error('Could not download the official Supabase root CA.');
  const pem = await response.text(), certificate = new X509Certificate(pem);
  if (!certificate.ca || !certificate.subject.includes('Supabase') || Date.parse(certificate.validTo) < Date.now()) throw new Error('Unexpected Supabase root certificate.');
  fs.writeFileSync(path.join(root, '.vercel/supabase-ca.crt'), pem);
  console.log(JSON.stringify({ certificate: certificate.subject, validTo: certificate.validTo, fingerprint: certificate.fingerprint256 }));
}
function runVercel(args, input) {
  const cli = process.env.CMS_VERCEL_CLI || process.argv[3];
  if (!cli || !fs.existsSync(cli)) throw new Error('Set CMS_VERCEL_CLI to the installed Vercel CLI entrypoint.');
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: root, env: process.env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; }); child.stderr.on('data', chunk => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', code => { if (code !== 0) reject(new Error('Vercel command failed: ' + args.slice(0, 3).join(' '))); else resolve({ stdout, stderr }); });
    child.stdin.on('error', () => {}); child.stdin.end(input);
  });
}
async function configure() {
  const env = productionEnvironment();
  const generatedFile = path.join(root, '.vercel/.env.cms.generated.local');
  const generated = fs.existsSync(generatedFile) ? parseEnv(fs.readFileSync(generatedFile, 'utf8')) : {};
  const secret = env.CMS_SESSION_SECRET || generated.CMS_SESSION_SECRET || randomBytes(32).toString('hex');
  if (secret.length < 32 || !env.DATABASE_SSL_CA) throw new Error('A valid CMS secret and verified Supabase root CA are required.');
  fs.writeFileSync(generatedFile, 'CMS_SESSION_SECRET=' + secret + '\n', { mode: 0o600 });
  const values = { DATABASE_URL: cloudUrl(env), CMS_SESSION_SECRET: secret, DATABASE_SSL_CA: env.DATABASE_SSL_CA };
  for (const [key, value] of Object.entries(values)) {
    if (env[key] === value && !(key === 'DATABASE_SSL_CA' && !parseEnv(fs.readFileSync(path.join(root, '.vercel/.env.production.local'), 'utf8')).DATABASE_SSL_CA)) { console.log(key + ': already configured'); continue; }
    await runVercel(['env', 'add', key, '--environment', 'production', '--sensitive', '--force', '--yes'], value);
    console.log(key + ': configured for Production (Secret)');
  }
}
async function auditDeployment() {
  const result = await runVercel(['deploy', '--dry', '--json']);
  const data = JSON.parse(result.stdout);
  fs.writeFileSync(path.join(root, '.vercel/deployment-audit.json'), JSON.stringify(data, null, 2));
  console.log(JSON.stringify({ fields: Object.keys(data), arrays: Object.fromEntries(Object.entries(data).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, { count: value.length, first: value.slice(0, 2) }])) }, null, 2));
}
async function smoke() {
  const env = productionEnvironment(), origin = new URL(env.NEXT_PUBLIC_SITE_URL).origin;
  if (origin !== 'https://tnt-website-theta.vercel.app') throw new Error('Unexpected production origin. Verify the target before testing.');
  if (env.DATABASE_SSL_CA) process.env.DATABASE_SSL_CA = env.DATABASE_SSL_CA;
  const sql = connect(cloudUrl(env));
  let cookie = '', csrf = '', testLead, loggedIn = false;
  const checks = [], fixtureName = 'TNT CMS smoke ' + randomUUID().slice(0, 12), fixtureSource = '/cms-online-smoke-test';
  const check = (condition, label) => { if (!condition) throw new Error('Online check failed: ' + label); checks.push(label); };
  async function request(endpoint, method = 'GET', body) {
    const response = await fetch(origin + endpoint, { method, cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(25000), headers: { 'Content-Type': 'application/json', Origin: origin, ...(cookie ? { Cookie: cookie } : {}), ...(method === 'GET' ? {} : { 'X-CSRF-Token': csrf }) }, body: body === undefined ? undefined : JSON.stringify(body) });
    for (const value of response.headers.getSetCookie()) if (value.startsWith('tnt_cms=')) cookie = value.split(';')[0];
    const data = await response.json(); if (typeof data.csrfToken === 'string') csrf = data.csrfToken;
    return { response, data };
  }
  try {
    const page = await fetch(origin + '/cms', { signal: AbortSignal.timeout(25000) });
    check(page.status === 200, 'CMS page returns 200'); await page.text();
    const anonymous = await fetch(origin + '/api/cms/leads', { signal: AbortSignal.timeout(25000) });
    check(anonymous.status === 401, 'Anonymous lead access is rejected'); await anonymous.text();
    const session = await request('/api/cms/session');
    check(session.response.status === 200 && session.data.user === null && /^[a-f0-9]{64}$/.test(csrf), 'PostgreSQL session initializes');
    check(session.response.headers.get('cache-control')?.includes('no-store'), 'CMS responses are not cached');
    const attributes = session.response.headers.getSetCookie().find(value => value.startsWith('tnt_cms=')) || '';
    check(attributes.includes('HttpOnly') && attributes.includes('Secure') && attributes.includes('SameSite=Strict'), 'Production cookie is protected');
    const credentials = fs.readFileSync(path.join(root, 'backend/storage/local-admin.txt'), 'utf8');
    const username = credentials.match(/^Username:\s*([^\r\n]+)/m)?.[1];
    const password = credentials.match(/^Initial password:\s*([^\r\n]+)/m)?.[1];
    const [admin] = await sql`SELECT username,password_hash FROM tnt_cms.users WHERE role='admin'`;
    if (!username || !password || admin.username !== username || !await compare(password, admin.password_hash.replace(/^\$2y\$/, '$2b$'))) throw new Error('The saved initial password is no longer current; do not reset the existing admin.');
    const login = await request('/api/cms/login', 'POST', { username, password });
    check(login.response.status === 200 && login.data.user?.role === 'admin', 'Existing admin signs in online'); loggedIn = true;
    const inbox = await request('/api/cms/leads'); check(inbox.response.status === 200 && inbox.data.total >= 2, 'Migrated leads appear in the inbox');
    const users = await request('/api/cms/users'); check(users.response.status === 200 && users.data.items.filter(user => user.role === 'admin').length === 1, 'Single admin is preserved');
    const payload = { name: fixtureName, company: 'TNT deployment verification', emailOrPhone: 'cms-smoke@example.invalid', interest: 'TNM ERP', industry: '', companySize: '', message: 'Temporary deployment verification fixture', consent: true, context: 'general', source: fixtureSource, details: {} };
    const submissionId = randomUUID();
    const submit = () => fetch(origin + '/api/leads', { method: 'POST', signal: AbortSignal.timeout(25000), headers: { 'Content-Type': 'application/json', Origin: origin, 'X-Submission-Id': submissionId }, body: JSON.stringify(payload) });
    for (const label of ['Public form commits online', 'Retry of the same form is accepted']) { const response = await submit(); const data = await response.json(); check(response.status === 202 && data.accepted === true, label); }
    const filtered = await request('/api/cms/leads?' + new URLSearchParams({ q: fixtureName }));
    check(filtered.response.status === 200 && filtered.data.total === 1, 'New request appears without reloading and retries do not duplicate');
    testLead = filtered.data.items[0]; check(testLead.source === fixtureSource, 'Fixture belongs to this online check');
    const update = await request('/api/cms/leads/' + testLead.id, 'PATCH', { ...payload, status: 'closed', notes: 'Online deployment verified', version: testLead.version });
    check(update.response.status === 200 && update.data.lead.status === 'closed', 'Lead status and notes can be updated'); testLead = update.data.lead;
    const remove = await request('/api/cms/leads/' + testLead.id, 'DELETE', { version: testLead.version });
    check(remove.response.status === 200 && remove.data.deleted === true, 'Temporary request is deleted'); testLead = undefined;
    const missing = await request('/api/cms/leads?' + new URLSearchParams({ q: fixtureName })); check(missing.data.total === 0, 'Fixture cleanup is confirmed');
    const out = await request('/api/cms/logout', 'POST', {}); check(out.response.status === 200 && out.data.user === null, 'Logout works online'); loggedIn = false;
    const [counts] = await sql`SELECT (SELECT count(*)::integer FROM tnt_cms.users) AS users, (SELECT count(*)::integer FROM tnt_cms.leads) AS leads`;
    const result = { origin, status: 'passed', checks: checks.length, validations: checks, data: counts, checkedAt: new Date().toISOString() };
    fs.writeFileSync(path.join(root, '.vercel/cms-online-verification.json'), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
  } finally {
    // Restrict cleanup to the unique fixture created by this invocation, including partial failures.
    await sql`DELETE FROM tnt_cms.leads WHERE name=${fixtureName} AND source=${fixtureSource}`;
    if (loggedIn) await request('/api/cms/logout', 'POST', {}).catch(() => {});
    await sql.end({ timeout: 5 });
  }
}
async function transfer() {
  const env = productionEnvironment(), targetUrl = cloudUrl(env);
  if (env.DATABASE_SSL_CA) process.env.DATABASE_SSL_CA = env.DATABASE_SSL_CA;
  const config = JSON.parse(fs.readFileSync(path.join(root, 'backend/storage/local-postgres.json'), 'utf8'));
  if (config.port !== 5433 || config.user !== 'tnt_local' || !/^[a-f0-9]{48}$/.test(config.password)) throw new Error('Unexpected local database configuration.');
  const source = connect(`postgresql://${config.user}:${config.password}@127.0.0.1:5433/tnt_cms_local`), target = connect(targetUrl);
  try {
    await migrate(target);
    const data = await source.begin('isolation level repeatable read read only', async sql => ({
      users: await sql.unsafe('SELECT * FROM tnt_cms.users ORDER BY id'),
      leads: await sql.unsafe('SELECT * FROM tnt_cms.leads ORDER BY id'),
      audit: await sql.unsafe('SELECT * FROM tnt_cms.audit_log ORDER BY id'),
    }));
    const result = await importData(target, data);
    const [counts] = await target`SELECT (SELECT count(*)::integer FROM tnt_cms.users) AS users, (SELECT count(*)::integer FROM tnt_cms.leads) AS leads, (SELECT count(*)::integer FROM tnt_cms.users WHERE role='admin') AS admins`;
    if (counts.users !== data.users.length || counts.leads !== data.leads.length || counts.admins !== 1) throw new Error('Migration verification failed. Inspect the destination before switching production.');
    console.log(JSON.stringify({ migration: result, verified: counts }));
  } finally { await Promise.allSettled([source.end({ timeout: 5 }), target.end({ timeout: 5 })]); }
}
module.exports = { productionEnvironment, cloudUrl };
if (require.main === module) (async () => {
  if ((process.argv[2] || 'inspect') === 'inspect') await inspect();
  else if (process.argv[2] === 'trust') await trust();
  else if (process.argv[2] === 'transfer') await transfer();
  else if (process.argv[2] === 'configure') await configure();
  else if (process.argv[2] === 'audit') await auditDeployment();
  else if (process.argv[2] === 'smoke') await smoke();
  else throw new Error('Use inspect, trust, transfer, configure, audit or smoke.');
})().catch(error => { console.error(safeError(error)); process.exitCode = 1; });
