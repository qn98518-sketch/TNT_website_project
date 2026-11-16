const ts=require('typescript'),fs=require('node:fs'),path=require('node:path');
const root=process.cwd(),config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);
const options=ts.parseJsonConfigFileContent(config.config,ts.sys,root).options;
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}walk(path.join(root,'src'));
const normalize=p=>path.resolve(p).toLowerCase();const graph=new Map(),incoming=new Map();
for(const file of files){
 const text=fs.readFileSync(file,'utf8'),deps=[];
 if(/\.[cm]?[jt]sx?$/.test(file)){
  const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
  function visit(n){if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier&&ts.isStringLiteral(n.moduleSpecifier))deps.push(n.moduleSpecifier.text);
   if(ts.isCallExpression(n)&&n.arguments[0]&&ts.isStringLiteral(n.arguments[0])&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||n.expression.getText(source)==='require'))deps.push(n.arguments[0].text);ts.forEachChild(n,visit);}visit(source);
 }else if(file.endsWith('.css'))for(const m of text.matchAll(/@import\s+["']([^"']+)["']/g))deps.push(m[1]);
 const resolved=[];
 for(const dep of deps){let target=ts.resolveModuleName(dep,file,options,ts.sys).resolvedModule?.resolvedFileName;
  if(!target&&(dep.startsWith('.')||dep.startsWith('@/'))){const base=dep.startsWith('@/')?path.join(root,'src',dep.slice(2)):path.resolve(path.dirname(file),dep);for(const candidate of[base,base+'.css',base+'.json'])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile()){target=candidate;break;}}
  if(target&&normalize(target).startsWith(normalize(path.join(root,'src')))){resolved.push(normalize(target));const parents=incoming.get(normalize(target))||[];parents.push(path.relative(root,file));incoming.set(normalize(target),parents);}
 }graph.set(normalize(file),resolved);
}
const reachable=new Set();function mark(file){if(reachable.has(file))return;reachable.add(file);for(const dep of graph.get(file)||[])mark(dep);}
for(const file of files.filter(p=>p.includes(path.sep+'app'+path.sep)&&/\.(tsx?|css|json)$/.test(p)))mark(normalize(file));
const result={unreachable:files.filter(p=>/\.(tsx?|css|json)$/.test(p)&&!reachable.has(normalize(p))).map(p=>({file:path.relative(root,p),incoming:incoming.get(normalize(p))||[]})),allFiles:files.length};
fs.mkdirSync('tmp',{recursive:true});fs.writeFileSync('tmp/source-graph-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
if(result.unreachable.length)process.exitCode=1;
