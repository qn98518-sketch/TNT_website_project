const fs = require('node:fs');
const files = ['src/app/globals.css', 'src/components/reference-pages.css', 'src/components/unified-pages.css', 'src/components/wireframe-pages.css'];
function hsl(hex) {
  let h = hex.slice(1);
  if (h.length === 3 || h.length === 4) h = [...h].map(c => c+c).join('');
  const [r,g,b] = [0,2,4].map(i => parseInt(h.slice(i,i+2),16)/255);
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min, l=(max+min)/2;
  let hue=d===0?0:max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;
  hue*=60;
  return {h:hue,s:d===0?0:d/(1-Math.abs(2*l-1)),l};
}
const counts = new Map();
for(const file of files) for(const match of fs.readFileSync(file,'utf8').matchAll(/#[\da-f]{3,8}\b/gi)) {
  const color=match[0].toLowerCase(), {h,s}=hsl(color);
  if(h>=185&&h<=250&&s>=.45) counts.set(color,(counts.get(color)||0)+1);
}
console.log([...counts].sort((a,b)=>b[1]-a[1]).map(([color,count])=>({color,count,...hsl(color)})));
