import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
export const MASTER_INSTRUCTIONS_PATH = path.join(ROOT, 'MASTER_INSTRUCTIONS.md');
export const MIGRATION_INPUT_PATH = path.join(ROOT, 'migration', 'game.input.json');

/** Every migration and template:generate run must start here. */
export function assertMasterInstructions() {
  if (!fs.existsSync(MASTER_INSTRUCTIONS_PATH)) {
    console.error(
      'Missing MASTER_INSTRUCTIONS.md. Read it before migrating — it is the single source of truth.',
    );
    process.exit(1);
  }
  console.log(`OK — ${MASTER_INSTRUCTIONS_PATH}`);
}
