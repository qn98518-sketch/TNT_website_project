const sharp = require('sharp');
const fs = require('node:fs/promises');

// Preserve the original tagline outlines; redraw the geometric mark as vectors.
async function main() {
  const { data, info } = await sharp('public/images/reference/tnt-logo.jpg')
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const dark = (x, y) => x >= 195 && x < 1005 && y >= 730 && y < 810 &&
    data[(y * info.width + x) * info.channels] < 100;
  const edges = new Map();
  function edge(x, y, nx, ny) {
    const key = `${x},${y}`;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push([nx, ny]);
  }
  for (let y = 730; y < 810; y++) for (let x = 195; x < 1005; x++) {
    if (!dark(x, y)) continue;
    if (!dark(x, y - 1)) edge(x, y, x + 1, y);
    if (!dark(x + 1, y)) edge(x + 1, y, x + 1, y + 1);
    if (!dark(x, y + 1)) edge(x + 1, y + 1, x, y + 1);
    if (!dark(x - 1, y)) edge(x, y + 1, x, y);
  }
  const paths = [];
  while (edges.size) {
    const first = edges.keys().next().value;
    let key = first;
    const points = [];
    do {
      points.push(key.split(',').map(Number));
      const list = edges.get(key);
      const next = list.pop();
      if (!list.length) edges.delete(key);
      key = next.join(',');
    } while (key !== first && edges.has(key));
    const corners = points.filter((p, i) => {
      const a = points[(i + points.length - 1) % points.length];
      const b = points[(i + 1) % points.length];
      return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]);
    });
    if (corners.length > 2) paths.push('M' + corners.map(p => p.join(' ')).join('L') + 'Z');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="190 390 820 420"><title>TNT — Software solutions provider</title><g fill="#ed2d34"><path d="M304 400H432L417 482H360Z"/><path d="M763 400H857L806 650L741 516Z"/></g><path fill="#423f92" d="M452 400H666L799 682H709L646 541L618 682H539L577 482H532L491 682H401Z"/><path fill="#111" fill-rule="evenodd" d="${paths.join('')}"/></svg>\n`;
  await fs.writeFile('public/images/tnt-logo.svg', svg);
  await sharp(Buffer.from(svg)).resize(820, 420).png().toFile('tmp/tnt-logo-preview.png');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
