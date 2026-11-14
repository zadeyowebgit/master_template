#!/usr/bin/env node
/** Scan src/, scripts/, public/, functions/ for retired brand terms (see MASTER_INSTRUCTIONS.md §12). */
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_TERMS = 'deadlock,deadlocks,cheatsdeadlock,deadlock-cheats';
const terms = (process.env.LEGACY_SCAN || DEFAULT_TERMS)
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const roots = ['src', 'scripts', 'public', 'functions'];
const ext = /\.(ts|tsx|js|mjs|astro|json|md|toml|txt|svg)$/i;
const skip = new Set(['node_modules', 'dist', '.git', '_tmp']);

let hits = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ext.test(ent.name) && ent.name !== 'legacy-brand-scan.mjs') {
      const t = fs.readFileSync(p, 'utf8').toLowerCase();
      for (const term of terms) {
        if (term && t.includes(term)) {
          console.log(`${p} -> ${term}`);
          hits++;
          break;
        }
      }
    }
  }
}

for (const root of roots) {
  if (fs.existsSync(root)) walk(root);
}

if (hits) {
  console.error(`legacy-brand-scan: ${hits} file(s) matched. Set LEGACY_SCAN to customize.`);
  process.exit(1);
}
console.log('legacy-brand-scan: clean');
