const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const origin = process.env.AUDIT_ORIGIN || 'http://localhost:3000';
const output = path.resolve(process.env.AUDIT_OUTPUT || 'tmp/responsive-card-check');
const smoke = process.argv.includes('--smoke');
const samples = ['/', '/du-an', '/kien-thuc', '/kien-thuc/blog', '/dich-vu/erp', '/dich-vu/outsourcing', '/giai-phap-nganh-thuc-pham', '/du-an/kala', '/kien-thuc/blog/chuyen-doi-so-nha-may-co-khi'];
const widths = smoke ? [390,600,760,820,1024,1280] : [320,390,430,599,600,640,744,759,760,761,768,800,820,834,1024,1100,1101,1280,1440,1920];
const executablePath = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(file => fs.existsSync(file));

async function main() {
  fs.mkdirSync(output, { recursive: true });
  assert.ok(executablePath, 'Set CHROME_PATH to an installed Chrome/Chromium browser.');
  const xml = await (await fetch(origin + '/sitemap.xml')).text();
  const routes = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname))];
  assert.ok(routes.length >= 25, 'Sitemap did not return the public routes.');
  const scenarios = widths.map(width => ({width,height:900,touch:width<=1100,locale:'vi',routes}));
  for (const [width,height] of [[744,480],[820,480],[1024,480],[1366,1024]]) scenarios.push({width,height,touch:true,locale:'vi',routes:samples});
  for (const width of [760,820,1024]) scenarios.push({width,height:900,touch:false,locale:'vi',routes:samples});
  scenarios.push({width:1280,height:900,touch:true,locale:'vi',routes:samples});
  for (const width of [600,760,820,1280]) scenarios.push({width,height:900,touch:width<=1100,locale:'en',routes:smoke?samples:routes});
  const browser = await chromium.launch({executablePath,headless:true});
  const results = [];let cursor = 0, completed = 0;
  const total = scenarios.reduce((n,s)=>n+s.routes.length,0);
  const save = () => fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({origin,total,completed,results},null,2));
  async function worker() {
    while(cursor < scenarios.length) {
      const scenario = scenarios[cursor++];
      const {width,height,touch,locale} = scenario;
      const context = await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch&&width<600,reducedMotion:'reduce'});
      await context.addCookies([{url:origin,name:'tnt-locale',value:locale}]);
      const page = await context.newPage();
      for (const route of scenario.routes) {
        const result = {route,width,height,touch,locale,issues:[]};
        try {
          const response = await page.goto(origin+route,{waitUntil:'networkidle',timeout:60000});
          assert.equal(response.status(),200);
          await page.evaluate(()=>document.fonts.ready);
          Object.assign(result,await page.evaluate(()=>{
            const vw = document.documentElement.clientWidth;
            const issues = [];
            if(document.documentElement.scrollWidth > vw+2) issues.push(`page overflow ${document.documentElement.scrollWidth}/${vw}`);
            if(Math.abs(innerWidth-vw)>2) issues.push('layout viewport differs from requested viewport');
            const small = innerWidth<=1100;
            const expected = innerWidth < 600 ? 1 : small ? 2 : 3;
            const grids = [...document.querySelectorAll('.content-card-grid')].filter(el=>el.getBoundingClientRect().width>0).map(el=>{
              const r=el.getBoundingClientRect(),cards=[...el.children],first=cards[0]?.getBoundingClientRect();
              const target=Math.min(expected,cards.length);
              const row=cards.filter(c=>Math.abs(c.getBoundingClientRect().top-first.top)<2);
              const visible=row.filter(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1;});
              if(visible.length!==target) issues.push(`expected ${target} fully visible cards, got ${visible.length}`);
              const s=getComputedStyle(el),gap=parseFloat(s.columnGap)||0;
              const columns=s.overflowX==='auto'?target:expected;
              const expectedCard=(el.clientWidth-(columns-1)*gap)/columns;
              if(first&&Math.abs(first.width-expectedCard)>2)issues.push(`card width ${first.width.toFixed(1)} expected ${expectedCard.toFixed(1)}`);
              if(first&&(r.left<-1||r.right>vw+1))issues.push('card group extends outside viewport');
              if(first&&getComputedStyle(cards[0].querySelector('.content-card-title')).fontSize!=='20px')issues.push('card title overridden');
              if(first&&getComputedStyle(cards[0].querySelector('.content-card-summary')).fontSize!=='14px')issues.push('card summary overridden');
              const counter=el.parentElement.querySelector('.content-carousel-position');
              if(s.overflowX==='auto'&&counter&&counter.textContent!==`1/${cards.length}`)issues.push('counter must use current/total format');
              const heights=row.map(c=>c.getBoundingClientRect().height);
              if(heights.length&&Math.max(...heights)-Math.min(...heights)>2)issues.push('unequal card heights');
              return{count:cards.length,visible:visible.length,expected:target,cardWidth:first?.width,trackWidth:r.width};
            });
            const relatedHeadings = [...document.querySelectorAll('.wf-related-articles .wf-section-heading')].map(heading=>{
              const description=heading.querySelector(':scope > p');
              if(!description)return null;
              const rect=description.getBoundingClientRect();
              const text=document.createRange();text.selectNodeContents(description);
              const textHeight=text.getBoundingClientRect().height;
              const lineHeight=parseFloat(getComputedStyle(description).lineHeight)||24;
              if(rect.height>textHeight+lineHeight)issues.push(`related article description reserves empty height: ${rect.height.toFixed(1)}px for ${textHeight.toFixed(1)}px text`);
              const card=heading.parentElement.querySelector('.content-card');
              const cardGap=card?card.getBoundingClientRect().top-heading.getBoundingClientRect().bottom:null;
              const headingSpace=parseFloat(getComputedStyle(heading).marginBottom)||0;
              if(cardGap!==null&&(cardGap<0||cardGap>headingSpace+12))issues.push(`related article card gap ${cardGap.toFixed(1)}px exceeds heading spacing ${headingSpace}px`);
              return{descriptionHeight:rect.height,textHeight,cardGap};
            }).filter(Boolean);
            const headingAlignment = [...document.querySelectorAll('main :is(.wf-section-heading:not(.wf-centered), .rf-heading, .rf-project-heading, .rf-service-subheading) > p')].filter(p=>p.getBoundingClientRect().width>0).map(p=>{
              const heading=p.parentElement;
              const title=heading.querySelector('h2,h3');
              const titleBlock=title&&[...heading.children].find(child=>child.contains(title));
              const rect=p.getBoundingClientRect(),titleRect=titleBlock?.getBoundingClientRect();
              const sideBySide=titleRect&&rect.left>=titleRect.right-1&&rect.top<titleRect.bottom&&rect.bottom>titleRect.top;
              const alignment=getComputedStyle(p).textAlign;
              const text=document.createRange();text.selectNodeContents(p);
              const textRects=[...text.getClientRects()].filter(r=>r.width>0);
              const rightGap=textRects.length?rect.right-Math.max(...textRects.map(r=>r.right)):0;
              if(sideBySide&&(!['right','end'].includes(alignment)||Math.abs(rightGap)>2))issues.push(`right-side heading description is misaligned: ${heading.className}, gap ${rightGap.toFixed(1)}px`);
              const contentRightGap=heading.getBoundingClientRect().right-rect.right;
              if(sideBySide&&Math.abs(contentRightGap)>2)issues.push(`heading description does not reach content edge: ${heading.className}, gap ${contentRightGap.toFixed(1)}px`);
              if(heading.closest('#blog-list')&&sideBySide){
                const controls=heading.parentElement.querySelector('.catalog-controls');
                if(controls&&Math.abs(rect.right-controls.getBoundingClientRect().right)>2)issues.push('Blog description does not align with search toolbar');
              }
              return{heading:heading.className,sideBySide:Boolean(sideBySide),alignment,rightGap,contentRightGap};
            });
            return{viewport:vw,scrollWidth:document.documentElement.scrollWidth,grids,relatedHeadings,headingAlignment,issues};
          }));
          if(!['/ve-tnt','/kien-thuc/guides','/kien-thuc/faq','/dich-vu/body-shop'].includes(route)) assert.ok(result.grids.length,'Expected card group is missing');
          assert.equal(await page.locator('.wf-content-card,.wf-card-copy,.catalog-card,.wf-card-grid').count(),0,'Retired card markup remains');
          if(route==='/'&&width>=1101&&!touch) assert.ok(await page.locator('.content-desktop-layout .rf-project-feature').isVisible(),'Desktop project showcase changed');
          if(['/du-an','/kien-thuc/blog'].includes(route)) assert.ok(await page.locator('main .wf-split').first().isVisible(),'Featured layout changed');
          if(locale==='vi'&&[600,760,820,1280].includes(width)&&['/','/du-an','/kien-thuc/blog','/giai-phap-nganh-thuc-pham'].includes(route)&&height===900&&touch===(width<=1100)){
            const group=page.locator('.content-card-grid').filter({visible:true}).first();
            if(await group.count()){
              await group.scrollIntoViewIfNeeded();
              await page.screenshot({path:path.join(output,`${route==='/'?'home':route.replaceAll('/','_')}-${width}.png`),fullPage:false});
            }
          }
        }catch(error){result.issues.push(error.message.slice(0,250));}
        results.push(result);completed++;
        if(result.issues.length)console.log(JSON.stringify({failure:result}));
        if(completed%25===0){save();console.log(`Progress ${completed}/${total}`);}
      }
      await context.close();
    }
  }
  const interactions=[];
  async function checkVisible(page,width){
    const groups=await page.locator('.content-card-grid:visible').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect(),first=el.firstElementChild.getBoundingClientRect();return{count:el.children.length,visible:[...el.children].filter(c=>{const b=c.getBoundingClientRect();return Math.abs(b.top-first.top)<2&&b.left>=r.left-1&&b.right<=r.right+1}).length};}));
    assert.ok(groups.length);
    for(const group of groups)assert.equal(group.visible,Math.min(group.count,width<600?1:width<=1100?2:3));
  }
  try {
    await Promise.all(Array.from({length:3},worker));
    const context=await browser.newContext({viewport:{width:820,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();page.setDefaultTimeout(15000);
    try{
      await page.goto(origin+'/kien-thuc/blog',{waitUntil:'networkidle'});
      await page.locator('.catalog-topic [role="combobox"]').first().click();
      const panel=page.locator('.custom-select-panel[data-open="true"]');await panel.waitFor({state:'visible'});
      const box=await panel.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=821);
      await page.keyboard.press('Escape');
      await page.locator('.catalog-search input').fill('no-match-responsive-regression-xyz');
      await page.locator('.catalog-empty').waitFor({state:'visible'});
      await page.locator('.catalog-reset').click();
      await page.locator('.catalog .content-card').first().waitFor({state:'visible'});await checkVisible(page,820);
      const count=await page.locator('.catalog .content-card').count();
      await page.waitForFunction(total=>document.querySelector('.catalog .content-carousel-position').textContent===`1/${total}`,count);
      const track=page.locator('.catalog .content-carousel-track');
      await page.locator('.catalog .content-carousel-control').last().click();
      await page.waitForFunction(()=>document.querySelector('.catalog .content-carousel-track').scrollLeft>0);await checkVisible(page,820);
      await page.waitForFunction(total=>document.querySelector('.catalog .content-carousel-position').textContent===`3/${total}`,count);
      await track.focus();await page.keyboard.press('End');
      await page.waitForFunction(()=>{const el=document.querySelector('.catalog .content-carousel-track');return el.scrollLeft>=el.scrollWidth-el.clientWidth-2});await checkVisible(page,820);
      await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('.catalog .content-carousel-track').scrollLeft<2);
      await page.waitForFunction(total=>document.querySelector('.catalog .content-carousel-position').textContent===`1/${total}`,count);
      for(const width of [390,600,760,820,1100,1101,1280,760]){
        await page.setViewportSize({width,height:900});
        await page.waitForFunction(expected=>{const el=document.querySelector('.catalog .content-carousel');return(el.dataset.revealSkip==='true')===expected;},width<=1100);
        await checkVisible(page,width);
      }
      await page.setViewportSize({width:1280,height:900});
      const devtools=await context.newCDPSession(page);
      await devtools.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
      await checkVisible(page,1280);
      await devtools.send('Emulation.setTouchEmulationEnabled',{enabled:false});
      await checkVisible(page,1280);await devtools.detach();
      await page.setViewportSize({width:760,height:900});
      await page.waitForFunction(()=>document.querySelector('.catalog .content-carousel').dataset.revealSkip==='true');
      await page.locator('.catalog .content-card-title a').first().click();
      await page.waitForURL('**/kien-thuc/blog/*');await page.waitForLoadState('networkidle');await checkVisible(page,760);
      interactions.push({passed:true,checks:['filter popup fits','current/total counter after reset and navigation','next/End/Home keeps two visible','resize across breakpoints','DevTools touch emulation keeps three cards at 1280px','client navigation to article retains two cards']});
    }catch(error){interactions.push({passed:false,error:error.message});process.exitCode=1;}finally{await context.close();}
  }finally{save();await browser.close();}
  const failures=results.filter(r=>r.issues.length);
  const summary={routes:routes.length,widths,total:results.length,failed:failures.length,interactions,report:path.join(output,'report.json')};
  fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary,null,2));
  if(failures.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1});
