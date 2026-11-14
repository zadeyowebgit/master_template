import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { LOCALES, DEFAULT_LOCALE } from '../src/i18n/locales.ts';
import { customerReviews } from '../src/data/reviews.ts';

const dictionaries = JSON.parse(fs.readFileSync('src/i18n/generated-content.json', 'utf8'));
assert.equal(DEFAULT_LOCALE, 'en');
assert.deepEqual(LOCALES.map((l) => l.code), ['en']);

for (const [locale, map] of Object.entries(dictionaries)) {
  if (locale !== 'en') continue;
  for (const [key, value] of Object.entries(map)) {
    assert.deepEqual(
      (key.match(/\{\w+\}/g) ?? []).sort(),
      (value.match(/\{\w+\}/g) ?? []).sort(),
      `${locale}: template ${key}`,
    );
  }
}

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : [],
  );
}

function elements(node, result = []) {
  if (node.tagName) result.push(node);
  for (const child of node.childNodes ?? []) elements(child, result);
  return result;
}

function attr(node, key) {
  return node.attrs?.find((a) => a.name === key)?.value;
}

function exists(href) {
  const clean = href.split(/[?#]/)[0];
  return fs.existsSync(path.join('dist', clean, 'index.html')) || fs.existsSync(path.join('dist', clean));
}

let count = 0;
const brokenLinks = [];

for (const file of files('dist')) {
  const relative = path.relative('dist', file).replaceAll('\\', '/');
  if (relative === '404.html' || relative === 'offline.html' || relative.startsWith('go/')) continue;
  if (htmlLooksLikeRedirectStub(relative)) continue;

  const html = fs.readFileSync(file, 'utf8');
  const nodes = elements(parse(html));
  assert.equal(attr(nodes.find((n) => n.tagName === 'html'), 'lang'), 'en', relative);
  assert.equal(html.includes('data-language-switcher'), false, `${relative}: language switcher removed for English-only`);

  const nav = nodes.filter((n) => n.tagName === 'a' && attr(n, 'data-nav-link') !== undefined);
  if (!nav.length) continue;
  const hrefs = nav.map((n) => attr(n, 'href'));

  for (const anchor of nodes.filter((n) => n.tagName === 'a')) {
    const href = attr(anchor, 'href') ?? '';
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/go/') || /\.[a-z0-9]+(?:[?#]|$)/i.test(href)) {
      continue;
    }
    if (!exists(href)) brokenLinks.push(`${relative}: ${href}`);
  }

  const forum = hrefs.findIndex((h) => h.endsWith('/forum/'));
  assert(forum >= 0 && hrefs[forum + 1].endsWith('/reviews/'), `${relative}: review order`);

  for (const href of hrefs) {
    assert(exists(href), `${relative}: broken nav ${href}`);
    assert(!/^\/(de|es|fr|ja|pl|pt|ru|tr)(\/|$)/.test(href), `${relative}: nav must not use legacy locale prefix: ${href}`);
  }

  if (relative.endsWith('reviews/index.html')) {
    assert(!html.includes('Layout preview') && !html.includes('reviews-notice'), relative);
    const users = nodes.filter((n) => attr(n, 'data-review-username') !== undefined);
    assert.equal(users.length, customerReviews.length, `${relative}: review count`);
    assert.equal(new Set(customerReviews.map((r) => r.body)).size, 120, `${relative}: distinct review text`);
    const legacyBrandPattern = process.env.LEGACY_BRAND_PATTERN
      ? new RegExp(process.env.LEGACY_BRAND_PATTERN, 'i')
      : null;
    if (legacyBrandPattern) {
      assert(
        !customerReviews.some((r) => legacyBrandPattern.test(`${r.username} ${r.body}`)),
        `${relative}: legacy brand substring in review copy`,
      );
    }
    assert.equal(nodes.filter((n) => attr(n, 'data-demo-buyer') !== undefined).length, 0, `${relative}: no demo badges`);
    for (const rating of [1, 2, 3, 4, 5]) {
      assert(nodes.some((n) => attr(n, 'data-rating') === String(rating)), `${relative}: missing rating filter ${rating}`);
      assert.equal(
        nodes.filter((n) => attr(n, 'data-review-rating') === String(rating)).length,
        customerReviews.filter((r) => r.rating === rating).length,
        `${relative}: rating count ${rating}`,
      );
    }
  }

  count++;
}

function htmlLooksLikeRedirectStub(relative) {
  const full = path.join('dist', relative);
  const html = fs.readFileSync(full, 'utf8');
  return html.includes('http-equiv="refresh"') && html.includes('nofollow');
}

assert.deepEqual(brokenLinks, [], `Broken content links: ${brokenLinks.slice(0, 30).join(', ')}`);
console.log(`Verified ${count} English pages: HTML language, nav order, internal links, and review labels.`);
