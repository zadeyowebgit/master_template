import { gameCatalog } from './gameCatalog';

export const hubPlans = gameCatalog.plans.map((plan) => ({
  ...plan,
  price: '',
  note: plan.priceNote,
  blurb: '[[HUB_PLAN_BLURB]]',
  popular: plan.id === 'monthly',
}));

export const hubModules = [
  { title: '[[HUB_MODULE_1_TITLE]]', desc: '[[HUB_MODULE_1_DESC]]', icon: 'eye' },
  { title: '[[HUB_MODULE_2_TITLE]]', desc: '[[HUB_MODULE_2_DESC]]', icon: 'lootEsp' },
  { title: '[[HUB_MODULE_3_TITLE]]', desc: '[[HUB_MODULE_3_DESC]]', icon: 'radar' },
] as const;

export const hubBuyUrl = gameCatalog.buyUrl;

export const hubSeoBlocks = [
  {
    title: '[[HUB_SEO_BLOCK_TITLE]]',
    paragraphs: [gameCatalog.description, gameCatalog.overview],
  },
];
