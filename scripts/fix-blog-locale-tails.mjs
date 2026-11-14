/**
 * Collapse repeated blog locale tail spreads (TAIL3, triple AB).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const localesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src/data/blog/locales');
const files = ['de.ts', 'es.ts', 'fr.ts', 'pl.ts', 'pt.ts', 'ru.ts', 'tr.ts'];

for (const file of files) {
  const filePath = path.join(localesDir, file);
  let c = fs.readFileSync(filePath, 'utf8');

  c = c.replace(
    /const TAIL = \[\.\.\.CDEFB, \.\.\.CDEFB, C\];\r?\nconst TAIL3 = \[\.\.\.CDEFB, \.\.\.CDEFB, \.\.\.CDEFB\];/,
    'const TAIL = [...CDEFB];',
  );
  c = c.replace(/\.\.\.TAIL3/g, '...TAIL');
  c = c.replace(/(\.\.\.AB,\s*\r?\n\s*){2,}\.\.\.AB/g, '...AB');

  // skin-guide: drop repeated SK_INTRO right after overview h2
  c = c.replace(/(h2\([^)]+\),\s*\r?\n\s*)p\(SK_INTRO\),\s*\r?\n(\s*p\()/g, '$1$2');

  // skin-guide tail: ...TAIL then redundant C
  c = c.replace(/\.\.\.TAIL,\s*\r?\n\s*C,/g, '...TAIL,');

  if (file === 'es.ts') {
    c = c.replace(/vision detector/g, 'detector de visión');
  }

  fs.writeFileSync(filePath, c, 'utf8');
  console.log('fixed', file);
}
