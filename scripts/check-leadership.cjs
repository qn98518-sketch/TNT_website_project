const{chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const origin=process.env.AUDIT_ORIGIN||'http://localhost:3000';
const output=path.resolve(process.env.AUDIT_OUTPUT||'tmp/leadership-check');
const widths=process.argv.includes('--smoke')?[390,600,820,1101,1280]:[320,390,599,600,639,640,744,760,761,820,1024,1100,1101,1280,1366,1440,1920];
const browserPath=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const active=page=>page.locator('.leader-carousel-dots button[aria-current="true"]').evaluate(el=>[...el.parentElement.children].indexOf(el));
async function select(page,index){await page.locator('.leader-carousel-dots button').nth(index).click();await page.waitForFunction(index=>[...document.querySelectorAll('.leader-carousel-dots button')].findIndex(e=>e.getAttribute('aria-current')==='true')===index,index);}
async function checkLayout(page,width){
 // Autoplay can start between separate protocol calls. Capture an idle
 // layout atomically so an in-flight slide is not mistaken for misalignment.
 const snapshot=await page.waitForFunction(()=>{
  const el=document.querySelector('.leadership-carousel');
  if(el.querySelector('.leader-carousel-track').style.transitionDuration!=='0ms')return false;
  const v=el.querySelector('.leader-carousel-viewport'),r=v.getBoundingClientRect();
  const all=[...el.querySelectorAll('.leader-card')],cards=all.filter(c=>c.getAttribute('aria-hidden')==='false');
  const full=all.filter(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1;});
  return{visible:full.length,ariaVisible:cards.length,offset:cards[0].getBoundingClientRect().left-r.left,heights:cards.map(c=>c.getBoundingClientRect().height),members:cards.map(c=>c.dataset.memberId),fullMembers:full.map(c=>c.dataset.memberId),pageWidth:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth};
 });
 const result=await snapshot.jsonValue();await snapshot.dispose();
 const expected=width<600?1:width<=1100?2:3;
 assert.equal(result.visible,expected,'Wrong fully visible card count');assert.equal(result.ariaVisible,expected,'Accessible card count differs');
 assert.ok(Math.abs(result.offset)<.5,`First card clipped/offset by ${result.offset}px`);
 assert.deepEqual(result.members,result.fullMembers);assert.equal(new Set(result.members).size,expected,'Repeated person in visible window');
 assert.ok(Math.max(...result.heights)-Math.min(...result.heights)<1,'Unequal card heights');
 assert.ok(result.pageWidth<=result.viewport+1,'Page has horizontal overflow');return result;
}
async function main(){
 fs.mkdirSync(output,{recursive:true});const results=[];
 const browser=await chromium.launch({executablePath:browserPath,headless:true});
 try{
  const cases=widths.map(width=>({width,height:900,touch:width<=1100}));
  for(const [width,height,touch]of[[820,480,true],[1024,480,true],[820,900,false],[1280,900,true]])cases.push({width,height,touch});
  for(const locale of ['vi','en'])for(const scenario of cases){
   const{width,height,touch}=scenario;const result={...scenario,locale,passed:true};
   const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:width<600,reducedMotion:'reduce'});
   await context.addCookies([{url:origin,name:'tnt-locale',value:locale}]);const page=await context.newPage();page.setDefaultTimeout(10000);
   try{
    const response=await page.goto(origin+'/ve-tnt',{waitUntil:'networkidle'});assert.equal(response.status(),200);
    await page.locator('.leadership-carousel').scrollIntoViewIfNeeded();await select(page,0);await page.mouse.move(0,0);
    Object.assign(result,await checkLayout(page,width));
    await page.locator('.leader-card[aria-hidden="false"] img').first().evaluate(img=>img.decode());
    for(let i=1;i<=7;i++){
     await page.locator('.leader-carousel-arrows button').last().click();
     await page.waitForFunction(index=>[...document.querySelectorAll('.leader-carousel-dots button')].findIndex(e=>e.getAttribute('aria-current')==='true')===index,i%5);
     await checkLayout(page,width);
    }
    await select(page,4);await checkLayout(page,width);
    const viewport=page.locator('.leader-carousel-viewport');await viewport.focus();await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(()=>document.querySelectorAll('.leader-carousel-dots button')[3].getAttribute('aria-current')==='true');await checkLayout(page,width);
    await page.mouse.move(0,0);
    const card=page.locator('.leader-card[aria-hidden="false"]').first();
    const opener=card.locator('[data-open-profile]');await opener.focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('.leader-card[aria-hidden="false"]').dataset.expanded==='true');
    assert.equal(await card.locator('.leader-card-details').getAttribute('aria-hidden'),'false');
    const details=card.locator('.leader-card-details');await details.evaluate(el=>el.scrollTop=el.scrollHeight);
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.leader-card[data-expanded="true"]'));
    await page.waitForFunction(()=>document.activeElement.hasAttribute('data-open-profile'));
    await select(page,0);
    if(locale==='vi'&&[600,820,1280].includes(width))await page.locator('.leadership-carousel').screenshot({path:path.join(output,`leaders-${width}-${height}-${touch?'touch':'mouse'}.png`)});
   }catch(error){result.passed=false;result.error=error.message;console.log(JSON.stringify(result));}
   results.push(result);await context.close();
  }
  console.log(`Checked ${results.length} responsive/language cases`);
  // A resize must retain a complete, correctly aligned window, including mid-transition.
  {
   const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'}),page=await context.newPage();
   const result={kind:'resize/hover/autoplay/reduced-motion',passed:true};
   try{
    await page.goto(origin+'/ve-tnt',{waitUntil:'networkidle'});await page.locator('.leadership-carousel').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
    for(const width of [1280,1281,599,600,820,1100,1101,1440,820]){
     await page.locator('.leader-carousel-arrows button').last().click();await page.setViewportSize({width,height:900});
     await page.waitForFunction(()=>document.querySelector('.leader-carousel-track').style.transitionDuration==='0ms');await checkLayout(page,width);
    }
    let before=await active(page);
    await page.waitForFunction(index=>[...document.querySelectorAll('.leader-carousel-dots button')].findIndex(e=>e.getAttribute('aria-current')==='true')!==index,before,{timeout:5000});
    await page.waitForFunction(()=>document.querySelector('.leader-carousel-track').style.transitionDuration==='0ms');
    const card=page.locator('.leader-card[aria-hidden="false"]').first();await card.hover();
    await page.waitForFunction(()=>document.querySelector('.leader-card[data-expanded="true"]'));
    before=await active(page);await page.waitForTimeout(3300);assert.equal(await active(page),before,'Autoplay interrupts hovered profile');
    await card.locator('[data-close-profile]').click();await page.mouse.move(0,0);
    await page.waitForFunction(()=>!document.querySelector('.leader-card[data-expanded="true"]'));
    await page.waitForFunction(index=>[...document.querySelectorAll('.leader-carousel-dots button')].findIndex(e=>e.getAttribute('aria-current')==='true')!==index,before,{timeout:5000});
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.leader-carousel-track').style.transitionDuration==='0ms');
    before=await active(page);await page.waitForTimeout(3300);assert.equal(await active(page),before,'Reduced motion must stop autoplay');
    await page.locator('.leader-carousel-arrows button').last().click();assert.notEqual(await active(page),before,'Manual navigation must still work');await checkLayout(page,820);
   }catch(error){result.passed=false;result.error=error.message;console.log(JSON.stringify(result));}
   results.push(result);await context.close();
  }
  {
   const context=await browser.newContext({viewport:{width:820,height:900},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();
   const result={kind:'touch/swipe/profile',passed:true};
   try{
    await page.goto(origin+'/ve-tnt',{waitUntil:'networkidle'});await page.locator('.leadership-carousel').scrollIntoViewIfNeeded();await select(page,0);
    let card=page.locator('.leader-card[aria-hidden="false"]').first();await card.locator('[data-open-profile]').tap();
    await page.waitForFunction(()=>document.querySelector('.leader-card[data-expanded="true"]'));await card.locator('[data-close-profile]').tap();
    await page.waitForFunction(()=>!document.querySelector('.leader-card[data-expanded="true"]'));
    const viewport=page.locator('.leader-carousel-viewport');await viewport.scrollIntoViewIfNeeded();const box=await viewport.boundingBox();
    const y=Math.max(100,box.y+100),x=box.x+box.width*.7,cdp=await context.newCDPSession(page),before=await active(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for(const distance of[40,80,120]){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-distance,y:y+2,id:1}]});await page.waitForTimeout(30);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await page.waitForFunction(index=>[...document.querySelectorAll('.leader-carousel-dots button')].findIndex(e=>e.getAttribute('aria-current')==='true')!==index,before);
    await checkLayout(page,820);await cdp.detach();
   }catch(error){result.passed=false;result.error=error.message;console.log(JSON.stringify(result));}
   results.push(result);await context.close();
  }
 }finally{await browser.close();fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(results,null,2));}
 const summary={checks:results.length,failed:results.filter(r=>!r.passed).length};fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));if(summary.failed)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1});
