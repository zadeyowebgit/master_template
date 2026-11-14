import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_SITE_URL } from './template-site.mjs';
import { resolveDistDir } from './dist-dir.mjs';
import { visitContent } from '../src/i18n/rendered-content.mjs';
const dictionaries = JSON.parse(fs.readFileSync('src/i18n/generated-content.json', 'utf8'));

const dist = resolveDistDir();

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

let patched = 0;
for (const file of walkHtml(dist)) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('http-equiv="refresh"')) continue;

  const urlMatch = html.match(/content=["']0;\s*url=([^"']+)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const targetUrl = urlMatch ? urlMatch[1] : (canonicalMatch ? canonicalMatch[1] : '/');
  const canonical = canonicalMatch ? canonicalMatch[1] : `${TEMPLATE_SITE_URL}${targetUrl}`;

  const rel = '/' + path.relative(dist, file).replace(/\\/g, '/');
  const localeMatch = rel.match(/^\/(es|de|fr|ja|pl|pt|ru|tr)\//);
  const lang = localeMatch ? localeMatch[1] : 'en';

  const cleanHtml = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <meta name="robots" content="noindex, nofollow">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <link rel="canonical" href="${canonical}">
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a></p>
</body>
</html>`;

  fs.writeFileSync(file, visitContent(cleanHtml, text => dictionaries[lang]?.[text] ?? text), 'utf8');
  patched++;
}

console.log(`patch-redirects: formatted ${patched} redirect page(s) with clean nofollow redirects.`);
