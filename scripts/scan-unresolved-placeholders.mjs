#!/usr/bin/env node
/**
 * After a migrated build, ensure production output has no raw [[PLACEHOLDER]] tokens.
 * Template mode (no migration/game.input.json): placeholders in source are allowed — scan is advisory only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { MIGRATION_INPUT_PATH } from './lib/migration-preflight.mjs';

function loadMigrationInput() {
  if (!fs.existsSync(MIGRATION_INPUT_PATH)) return null;
  return JSON.parse(fs.readFileSync(MIGRATION_INPUT_PATH, 'utf8'));
}

const ROOT = process.cwd();
const TOKEN = /\[\[[^\]]+\]\]/g;

const DIST_EXT = new Set(['.html', '.xml', '.txt', '.js', '.css', '.json']);
const SRC_EXT = new Set(['.ts', '.astro', '.mjs', '.json', '.js']);

const SRC_ROOTS = [
  path.join(ROOT, 'src', 'data'),
  path.join(ROOT, 'src', 'config'),
  path.join(ROOT, 'src', 'i18n'),
  path.join(ROOT, 'src', 'pages'),
  path.join(ROOT, 'src', 'components'),
  path.join(ROOT, 'src', 'game', 'instances'),
];

const SKIP_DIR = new Set(['node_modules', '.git', 'dist']);
const SKIP_FILE = /(?:template-posts\.ts|game\.input\.example\.json|placeholders\.ts)$/;

function walk(dir, extSet, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, extSet, out);
    else if (extSet.has(path.extname(name)) && !SKIP_FILE.test(p)) out.push(p);
  }
  return out;
}

function activeInstanceDir() {
  const applied = path.join(ROOT, 'migration', 'applied.json');
  if (fs.existsSync(applied)) {
    try {
      const { slug } = JSON.parse(fs.readFileSync(applied, 'utf8'));
      if (slug) return path.join(ROOT, 'src', 'game', 'instances', slug);
    } catch {
      /* ignore */
    }
  }
  return null;
}

function shouldScanInstanceFile(file) {
  const rel = path.relative(path.join(ROOT, 'src', 'game', 'instances'), file);
  if (!rel.includes(path.sep)) return true;
  const top = rel.split(path.sep)[0];
  if (top === 'template') return false;
  const active = activeInstanceDir();
  if (active) return file.startsWith(active);
  return top !== 'template';
}

function scanFiles(files, filterFn) {
  /** @type {Map<string, Set<string>>} */
  const byToken = new Map();
  for (const file of files) {
    if (filterFn && !filterFn(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('[[')) continue;
    for (const m of text.matchAll(TOKEN)) {
      const token = m[0];
      if (!byToken.has(token)) byToken.set(token, new Set());
      byToken.get(token).add(path.relative(ROOT, file));
    }
  }
  return byToken;
}

function printFindings(label, byToken) {
  if (byToken.size === 0) {
    console.log(`${label}: no [[…]] tokens found`);
    return 0;
  }
  let n = 0;
  console.error(`${label}: found ${byToken.size} unique token(s):`);
  for (const [token, files] of [...byToken.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    n += files.size;
    console.error(`  ${token}`);
    for (const f of [...files].sort()) console.error(`    - ${f}`);
  }
  return n;
}

function main() {
  const input = loadMigrationInput();
  const migrated = Boolean(input);
  const wantSrc = process.argv.includes('--src') || process.argv.includes('--all');
  const wantDist = process.argv.includes('--dist') || process.argv.includes('--all') || !wantSrc;

  const reportOnly = process.argv.includes('--report');
  if (!migrated) {
    console.log(
      'scan-unresolved-placeholders: master template mode (no game.input.json). [[…]] in source/dist is expected.',
    );
    if (!reportOnly && !process.argv.includes('--force')) process.exit(0);
  }

  let failures = 0;

  if (wantSrc) {
    const files = SRC_ROOTS.flatMap((d) => walk(d, SRC_EXT));
    const byToken = scanFiles(files, (f) =>
      f.includes(`${path.sep}instances${path.sep}`) ? shouldScanInstanceFile(f) : true,
    );
    failures += printFindings('source scan', byToken);
  }

  if (wantDist) {
    const dist = path.join(ROOT, 'dist');
    const files = walk(dist, DIST_EXT);
    const byToken = scanFiles(files);
    failures += printFindings('dist scan', byToken);
  }

  if (!migrated && reportOnly && failures > 0) {
    console.log(`\n(template) ${failures} file hit(s) with [[…]] — OK for master template, must be zero after migration.`);
    process.exit(0);
  }

  if (migrated && failures > 0) {
    console.error(
      '\nMigrated site rule: resolve all [[…]] using verifiedContent, apply-migration-tokens, and editorial passes.',
    );
    console.error(
      'Unverified facts → neutral wording or remove unsupported copy (keep layout). Document gaps in unverifiedNotes.',
    );
    console.error('Do not remove reusable placeholders from src/game/instances/template/ (master template).');
    process.exit(1);
  }

  if (migrated) console.log('scan-unresolved-placeholders: OK');
}

main();
