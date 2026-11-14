import fs from 'node:fs';
import path from 'node:path';

const card = '/images/placeholders/card.svg';
const files = [
  'src/data/blog/posts.ts',
  'src/i18n/en.ts',
  'src/i18n/de.ts',
  'src/i18n/es.ts',
  'src/i18n/fr.ts',
  'src/i18n/pl.ts',
  'src/i18n/pt.ts',
  'src/i18n/ru.ts',
  'src/i18n/tr.ts',
];

const pattern = /\/images\/blog\/[^"']+\.(png|jpe?g|webp)/gi;

for (const rel of files) {
  const file = path.join(process.cwd(), rel);
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  const next = text.replace(pattern, card);
  if (next !== text) {
    fs.writeFileSync(file, next);
    console.log('Updated', rel);
  }
}
