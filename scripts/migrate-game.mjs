#!/usr/bin/env node
/**
 * One-shot game migration from migration/game.input.json.
 * Requires MASTER_INSTRUCTIONS.md (see scripts/lib/migration-preflight.mjs).
 *
 * Owner inputs only:
 * - game name, domain, product/checkout links, reviews (optional), images (optional)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  assertMasterInstructions,
  MIGRATION_INPUT_PATH,
} from './lib/migration-preflight.mjs';

const ROOT = process.cwd();
const TEMPLATE_INSTANCE = path.join(ROOT, 'src', 'game', 'instances', 'template');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'game';
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function copyDir(src, dest, skip = new Set()) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (skip.has(name)) continue;
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to, skip);
    else fs.copyFileSync(from, to);
  }
}

function patchFile(file, replacements) {
  let text = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    if (!text.includes(from)) {
      console.warn(`patch skip (pattern not found): ${file} → ${from.slice(0, 40)}…`);
      continue;
    }
    text = text.replaceAll(from, to);
  }
  fs.writeFileSync(file, text);
}

function generateGameIndex({ slug, input, checkoutUrl, domain }) {
  const g = input.gameName;
  const display = input.gameNameDisplay || input.gameName;
  const brand = input.siteBrand || `${display} Catalog`;
  const segment = input.images?.mediaPathSegment || 'game';
  const discord = input.discordUrl || 'https://discord.gg/template-placeholder';
  const rights = input.rightsHolder || '[[RIGHTS_HOLDER]]';
  const reviewsOn = input.reviews?.verifiedOn || '[[REVIEWS_VERIFIED_DATE]]';

  return `import type { GameInstance } from '../../types';
import { TEMPLATE_RUNTIME } from '../../runtime-defaults';
import { applyTemplateMarketingOverlay } from '../template/marketing';
import {
  TEMPLATE_CHECKOUT,
  templateCloudNote,
  templateDescription,
  templateFeatureGroups,
  templateHeadline,
  templateOverview,
  templatePlans,
  templateSystemRequirements,
  templateTagline,
} from '../template/manifest';

const productRouteSegment = 'cheats';
const productBase = \`/products/\${productRouteSegment}/\`;

export const ${slug.replace(/-/g, '_')}Game: GameInstance = {
  site: {
    id: ${JSON.stringify(slug)},
    gameName: ${JSON.stringify(g)},
    gameNameDisplay: ${JSON.stringify(display)},
    titlePrefix: ${JSON.stringify(display)},
    brandName: ${JSON.stringify(brand)},
    canonicalDomain: ${JSON.stringify(domain)},
    supportEmailLocalPart: 'support',
    discordUrl: ${JSON.stringify(discord)},
    publisherShort: ${JSON.stringify(brand)},
    franchiseRightsHolder: ${JSON.stringify(rights)},
    communityName: ${JSON.stringify(`${display} community`)},
    mediaPathSegment: ${JSON.stringify(segment)},
    productRouteSegment,
    blogSlugPrefix: '',
    defaultProductSlug: 'featured-package',
    reviewsVerifiedOn: ${JSON.stringify(reviewsOn)},
  },
  routes: {
    productBase,
    productDetailPath: (s) => \`\${productBase}\${s}/\`,
  },
  checkout: {
    primaryProductKey: 'primary',
    externalCheckoutUrl: ${JSON.stringify(checkoutUrl)},
    goPath: '/go/checkout/',
  },
  product: {
    checkoutUrl: ${JSON.stringify(checkoutUrl)},
    verifiedOn: '[[PRODUCT_VERIFIED_DATE]]',
    headline: templateHeadline,
    tagline: templateTagline,
    description: templateDescription,
    overview: templateOverview,
    cloudDmaNote: templateCloudNote,
    featureGroups: templateFeatureGroups,
    plans: templatePlans,
    systemRequirements: templateSystemRequirements,
  },
  applyMarketingOverlay: applyTemplateMarketingOverlay,
};
`;
}

function writeReviewsFromInput(items, verifiedOn) {
  const lines = items.map((row, i) => {
    const rating = Number(row.rating) || ((i % 5) + 1);
    const user = JSON.stringify(row.username || `@user_${i + 1}`);
    const body = JSON.stringify(row.body || '[[REVIEW_PLACEHOLDER]]');
    return `  [${user}, ${rating}, ${body}],`;
  });
  const out = `// Migrated from migration/game.input.json — owner-supplied reviews.\nexport interface CustomerReview { id:number; username:string; rating:number; body:string }\ntype T=[string,number,string];\nconst reviews:T[]=[\n${lines.join('\n')}\n];\nexport const customerReviews:CustomerReview[]=reviews.map(([username,rating,body],index)=>({id:index+1,username,rating,body}));\nexport const REVIEWS_VERIFIED_ON=${JSON.stringify(verifiedOn)};\n`;
  writeFile(path.join(ROOT, 'src', 'data', 'reviews.ts'), out);
}

function patchProductBuyUrls(productLinks) {
  const file = path.join(ROOT, 'src', 'data', 'products.ts');
  let text = fs.readFileSync(file, 'utf8');
  for (const link of productLinks) {
    if (!link.slug || !link.buyUrl) continue;
    const slugMarker = `slug: ${JSON.stringify(link.slug)}`;
    const idx = text.indexOf(slugMarker);
    if (idx === -1) {
      console.warn(`products.ts: slug not found ${link.slug}`);
      continue;
    }
    const slice = text.slice(idx, idx + 2500);
    const patched = slice.replace(/buyUrl:\s*'[^']*'/, `buyUrl: ${JSON.stringify(link.buyUrl)}`);
    text = text.slice(0, idx) + patched + text.slice(idx + slice.length);
  }
  fs.writeFileSync(file, text);
}

function patchGameCatalogCheckout(checkoutUrl) {
  const file = path.join(ROOT, 'src', 'data', 'gameCatalog.ts');
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/buyUrl:\s*'[^']*'/, `buyUrl: ${JSON.stringify(checkoutUrl)}`);
  fs.writeFileSync(file, text);
}

function copyImages(input, mediaSegment) {
  const destRoot = path.join(ROOT, 'public', 'images', mediaSegment);
  fs.mkdirSync(destRoot, { recursive: true });
  const files = input.images?.copyToPublic ?? [];
  for (const entry of files) {
    const from = path.isAbsolute(entry.from) ? entry.from : path.join(ROOT, entry.from);
    const toName = entry.to || path.basename(from);
    const to = path.join(destRoot, toName);
    if (!fs.existsSync(from)) {
      console.warn(`image missing: ${from}`);
      continue;
    }
    fs.copyFileSync(from, to);
    console.log(`image → ${path.relative(ROOT, to)}`);
  }
  if (input.images?.hero) {
    const from = path.isAbsolute(input.images.hero)
      ? input.images.hero
      : path.join(ROOT, input.images.hero);
    const to = path.join(ROOT, 'public', 'images', 'placeholders', 'hero.svg');
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, to);
      console.log('hero copied to public/images/placeholders/hero.svg');
    }
  }
}

function updateGameIndexExport(slug, exportName) {
  const file = path.join(ROOT, 'src', 'game', 'index.ts');
  const content = `import type { GameInstance } from './types';
import { ${exportName} } from './instances/${slug}';

/** Active game instance. Replace via migration/game.input.json + npm run template:generate */
export const game: GameInstance = ${exportName};

export type { GameCheckoutConfig, GameInstance, GameProductManifest, GameRoutesConfig, GameSiteConfig } from './types';
export { PH } from './placeholders';

export function productHubPath(): string {
  return game.routes.productBase;
}

export function productImageBase(): string {
  return \`/images/\${game.site.mediaPathSegment}\`;
}
`;
  writeFile(file, content);
}

export function runMigrationIfConfigured() {
  assertMasterInstructions();
  if (!fs.existsSync(MIGRATION_INPUT_PATH)) {
    console.log('No migration/game.input.json — skipping instance migration.');
    return false;
  }

  const input = readJson(MIGRATION_INPUT_PATH);
  const slug = slugify(input.instanceId || input.gameNameShort || input.gameName);
  const exportName = `${slug.replace(/-/g, '_')}Game`;
  const domain = input.domain;
  const checkoutUrl = input.checkoutUrl || input.productLinks?.[0]?.buyUrl;
  if (!input.gameName || !domain || !checkoutUrl) {
    console.error('game.input.json requires gameName, domain, and checkoutUrl (or productLinks[0].buyUrl).');
    process.exit(1);
  }

  const instanceDir = path.join(ROOT, 'src', 'game', 'instances', slug);
  fs.mkdirSync(instanceDir, { recursive: true });
  writeFile(path.join(instanceDir, 'index.ts'), generateGameIndex({ slug, input, checkoutUrl, domain }));

  const runtimePath = path.join(ROOT, 'src', 'game', 'runtime-defaults.ts');
  writeFile(
    runtimePath,
    `/**
 * Valid hosts and URLs for builds (schema.org, canonical, mailto).
 * Updated by scripts/migrate-game.mjs — keep in sync with scripts/template-site.mjs
 */
export const TEMPLATE_RUNTIME = {
  canonicalDomain: ${JSON.stringify(domain)},
  checkoutUrl: ${JSON.stringify(checkoutUrl)},
  discordUrl: ${JSON.stringify(input.discordUrl || 'https://discord.gg/template-placeholder')},
} as const;
`,
  );

  patchFile(path.join(ROOT, 'scripts', 'template-site.mjs'), [
    ["export const TEMPLATE_CANONICAL_DOMAIN = 'your-domain.example';", `export const TEMPLATE_CANONICAL_DOMAIN = ${JSON.stringify(domain)};`],
    [
      "export const TEMPLATE_CHECKOUT_URL = 'https://checkout.example/template';",
      `export const TEMPLATE_CHECKOUT_URL = ${JSON.stringify(checkoutUrl)};`,
    ],
  ]);

  patchFile(path.join(ROOT, 'astro.config.mjs'), [
    ["const site = 'https://your-domain.example';", `const site = 'https://${domain}';`],
  ]);

  patchFile(path.join(ROOT, 'functions', '_middleware.js'), [
    ["const CANONICAL_HOST = 'your-domain.example';", `const CANONICAL_HOST = ${JSON.stringify(domain)};`],
  ]);

  updateGameIndexExport(slug, exportName);

  if (Array.isArray(input.productLinks) && input.productLinks.length) {
    patchProductBuyUrls(input.productLinks);
  }
  patchGameCatalogCheckout(checkoutUrl);

  const reviews = input.reviews;
  if (reviews?.mode === 'owner' && Array.isArray(reviews.items) && reviews.items.length) {
    writeReviewsFromInput(reviews.items, reviews.verifiedOn || '[[REVIEWS_VERIFIED_DATE]]');
  }

  const mediaSegment = input.images?.mediaPathSegment || 'game';
  copyImages(input, mediaSegment);

  writeFile(
    path.join(ROOT, 'migration', 'applied.json'),
    JSON.stringify({ slug, appliedAt: new Date().toISOString(), domain, checkoutUrl }, null, 2),
  );

  console.log(`Migration applied: instance "${slug}" → src/game/index.ts`);
  return true;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  runMigrationIfConfigured();
  const contentOnly =
    process.env.MIGRATE_CONTENT_ONLY === '1' || process.argv.includes('--content-only');
  if (!contentOnly) {
    spawnSync(process.execPath, ['scripts/generate-all-template-content.mjs', '--skip-migrate'], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
}
