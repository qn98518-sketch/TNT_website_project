/* Next.js production + PostgreSQL integration in a disposable, isolated database. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const ts = require('typescript');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const { migrate } = require('./cms-db.cjs');
const { importData } = require('./cms-import-mysql.cjs');
const root = path.resolve(__dirname, '..');
let databaseAdmin, testDatabase, testDatabaseName;
const children = [];
const logs = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const secret = crypto.randomBytes(32).toString('hex');
const dbPassword = crypto.randomBytes(20).toString('hex');
const adminPassword = 'Test1-' + crypto.randomBytes(16).toString('hex');
const newPassword = 'Changed2-' + crypto.randomBytes(16).toString('hex');
const staffPassword = 'Staff3-' + crypto.randomBytes(16).toString('hex');
function loadTs(filename, cache = new Map()) {
  filename = path.resolve(filename); if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} }; cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', code)(id => id.startsWith('@/') ? loadTs(path.join(root, 'src', id.slice(2)) + '.ts', cache) : require(id), module, module.exports);
  return module.exports;
}
function launch(executable, args, env = process.env, cwd = root) {
  const child = spawn(executable, args, { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  children.push(child); let output = '';
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { output = (output + chunk.toString()).slice(-24000); });
  child.testOutput = () => output;
  child.done = new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (code, signal) => resolve({ code, signal, output })); });
  child.done.catch(() => {});
  return child;
}
async function run(executable, args, env) {
  const result = await launch(executable, args, env).done;
  if (result.code !== 0) throw new Error(`Test process failed (${path.basename(executable)}): ${result.output}`);
  return result.output.trim();
}
async function port() { const server = net.createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); const value = server.address().port; await new Promise(resolve => server.close(resolve)); return value; }
async function waitPort(number, child) {
  for (let i = 0; i < 150; i++) {
    if (child.exitCode !== null) throw new Error('Test service exited before listening');
    if (await new Promise(resolve => { const socket = net.connect(number, '127.0.0.1'); socket.once('connect', () => { socket.destroy(); resolve(true); }); socket.once('error', () => resolve(false)); })) return;
    await sleep(200);
  }
  throw new Error('Test service startup timed out');
}
let checks = 0;
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label); checks++; }
async function checkClientSessionRecovery() {
  const {createCmsApi,CmsApiError}=loadTs(path.join(root,'src/components/cms/api.ts'));
  const originalFetch=global.fetch;const requests=[];let expired=0,refreshed=0;
  const a='a'.repeat(64),b='b'.repeat(64),c='c'.repeat(64);
  const replies=[
    [200,{user:null,csrfToken:a}],
    [200,{user:{id:1,role:'admin'},csrfToken:b}],
    [401,{error:{code:'UNAUTHENTICATED',message:'Expired'}}],
    [200,{user:null,csrfToken:c}],
    [200,{user:{id:1,role:'admin'},csrfToken:b}],
  ];
  global.fetch=async(url,options)=>{requests.push({url,options});const [status,body]=replies.shift();return Response.json(body,{status});};
  try {
    const api=createCmsApi({expired:()=>expired++,refreshed:error=>{assert.equal(error,undefined);refreshed++;}});
    await api('session');await api('login','POST',{username:'example',password:'not-a-real-credential'});
    await assert.rejects(()=>api('leads'),error=>error instanceof CmsApiError&&error.code==='UNAUTHENTICATED');checks++;
    await api('login','POST',{username:'example',password:'not-a-real-credential'});
    equal(requests[1].options.headers['X-CSRF-Token'],a,'login uses anonymous CSRF');
    equal(requests[4].options.headers['X-CSRF-Token'],c,'login after expiry uses refreshed CSRF');
    equal(requests.filter(request=>request.url==='/api/cms/leads').length,1,'failed request never retried automatically');
    equal(expired,1,'client signs out on revoked session');equal(refreshed,1,'client refresh completes');
  } finally {global.fetch=originalFetch;}
}
function sample(context = 'general') {
  const options = loadTs(path.join(root, 'src/lib/lead-options.ts'));
  return { name: 'Khach hang test', company: 'TNT Test Company', emailOrPhone: 'customer@example.invalid', interest: options.interestsFor(context)[0], industry: '', companySize: '', message: 'Test request', consent: true, context, source: '/', details: Object.fromEntries(options.contextDetailKeys[context].map(key => [key, options.detailOptions[key][0]])) };
}
function cases() {
  const valid = sample();
  return [
    ...['general','food-processing','erp','outsourcing','body-shop'].map(context => ({ name:context, valid:true, payload:sample(context) })),
    {name:'vietnamese phone',valid:true,payload:{...valid,emailOrPhone:'+84 (912) 345-678'}},
    {name:'optional omitted',valid:true,payload:Object.fromEntries(Object.entries(valid).filter(([key])=>!['industry','companySize','message','details'].includes(key)))},
    ...[
      ['array root',[]], ['null root',null], ['name null',{...valid,name:null}], ['missing name',{...valid,name:''}],
      ['too long name',{...valid,name:'x'.repeat(121)}], ['contact number',{...valid,emailOrPhone:1234}],
      ['short phone',{...valid,emailOrPhone:'123456'}], ['long phone',{...valid,emailOrPhone:'1'.repeat(16)}],
      ['bad email',{...valid,emailOrPhone:'a@bad'}], ['invalid company',{...valid,company:[]}],
      ['unknown field',{...valid,role:'admin'}], ['string consent',{...valid,consent:'true'}], ['false consent',{...valid,consent:false}],
      ['optional wrong type',{...valid,message:42}], ['oversize message',{...valid,message:'x'.repeat(4001)}],
      ['bad enum',{...valid,companySize:'unknown'}], ['interest wrong context',{...sample('erp'),interest:'Khac'}],
      ['unknown context',{...valid,context:'admin'}], ['external source',{...valid,source:'//evil.example'}],
      ['source control',{...valid,source:'/a\nb'}], ['source backslash',{...valid,source:'/foo\\bar'}],
      ['source query',{...valid,source:'/a?token=1'}], ['details array',{...valid,details:[]}],
      ['details null',{...valid,details:null}], ['wrong detail context',{...valid,details:{erpNeed:'Khac'}}],
      ['wrong detail value',{...sample('erp'),details:{erpNeed:'unsupported'}}], ['control chars',{...valid,name:'A\u0000B'}],
      ['prototype context',{...valid,context:'__proto__',details:{erpNeed:'bad'}}],
      ['constructor context',{...valid,context:'constructor',details:{erpNeed:'bad'}}],
    ].map(([name,payload])=>({name,valid:false,payload})),
  ];
}
function client(origin, forwarded = '198.51.100.1') {
  let cookie = '', csrf = '';
  async function request(endpoint, method = 'GET', body, extras = {}) {
    const headers = { 'Content-Type':'application/json', Origin:origin, 'X-Forwarded-For':forwarded, ...(cookie ? {Cookie:cookie} : {}), ...(method !== 'GET' ? {'X-CSRF-Token':csrf} : {}), ...extras };
    const response = await fetch(origin + endpoint, { method, headers, body:body===undefined?undefined:JSON.stringify(body), redirect:'manual' });
    for(const value of response.headers.getSetCookie()) if(value.startsWith('tnt_cms=')) cookie=value.split(';')[0];
    const text=await response.text(); assert(!text.includes(secret),'Shared secret leaked');
    let data; try{data=JSON.parse(text);}catch{throw new Error('Expected JSON: '+response.status+' '+text.slice(0,160));}
    if(data.csrfToken)csrf=data.csrfToken;
    return {status:response.status,data,headers:response.headers};
  }
  return {request, session:()=>request('/api/cms/session'),login:(username,password)=>request('/api/cms/login','POST',{username,password}), sessionCookie:()=>cookie};
}
(async()=>{
  fs.mkdirSync(path.join(root,'tmp'),{recursive:true});
  await checkClientSessionRecovery();
  const fixtures=cases(); const validate=loadTs(path.join(root,'src/server/leads/contract.ts')).validateLeadSubmission;
  for(const fixture of fixtures)equal(validate(fixture.payload).success,fixture.valid,'TS '+fixture.name);
  const config=JSON.parse(fs.readFileSync(path.join(root,'backend/storage/local-postgres.json'),'utf8'));
  assert(config.user==='tnt_local'&&config.port===5433,'Tests require the isolated local PostgreSQL helper. Run cms:setup first.');
  const base=`postgresql://${config.user}:${config.password}@127.0.0.1:${config.port}/`;
  databaseAdmin=postgres(base+'postgres',{ssl:false,max:1,onnotice:()=>{}});
  testDatabaseName='tnt_cms_test_'+crypto.randomBytes(8).toString('hex');
  await databaseAdmin.unsafe('CREATE DATABASE '+testDatabaseName);
  testDatabase=postgres(base+testDatabaseName,{ssl:false,max:3,onnotice:()=>{}});
  await migrate(testDatabase);await migrate(testDatabase);
  const legacyHash=(await bcrypt.hash(adminPassword,10)).replace(/^\$2b\$/,'$2y$');
  const legacy={users:[{id:1,username:'fixed-admin',display_name:'Test Admin',email:'admin@example.invalid',password_hash:legacyHash,role:'admin',active:1,auth_version:1,version:1,created_at:'2026-01-02 03:04:05',updated_at:'2026-01-02 03:04:05'}],leads:[],audit:[]};
  const legacySubmissionId=crypto.randomUUID(),legacyPayload=sample();
  legacy.leads.push({id:7,name:legacyPayload.name,email_or_phone:legacyPayload.emailOrPhone,company:legacyPayload.company,interest:legacyPayload.interest,industry:'',company_size:'',message:legacyPayload.message,consent:true,context:'general',source:'/',details:{},status:'new',notes:'Preserved legacy note',submission_key:crypto.createHash('sha256').update(legacySubmissionId).digest('hex'),payload_hash:'old PHP hash will be normalized',version:3,created_by:1,updated_by:1,created_at:new Date('2026-01-02T03:04:05Z'),updated_at:new Date('2026-01-03T03:04:05Z')});
  legacy.audit.push({id:1,actor_id:1,action:'create',entity_type:'lead',entity_id:7,metadata:{channel:'website'},created_at:new Date('2026-01-02T03:04:05Z')});
  equal((await importData(testDatabase,legacy)).skipped,false,'legacy account imported');
  equal((await importData(testDatabase,legacy)).skipped,true,'repeat import is idempotent');
  await assert.rejects(()=>importData(testDatabase,{...legacy,users:[{...legacy.users[0],display_name:'Different snapshot'}]}));checks++;
  const [imported]=await testDatabase`SELECT password_hash,created_at FROM tnt_cms.users WHERE id=1`;
  equal(imported.password_hash,legacyHash,'legacy bcrypt hash is preserved');equal(imported.created_at.toISOString(),'2026-01-02T03:04:05.000Z','legacy date stays UTC');
  const [legacyLead]=await testDatabase`SELECT * FROM tnt_cms.leads WHERE id=7`;
  equal(legacyLead.notes,'Preserved legacy note','migration preserves lead notes');equal(legacyLead.version,3,'migration preserves versions');equal(legacyLead.details,{},'migration stores JSON as an object');
  const [legacyAudit]=await testDatabase`SELECT metadata FROM tnt_cms.audit_log WHERE id=1`;equal(legacyAudit.metadata,{channel:'website'},'migration preserves audit objects');
  const nextPort=await port();
  const origin='http://127.0.0.1:'+nextPort;
  const env={...process.env,DATABASE_URL:base+testDatabaseName,CMS_MIGRATION_DATABASE_URL:base+testDatabaseName,CMS_SESSION_SECRET:secret,NEXT_PUBLIC_SITE_URL:origin,VERCEL:''};
  const duplicateAdmin=await launch(process.execPath,['scripts/cms-database.cjs','create-admin'],{...env,CMS_ADMIN_USERNAME:'fixed-admin',CMS_ADMIN_NAME:'Test Admin',CMS_ADMIN_EMAIL:'admin@example.invalid',CMS_ADMIN_PASSWORD:adminPassword}).done;equal(duplicateAdmin.code,1,'bootstrap cannot recreate admin');
  const nextServer=launch(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(nextPort)],env);await waitPort(nextPort,nextServer);
  const admin=client(origin),admin2=client(origin),visitor=client(origin,'198.51.100.2');
  equal((await visitor.request('/api/leads','POST',legacyPayload,{'X-Submission-Id':legacySubmissionId})).status,202,'retry of migrated PHP submission is accepted');
  equal((await visitor.request('/api/leads','POST',{...legacyPayload,message:'Changed after migration'},{'X-Submission-Id':legacySubmissionId})).status,409,'changed migrated submission is rejected');
  equal((await testDatabase`SELECT count(*)::integer AS total FROM tnt_cms.leads`)[0].total,1,'migrated retry does not duplicate');
  await testDatabase`DELETE FROM tnt_cms.leads WHERE id=7`;
  const anonymous=await admin.request('/api/cms/leads');equal(anonymous.status,401,'anonymous blocked '+JSON.stringify(anonymous.data));
  let response=await admin.session();equal(response.status,200,'anonymous session');equal(response.data.user,null,'no anonymous user');
  assert(anonymous.headers.get('set-cookie').includes('HttpOnly'));assert(anonymous.headers.get('set-cookie').includes('SameSite=Strict'));assert(response.headers.get('cache-control').includes('no-store'));checks+=3;
  equal((await admin.request('/api/cms/login','POST',{username:'fixed-admin',password:adminPassword},{'X-CSRF-Token':'bad'})).status,403,'login CSRF');
  equal((await admin.login('fixed-admin','wrong-password')).status,401,'wrong password');
  response=await admin.login('fixed-admin',adminPassword);equal(response.status,200,'admin login');equal(response.data.user.role,'admin','admin role');assert(!JSON.stringify(response.data).includes('password_hash'));checks++;
  await admin2.session();equal((await admin2.login('fixed-admin',adminPassword)).status,200,'second admin session');
  const peerPort=await port();const peerServer=launch(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(peerPort)],env);await waitPort(peerPort,peerServer);
  const peerSession=await fetch(`http://127.0.0.1:${peerPort}/api/cms/session`,{headers:{Cookie:admin.sessionCookie()}});equal(peerSession.status,200,'session works on another server instance');equal((await peerSession.json()).user.role,'admin','database sessions share authentication');
  equal((await admin.request('/api/cms/users','GET',undefined,{Origin:'https://evil.example'})).status,403,'cross origin rejected');
  equal((await admin.request('/api/cms/users','POST',{}, {'X-CSRF-Token':'bad'})).status,403,'write CSRF');
  let adminUser=(await admin.request('/api/cms/users')).data.items[0];
  equal((await admin.request('/api/cms/users/'+adminUser.id,'DELETE',{version:adminUser.version})).status,403,'admin self delete');
  equal((await admin.request('/api/cms/users/'+adminUser.id,'PATCH',{})).status,403,'fixed admin edits');
  const account={username:'test-editor',displayName:'Test Editor',email:'editor@example.invalid',role:'editor',active:true,password:staffPassword};
  equal((await admin.request('/api/cms/users','POST',{...account,role:'admin'})).status,422,'cannot create second admin');
  equal((await admin.request('/api/cms/users','POST',{...account,active:'true'})).status,422,'boolean must be boolean');
  response=await admin.request('/api/cms/users','POST',account);equal(response.status,201,'create editor');let editorUser=response.data.user;
  equal((await admin.request('/api/cms/users','POST',account)).status,409,'duplicate username/email');
  const viewerAccount={...account,username:'test-viewer',email:'viewer@example.invalid',role:'viewer'};
  response=await admin.request('/api/cms/users','POST',viewerAccount);equal(response.status,201,'create viewer');const viewerUser=response.data.user;
  const editor=client(origin),viewer=client(origin);await editor.session();await viewer.session();equal((await editor.login('test-editor',staffPassword)).status,200,'editor login');equal((await viewer.login('test-viewer',staffPassword)).status,200,'viewer login');
  equal((await editor.request('/api/cms/users')).status,403,'editor no user management');equal((await viewer.request('/api/cms/users')).status,403,'viewer no user management');
  for(const context of ['general','food-processing','erp','outsourcing','body-shop'])equal((await visitor.request('/api/leads','POST',sample(context),{'X-Submission-Id':crypto.randomUUID()})).status,202,'intake '+context);
  const id=crypto.randomUUID();equal((await visitor.request('/api/leads','POST',sample(),{'X-Submission-Id':id})).status,202,'new idempotent intake');equal((await visitor.request('/api/leads','POST',sample(),{'X-Submission-Id':id})).status,202,'retry accepted');equal((await visitor.request('/api/leads','POST',{...sample(),message:'changed'},{'X-Submission-Id':id})).status,409,'idempotency mismatch');
  equal((await visitor.request('/api/leads','POST',{...sample(),consent:'true'})).status,422,'public JSON validation');
  let list=(await admin.request('/api/cms/leads')).data;equal(list.total,6,'six records (retry did not duplicate)');
  equal((await viewer.request('/api/cms/leads')).status,200,'viewer can read');equal((await viewer.request('/api/cms/leads','POST',{...sample(),status:'new',notes:''})).status,403,'viewer cannot create');
  let lead=list.items[0];const managed={...sample(),status:'in_progress',notes:'Internal note'};
  response=await editor.request('/api/cms/leads','POST',managed);equal(response.status,201,'editor create');lead=response.data.lead;
  const update={...managed,name:'Updated test name',version:lead.version};response=await editor.request('/api/cms/leads/'+lead.id,'PATCH',update);equal(response.status,200,'editor update');equal(response.data.lead.notes,'Internal note','notes preserved');let updated=response.data.lead;
  equal((await editor.request('/api/cms/leads/'+lead.id,'PATCH',update)).status,409,'stale version update');equal((await editor.request('/api/cms/leads/'+lead.id,'DELETE',{version:lead.version})).status,409,'stale delete');
  equal((await viewer.request('/api/cms/leads/'+lead.id,'PATCH',{...update,version:updated.version})).status,403,'viewer cannot edit');equal((await viewer.request('/api/cms/leads/'+lead.id,'DELETE',{version:updated.version})).status,403,'viewer cannot delete');
  equal((await admin.request('/api/cms/leads?context=erp')).data.total,1,'filter service');equal((await admin.request('/api/cms/leads?status=in_progress')).data.total,1,'filter status');equal((await admin.request('/api/cms/leads?q='+encodeURIComponent("' OR 1=1 --"))).data.total,0,'search injection is literal');equal((await admin.request('/api/cms/leads?perPage=1&page=2')).data.items.length,1,'pagination');equal((await admin.request('/api/cms/leads?page=0')).status,422,'invalid page');equal((await admin.request('/api/cms/leads?from=2026-02-30')).status,422,'invalid date');
  equal((await editor.request('/api/cms/leads/'+lead.id,'DELETE',{version:updated.version})).status,200,'editor delete');equal((await admin.request('/api/cms/leads/'+lead.id)).status,404,'deleted record missing');
  const {password,...editAccount}=account;response=await admin.request('/api/cms/users/'+editorUser.id,'PATCH',{...editAccount,active:false,version:editorUser.version});equal(response.status,200,'lock account');editorUser=response.data.user;equal((await editor.request('/api/cms/leads')).status,401,'locked session revoked');equal((await editor.login('test-editor',staffPassword)).status,403,'revoked CSRF cannot be reused');await editor.session();equal((await editor.login('test-editor',staffPassword)).status,401,'locked login denied');
  equal((await admin.request('/api/cms/users/'+viewerUser.id,'DELETE',{version:viewerUser.version})).status,200,'delete user');equal((await viewer.request('/api/cms/leads')).status,401,'deleted user session revoked');
  equal((await admin.request('/api/cms/password','POST',{currentPassword:'wrong-password',newPassword,confirmPassword:newPassword})).status,422,'current password verified');equal((await admin.request('/api/cms/password','POST',{currentPassword:adminPassword,newPassword,confirmPassword:'mismatch'})).status,422,'confirmation validated');response=await admin.request('/api/cms/password','POST',{currentPassword:adminPassword,newPassword,confirmPassword:newPassword});equal(response.status,200,'admin changes own password');equal((await admin.request('/api/cms/leads')).status,200,'current session retained');equal((await admin2.request('/api/cms/leads')).status,401,'other session revoked');await admin2.session();equal((await admin2.login('fixed-admin',adminPassword)).status,401,'old password rejected');equal((await admin2.login('fixed-admin',newPassword)).status,200,'new password works');
  const limited=client(origin,'198.51.100.33');await limited.session();for(let i=0;i<5;i++)equal((await limited.login('nonexistent','wrong-password')).status,401,'failed login '+i);equal((await limited.login('nonexistent','wrong-password')).status,429,'login throttle');
  const intakeLimited=client(origin,'198.51.100.44');for(let i=0;i<10;i++)equal((await intakeLimited.request('/api/leads','POST',sample())).status,202,'allowed intake '+i);equal((await intakeLimited.request('/api/leads','POST',sample())).status,429,'intake throttle');
  for(const url of ['/cms','/ve-tnt/cms','/du-an/erp-che-bien-thuy-san/cms','/dich-vu/erp/cms']){const r=await fetch(origin+url,{redirect:'manual'});equal(r.status,url==='/cms'?200:307,'CMS path '+url);if(url!=='/cms')assert(new URL(r.headers.get('location'),origin).pathname==='/cms');}
  for(const url of ['/','/ve-tnt','/giai-phap-nganh-thuc-pham','/dich-vu','/dich-vu/erp','/dich-vu/outsourcing','/dich-vu/body-shop']){
    const r=await fetch(origin+url);equal(r.status,200,'public page '+url);const html=await r.text();
    assert(/<form[^>]+class="lead-form"/i.test(html),'Shared form missing '+url);checks++;
    assert(/<input(?=[^>]*\bname="name")(?=[^>]*\bmaxLength="120")[^>]*>/i.test(html),'Name UI constraint missing '+url);checks++;
    assert(/<input(?=[^>]*\bname="emailOrPhone")(?=[^>]*\bmaxLength="254")[^>]*>/i.test(html),'Contact UI constraint missing '+url);checks++;
  }
  let malformed=await fetch(origin+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});equal(malformed.status,400,'malformed JSON');equal((await fetch(origin+'/api/leads',{method:'POST',headers:{'Content-Type':'text/plain'},body:'{}'})).status,415,'wrong content type');equal((await visitor.request('/api/leads','POST',{...sample(),message:'x'.repeat(33000)})).status,413,'body limit');
  equal((await admin.request('/api/cms/logout','POST',{})).status,200,'logout');equal((await admin.request('/api/cms/leads')).status,401,'logged out session blocked');
  await assert.rejects(()=>testDatabase`DELETE FROM tnt_cms.users WHERE role='admin'`,error=>error.code==='23514');checks++;
  await assert.rejects(()=>testDatabase`UPDATE tnt_cms.users SET active=false WHERE role='admin'`,error=>error.code==='23514');checks++;
  await assert.rejects(()=>testDatabase`INSERT INTO tnt_cms.users (username,display_name,email,password_hash,role) VALUES ('extra-admin','Extra','extra@example.invalid','unused','admin')`,error=>error.code==='23505');checks++;
  const [acl]=await testDatabase`SELECT count(*)::integer AS public_grants FROM pg_namespace n, LATERAL aclexplode(n.nspacl) a WHERE n.nspname='tnt_cms' AND a.grantee=0`;
  equal(acl.public_grants,0,'private schema has no PUBLIC access');
  const [rls]=await testDatabase`SELECT bool_and(c.relrowsecurity) AS protected FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='tnt_cms' AND c.relkind='r'`;
  equal(rls.protected,true,'all CMS tables have RLS enabled');
  const [secrets]=await testDatabase`SELECT count(*)::integer AS leaks FROM tnt_cms.audit_log WHERE metadata::text LIKE ${'%'+newPassword+'%'}`;
  equal(secrets.leaks,0,'audit records contain no plaintext passwords');
  console.log(`CMS integration: ${checks} assertions passed. Next.js production + PostgreSQL; no PHP backend.`);
})().catch(error=>{let message=String(error.stack||error)+'\n'+children.map(child=>child.testOutput().slice(-3000)).join('\n');for(const value of [secret,dbPassword,adminPassword,newPassword,staffPassword])message=message.replaceAll(value,'[REDACTED]');console.error(message);process.exitCode=1;}).finally(async()=>{
  for(const child of [...children].reverse())if(child.exitCode===null&&!child.killed)child.kill();
  await Promise.allSettled(children.map(child=>child.done));
  if(testDatabase)await testDatabase.end({timeout:5});
  if(databaseAdmin){if(/^tnt_cms_test_[a-f0-9]{16}$/.test(testDatabaseName||''))await databaseAdmin.unsafe('DROP DATABASE '+testDatabaseName+' WITH (FORCE)');await databaseAdmin.end({timeout:5});}
});
