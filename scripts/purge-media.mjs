import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const keepPublic = new Set([
  path.join(root, 'public', 'favicon.svg'),
  path.join(root, 'public', 'logo.svg'),
  path.join(root, 'public', 'offline.html'),
  path.join(root, 'public', 'site.webmanifest'),
  path.join(root, 'public', 'sw.js'),
  path.join(root, 'public', 'robots.txt'),
  path.join(root, 'public', '_redirects'),
  path.join(root, 'public', '_headers'),
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const mediaExt = /\.(png|jpe?g|gif|webp|avif|ico|mp4|webm|mov)$/i;

let removed = 0;
for (const file of walk(path.join(root, 'public'))) {
  if (keepPublic.has(file)) continue;
  if (file.includes(`${path.sep}images${path.sep}placeholders${path.sep}`)) continue;
  if (mediaExt.test(file)) {
    fs.unlinkSync(file);
    removed++;
  }
}

const assetRoot = path.join(root, 'src', 'assets');
if (fs.existsSync(assetRoot)) {
  fs.rmSync(assetRoot, { recursive: true, force: true });
  console.log('Removed src/assets');
}

for (const sub of ['images/gameplay', 'images/blog', 'images/posters', 'videos']) {
  const dir = path.join(root, 'public', sub);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed public/${sub}`);
  }
}

console.log(`Removed ${removed} public media files.`);
