import fs from 'node:fs';
import path from 'node:path';
import { resolveDistDir } from './dist-dir.mjs';

/** Lists image folders present in dist after publish (informational). */
const distImages = path.join(resolveDistDir(), 'images');
if (fs.existsSync(distImages)) {
  const dirs = fs.readdirSync(distImages).filter((name) => {
    const full = path.join(distImages, name);
    return fs.statSync(full).isDirectory();
  });
  console.log(`prune-dist-images: kept image folders (${dirs.join(', ') || 'none'}).`);
}
