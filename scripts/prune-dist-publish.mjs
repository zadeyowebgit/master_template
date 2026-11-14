import fs from 'node:fs';
import path from 'node:path';
import { resolveDistDir } from './dist-dir.mjs';

/** Drop import-only or duplicate masters — not linked from production HTML. */
const dist = resolveDistDir();
const dropRelPaths = ['videos/hero-source-unoptimized.mp4'];

let removed = 0;
let bytes = 0;

for (const rel of dropRelPaths) {
  const full = path.join(dist, rel);
  if (!fs.existsSync(full)) continue;
  bytes += fs.statSync(full).size;
  fs.unlinkSync(full);
  removed += 1;
  console.log(`prune-dist-publish: removed ${rel}`);
}

if (removed) {
  console.log(
    `prune-dist-publish: ${removed} file(s), ${(bytes / 1024 / 1024).toFixed(1)} MB freed.`,
  );
}
