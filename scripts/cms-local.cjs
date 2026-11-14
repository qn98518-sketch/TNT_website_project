/* XAMPP local launcher. Secrets are generated locally and written only to ignored files. */
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const crypto = require('node:crypto');
const {spawn, spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const php = process.env.CMS_LOCAL_PHP || 'C:/xampp/php/php.exe';
const backendEnv = path.join(root, 'backend/.env');
const nextEnv = path.join(root, '.env.local');
const storage = path.join(root, 'backend/storage');
const stateFile = path.join(storage, 'local-processes.json');
const credentialsFile = path.join(storage, 'local-admin.txt');
const mysqlFile = path.join(storage, 'local-mysql.json');
const mysqlBin = process.env.CMS_LOCAL_MYSQL_BIN || path.resolve(path.dirname(php), '../mysql/bin');
const site = 'http://localhost:3000';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function parseEnv(file) {
  if(!fs.existsSync(file))return {};
  return Object.fromEntries(fs.readFileSync(file,'utf8').split(/\r?\n/).filter(line=>/^[A-Z][A-Z0-9_]*=/.test(line)).map(line=>{const split=line.indexOf('=');return [line.slice(0,split),line.slice(split+1).trim().replace(/^(["'])(.*)\1$/,'$2')];}));
}
function updateEnv(file, values) {
  let text=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
  for(const [key,value] of Object.entries(values)) {
    if(/[\r\n]/.test(value))throw new Error('Environment values cannot contain newlines');
    const rule=new RegExp('^'+key+'=.*$','m');
    if(rule.test(text))text=text.replace(rule,()=>key+'='+value);else text+=(text&&!text.endsWith('\n')?'\n':'')+key+'='+value+'\n';
  }
  fs.writeFileSync(file,text,{mode:0o600});
}
function environment(config) {return {...process.env,...config};}
function runPhp(args, config, input) {
  const result=spawnSync(php,args,{cwd:root,env:environment(config),encoding:'utf8',input,windowsHide:true});
  if(result.error||result.status!==0)throw new Error('PHP command failed. Check XAMPP/database configuration. '+(result.stderr||'').replace(/password[^\n]*/gi,'[redacted]'));
  return result.stdout.trim();
}
function listening(port) {return new Promise(resolve=>{const socket=net.connect(port,'127.0.0.1');socket.setTimeout(1000);socket.once('connect',()=>{socket.destroy();resolve(true);});socket.once('error',()=>resolve(false));socket.once('timeout',()=>{socket.destroy();resolve(false);});});}
function loadState(){return fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile,'utf8')):{};}
function saveState(state){fs.writeFileSync(stateFile,JSON.stringify(state,null,2));}
function background(name, executable, args, config={}) {
  const stdout=fs.openSync(path.join(storage,name+'.log'),'a'),stderr=fs.openSync(path.join(storage,name+'-error.log'),'a');
  const child=spawn(executable,args,{cwd:root,env:environment(config),detached:true,windowsHide:true,stdio:['ignore',stdout,stderr]});
  child.unref();fs.closeSync(stdout);fs.closeSync(stderr);
  const state=loadState();state[name]={pid:child.pid,startedAt:new Date().toISOString()};saveState(state);
  return child;
}
async function waitFor(port){for(let i=0;i<100;i++){if(await listening(port))return;await delay(200);}throw new Error('Service did not start on port '+port+'. Check backend/storage logs.');}
async function ensureLocalMysql() {
  fs.mkdirSync(storage,{recursive:true});fs.mkdirSync(path.join(storage,'tmp'),{recursive:true});
  let server;
  if(fs.existsSync(mysqlFile))server=JSON.parse(fs.readFileSync(mysqlFile,'utf8'));
  else {
    if(await listening(3307))throw new Error('Port 3307 is already used. No existing service was modified.');
    server={port:3307,password:crypto.randomBytes(24).toString('hex'),dataDir:path.join(storage,'mysql-data')};
    fs.writeFileSync(mysqlFile,JSON.stringify(server,null,2),{mode:0o600});
  }
  const expectedData=path.resolve(storage,'mysql-data');
  if(server.port!==3307||path.resolve(server.dataDir)!==expectedData||!/^[a-f0-9]{48}$/.test(server.password))throw new Error('Invalid local MySQL configuration; no server was started.');
  if(!fs.existsSync(path.join(expectedData,'mysql'))) {
    const result=spawnSync(path.join(mysqlBin,'mysql_install_db.exe'),['--datadir='+expectedData,'--password='+server.password,'--port=3307','--silent'],{cwd:root,encoding:'utf8',windowsHide:true});
    if(result.error||result.status!==0)throw new Error('Could not initialize the isolated XAMPP MySQL database.');
  }
  if(!await listening(3307)) {
    background('mysql',path.join(mysqlBin,'mysqld.exe'),['--no-defaults','--basedir='+path.dirname(mysqlBin),'--datadir='+expectedData,'--port=3307','--bind-address=127.0.0.1','--console','--tmpdir='+path.join(storage,'tmp')]);
    await waitFor(3307);
  }
  return server;
}
async function setup() {
  if(!fs.existsSync(php))throw new Error('XAMPP PHP was not found: '+php);
  fs.mkdirSync(storage,{recursive:true});
  let config=parseEnv(backendEnv);
  if(fs.existsSync(backendEnv)&&config.APP_ENV!=='local')throw new Error('Existing backend configuration is not local. It was preserved.');
  if(config.DB_DATABASE&&config.DB_DATABASE!=='tnt_cms_local')throw new Error('Existing database configuration was preserved; use a separate checkout for local setup.');
  const mysql=await ensureLocalMysql();
  const secret=config.CMS_SHARED_SECRET||crypto.randomBytes(32).toString('hex');
  if(!/^[a-f0-9]{64}$/.test(secret))throw new Error('Existing backend secret is not a generated local secret. Configuration was preserved.');
  config={...config,APP_ENV:'local',CMS_PUBLIC_URL:site,CMS_SHARED_SECRET:secret,DB_HOST:'127.0.0.1',DB_PORT:'3307',DB_DATABASE:'tnt_cms_local',DB_USERNAME:config.DB_USERNAME||'tnt_cms_dev_'+crypto.randomBytes(4).toString('hex'),DB_PASSWORD:config.DB_PASSWORD||crypto.randomBytes(24).toString('hex'),CMS_SESSION_PATH:path.join(storage,'sessions').replaceAll('\\','/')};
  console.log(runPhp(['backend/bin/setup-local.php'],{...config,CMS_LOCAL_MYSQL_PASSWORD:mysql.password}));
  updateEnv(backendEnv,config);
  // Preserve unrelated Next.js environment variables, including the existing Vercel token.
  updateEnv(nextEnv,{CMS_BACKEND_URL:'http://127.0.0.1:8080',CMS_SHARED_SECRET:secret});
  console.log(runPhp(['backend/bin/console.php','migrate'],config));
  const probe=spawnSync(php,['-r',"require 'backend/src/bootstrap.php'; echo row(\"SELECT id FROM cms_users WHERE role='admin'\") ? 'exists' : 'missing';"],{cwd:root,env:environment(config),encoding:'utf8',windowsHide:true});
  if(probe.status!==0)throw new Error('Could not inspect the local admin account');
  if(probe.stdout==='missing') {
    const password='Tnt1!'+crypto.randomBytes(18).toString('base64url');
    runPhp(['backend/bin/console.php','create-admin'],{...config,CMS_ADMIN_USERNAME:'admin',CMS_ADMIN_NAME:'TNT Admin',CMS_ADMIN_EMAIL:'admin@tnt.example'},password+'\n');
    fs.writeFileSync(credentialsFile,`TNT CMS - LOCAL ONLY\n\nURL: ${site}/cms\nUsername: admin\nInitial password: ${password}\n\nChange the password in CMS after your first login.\nThis file is local, ignored by Git, and never deployed to Vercel.\n`,{mode:0o600});
    console.log('Local admin created. Open backend/storage/local-admin.txt for the initial password.');
  } else console.log('Existing admin was preserved.');
}
async function start() {
  const config=parseEnv(backendEnv);
  if(config.APP_ENV!=='local'||config.DB_DATABASE!=='tnt_cms_local')throw new Error('Run npm run cms:setup first.');
  await ensureLocalMysql();
  fs.mkdirSync(path.join(storage,'tmp'),{recursive:true});
  if(!await listening(8080)) {
    background('php',php,['-d','display_errors=0','-d','display_startup_errors=0','-d','sys_temp_dir='+path.join(storage,'tmp'),'-d','upload_tmp_dir='+path.join(storage,'tmp'),'-d','error_log='+path.join(storage,'php-runtime-error.log'),'-S','127.0.0.1:8080','-t','backend/public','backend/public/index.php'],config);
    await waitFor(8080);
  }
  const backend=await fetch('http://127.0.0.1:8080/api/session',{headers:{'X-CMS-Key':config.CMS_SHARED_SECRET},signal:AbortSignal.timeout(10000)});
  const backendResult=await backend.json();
  if(!backend.ok||typeof backendResult.csrfToken!=='string')throw new Error('Port 8080 is not serving the configured TNT PHP backend.');
  if(!await listening(3000)){
    background('website',process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3000']);
    await waitFor(3000);
  }
  let ready=false;
  for(let i=0;i<12;i++){
    try {const response=await fetch(site+'/api/cms/session',{cache:'no-store',signal:AbortSignal.timeout(20000)});const result=await response.json();if(response.ok&&typeof result.csrfToken==='string'){ready=true;break;}}catch{}
    await delay(1000);
  }
  if(!ready)throw new Error('Restart the existing Next.js dev terminal to reload .env.local, then run cms:start again.');
  console.log(`\nWebsite: ${site}\nCMS: ${site}/cms\nDatabase: tnt_cms_local (isolated XAMPP MySQL, port 3307)\nInitial login details: backend/storage/local-admin.txt\n`);
}
async function status(){for(const [name,port]of[['TNT MySQL (XAMPP binaries)',3307],['PHP backend',8080],['Website',3000]])console.log(name+': '+(await listening(port)?'running':'stopped'));}
function processStillOurs(service) {
  if(!Number.isInteger(service?.pid)||!service.startedAt||process.platform!=='win32')return false;
  const result=spawnSync('powershell.exe',['-NoProfile','-Command',`$p=Get-Process -Id ${service.pid} -ErrorAction SilentlyContinue; if ($p) { $p.StartTime.ToUniversalTime().ToString('o') }`],{encoding:'utf8',windowsHide:true});
  const actual=Date.parse(result.stdout?.trim());return Number.isFinite(actual)&&Math.abs(actual-Date.parse(service.startedAt))<5000;
}
async function stop(){
  const state=loadState();
  for(const name of ['php','website']){const service=state[name];if(processStillOurs(service)){try{process.kill(service.pid);}catch{}}delete state[name];}
  if(processStillOurs(state.mysql)&&fs.existsSync(mysqlFile)) {
    const server=JSON.parse(fs.readFileSync(mysqlFile,'utf8'));
    const result=spawnSync(path.join(mysqlBin,'mysqladmin.exe'),['--no-defaults','--host=127.0.0.1','--port=3307','--user=root','shutdown'],{encoding:'utf8',windowsHide:true,env:{...process.env,MYSQL_PWD:server.password}});
    if(result.status!==0)throw new Error('Could not stop the isolated MySQL server cleanly. Data was preserved.');
    delete state.mysql;
  }
  saveState(state);console.log('Stopped helper-owned services. Database files and existing website terminals were preserved.');
}
(async()=>{const command=process.argv[2]||'start';if(command==='setup')await setup();else if(command==='start')await start();else if(command==='status')await status();else if(command==='stop')await stop();else throw new Error('Use setup, start, status, or stop');})().catch(error=>{let message=error.message;const config=parseEnv(backendEnv);for(const key of ['CMS_SHARED_SECRET','DB_PASSWORD'])if(config[key])message=message.replaceAll(config[key],'[REDACTED]');console.error(message);process.exitCode=1;});
