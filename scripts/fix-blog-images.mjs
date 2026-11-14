import fs from 'node:fs';

for (const file of ['src/data/blog/posts.ts', 'src/i18n/en.ts']) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(
    /"image": "\/images\/placeholders\/card\.svg",[^"]+",/g,
    '"image": "/images/placeholders/card.svg",',
  );
  text = text.replace(/\s*_legacy: '[^']+',?\n/g, '\n');
  text = text.replace(/\/images\/blog\/[^'"]+\.(png|webp|jpg)['"]/g, (m) => {
    const quote = m.at(-1);
    return `/images/placeholders/card.svg${quote}`;
  });
  fs.writeFileSync(file, text);
  console.log('fixed', file);
}
