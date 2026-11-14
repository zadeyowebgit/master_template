import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
export const EXAMPLE_PATH = path.join(ROOT, 'migration', 'game.input.example.json');
export const OUTPUT_PATH = path.join(ROOT, 'migration', 'game.input.json');

export function loadExampleTemplate() {
  return JSON.parse(fs.readFileSync(EXAMPLE_PATH, 'utf8'));
}

/** @param {unknown} a @param {unknown} b */
export function deepMerge(a, b) {
  if (b === null || b === undefined) return a;
  if (Array.isArray(b)) return b.map((item) => (typeof item === 'object' && item ? { ...item } : item));
  if (typeof b !== 'object' || typeof a !== 'object' || a === null) return b;
  const out = { ...a };
  for (const key of Object.keys(b)) {
    if (key.startsWith('$')) continue;
    const bv = b[key];
    const av = out[key];
    if (bv && typeof bv === 'object' && !Array.isArray(bv) && av && typeof av === 'object' && !Array.isArray(av)) {
      out[key] = deepMerge(av, bv);
    } else if (bv !== undefined) {
      out[key] = bv;
    }
  }
  return out;
}

/** @param {Record<string, unknown>} input */
export function validateMigrationInput(input) {
  const errors = [];
  if (!input.gameName || !String(input.gameName).trim()) errors.push('gameName is required');
  if (!input.domain || !String(input.domain).trim()) errors.push('domain is required');
  const checkout =
    input.checkoutUrl ||
    (Array.isArray(input.productLinks) && input.productLinks[0]?.buyUrl);
  if (!checkout || !String(checkout).trim()) {
    errors.push('checkoutUrl or productLinks[0].buyUrl is required');
  }
  const domain = String(input.domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (domain.includes('/')) errors.push('domain must be a hostname only (no path)');
  if (Array.isArray(input.productLinks)) {
    for (const [i, link] of input.productLinks.entries()) {
      if (!link?.slug) errors.push(`productLinks[${i}].slug is required`);
      if (!link?.buyUrl) errors.push(`productLinks[${i}].buyUrl is required`);
    }
  }
  return errors;
}
