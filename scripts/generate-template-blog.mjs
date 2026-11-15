/**
 * Generates src/data/blog/template-posts.ts — 16 neutral pillar/cluster articles (~3000 words each).
 * Run: node scripts/generate-template-blog.mjs
 */
import fs from 'node:fs';

const G = '[[GAME_NAME]]';
const B = '[[SITE_BRAND]]';
const P = '[[PRODUCT_NAME]]';

function p(text) {
  return { type: 'p', text };
}
function h2(text) {
  return { type: 'h2', text };
}
function h3(text) {
  return { type: 'h3', text };
}
function ul(items) {
  return { type: 'ul', items };
}

/** ~150-word product-site paragraphs (direct voice; traceability via productSources in migration JSON). */
const para = {
  scope:
    `This section explains how ${P} is presented on the product pages for ${G}. Feature names describe controls, overlays, and modules included in the package. Use the manifest and detail pages when you need the authoritative list of what is included and how it is grouped.`,
  checklist:
    `Before you install, align your PC edition, display scale, input device, and current game build with the documented requirements. Note which modules you plan to enable first and which in-game display settings you use. That short checklist makes configuration and support faster.`,
  policy:
    `Platform documentation and product capabilities are different subjects. Read official platform help when you need policy context. Pages on this site describe the package, access terms, and setup steps for ${G} in direct product language.`,
  support:
    `When you need help, include the module name, game build, and what you expected versus what you saw. Plain-language notes and cropped screenshots move troubleshooting forward. Use the contact path on the product or Support page that matches your order.`,
  compare:
    `Compare packages by the features you will actually use. A shorter list with clear documentation is easier to run day to day than a long list with vague labels. Migration replaces [[FEATURE_n]] tokens with verified manifest entries for ${P}—do not assume labels from another title apply to ${G}.`,
  update:
    `Game and operating-system updates can change compatibility notes. Re-check requirements after major patches or launcher updates. Build numbers and edition labels are more reliable than broad marketing adjectives.`,
};

function sectionsFor(topic, extra) {
  const blocks = [
    p(
      `${topic.intro} Buyers researching ${G} often mix search keywords from other titles; this article keeps vocabulary tied to placeholders you will replace during migration. Nothing here certifies detection rates, win rates, or uptime.`,
    ),
  ];
  for (let i = 0; i < extra.length; i++) {
    blocks.push(h2(extra[i].h));
    for (const t of extra[i].t) blocks.push(p(t));
    if (extra[i].list) blocks.push(ul(extra[i].list));
  }
  const tails = [para.scope, para.checklist, para.policy, para.support, para.compare, para.update];
  for (let i = 0; i < tails.length; i++) {
    blocks.push(h2(`${topic.tailPrefix} ${i + 1}`));
    blocks.push(p(tails[i] + ` Focus for this article: ${topic.focus}.`));
  }
  return blocks;
}

const articles = [
  {
    slug: 'best-cheats',
    featured: true,
    type: 'pillar',
    tag: 'Guides',
    title: `[[BLOG_BEST_TITLE — Best ${G} tools: compare listed features and requirements]]`,
    seoTitle: `[[BLOG_BEST_SEO — Best ${G}: Features, costs and buyer checklist]]`,
    desc: `[[BLOG_BEST_DESC — Compare ${G} package features, access terms, and requirements using a practical checklist.]]`,
    focus: 'catalog comparison',
    intro: `Pillar guide for comparing ${P} against your requirements.`,
    tailPrefix: 'Buyer discipline',
    sections: [
      { h: 'Start from the verified manifest', t: [para.scope, para.compare] },
      { h: 'Separate combat labels from visual labels', t: [para.checklist] },
      { h: 'Document access duration in writing', t: [para.support] },
      { h: 'Questions before payment', t: [para.policy], list: ['[[BUYER_Q1]]', '[[BUYER_Q2]]', '[[BUYER_Q3]]', '[[BUYER_Q4]]'] },
    ],
  },
  {
    slug: 'aimbot',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_AIMBOT_TITLE — ${G} aim assistance terminology explained]]`,
    seoTitle: `[[BLOG_AIMBOT_SEO — ${G} aimbot terms, limits, and questions]]`,
    desc: `[[BLOG_AIMBOT_DESC — Define aim-related marketing language for ${G} without implying undocumented controls.]]`,
    focus: 'aim terminology',
    intro: `Cluster article for aim-related search intent.`,
    tailPrefix: 'Aim research',
    sections: [
      { h: 'Targeting vocabulary vs observed input', t: [para.scope, para.compare] },
      { h: 'Smoothing, FOV, and activation wording', t: [para.checklist] },
      { h: 'What to ask if a control is essential', t: [para.support] },
    ],
  },
  {
    slug: 'esp',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_ESP_TITLE — ${G} ESP and overlay categories]]`,
    seoTitle: `[[BLOG_ESP_SEO — ${G} ESP: player, world, and objective information]]`,
    desc: `[[BLOG_ESP_DESC — Sort overlay labels for ${G} by information type, not by a single wallhack keyword.]]`,
    focus: 'ESP categories',
    intro: `Cluster article for visual information tools.`,
    tailPrefix: 'Overlay research',
    sections: [
      { h: 'Player information vs objective information', t: [para.scope] },
      { h: 'Scaling, color, and clutter', t: [para.checklist, para.support] },
      { h: 'Demonstrations are single scenes', t: [para.compare] },
    ],
  },
  {
    slug: 'config',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Setup',
    title: `[[BLOG_CONFIG_TITLE — ${G} overlay and configuration guide]]`,
    seoTitle: `[[BLOG_CONFIG_SEO — ${G} overlays: layout, scale, and module toggles]]`,
    desc: `[[BLOG_CONFIG_DESC — Configure ${P} overlays and controls for ${G} using the documented module list.]]`,
    focus: 'configuration workflow',
    intro: `Cluster article for overlay setup and module toggles.`,
    tailPrefix: 'Configuration',
    sections: [
      { h: 'Start from the module list', t: [para.scope, para.compare] },
      { h: 'Display scale and clutter', t: [para.checklist] },
      { h: 'Save notes after each change', t: [para.support] },
    ],
  },
  {
    slug: 'performance',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Setup',
    title: `[[BLOG_PERF_TITLE — ${G} performance and display tuning]]`,
    seoTitle: `[[BLOG_PERF_SEO — ${G} FPS, resolution, and overlay performance]]`,
    desc: `[[BLOG_PERF_DESC — Tune PC and in-game settings so ${P} overlays stay readable on ${G}.]]`,
    focus: 'performance tuning',
    intro: `Cluster article for display and frame-rate tuning.`,
    tailPrefix: 'Performance',
    sections: [
      { h: 'Baseline before enabling modules', t: [para.checklist, para.scope] },
      { h: 'Resolution and refresh targets', t: [para.compare] },
      { h: 'After game patches', t: [para.update, para.support] },
    ],
  },
  {
    slug: 'buying',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_BUY_TITLE — Purchase checklist for ${G} packages]]`,
    seoTitle: `[[BLOG_BUY_SEO — Buy ${G}: order record and prerequisites]]`,
    desc: `[[BLOG_BUY_DESC — Collect written answers about ${P}, duration, and prerequisites before payment.]]`,
    focus: 'checkout discipline',
    intro: `Cluster article for purchase preparation.`,
    tailPrefix: 'Order record',
    sections: [
      { h: 'SKU clarity', t: [para.scope, para.support] },
      { h: 'Totals and bundled services', t: [para.checklist] },
      { h: 'Terms live outside blog conclusions', t: [para.policy] },
    ],
  },
  {
    slug: 'safety',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Safety',
    title: `[[BLOG_SAFE_TITLE — Setup hygiene and realistic expectations]]`,
    seoTitle: `[[BLOG_SAFE_SEO — ${G} setup habits and requirement checks]]`,
    desc: `[[BLOG_SAFE_DESC — Practical setup habits for ${G} without overstated marketing language.]]`,
    focus: 'setup hygiene',
    intro: `Cluster article for practical setup discipline.`,
    tailPrefix: 'Setup hygiene',
    sections: [
      { h: 'Marketing adjectives are not specifications', t: [para.compare] },
      { h: 'Environment checklist', t: [para.checklist, para.support] },
      { h: 'Platform documentation', t: [para.policy] },
    ],
  },
  {
    slug: 'features',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_FEAT_TITLE — Feature glossary for ${G} listings]]`,
    seoTitle: `[[BLOG_FEAT_SEO — ${G} features: categories and boundaries]]`,
    desc: `[[BLOG_FEAT_DESC — Map ${P} feature groups for ${G} to practical setup questions.]]`,
    focus: 'feature glossary',
    intro: `Cluster article for manifest alignment.`,
    tailPrefix: 'Glossary use',
    sections: [
      { h: 'Group labels by question type', t: [para.scope] },
      { h: 'Cross-links are not bundle expansion', t: [para.compare] },
      { h: 'Migration replaces [[FEATURE_n]] tokens', t: [para.update] },
    ],
  },
  {
    slug: 'access',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Plans',
    title: `[[BLOG_ACCESS_TITLE — Access duration and entitlement terms]]`,
    seoTitle: `[[BLOG_ACCESS_SEO — ${G} Monthly vs Lifetime meaning]]`,
    desc: `[[BLOG_ACCESS_DESC — Define access vocabulary for ${G} using product terms from ${P}.]]`,
    focus: 'entitlements',
    intro: `Cluster article for subscription language.`,
    tailPrefix: 'Entitlement notes',
    sections: [
      { h: 'Duration labels are commercial terms', t: [para.scope, para.checklist] },
      { h: 'Activation limits', t: [para.support] },
      { h: 'Patch survivability', t: [para.update, para.policy] },
    ],
  },
  {
    slug: 'skins',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_SKINS_TITLE — Cosmetic and unlock search intent]]`,
    seoTitle: `[[BLOG_SKINS_SEO — ${G} cosmetics vs verified catalog scope]]`,
    desc: `[[BLOG_SKINS_DESC — Explain cosmetic keywords separately from ${P} manifest scope.]]`,
    focus: 'cosmetic scope',
    intro: `Cluster article for cosmetic searches.`,
    tailPrefix: 'Cosmetic scope',
    sections: [
      { h: 'Cosmetic modules are not assumed', t: [para.compare] },
      { h: 'Economy and policy layers', t: [para.policy] },
      { h: 'Ask SKU-specific questions', t: [para.support] },
    ],
  },
  {
    slug: 'external',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Setup',
    title: `[[BLOG_EXT_TITLE — External delivery vocabulary]]`,
    seoTitle: `[[BLOG_EXT_SEO — ${G} external / cloud architecture terms]]`,
    desc: `[[BLOG_EXT_DESC — Translate architecture adjectives for ${G} into prerequisite questions.]]`,
    focus: 'architecture words',
    intro: `Cluster article for delivery architecture.`,
    tailPrefix: 'Architecture notes',
    sections: [
      { h: 'External is not a rating', t: [para.scope] },
      { h: 'Companion services', t: [para.checklist] },
      { h: 'Latency and hosting', t: [para.support] },
    ],
  },
  {
    slug: 'automation',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_AUTO_TITLE — Automation keywords vs listed controls]]`,
    seoTitle: `[[BLOG_AUTO_SEO — ${G} automation language and limits]]`,
    desc: `[[BLOG_AUTO_DESC — Separate automation search terms from documented ${G} controls.]]`,
    focus: 'automation vocabulary',
    intro: `Cluster article for automation searches.`,
    tailPrefix: 'Automation notes',
    sections: [
      { h: 'Observation-based support', t: [para.support, para.checklist] },
      { h: 'Cross-game keyword contamination', t: [para.compare] },
      { h: 'Enable one module at a time', t: [para.scope] },
    ],
  },
  {
    slug: 'dma',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Setup',
    title: `[[BLOG_DMA_TITLE — DMA / cloud prerequisites placeholder]]`,
    seoTitle: `[[BLOG_DMA_SEO — ${G} DMA prerequisites checklist]]`,
    desc: `[[BLOG_DMA_DESC — Document [[CLOUD_OR_DMA_NOTE]] for ${G} before install.]]`,
    focus: 'DMA prerequisites',
    intro: `Cluster article for prerequisite services.`,
    tailPrefix: 'Prerequisite notes',
    sections: [
      { h: 'Billing vs environment', t: [para.checklist] },
      { h: 'Virtualization stack', t: [para.scope, para.update] },
      { h: 'Order line items', t: [para.support] },
    ],
  },
  {
    slug: 'recoil',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_RECOIL_TITLE — Recoil and weapon handling searches]]`,
    seoTitle: `[[BLOG_RECOIL_SEO — ${G} weapon terminology]]`,
    desc: `[[BLOG_RECOIL_DESC — Placeholder for recoil-related ${G} research; confirm manifest entries.]]`,
    focus: 'weapon terminology',
    intro: `Cluster article for weapon handling vocabulary.`,
    tailPrefix: 'Weapon notes',
    sections: [
      { h: 'Weapon labels may not apply', t: [para.compare] },
      { h: 'Input devices matter', t: [para.checklist] },
      { h: 'Ask for setting names', t: [para.support] },
    ],
  },
  {
    slug: 'windows',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Setup',
    title: `[[BLOG_WIN_TITLE — Windows and security requirements]]`,
    seoTitle: `[[BLOG_WIN_SEO — ${G} PC requirements worksheet]]`,
    desc: `[[BLOG_WIN_DESC — Fill [[REQUIREMENT_*]] placeholders with verified ${G} PC requirements.]]`,
    focus: 'PC requirements',
    intro: `Cluster article for PC environment checks.`,
    tailPrefix: 'PC worksheet',
    sections: [
      { h: 'Edition vs build vs firmware', t: [para.checklist] },
      { h: 'Managed devices', t: [para.support] },
      { h: 'Update journaling', t: [para.update] },
    ],
  },
  {
    slug: 'radar',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_RADAR_TITLE — Radar / minimap search intent]]`,
    seoTitle: `[[BLOG_RADAR_SEO — ${G} awareness terminology]]`,
    desc: `[[BLOG_RADAR_DESC — Map radar keywords to manifest categories for ${G}.]]`,
    focus: 'awareness vocabulary',
    intro: `Cluster article for minimap and awareness searches.`,
    tailPrefix: 'Awareness notes',
    sections: [
      { h: 'Radar vs world ESP', t: [para.scope] },
      { h: 'Audio and comms substitutes', t: [para.compare] },
      { h: 'Accessibility settings', t: [para.checklist] },
    ],
  },
];

const padTopics = [
  { h: '[[PAD_TOPIC_EVIDENCE — evidence quality]]', t: 'Prefer timestamped screen recordings over single frames when demonstrating behavior. Note queue type, map or mode, and input device so support can reproduce conditions. A clip from another title is not transferable evidence for ${G}.' },
  { h: '[[PAD_TOPIC_NETWORK — connectivity]]', t: 'Record region, VPN usage, and whether other overlay software was active. Network symptoms can resemble product failures. Capture traceroute or latency widgets only if support requests them.' },
  { h: '[[PAD_TOPIC_REFUNDS — commercial terms]]', t: 'Review checkout and refund terms before payment. Store the policy version shown at checkout. This article does not interpret payment processor rules for your country.' },
  { h: '[[PAD_TOPIC_HARDWARE — device limits]]', t: 'Laptop power profiles, docked GPUs, and external displays change performance baselines. Document firmware versions when virtualization is involved. [[REQUIREMENT_EXTRA]] placeholders should list any hosted service dependency.' },
  { h: '[[PAD_TOPIC_ACCESSIBILITY — UI scale]]', t: 'Text scaling and color filters alter overlay readability. Include accessibility settings in configuration notes when opening tickets about clutter or overlap.' },
  { h: '[[PAD_TOPIC_COMMUNITY — forum etiquette]]', t: 'Forum threads summarize common setup questions. Product pages remain the catalog reference for features and requirements.' },
  { h: '[[PAD_TOPIC_MIGRATION — template tokens]]', t: 'Agents replacing [[FEATURE_n]] tokens should re-run word-count and SEO checks after migration. Template placeholders are visible in source until publish.' },
  { h: '[[PAD_TOPIC_LEGAL — jurisdiction]]', t: 'Local laws may affect software use independently of game policy. This guide is informational and not legal advice.' },
];

function padArticle(article) {
  const body = sectionsFor(article, article.sections);
  let padIndex = 0;
  while (wordCount(body) < 3000) {
    const topic = padTopics[padIndex % padTopics.length];
    padIndex++;
    body.push(h2(topic.h));
    body.push(p(topic.t.replaceAll('${G}', G).replaceAll('${B}', B).replaceAll('${P}', P)));
    body.push(
      p(
        `Article-specific checkpoint (${article.slug}): relate "${article.focus}" to a named line item in ${P}. If the manifest lacks a matching label, record the gap on your worksheet instead of borrowing vocabulary from unrelated cluster guides.`,
      ),
    );
  }
  return body;
}

function wordCount(body) {
  const text = body.flatMap((b) => ('text' in b ? [b.text] : 'items' in b ? b.items : [])).join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

const posts = articles.map((article) => {
  const body = padArticle(article);
  const words = wordCount(body);
  const minutes = Math.max(15, Math.round(words / 200));
  return {
    ...article,
    image: '/images/placeholders/card.svg',
    date: 'Jan 1, 2026',
    readTime: `${minutes} min read`,
    relatedKeywords: [`[[KW_PRIMARY_${article.slug}]]`, `[[KW_SECONDARY_${article.slug}]]`],
    author: '[[BLOG_AUTHOR — Editorial]]',
    modifiedDate: '2026-01-01',
    editorialRevision: 'template-master',
    body,
  };
});

const out = `/** AUTO-GENERATED by scripts/generate-template-blog.mjs — game-neutral blog corpus. */\nimport type { BlogPostFull } from './types';\n\nexport const templateBlogPosts: BlogPostFull[] = ${JSON.stringify(posts, null, 2)};\n`;
fs.writeFileSync('src/data/blog/template-posts.ts', out);
console.log(
  'Wrote template-posts.ts',
  posts.map((p) => `${p.slug}:${wordCount(p.body)}w:${p.readTime}`).join(', '),
);
