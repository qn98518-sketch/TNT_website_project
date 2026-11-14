const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const logo = await fs.readFile(path.join(root, 'public/images/tnt-logo.svg'), 'utf8');
  const mark = logo.match(/<g fill="#ed2d34">[\s\S]*?<\/g><path fill="#423f92"[^>]*\/>/)?.[0];
  if (!mark) throw new Error('Could not find the existing TNT brand mark.');
  // Preserve the original mark and colors; omit the tagline at browser-tab sizes.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>TNT</title><rect width="64" height="64" rx="12" fill="#fff"/><g transform="translate(-26.05 -22.1) scale(.1)">${mark}</g></svg>\n`;
  await fs.writeFile(path.join(root, 'src/app/icon.svg'), svg);

  const sizes = [16, 32, 48, 64, 256];
  const images = await Promise.all(sizes.map(size => sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    header[entry] = header[entry + 1] = size === 256 ? 0 : size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[index].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  });
  await fs.writeFile(path.join(root, 'src/app/favicon.ico'), Buffer.concat([header, ...images]));
  await fs.mkdir(path.join(root, 'tmp'), { recursive: true });
  await fs.writeFile(path.join(root, 'tmp/tnt-favicon-preview.png'), images.at(-1));
  console.log('Generated TNT SVG icon and ICO with 16/32/48/64/256px sizes.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
