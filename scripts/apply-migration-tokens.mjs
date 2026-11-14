#!/usr/bin/env node
/**
 * After template:generate, replace structural [[tokens]] in data/SEO files
 * using migration/game.input.json (mechanical — not research or prose).
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  buildTokenMap,
  loadMigrationInput,
  resolvePlaceholdersInText,
} from './lib/migration-tokens.mjs';

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, 'src', 'data'),
  path.join(ROOT, 'src', 'config'),
  path.join(ROOT, 'src', 'game', 'instances'),
];

const SKIP_FILES = new Set(['types.ts', 'icon-types.ts']);
const EXT = /\.(ts|mjs|json)$/;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (EXT.test(name) && !SKIP_FILES.has(name)) files.push(p);
  }
  return files;
}

function main() {
  const input = loadMigrationInput();
  if (!input) {
    console.log('apply-migration-tokens: no migration/game.input.json — skip');
    return;
  }
  const map = buildTokenMap(input);
  let changed = 0;
  for (const dir of TARGET_DIRS) {
    for (const file of walk(dir)) {
      const before = fs.readFileSync(file, 'utf8');
      if (!before.includes('[[')) continue;
      const after = resolvePlaceholdersInText(before, map);
      if (after !== before) {
        fs.writeFileSync(file, after);
        changed++;
      }
    }
  }
  console.log(`apply-migration-tokens: updated ${changed} file(s)`);
}

main();
