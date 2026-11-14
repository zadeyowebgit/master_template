#!/usr/bin/env node
/**
 * Pre-deploy sign-off: production build + placeholder scan (+ structural verify).
 *
 * Master template (no game.input.json): build must succeed; placeholders in dist are OK.
 * Migrated site (game.input.json): build must succeed; scan must find zero [[…]] in source + dist.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { MIGRATION_INPUT_PATH, assertMasterInstructions } from './lib/migration-preflight.mjs';

const ROOT = process.cwd();
const migrated = fs.existsSync(MIGRATION_INPUT_PATH);

function run(label, cmd, args, opts = {}) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: false, ...opts });
  if (r.status !== 0) {
    console.error(`\nmigration-signoff: failed at ${label}`);
    process.exit(r.status ?? 1);
  }
}

assertMasterInstructions();

run('template:verify (counts + blog minimum)', process.execPath, [
  path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs'),
  path.join(ROOT, 'scripts', 'verify-template-content.mjs'),
]);

run('astro build (production)', process.execPath, [
  path.join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs'),
  'build',
]);

const scanArgs = [path.join(ROOT, 'scripts', 'scan-unresolved-placeholders.mjs'), '--all'];
if (!migrated) scanArgs.push('--report');
run(
  migrated ? 'placeholder scan (strict)' : 'placeholder scan (template advisory)',
  process.execPath,
  scanArgs,
);

const dist = path.join(ROOT, 'dist');
if (!fs.existsSync(dist)) {
  console.error('migration-signoff: dist/ missing after build');
  process.exit(1);
}

const pageWalk = [];
function walkHtml(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p);
    else if (name.endsWith('.html')) pageWalk.push(p);
  }
}
walkHtml(dist);

const EXPECTED_HTML = 38; // 36 prerendered routes + 404.html + offline.html
if (pageWalk.length !== EXPECTED_HTML) {
  console.error(
    `migration-signoff: expected ${EXPECTED_HTML} HTML files in dist (layout/route set), found ${pageWalk.length}.`,
  );
  process.exit(1);
}

if (migrated) {
  const input = JSON.parse(fs.readFileSync(MIGRATION_INPUT_PATH, 'utf8'));
  const notes = input.verifiedContent?.unverifiedNotes;
  if (notes && String(notes).includes('[[')) {
    console.warn('migration-signoff: unverifiedNotes should describe gaps in plain language, not raw [[tokens]].');
  }
  console.log('\nmigration-signoff: migrated project OK (build + zero placeholders + layout route count).');
  console.log('Confirm product copy is seller-backed — see verifiedContent.productSources in game.input.json.');
} else {
  console.log('\nmigration-signoff: master template OK (build + structural verify). Placeholders in dist are expected.');
}
