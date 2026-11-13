// One-off migration: consolidate blue UI colors around the approved homepage hero.
const fs = require('node:fs');
const postcss = require('postcss');
const files = ['src/app/globals.css','src/components/reference-pages.css','src/components/unified-pages.css','src/components/wireframe-pages.css'];
function channels(hex) {
  let value=hex.slice(1);
  if(value.length===3||value.length===4)value=[...value].map(c=>c+c).join('');
  return [0,2,4].map(i=>parseInt(value.slice(i,i+2),16)).concat(value.length===8?parseInt(value.slice(6),16)/255:1);
}
function blue([r,g,b]) {
  [r,g,b]=[r,g,b].map(c=>c/255);
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;
  const h=d===0?0:(max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4)*60;
  const s=d===0?0:d/(1-Math.abs(2*l-1));
  return h>=185&&h<=250&&s>=.45?{l,s}:null;
}
const exact = {'#001425':'navy','#21a5ff':'accent','#7dd1f9':'sky','#007aff':'action','#0058ff':'action-end','#07194f':'ink'};
function replacement(rgba,decl,hex) {
  const color=blue(rgba);
  if(!color)return null;
  const text=decl.prop==='color'||decl.prop==='fill'||decl.prop==='stroke';
  const selector=decl.parent.selector||'';
  const {l,s}=color;
  let token=exact[hex?.toLowerCase()];
  if(!token) {
    if(l<.16)token=text?'ink':'navy';
    else if(l<.30)token=text?'ink':'navy-raised';
    else if(l<.45)token=text?(s>.8?'link':'body'):(l<.35?'navy-raised':'action-end');
    else if(l<.62)token=text?(/svg|icon/i.test(selector)?'action':/\bem\b|h1.*span/.test(selector)?'accent':'link'):'action';
    else if(l<.83)token='sky';
    else if(l<.94)token=/border|outline/.test(decl.prop)?'line':'pale';
    else token=text?'on-dark':'surface';
  }
  const variable=`var(--brand-${token})`;
  return rgba[3]===1?variable:`color-mix(in srgb, ${variable} ${+(rgba[3]*100).toFixed(3)}%, transparent)`;
}
const counts={};
for(const file of files){
  const root=postcss.parse(fs.readFileSync(file,'utf8'));
  let count=0;
  root.walkDecls(decl=>{
    if(decl.prop.startsWith('--brand-'))return;
    decl.value=decl.value.replace(/#[\da-f]{3,8}\b/gi,hex=>{
      const result=replacement(channels(hex),decl,hex);
      if(result){count++;return result;}return hex;
    }).replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g,(value,r,g,b,a)=>{
      const result=replacement([+r,+g,+b,a===undefined?1:+a],decl);
      if(result){count++;return result;}return value;
    });
  });
  fs.writeFileSync(file,root.toString());counts[file]=count;
}
console.log(counts);
