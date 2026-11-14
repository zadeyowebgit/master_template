#!/usr/bin/env node
/**
 * Create or update migration/game.input.json (agent use).
 * Owner supplies details in chat; the coding agent runs this script — owners do not edit JSON by hand.
 *
 * Usage:
 *   node scripts/write-game-input.mjs --stdin < payload.json
 *   node scripts/write-game-input.mjs --merge path/to/partial.json
 *   node scripts/write-game-input.mjs --dry-run --stdin < payload.json
 *
 * Merges onto game.input.example.json defaults, validates required fields, writes game.input.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  deepMerge,
  loadExampleTemplate,
  OUTPUT_PATH,
  validateMigrationInput,
} from './lib/migration-input-defaults.mjs';

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => chunks.push(c));
    process.stdin.on('end', () => resolve(chunks.join('')));
    process.stdin.on('error', reject);
  });
}

function normalizeDomain(domain) {
  return String(domain)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function normalizeInput(merged, partial) {
  const input = { ...merged };
  if (input.domain) input.domain = normalizeDomain(input.domain);
  if (partial.gameName) {
    input.gameName = partial.gameName;
    input.gameNameDisplay =
      partial.gameNameDisplay !== undefined ? partial.gameNameDisplay : partial.gameName;
  }
  if (partial.gameName && partial.siteBrand === undefined && input.siteBrand === 'Game Catalog') {
    input.siteBrand = `${input.gameNameDisplay} Catalog`;
  }
  if (!input.checkoutUrl && Array.isArray(input.productLinks) && input.productLinks[0]?.buyUrl) {
    input.checkoutUrl = input.productLinks[0].buyUrl;
  }
  if (!input.siteBrand && input.gameNameDisplay) {
    input.siteBrand = `${input.gameNameDisplay} Catalog`;
  }
  if (!input.images) input.images = {};
  if (!input.images.mediaPathSegment && input.gameName) {
    input.images.mediaPathSegment = String(input.gameName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 32) || 'game';
  }
  if (!input.reviews) {
    input.reviews = { mode: 'placeholders', verifiedOn: '', items: [] };
  }
  if (input.reviews?.items?.length && input.reviews.mode !== 'owner') {
    input.reviews.mode = 'owner';
  }
  if (!input.verifiedContent) {
    input.verifiedContent = { product: {}, tokens: {}, unverifiedNotes: '' };
  }
  return input;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const mergeIdx = process.argv.indexOf('--merge');
  let partial = {};

  if (mergeIdx !== -1 && process.argv[mergeIdx + 1]) {
    partial = JSON.parse(fs.readFileSync(path.resolve(process.argv[mergeIdx + 1]), 'utf8'));
  } else if (process.argv.includes('--stdin') || !process.stdin.isTTY) {
    const raw = await readStdin();
    if (raw.trim()) partial = JSON.parse(raw);
  } else {
    console.error(
      'write-game-input: pass JSON via --stdin, --merge <file>, or pipe to stdin.\nSee migration/AGENT_TASKS.md',
    );
    process.exit(1);
  }

  const fromExample = process.argv.includes('--from-example');
  const base = (() => {
    if (!fromExample && fs.existsSync(OUTPUT_PATH)) {
      return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    }
    const t = loadExampleTemplate();
    delete t.$comment;
    if (t.verifiedContent?.$comment) delete t.verifiedContent.$comment;
    return t;
  })();

  const merged = normalizeInput(deepMerge(base, partial), partial);
  const errors = validateMigrationInput(merged);
  if (errors.length) {
    console.error('write-game-input: validation failed:\n - ' + errors.join('\n - '));
    process.exit(1);
  }

  const out = JSON.stringify(merged, null, 2) + '\n';
  if (dryRun) {
    process.stdout.write(out);
    return;
  }
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, out);
  console.log(`write-game-input: wrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
