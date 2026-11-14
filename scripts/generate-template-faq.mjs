import fs from 'node:fs';

const MAIN_FAQ_IDS = [
  'plans', 'requirements', 'cloud', 'utilities', 'activation', 'transfer', 'updates', 'risk', 'support', 'terms',
  'features', 'utility-scopes', 'order-record', 'delivery-check', 'windows-edition', 'separate-services',
  'error-details', 'follow-up',
];

const HOME_FAQ_IDS = ['home-offer', 'home-duration', 'home-before-buy', 'home-extra', 'home-evidence', 'home-help'];

const supplementalIds = ['catalog', 'pricing', 'refunds', 'hardware', 'discord', 'documentation', 'scope'];

const allIds = [...new Set([...MAIN_FAQ_IDS, ...HOME_FAQ_IDS, ...supplementalIds])];

const items = allIds.map((id, index) => ({
  id,
  topic: ['plans', 'safety', 'setup', 'products', 'esp', 'scripts', 'blog'][index % 7],
  icon: 'navFaq',
  q: `[[FAQ_${id.toUpperCase().replace(/-/g, '_')}_Q]]`,
  a: `[[FAQ_${id.toUpperCase().replace(/-/g, '_')}_A]]`,
}));

const file = `import type { IconName } from '../components/icons/types';\nimport type { SiteFaqItem } from './faq';\n\nexport const purchaseFaqs: SiteFaqItem[] = ${JSON.stringify(items, null, 2)};\nexport const MAIN_FAQ_IDS = ${JSON.stringify(MAIN_FAQ_IDS)};\nexport const HOME_FAQ_IDS = ${JSON.stringify(HOME_FAQ_IDS)};\n`;
fs.writeFileSync('src/data/purchaseFaqs.ts', file);
console.log('purchaseFaqs', items.length, 'main', MAIN_FAQ_IDS.length, 'home', HOME_FAQ_IDS.length);
