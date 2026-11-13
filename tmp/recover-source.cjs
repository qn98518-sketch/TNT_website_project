const fs=require('fs'), path=require('path'), cp=require('child_process');
const found=new Map();
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.map')){try{const j=JSON.parse(fs.readFileSync(p,'utf8'));function scan(m){if(m.sections)m.sections.forEach(s=>scan(s.map));(m.sources||[]).forEach((s,i)=>{if(s.includes('/TNT_website_project/src/')&&m.sourcesContent?.[i]){const f=decodeURIComponent(s.split('/TNT_website_project/')[1]);const content=m.sourcesContent[i];if(!content.includes('getI18n')&&!content.includes('useI18n'))found.set(f,content);}})}scan(j)}catch{}}}}
walk('.next/dev');
console.log('Available source snapshots:',[...found.keys()].filter(s=>s.endsWith('.tsx')));
const files=[];
function targets(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())targets(p);else if(p.endsWith('.tsx')&&!p.includes('i18n')&&fs.readFileSync(p,'utf8').includes('const { t }'))files.push(p.replaceAll('\\','/'));}}
targets('src');
for(const file of files){let original=found.get(file);if(!original){try{original=cp.execFileSync('git',['show','HEAD:'+file],{encoding:'utf8',stdio:['ignore','pipe','ignore']});}catch{console.log('MISSING',file);continue;}}const out=path.join('tmp/before-localization',file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,original);console.log('Saved',file);}
