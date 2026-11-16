const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const origin=process.env.AUDIT_ORIGIN||'http://localhost:3000';
const output=path.resolve(process.env.AUDIT_OUTPUT||'tmp/card-hover-check');
const samples=['/','/dich-vu','/dich-vu/erp','/dich-vu/outsourcing','/du-an','/kien-thuc/blog','/du-an/kala','/kien-thuc/blog/chuyen-doi-so-nha-may-co-khi'];
async function main(){
 fs.mkdirSync(output,{recursive:true});
 const xml=await(await fetch(origin+'/sitemap.xml')).text();
 const routes=[...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname))];
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 try{
  const modes=[{width:1280,touch:false,motion:'no-preference',routes:process.argv.includes('--smoke')?samples:routes},{width:820,touch:false,motion:'no-preference',routes:samples},{width:820,touch:true,motion:'no-preference',routes:samples},{width:1280,touch:true,motion:'no-preference',routes:samples},{width:1280,touch:false,motion:'reduce',routes:samples}];
  for(const mode of modes.filter(mode=>!process.argv.includes('--tablet')||mode.width===820)){
   const context=await browser.newContext({viewport:{width:mode.width,height:900},hasTouch:mode.touch,reducedMotion:mode.motion});
   const page=await context.newPage();page.setDefaultTimeout(15000);
   for(const route of mode.routes){
    const result={route,width:mode.width,touch:mode.touch,motion:mode.motion,groups:0,passed:true};
    try{
     await page.goto(origin+route,{waitUntil:'networkidle'});
     const grids=page.locator('.content-card-grid:visible');
     for(let i=0;i<await grids.count();i++){
      const grid=grids.nth(i),card=grid.locator(':scope > .content-card').first();
      await page.mouse.move(0,0);await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      // Hover may scroll a partly visible card into view. Compare document
      // positions so that browser scrolling is not mistaken for card movement.
      const baseline=await grid.locator(':scope > .content-card').evaluateAll(nodes=>nodes.slice(0,2).map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height};}));
      await card.hover();await page.waitForTimeout(350);
      const current=await grid.locator(':scope > .content-card').evaluateAll(nodes=>nodes.slice(0,2).map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height,transform:s.transform,shadow:s.boxShadow,border:s.borderTopColor};}));
      const lift=!mode.touch&&mode.motion==='no-preference'?6:0;
      assert.ok(Math.abs(current[0].y-baseline[0].y+lift)<1,`Expected lift ${lift}, got ${baseline[0].y-current[0].y}`);
      assert.ok(Math.abs(current[0].width-baseline[0].width)<1);
      if(current[1])assert.ok(Math.abs(current[1].y-baseline[1].y)<1,'Hover moved another card');
      if(!mode.touch){assert.notEqual(current[0].shadow,'none');assert.equal(current[0].border,'rgb(125, 209, 249)');}
      if(mode.width<=1100&&lift){
       const top=await grid.evaluate(el=>el.getBoundingClientRect().y+scrollY);assert.ok(current[0].y>=top,'Carousel clips the lifted card');
      }
      if(route==='/dich-vu'&&!mode.touch&&mode.motion==='no-preference')await page.screenshot({path:path.join(output,`service-hover-${mode.width}.png`)});
      await page.mouse.move(0,0);await page.waitForTimeout(350);
      const resetY=await card.evaluate(el=>el.getBoundingClientRect().y+scrollY);assert.ok(Math.abs(resetY-baseline[0].y)<1,'Mouse leave did not reset card');
      result.groups++;
     }
    }catch(error){result.passed=false;result.error=error.message;}
    results.push(result);if(!result.passed)console.log(JSON.stringify(result));
   }
   await context.close();console.log(`Checked hover ${mode.width}px touch=${mode.touch} motion=${mode.motion}`);
  }
 }finally{await browser.close();fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(results,null,2));}
 const summary={checks:results.length,groups:results.reduce((n,r)=>n+r.groups,0),failed:results.filter(r=>!r.passed).length};
 fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));if(summary.failed)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1});
