const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const items = new Set();
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.tsx?$/.test(file) && !file.includes(`${path.sep}i18n${path.sep}`)) {
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      function visit(node) {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) {
          const value = node.text.replace(/\s+/g, ' ').trim();
          if (/[À-ỹĐđ]/.test(value) && !value.startsWith('/') && !value.includes('http')) items.add(value);
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
}
walk('src');
const values = [...items].sort();
fs.mkdirSync('tmp', { recursive: true });
fs.writeFileSync('tmp/translation-source.json', JSON.stringify(values, null, 2));
console.log(values.length + ' translation strings');
for (let i = 0; i < values.length; i++) console.log(i + '\t' + values[i]);
