import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';
import { resolveDistDir } from './dist-dir.mjs';

const dist = resolveDistDir();
const missing = new Set();
let checked = 0;
function visit(node) {
  for (const attr of node.attrs ?? []) {
    if (!['src', 'srcset', 'poster'].includes(attr.name)) continue;
    for (const candidate of attr.value.split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (!url.startsWith('/images/')) continue;
      checked++;
      const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
      if (!fs.existsSync(path.join(dist, pathname))) missing.add(pathname);
    }
  }
  for (const child of node.childNodes ?? []) visit(child);
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) visit(parse(fs.readFileSync(file, 'utf8')));
  }
}
walk(dist);
if (missing.size) {
  console.error('Missing image files:', [...missing].join('\n'));
  process.exitCode = 1;
} else console.log(`Verified ${checked} local image references.`);
