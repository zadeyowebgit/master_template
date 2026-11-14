# Universal Game Website Migration Rules

**Permanent standard for every future game migration.** Read this entire file before starting any migration work.

When the owner supplies a new game’s details, the **AI coding agent** must follow these rules. The owner provides project information and assets only — not manual content wiring, SEO configuration, or placeholder find/replace across the repository.

**Replace** all game-specific references with the **new** project’s supplied information. **Never** copy game names, domains, product links, keywords, features, or content from an example or prior migration. Examples are references for **instruction structure** only.

Execution checklist for this repo: [`migration/AGENT_TASKS.md`](migration/AGENT_TASKS.md).  
**Part II** below maps these rules to this template’s files, generators, and commands.

---

## Part I — Universal rules (all migrations)

### 1. Owner inputs

The owner will provide:

- New game name
- Production domain
- Product listing or seller links
- Checkout/affiliate destination, if applicable
- Verified reviews, when available
- Images (folder or individual files)

The owner will **not** be asked to manually create game instances, populate content, write SEO, configure routes, edit `migration/game.input.json`, or replace `[[PLACEHOLDER]]` strings across the codebase.

**How inputs reach the repo:** the owner sends the list above in chat (or attachments/paths). The **AI coding agent** reads Part I + [`migration/AGENT_TASKS.md`](migration/AGENT_TASKS.md), asks only for genuinely missing required facts, then **creates and updates** `migration/game.input.json` with `scripts/write-game-input.mjs` (schema: `migration/game.input.example.json`).

---

### 2. Product research — extremely important

Inspect every supplied product link carefully.

- Find every available product listed by the seller.
- Create an individual product card for every product.
- Do not omit additional products or label them as “Add-on Products”.
- Include all available, **verified** product features, specifications, requirements, options, and descriptions.
- Inspect product FAQs, setup instructions, compatibility details, and other relevant seller information.
- Preserve distinctions between products and their actual features.
- **Do not silently invent** missing product details — if the seller omits a spec, use neutral wording, omit that bullet, or state that the seller should confirm; never add plausible-sounding features that are not on the listing.
- Record `verifiedContent.productSources` (slug → seller URL) for every SKU; product copy must trace to those pages.
- Change **data and copy only** on product/homepage pages — do not alter layout, grids, or component structure.
- Do not invent missing information.
- Do not add pricing information anywhere unless explicitly requested.
- Preserve the existing pricing display behavior rather than introducing new pricing content.
- Update homepage product sections and product listing/detail pages.
- Use the supplied checkout destination for applicable purchase buttons.

---

### 3. Content migration

Rewrite all game-specific content for the new game:

- Homepage copy
- H1 and headings
- Product descriptions
- All existing blogs
- FAQs
- Forum discussions, comments, and replies
- Feature sections
- Supporting SEO content

Preserve existing content **counts**, structure, word counts, and functionality.

Do **not** reduce the number of blogs, their word counts, forum discussions, comments, or FAQs.

#### Blog requirements

- Preserve exactly **16** articles.
- Every article must contain at least **1,500** useful words.
- Expand every article below 1,500 words.
- Pay special attention to articles currently under 5 minutes reading time.
- Target at least **15 minutes** reading time.
- Use natural search intent, relevant keywords, useful headings, and detailed information.
- Never add filler or repeat content to inflate word counts.

#### Forums and FAQs

- Preserve all **7** forum discussions and their existing comments/replies.
- Rewrite them for the new game.
- Research relevant questions, topics, and search intent.
- Preserve existing FAQ counts and structures (this template: 31 pool, 18 main landing, 6 homepage — see Part II).

---

### Blog SEO research & content strategy — mandatory

For every new game migration, research blog content **before** writing or rewriting articles. Node generators produce neutral scaffolds only; the agent researches and writes.

#### 1. Competitor and search research

For each of the 16 blog topics:

- Search Google for the new game’s relevant keywords; identify top-ranking sites and articles.
- Study relevant competitor blogs, guides, tutorials, product information, and FAQs.
- Identify topics, subheadings, questions, and search intents covered by successful pages.
- Research related keywords, long-tail keywords, and relevant search queries.
- Identify content gaps and opportunities to provide more useful information.
- Prioritize authoritative sources; do not copy or lightly paraphrase competitor text.

#### 2. Search intent and keyword mapping

Before writing, create a keyword and search-intent map for all 16 articles. For each article define:

- Primary keyword
- Secondary keywords
- Related semantic terms
- Long-tail search queries
- Search intent (informational, commercial investigation, transactional, navigational)
- Target audience and the question the article must answer
- Suggested title, URL slug, and meta description
- Relevant internal links (products, other blogs, FAQs, relevant pages)

Avoid targeting the same primary keyword with multiple articles unless search intents are genuinely different.

#### 3. Writing requirements

Write all 16 articles from scratch or substantially rebuild existing content for the new game.

- Use competitor research as reference, never as text to copy.
- Create original, comprehensive articles that provide additional value.
- Address the actual search intent completely.
- Naturally incorporate primary, secondary, and related keywords.
- Avoid keyword stuffing, repetitive headings, and unnatural keyword placement.
- Use descriptive H2 and H3 headings.
- Answer relevant questions directly.
- Include useful examples, comparisons, and explanations where information can be verified.
- Add relevant internal links naturally.
- Use reliable external sources for factual claims where appropriate.
- Do not invent firsthand experience, testing results, reviews, or product claims.

#### 4. Article length

- Maintain exactly 16 blogs.
- Minimum 1,500 words per article.
- Target at least 15 minutes reading time.
- Expand articles below 1,500 words.
- Never use filler or repeated paragraphs to reach word count.
- Reading time must reflect actual article content.

#### 5. Content SEO

Optimize every article individually:

- Unique SEO title and meta description
- One clear H1
- Logical H2/H3 hierarchy
- Search-intent-aligned introduction
- Primary keyword used naturally in title, introduction, and relevant headings
- Related keywords distributed naturally
- Descriptive image alt text
- Relevant internal links and contextual anchor text
- Appropriate canonical URL
- Article structured data only where eligible and accurate
- Relevant FAQ content only when it genuinely helps readers
- Avoid duplicate content and keyword cannibalization

#### 6. Final blog quality review

Before completing the migration, verify all 16 articles:

- Each satisfies its intended search intent
- Each contains at least 1,500 useful words
- Each targets a distinct, appropriate keyword cluster
- No unnatural keyword stuffing
- No copied or lightly rewritten competitor passages
- No invented features, statistics, or claims
- No duplicate titles, descriptions, or competing article topics
- Internal links work
- Metadata and canonical URLs are correct

Provide a short final report: each article’s primary keyword, search intent, word count, and competitor research sources.

**Important:** The objective is original, useful content that can compete in search — not imitation or guaranteed rankings. Never claim the site will rank first or that ranking is guaranteed.

---

### 4. Reviews and support

- Do not modify the reviews page until the owner supplies **verified** reviews.
- Never invent reviews, ratings, testimonials, or customer experiences.
- Do not modify the support page unless explicitly requested.
- Preserve existing support functionality and links.

---

### 5. Homepage and UI preservation

- Do not redesign the website.
- Do not change existing UI, styling, layout, components, spacing, or responsive behavior.
- Do not reduce homepage content or section counts.
- Rewrite game-specific wording while preserving the original content structure.
- Preserve existing H1 structure and metadata descriptions unless the owner explicitly requests a change.
- Never remove existing reusable placeholders from the template architecture; resolve them when facts are verified.
- Only add sections when specifically required or necessary for the product listing.

---

### 6. Images and media

- The owner may provide images in a folder or as individual files.
- Inspect supplied assets and identify their intended use.
- Replace old-game images with relevant new-game images or placeholders.
- Remove obsolete game-specific media.
- Use different images for different products and blog articles; avoid reusing the same image unnecessarily.
- Do not compress, resize destructively, or reduce original image quality.
- Preserve original resolution and quality where possible.
- Organize images into appropriate asset folders.
- Use the supplied favicon for favicon, navbar logo, footer logo, and forum logo where applicable.
- Apply the requested subtle purple tint to relevant branding assets when specified.
- Do not add video functionality or video placeholders. This project uses **images only**.

---

### 7. SEO requirements

Perform complete content SEO, on-page SEO, and technical SEO.

- Research relevant keywords and search intent for the new game.
- Use keywords naturally in headings, titles, descriptions, and content.
- Use relevant keyword combinations in page slugs, generally targeting two relevant terms where natural (fixed blog/forum slugs in this template stay unless a deliberate SEO project changes them).
- Do not force awkward or repetitive keyword usage.
- Configure unique title tags and meta descriptions.
- Configure canonical URLs, structured data, internal links, and breadcrumbs.
- Update sitemap, robots.txt, redirects, and domain configuration.
- Remove old-game keywords, metadata, and references.
- Do not invent ranking positions or claim that a keyword is high-ranking without evidence.

#### Domain and indexing rules

The supplied production domain must be the only indexable host.

- Production canonicals must point to the supplied domain.
- Preview hosts, development hosts, Cloudflare Pages hosts, and workers.dev hosts must **not** be indexable.
- Configure appropriate noindex behavior for non-production hosts.
- Ensure production sitemap URLs use the production domain.
- Ensure robots.txt and sitemap work correctly after the production domain is attached.
- Do not accidentally block production indexing.
- Do not add temporary indexing exceptions or weaken production indexing rules to improve Lighthouse results.

---

### 8. Performance and quality

- Aim for Lighthouse scores of **100** on mobile and desktop where realistically achievable.
- Do not compromise original image quality just to improve scores.
- Fix broken links, 404 errors, missing images, incorrect redirects, and broken internal navigation.
- Verify the site locally before sign-off.

---

### 9. Research and accuracy

- Inspect supplied seller/product links directly.
- Research relevant game information and competitor content where useful.
- Use verified facts and reliable sources.
- Do not invent product features, specifications, compatibility, detection claims, guarantees, reviews, or statistics.
- Clearly distinguish verified information from information that requires seller confirmation.
- Document facts that could not be verified in `verifiedContent.unverifiedNotes` — **do not** ship them as raw `[[…]]` on a migrated site (use neutral wording instead; see below).

#### Placeholder resolution — mandatory after every migration

| Context | Rule |
|---------|------|
| **Master template** (no active migration / no `game.input.json`) | Reusable `[[…]]` tokens in source **must be preserved** for the next game. |
| **Migrated website** | All placeholders **must be resolved** before deployment. No raw `[[PLACEHOLDER]]` in production `dist/`. |

After migrating a game, the agent must:

1. Resolve and replace game-specific placeholders using verified data (`verifiedContent`, `apply-migration-tokens.mjs`, and editorial updates).
2. Cover **all surfaces**: pages, components, metadata, 16 blogs, FAQs, forums, product cards, and SEO config files (excluding the untouched `instances/template/` scaffold).
3. If information cannot be verified, **do not invent it** — use neutral, honest wording or remove unsupported claims while **keeping section layout and UI**.
4. Run `npm run template:generate` (token apply), finish content passes, then `npx astro build`.
5. Run `npm run migration:scan-placeholders` (source + `dist/` scan). The build **fails this check** if any `[[…]]` remain for a migrated project.
6. Report any items that required neutral fallback or removal, with reasons (seller did not list, conflicting sources, owner input missing).

Runtime copy uses `finalizeDisplayCopy` when `game.input.json` exists; remaining brackets in static data must still be eliminated in source so HTML output is clean.

---

### 10. Repository and change restrictions

- Do not repeatedly scan the entire repository without cause.
- Do not rewrite unrelated files.
- Do not run expensive tests after every small change; batch work, then verify.
- Do not modify unrelated functionality.
- Do not redesign the frontend.
- Do not add pricing information unless explicitly requested.
- Do not introduce unnecessary sections or features.
- Do not retain previous-game content, assets, metadata, routes, or references.

---

### 11. Future migration workflow

Whenever the owner supplies a new game’s information:

1. Read this entire `MASTER_INSTRUCTIONS.md` and [`migration/AGENT_TASKS.md`](migration/AGENT_TASKS.md).
2. Parse owner-provided name, domain, product/checkout links, reviews, and images; ask only for missing required fields.
3. Create or update `migration/game.input.json` (agent — not the owner).
4. Inspect all supplied products and available information.
5. Inspect supplied images and branding assets.
6. Research seller listings; populate `verifiedContent` and extend `productLinks` for every SKU.
7. Research blogs (Blog SEO section) and write game-specific content.
8. Populate all products, blogs, FAQs, forums, and SEO; complete placeholder resolution (§9).
9. Run `npm run template:generate`, then `npm run legacy:scan` and `npx astro build`.
10. Run `npm run migration:scan-placeholders`; fix any remaining `[[…]]` before deploy.
11. Preserve reviews/support unless verified reviews or explicit instructions are supplied.
12. Report completed changes, placeholder fallbacks, `unverifiedNotes`, and verification results (including the blog keyword report).

**Node vs AI:** `npm run template:generate` handles configuration, structural regeneration, mechanical token replacement, and structural verification. It does **not** research games or write verified original content. See Part II and [`migration/AGENT_TASKS.md`](migration/AGENT_TASKS.md).

---

## Part II — This master template repository

### Role of this repository

- **English only** — no secondary-language sites from Repo B.
- **UI frozen** — same design, layout, section counts, and component behavior as the original storefront.
- **Content replaceable** — blogs, forum, FAQs, reviews, products, SEO, and images per owner-verified inputs.
- Active game config: `src/game/instances/<game>/` via `src/game/index.ts` (default instance: `template`).

### Content architecture

| Layer | Location |
|-------|----------|
| Game instance | `src/game/instances/<game>/index.ts`, `manifest.ts`, `marketing.ts` |
| Placeholders | `src/game/placeholders.ts` |
| Runtime URLs | `src/game/runtime-defaults.ts`, `scripts/template-site.mjs` |
| Content surface | `src/game/content.ts` |
| Generated data | `src/data/blog/template-posts.ts`, `forum.generated.ts`, `purchaseFaqs.ts`, `reviews.ts`, etc. |

### Fixed content structure (do not change counts without updating generators)

| Asset | Count | Notes |
|-------|-------|--------|
| Blogs | **16** | Slugs: `best-cheats`, `aimbot`, `esp`, `anticheat`, `bans`, `buying`, `safety`, `features`, `access`, `skins`, `external`, `automation`, `dma`, `recoil`, `windows`, `radar` |
| Forum | **7** | Slugs: `overlay-questions`, `fov-questions`, `aimbot-delay`, `launch-errors`, `stream-proof`, `hardware-change`, `requirements-check` |
| FAQs | **31** pool, **18** main (`MAIN_FAQ_IDS`), **6** home (`HOME_FAQ_IDS`) | `src/data/purchaseFaqs.ts` |
| Reviews | **120** | Placeholders until owner reviews; `reviews.mode: "owner"` when supplied |

**Verify counts and blog word minimum:** `npm run template:verify`

### Products (implementation)

- Hub: `src/pages/products/cheats/index.astro` — `ProductHubCards`, `ProductHubDetails`
- Detail: `src/pages/products/cheats/[slug].astro` — `src/data/products.ts`, `gameCatalog.ts`, instance `manifest.ts`
- One `ProductPage` per SKU; images under `/images/<mediaPathSegment>/`

### UI, routes, and behavior (reference)

| Item | Detail |
|------|--------|
| Routes | Products: `/products/cheats/`; blog: `/blog/{slug}/`; forum: `/forum/{slug}/` |
| Behavior | FAQ filters, forum votes, blog TOC/sidebar, `/go/checkout/` flow unchanged |

### SEO files (implementation)

| File | Generator |
|------|-----------|
| `src/config/pageSeo.ts` | `generate-template-page-seo.mjs` |
| `src/config/keywords.ts` | `generate-template-keywords.mjs` |
| `src/config/auditSeo.ts` | `generate-template-audit-seo.mjs` |
| Canonical / middleware | `game` instance, `astro.config.mjs`, `functions/_middleware.js`, `finalize-sitemap.mjs` |

### Owner JSON (`migration/game.input.json`) — agent-maintained

Owners do **not** edit this file. The agent writes it via:

```bash
node scripts/write-game-input.mjs --stdin    # or --merge partial.json
npm run migration:write-input                # alias (--stdin)
```

| Owner chat → JSON field | Required |
|-------------------------|----------|
| Game name → `gameName`, `gameNameDisplay` | Yes |
| Domain → `domain` (hostname only) | Yes |
| Product URLs → `productLinks[]` (`slug`, `buyUrl`, `title`) | Yes (≥1) |
| Checkout → `checkoutUrl` (defaults to first product `buyUrl`) | Yes |
| Reviews → `reviews.mode`, `reviews.items[]` | If supplied |
| Images → `images.copyToPublic[]`, `images.hero` | If supplied |
| After research → `verifiedContent` | Agent |

Optional: `siteBrand`, `platformName`, `rightsHolder`, `discordUrl`, `instanceId`, `images.mediaPathSegment`.

### Commands

```bash
npm run template:generate   # preflight; optional migrate; generators; token apply; verify
npm run migrate:game          # instance + domain/checkout only
npm run template:verify       # structural checks
npm run legacy:scan           # retired-game string scan
npx astro build               # local build check
```

**What `template:generate` does (Node only)**

1. Requires this file to exist.
2. If `game.input.json` exists: `migrate-game.mjs` (instance, domain, checkout URLs, owner reviews, images).
3. Regenerates blog, forum, FAQ, reviews placeholders, page SEO, keywords, audit SEO, blog meta.
4. `apply-migration-tokens.mjs` — mechanical `[[token]]` replacement from JSON.
5. `verify-template-content.mjs` — counts and blog ≥1,500 words.

After agent work:

```bash
npm run template:verify
node scripts/sync-public-redirects.mjs
npx astro build
npm run legacy:scan
```

**Migrated builds:** zero raw `[[…]]` in `dist/` (enforced by `migration:scan-placeholders`).  
**Master template:** placeholders remain in source (especially `instances/template/`) until a migration runs.

---

## Final verification checklist

- [ ] `npx astro build` — **36** static pages (16 blog + 7 forum + core routes)
- [ ] `npm run legacy:scan` clean on `src/`, `public/`, `functions/`, `scripts/`
- [ ] 16 blogs ≥1,500 words; 7 forum threads; FAQ counts; 120 reviews; all product slugs resolve
- [ ] Production canonicals; robots/sitemap on production domain; no stale old-game hosts in redirects
- [ ] Features/requirements traceable to seller; no fabricated reviews/schema; checkout URLs correct
- [ ] Blog keyword report delivered (Part I, Blog SEO §6)
- [ ] `npm run migration:signoff` passes (build + scan; **38** HTML files in `dist/` = 36 routes + `404.html` + `offline.html` — layout preserved)
- [ ] `verifiedContent.productSources` documents every product slug; no invented specs

---

## Appendix A — Key files map

| Area | Paths |
|------|--------|
| Game config | `src/game/index.ts`, `instances/<game>/*`, `placeholders.ts`, `runtime-defaults.ts` |
| Blog | `scripts/generate-template-blog.mjs`, `src/data/blog/template-posts.ts`, `posts.ts` |
| Forum | `scripts/generate-template-forum.mjs`, `src/data/forum.generated.ts`, `forum.ts` |
| FAQ | `scripts/generate-template-faq.mjs`, `src/data/purchaseFaqs.ts` |
| Reviews | `scripts/generate-template-reviews.mjs`, `src/data/reviews.ts` |
| SEO | `generate-template-page-seo.mjs`, `keywords.mjs`, `audit-seo.mjs` |
| Products | `src/data/products.ts`, `gameCatalog.ts` |
| Deploy | `wrangler.toml`, `functions/_middleware.js`, `public/_redirects` |

## Appendix B — Placeholder tokens (non-exhaustive)

`[[GAME_NAME]]`, `[[GAME_NAME_DISPLAY]]`, `[[SITE_BRAND]]`, `[[CANONICAL_DOMAIN]]`, `[[PRODUCT_NAME]]`, `[[CHECKOUT_URL]]`, `[[RIGHTS_HOLDER]]`, `[[PLATFORM_NAME]]`

## Appendix C — Migration tooling

| Path | Role |
|------|------|
| `migration/game.input.example.json` | JSON schema reference |
| `migration/AGENT_TASKS.md` | Agent workflow (owner chat → JSON → migrate) |
| `scripts/write-game-input.mjs` | Create/update `game.input.json` (`npm run migration:write-input`) |
| `scripts/migrate-game.mjs` | Instance, domain, checkout, reviews, images |
| `scripts/generate-all-template-content.mjs` | `npm run template:generate` |
| `scripts/apply-migration-tokens.mjs` | Token replacement from JSON |
| `scripts/verify-template-content.mjs` | `npm run template:verify` |
| `scripts/scan-unresolved-placeholders.mjs` | `npm run migration:scan-placeholders` |
| `scripts/migration-signoff.mjs` | `npm run migration:signoff` (build + verify + scan + layout check) |
| `scripts/legacy-brand-scan.mjs` | `npm run legacy:scan` |
| `scripts/lib/migration-preflight.mjs` | Requires this file before generate/migrate |

---

*Permanent universal rules (Part I) apply to every game migration. Update Part II when this repository’s architecture or tooling changes.*
