#!/usr/bin/env node
/**
 * Regenerate all game-neutral template data files.
 *
 * Workflow (see MASTER_INSTRUCTIONS.md):
 * 1. Always verifies MASTER_INSTRUCTIONS.md exists.
 * 2. If migration/game.input.json exists, runs scripts/migrate-game.mjs (instance + URLs).
 * 3. Runs all content/SEO generators (blogs, forum, FAQ, reviews placeholders, SEO).
 *
 * Full migration: agent creates migration/game.input.json (write-game-input.mjs) from owner chat inputs.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { assertMasterInstructions, MIGRATION_INPUT_PATH } from './lib/migration-preflight.mjs';

const skipMigrate = process.argv.includes('--skip-migrate');

assertMasterInstructions();

if (!skipMigrate) {
  if (existsSync(MIGRATION_INPUT_PATH)) {
    console.log('migration/game.input.json found — applying game instance migration…');
    const mig = spawnSync(process.execPath, ['scripts/migrate-game.mjs', '--content-only'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: { ...process.env, MIGRATE_CONTENT_ONLY: '1' },
    });
    if (mig.status !== 0) process.exit(mig.status ?? 1);
  } else {
    console.log(
      'Template mode: no migration/game.input.json. Generating neutral [[PLACEHOLDER]] content only.',
    );
  }
}

const steps = [
  'generate-template-blog.mjs',
  'generate-template-forum.mjs',
  'generate-template-reviews.mjs',
  'generate-template-faq.mjs',
  'generate-template-page-seo.mjs',
  'generate-template-keywords.mjs',
  'generate-template-audit-seo.mjs',
  'generate-template-blog-meta.mjs',
];

for (const script of steps) {
  if (script === 'generate-template-reviews.mjs' && existsSync(MIGRATION_INPUT_PATH)) {
    try {
      const input = JSON.parse(readFileSync(MIGRATION_INPUT_PATH, 'utf8'));
      if (input.reviews?.mode === 'owner' && input.reviews?.items?.length) {
        console.log('Skipping review generator — owner reviews in game.input.json');
        continue;
      }
    } catch {
      /* continue with generator */
    }
  }
  const result = spawnSync(process.execPath, [`scripts/${script}`], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (existsSync(MIGRATION_INPUT_PATH)) {
  const tok = spawnSync(process.execPath, ['scripts/apply-migration-tokens.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (tok.status !== 0) process.exit(tok.status ?? 1);
}

const verify = spawnSync('npx', ['tsx', 'scripts/verify-template-content.mjs'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
});
if (verify.status !== 0) process.exit(verify.status ?? 1);

console.log('template:generate complete (see MASTER_INSTRUCTIONS.md §11–12 for verification).');
