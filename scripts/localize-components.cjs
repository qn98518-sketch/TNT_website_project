const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const attrs = new Set(['title', 'highlightedTitle', 'description', 'eyebrow', 'label', 'submitLabel', 'alt', 'placeholder', 'aria-label', 'aria-description']);
function jsxText(text) {
  const lines = text.replace(/\t/g, ' ').split(/\r?\n/);
  let last = 0;
  lines.forEach((line, i) => { if (/[^ ]/.test(line)) last = i; });
  return lines.map((line, i) => {
    if (i !== 0) line = line.replace(/^ +/, '');
    if (i !== lines.length - 1) line = line.replace(/ +$/, '');
    return line ? line + (i !== last ? ' ' : '') : '';
  }).join('');
}
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (!['i18n','ui'].includes(entry.name)) walk(file); continue; }
    if (!file.endsWith('.tsx') || ['layout.tsx','language-switcher.tsx'].includes(entry.name)) continue;
    const original = fs.readFileSync(file, 'utf8');
    if (original.includes('getI18n') || original.includes('useI18n')) continue;
    const source = ts.createSourceFile(file, original, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const client = /^['"]use client['"];/.test(original.trimStart());
    let changed = false;
    const transformed = ts.transform(source, [context => {
      const f = context.factory;
      const call = expression => f.createCallExpression(f.createIdentifier('t'), undefined, [expression]);
      function visit(node) {
        if (ts.isJsxText(node)) {
          const text = jsxText(node.text);
          if (!text.trim()) return node;
          return f.createJsxExpression(undefined, call(f.createStringLiteral(text)));
        }
        if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent)) {
          return f.updateJsxExpression(node, call(ts.visitNode(node.expression, visit)));
        }
        if (ts.isJsxAttribute(node) && attrs.has(node.name.getText(source)) && node.initializer) {
          const init = node.initializer;
          if (ts.isStringLiteral(init)) return f.updateJsxAttribute(node, node.name, f.createJsxExpression(undefined, call(f.createStringLiteral(init.text))));
          if (ts.isJsxExpression(init) && init.expression) return f.updateJsxAttribute(node, node.name, f.createJsxExpression(undefined, call(ts.visitNode(init.expression, visit))));
        }
        if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text) && node.body) {
          const updated = ts.visitEachChild(node, visit, context);
          let usesT = false;
          function find(child) {
            if (ts.isCallExpression(child) && ts.isIdentifier(child.expression) && child.expression.text === 't') usesT = true;
            ts.forEachChild(child, find);
          }
          find(updated.body);
          if (!usesT) return updated;
          changed = true;
          const binding = f.createVariableStatement(undefined, f.createVariableDeclarationList([
            f.createVariableDeclaration(f.createObjectBindingPattern([f.createBindingElement(undefined, undefined, 't')]), undefined, undefined,
              client ? f.createCallExpression(f.createIdentifier('useI18n'), undefined, []) : f.createAwaitExpression(f.createCallExpression(f.createIdentifier('getI18n'), undefined, [])))
          ], ts.NodeFlags.Const));
          const modifiers = [...(updated.modifiers ?? [])];
          if (!client && !modifiers.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) modifiers.push(f.createModifier(ts.SyntaxKind.AsyncKeyword));
          return f.updateFunctionDeclaration(updated, modifiers, updated.asteriskToken, updated.name, updated.typeParameters, updated.parameters, updated.type, f.updateBlock(updated.body, [binding, ...updated.body.statements]));
        }
        return ts.visitEachChild(node, visit, context);
      }
      return node => ts.visitNode(node, visit);
    }]);
    if (changed) {
      const name = client ? 'useI18n' : 'getI18n';
      const specifier = client ? '@/i18n/provider' : '@/i18n/server';
      let printed = printer.printFile(transformed.transformed[0]);
      const line = `import { ${name} } from "${specifier}";\n`;
      printed = client ? printed.replace(/(["']use client["'];\n)/, '$1' + line) : line + printed;
      printed = printed.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
      fs.writeFileSync(file, printed);
      console.log(file);
    }
    transformed.dispose();
  }
}
walk('src/app'); walk('src/components');
