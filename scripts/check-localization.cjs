const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const source = fs.readFileSync('src/content/local-data.ts', 'utf8');
const dataModule = new Module('local-content-check');
dataModule._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, 'local-content-check.js');
const data = dataModule.exports;
const origin = process.argv[2] ?? 'http://localhost:3000';
const routes = ['/', '/giai-phap-nganh-thuc-pham', '/ve-tnt', '/dich-vu', '/dich-vu/erp', '/dich-vu/outsourcing', '/dich-vu/body-shop', '/du-an', '/kien-thuc', '/kien-thuc/blog', '/kien-thuc/guides', '/kien-thuc/faq',
  ...data.projects.map(p => '/du-an/' + p.slug),
  ...data.articles.map(p => '/kien-thuc/blog/' + p.slug)];
function text(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<!--.*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
async function main() {
  const results = [];
  for (const route of [...new Set(routes)]) {
    const versions = [];
    for (const locale of ['vi', 'en']) {
      const response = await fetch(origin + route, { headers: { cookie: 'tnt-locale=' + locale } });
      const html = await response.text();
      const visible = text(html);
      const untranslated = locale === 'en' ? visible.split(/(?<=[.!?])\s+|(?= [A-Z])/).filter(s => /[À-ỹĐđ]/.test(s)) : [];
      const h1 = text(html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '');
      versions.push({ locale, status: response.status, h1, correctLanguage: html.includes('lang="' + locale + '"'), navigation: html.includes('language-switcher'), length: visible.length, untranslated });
      fs.mkdirSync('tmp/route-checks', { recursive: true });
      fs.writeFileSync('tmp/route-checks/' + (route === '/' ? 'home' : route.slice(1).replaceAll('/', '_')) + '-' + locale + '.txt', visible);
    }
    const result = { route, versions };
    results.push(result);
    console.log(route, versions.map(v => v.locale + ':' + v.status + ':' + v.untranslated.length).join(' '));
  }
  fs.writeFileSync('tmp/localization-audit.json', JSON.stringify(results, null, 2));
  const failures = results.filter(r => r.versions.some(v => v.status !== 200 || !v.correctLanguage || !v.navigation || !v.h1 || v.length < 300 || v.untranslated.length));
  console.log('Routes checked:', results.length, 'failures:', failures.map(f => f.route));
  console.log('Untranslated fragments:', results.flatMap(r => r.versions.flatMap(v => v.untranslated.map(s => ({ route:r.route, text:s })))).slice(0, 45));
  if (failures.length) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
