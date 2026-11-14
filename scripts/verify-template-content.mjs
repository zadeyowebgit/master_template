#!/usr/bin/env node
/**
 * Structural checks for the master template (counts + blog word minimum).
 * Does not validate factual accuracy — that is the AI agent's job (see migration/AGENT_TASKS.md).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let failed = false;

function fail(msg) {
  console.error(`verify-template-content: ${msg}`);
  failed = true;
}

// Blog word counts via dynamic import of generated TS
async function verifyBlogs() {
  const mod = await import('../src/data/blog/template-posts.ts');
  const posts = mod.templateBlogPosts;
  if (!Array.isArray(posts) || posts.length !== 16) {
    fail(`expected 16 blog posts, got ${posts?.length ?? 0}`);
    return;
  }
  function words(body) {
    let t = '';
    for (const b of body) {
      if (b.text) t += `${b.text} `;
      if (b.items) t += `${b.items.join(' ')} `;
      if (b.rows) t += `${b.rows.flat().join(' ')} `;
    }
    return t.trim().split(/\s+/).filter(Boolean).length;
  }
  const low = [];
  for (const p of posts) {
    const w = words(p.body);
    if (w < 1500) low.push(`${p.slug} (${w})`);
  }
  if (low.length) fail(`blog posts below 1500 words: ${low.join(', ')}`);
  else console.log(`blogs: 16 posts, all ≥1500 words`);
}

function verifyForum() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/forum.generated.ts'), 'utf8');
  const slugs = [...text.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
  if (slugs.length !== 7) fail(`expected 7 forum threads, got ${slugs.length}`);
  else console.log(`forum: ${slugs.length} threads`);
}

function verifyFaq() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/purchaseFaqs.ts'), 'utf8');
  const pool = (text.match(/export const purchaseFaqs/g) || []).length;
  const main = text.match(/MAIN_FAQ_IDS\s*=\s*\[([^\]]+)\]/);
  const home = text.match(/HOME_FAQ_IDS\s*=\s*\[([^\]]+)\]/);
  const mainN = main ? main[1].split(',').filter(Boolean).length : 0;
  const homeN = home ? home[1].split(',').filter(Boolean).length : 0;
  const poolN = (text.match(/"id":\s*"/g) || []).length;
  if (poolN < 31) fail(`expected FAQ pool ≥31, counted ${poolN}`);
  if (mainN !== 18) fail(`expected MAIN_FAQ_IDS length 18, got ${mainN}`);
  if (homeN !== 6) fail(`expected HOME_FAQ_IDS length 6, got ${homeN}`);
  if (!failed) console.log(`faq: pool ${poolN}, main ${mainN}, home ${homeN}`);
}

function verifyReviews() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/reviews.ts'), 'utf8');
  const rows = (text.match(/@placeholder_user_/g) || []).length;
  if (rows < 120) fail(`expected 120 placeholder reviews, counted ${rows}`);
  else console.log(`reviews: ${rows} entries`);
}

await verifyBlogs();
verifyForum();
verifyFaq();
verifyReviews();

if (failed) process.exit(1);
console.log('verify-template-content: OK');
