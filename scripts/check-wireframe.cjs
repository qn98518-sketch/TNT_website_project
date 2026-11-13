const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const sharp=require('sharp');
const origin=process.argv[2]??'http://localhost:3000';
const audit=JSON.parse(fs.readFileSync('tmp/localization-audit.json','utf8'));
const attr=(tag,name)=>tag.match(new RegExp(name+'="([^"]*)"'))?.[1]?.replaceAll('&amp;','&');

async function main(){
  const contentHash=crypto.createHash('sha256').update(fs.readFileSync('src/content/local-data.ts')).digest('hex');
  assert.equal(contentHash,fs.readFileSync('tmp/content-before-wireframe.sha256','utf8'),'Original content must remain unchanged');
  const links=new Set(),images=new Set(),failures=[];
  let photoElements=0;
  for(const {route}of audit){
    const response=await fetch(origin+route);
    assert.equal(response.status,200,route);
    const html=(await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
    if(!['/','/ve-tnt','/giai-phap-nganh-thuc-pham'].includes(route))assert.ok(html.includes('wf-page'),'Wireframe layout missing: '+route);
    for(const m of html.matchAll(/<img\b[^>]*>/g)){
      const tag=m[0];
      assert.ok(attr(tag,'class')?.includes('tnt-media'),'Unmanaged image: '+route);
      const kind=attr(tag,'data-media-kind');
      assert.ok(['photo','cutout','background'].includes(kind),'Missing image role: '+route);
      if(kind==='photo')photoElements++;
      const url=new URL(attr(tag,'src'),origin);
      const src=url.pathname==='/_next/image'?url.searchParams.get('url'):url.pathname;
      if(src?.startsWith('/images/'))images.add(src);
    }
    for(const m of html.matchAll(/<a\b[^>]*>/g)){
      const href=attr(m[0],'href');
      if(href?.startsWith('/')&&!href.startsWith('/_next/'))links.add(href.split('#')[0]);
    }
  }
  for(const src of images){
    const file=path.join('public',src.slice(1));
    assert.ok(fs.existsSync(file),'Missing image '+src);
    const m=await sharp(file).metadata();
    if(src.includes('/collection/')){assert.equal(m.width,1600);assert.equal(m.height,1000);}
  }
  for(const href of links){const r=await fetch(origin+href);if(r.status!==200)failures.push([href,r.status]);}
  const collection=fs.readdirSync('public/images/collection').filter(f=>f.endsWith('.webp'));
  assert.equal(collection.length,9);
  const result={routes:audit.length,photoElements,uniqueImages:images.size,generatedImages:collection.length,internalDestinations:links.size,failures,originalContentUnchanged:true};
  fs.writeFileSync('tmp/wireframe-audit.json',JSON.stringify(result,null,2));
  console.log(result);
  assert.equal(failures.length,0);
}
main().catch(error=>{console.error(error);process.exitCode=1});
