import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (f.endsWith('.html')) results.push(full);
  }
  return results;
}

const htmlFiles = walk('dist');
console.log(`Checking ${htmlFiles.length} HTML files in dist/ for broken links...`);

// Build a set of all valid routes in dist
const validRoutes = new Set();
for (const file of htmlFiles) {
  let route = '/' + path.relative('dist', file).replace(/\\/g, '/');
  if (route.endsWith('/index.html')) {
    route = route.slice(0, -'index.html'.length);
  }
  validRoutes.add(route);
  if (!route.endsWith('/')) {
    validRoutes.add(route + '/');
  }
}

// Also check static files in dist
function walkAll(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) results = results.concat(walkAll(full));
    else results.push(full);
  }
  return results;
}
const allDistFiles = walkAll('dist');
for (const file of allDistFiles) {
  const route = '/' + path.relative('dist', file).replace(/\\/g, '/');
  validRoutes.add(route);
}

// Read redirects from public/_redirects if exists
const redirects = new Map();
if (fs.existsSync('public/_redirects')) {
  const lines = fs.readFileSync('public/_redirects', 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      redirects.set(parts[0], parts[1]);
    }
  }
}

const broken = [];
const checkedLinks = new Set();

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  // Strip <script> and <style> tags to only check rendered DOM links
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawHref = match[1];
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) {
      continue;
    }
    // Clean href
    let clean = rawHref.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (!clean.startsWith('/')) {
      // Relative path
      const currentDir = path.dirname('/' + path.relative('dist', file).replace(/\\/g, '/'));
      clean = path.posix.normalize(path.posix.join(currentDir, clean));
    }
    
    const key = `${file} -> ${clean}`;
    if (checkedLinks.has(key)) continue;
    checkedLinks.add(key);

    // Resolve redirect
    let target = clean;
    if (redirects.has(target)) target = redirects.get(target);
    else if (target !== '/' && redirects.has(target.replace(/\/$/, ''))) target = redirects.get(target.replace(/\/$/, ''));

    // Check if target exists in validRoutes
    const exists = validRoutes.has(target) || validRoutes.has(target + '/') || validRoutes.has(target.replace(/\/$/, ''));
    if (!exists) {
      broken.push({ file: path.relative('dist', file), raw: rawHref, target });
    }
  }
}

if (broken.length === 0) {
  console.log(`✓ All internal links valid! Zero 404s found across all ${htmlFiles.length} pages.`);
} else {
  console.error(`✗ Found ${broken.length} broken links:`);
  for (const b of broken) {
    console.error(`  In ${b.file}: ${b.raw} -> ${b.target}`);
  }
}
