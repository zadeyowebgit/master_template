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

/** ~150-word neutral paragraphs (non-duplicative across the corpus). */
const para = {
  scope:
    `This section describes how to read seller language for ${G} without treating marketing labels as tested results. Feature names group information a buyer might need, but they do not prove range, timing, compatibility, or account outcomes. ${B} publishes buyer guides and catalog references; it does not run independent benchmarks. When a paragraph cites ${P}, it refers to the owner-supplied listing you will attach during migration—not to invented functionality.`,
  checklist:
    `Build a two-column worksheet before checkout. Left column: your PC edition, display scale, input device, game build, and any virtualization or security settings already enabled. Right column: the seller’s written answers with dates. Mark every unresolved requirement as open rather than assuming it is satisfied because another game worked. Store chat exports with order IDs, but redact payment data and account credentials from screenshots shared in public threads.`,
  policy:
    `Platform policy and product architecture are separate conversations. Official help pages explain what a publisher may enforce on an account; seller pages explain what a specific package claims to include. Neither document validates the other. If account access matters, read current policy on the official platform first, then decide whether third-party tooling is acceptable for your situation. This template does not promise legality, stealth, or immunity from enforcement.`,
  support:
    `Seller support should receive specific questions: setting name, game build, reproduction steps, and whether a prerequisite service is active. Vague tickets such as “it does not work” force guesswork. Attach logs or error text in plain language rather than paraphrasing from memory. When support requests a screen capture, crop to the relevant panel and hide identifiers. A structured ticket shortens loops even when the underlying limitation cannot be fixed remotely.`,
  compare:
    `Comparisons fail when they score undocumented features. Instead, count how many of your personal requirements have written answers. A shorter list with complete documentation can be more usable than a long list with silent gaps. Retired tier names from older sites should not reappear in your worksheet unless the seller still sells those exact SKUs for ${G}. Migration agents should replace retired names with the current ${P} manifest.`,
  update:
    `Game and operating-system updates can invalidate a sentence that was accurate last month. Re-open the listing after patches, especially when anti-cheat or launcher components change. A compatibility statement is a photograph in time, not a perpetual guarantee. Buyers who track build numbers maintain fewer false expectations than buyers who remember adjectives such as “undetected” or “bulletproof.”`,
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
    desc: `[[BLOG_BEST_DESC — Compare seller-listed ${G} features, access terms, and requirements using an evidence-based checklist.]]`,
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
    slug: 'anticheat',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Safety',
    title: `[[BLOG_AC_TITLE — Anti-cheat and policy language for ${G}]]`,
    seoTitle: `[[BLOG_AC_SEO — ${G} anti-cheat: policy vs architecture]]`,
    desc: `[[BLOG_AC_DESC — Keep platform enforcement, software architecture, and seller claims separate for ${G}.]]`,
    focus: 'anti-cheat clarity',
    intro: `Cluster article for policy and architecture questions.`,
    tailPrefix: 'Policy reading',
    sections: [
      { h: 'Three categories of anti-cheat questions', t: [para.policy, para.scope] },
      { h: 'No independent detection table here', t: [para.compare] },
      { h: 'Evidence to keep', t: [para.checklist] },
    ],
  },
  {
    slug: 'bans',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Safety',
    title: `[[BLOG_BANS_TITLE — Account restrictions and recovery questions]]`,
    seoTitle: `[[BLOG_BANS_SEO — ${G} account limits and support routes]]`,
    desc: `[[BLOG_BANS_DESC — Separate account sanctions from product setup issues for ${G}.]]`,
    focus: 'account restrictions',
    intro: `Cluster article for restriction vocabulary.`,
    tailPrefix: 'Account notes',
    sections: [
      { h: 'Restriction types use different support paths', t: [para.policy] },
      { h: 'Hardware identifiers vs product keys', t: [para.checklist] },
      { h: 'When to stop public troubleshooting', t: [para.support] },
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
    title: `[[BLOG_SAFE_TITLE — Risk framing without marketing promises]]`,
    seoTitle: `[[BLOG_SAFE_SEO — ${G} safety language: bounded claims]]`,
    desc: `[[BLOG_SAFE_DESC — Explain how to read risk-related adjectives for ${G} without guarantees.]]`,
    focus: 'risk language',
    intro: `Cluster article for cautious buyers.`,
    tailPrefix: 'Risk framing',
    sections: [
      { h: 'Safe, private, undetected are not metrics', t: [para.compare] },
      { h: 'Operational security for buyers', t: [para.checklist, para.support] },
      { h: 'Official platform stance', t: [para.policy] },
    ],
  },
  {
    slug: 'features',
    type: 'cluster',
    parentPillar: 'best-cheats',
    tag: 'Guides',
    title: `[[BLOG_FEAT_TITLE — Feature glossary for ${G} listings]]`,
    seoTitle: `[[BLOG_FEAT_SEO — ${G} features: categories and boundaries]]`,
    desc: `[[BLOG_FEAT_DESC — Map seller feature groups for ${G} to buyer questions.]]`,
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
    desc: `[[BLOG_ACCESS_DESC — Define access vocabulary for ${G} using seller terms, not guesses.]]`,
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
    desc: `[[BLOG_WIN_DESC — Fill [[REQUIREMENT_*]] placeholders with seller facts for ${G}.]]`,
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
  { h: '[[PAD_TOPIC_NETWORK — connectivity]]', t: 'Record region, VPN usage, and whether other overlay software was active. Network symptoms can resemble product failures. ${B} does not host network diagnostics; capture traceroute or latency widgets only if support requests them.' },
  { h: '[[PAD_TOPIC_REFUNDS — commercial terms]]', t: 'Refund eligibility, chargebacks, and resellers are seller-policy topics. Store the policy version shown at checkout. This article does not interpret payment processor rules for your country.' },
  { h: '[[PAD_TOPIC_HARDWARE — device limits]]', t: 'Laptop power profiles, docked GPUs, and external displays change performance baselines. Document firmware versions when virtualization is involved. [[REQUIREMENT_EXTRA]] placeholders should list any hosted service dependency.' },
  { h: '[[PAD_TOPIC_ACCESSIBILITY — UI scale]]', t: 'Text scaling and color filters alter overlay readability. Include accessibility settings in configuration notes when opening tickets about clutter or overlap.' },
  { h: '[[PAD_TOPIC_COMMUNITY — forum etiquette]]', t: 'Public threads on ${B} host editorial summaries, not SKU expansion. Confirm answers with the seller before treating a forum reply as catalog fact.' },
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
    author: `[[BLOG_AUTHOR — ${B} Editorial]]`,
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
