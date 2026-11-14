import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

for (const name of ['hero', 'card', 'og']) {
  if (!fs.existsSync(`public/images/placeholders/${name}.svg`)) {
    throw new Error(`Missing placeholder ${name}`);
  }
}

/** Union of CARD, HERO, SHOWCASE, and default responsive widths used in srcset HTML. */
const widthTiers = [320, 400, 560, 640, 960];
const rasterExt = /\.(webp|avif|png|jpe?g)$/i;
/** Only fixed responsive widths — do not treat e.g. hero-640.webp as a tier. */
const tierSuffix = /-(320|400|560|640|960)\.(webp|avif|png|jpe?g)$/i;

function collectMasters(dir) {
  const masters = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      masters.push(...collectMasters(full));
      continue;
    }
    if (!rasterExt.test(entry.name) || tierSuffix.test(entry.name)) continue;
    masters.push(full);
  }
  return masters;
}

const gameImageRoot = path.join('public', 'images', 'game');
const masters = fs.existsSync(gameImageRoot) ? collectMasters(gameImageRoot) : [];

let wrote = 0;
for (const master of masters) {
  const stem = master.replace(rasterExt, '');
  for (const width of widthTiers) {
    const out = `${stem}-${width}.webp`;
    if (fs.existsSync(out)) continue;
    await sharp(master)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(out);
    wrote += 1;
    console.log('wrote', path.relative(process.cwd(), out));
  }
}

console.log(
  wrote
    ? `Generated ${wrote} responsive WebP tier(s) from ${masters.length} master(s).`
    : `Responsive WebP tiers present (${masters.length} master(s)); placeholders verified.`,
);
