const fs = require('fs');
(async () => {
  const manifest = JSON.parse(fs.readFileSync('.next/server/server-reference-manifest.json', 'utf8'));
  const entry = Object.entries(manifest.node).find(([,v]) => v.exportedName === 'changeLanguage');
  if (!entry) throw Error('Missing language action');
  for (const locale of ['en', 'vi']) {
    const response = await fetch('http://localhost:3001/dich-vu', {method:'POST', headers:{'Next-Action':entry[0], Origin:'http://localhost:3001', 'Content-Type':'text/plain;charset=UTF-8'}, body:JSON.stringify([locale])});
    const cookie = response.headers.get('set-cookie');
    if (!response.ok || !cookie?.includes('tnt-locale='+locale)) throw Error('Language action failed '+locale);
    for (const route of ['/du-an','/kien-thuc']) {
      const html = await (await fetch('http://localhost:3001'+route, {headers:{Cookie:cookie.split(';')[0]}})).text();
      if (!html.includes('lang="'+locale+'"')) throw Error('Language not preserved '+route);
    }
  }
  console.log('VI/EN action and cross-page persistence passed');
})().catch(e=>{console.error(e.message);process.exitCode=1});
