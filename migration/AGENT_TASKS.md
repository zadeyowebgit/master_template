# AI coding agent — migration workflow

**The owner does not create or edit `migration/game.input.json`.**  
They provide game details in chat (name, domain, product links, checkout, reviews, images). You read the rules, write the JSON, research, migrate, and verify.

**Read first (every migration):** [`MASTER_INSTRUCTIONS.md`](../MASTER_INSTRUCTIONS.md) Part I + this file.

---

## What the owner provides (in chat — not in JSON)

| Required | Optional |
|----------|----------|
| Game name | Display name, site brand |
| Production domain (hostname) | Platform, rights holder, Discord |
| Product / seller URLs | Checkout URL (if separate from product links) |
| | Verified review text |
| | Image folder path or file paths, favicon/branding notes |

**Ask only** when something required is missing or ambiguous (e.g. no domain, no product link, conflicting checkout URLs). Do **not** ask the owner to copy `game.input.example.json`, edit JSON, or find/replace `[[PLACEHOLDER]]`.

---

## Phase 0 — Ingest and create `game.input.json`

1. Parse the owner message into structured fields.
2. Build `productLinks[]`: one entry per supplied URL (`slug`, `buyUrl`, `title` when known). Add more slugs after product research in Phase 1.
3. Map reviews to `reviews.mode: "owner"` and `reviews.items[]` when the owner supplied text; otherwise `placeholders`.
4. Map images to `images.copyToPublic[]` (`{ "from": "<repo-relative or absolute>", "to": "optional.webp" }`), `images.hero`, `images.mediaPathSegment`.
5. Write the file:

```bash
# PowerShell: agent writes payload.json in migration/ or pipes inline JSON
Get-Content migration/_agent-payload.json -Raw | node scripts/write-game-input.mjs --stdin

# Or merge a partial update after research (keeps existing keys):
node scripts/write-game-input.mjs --merge migration/_agent-payload.json

# Dry-run validation:
node scripts/write-game-input.mjs --dry-run --stdin < migration/_agent-payload.json
```

Schema reference: [`game.input.example.json`](./game.input.example.json).  
`game.input.json` is gitignored; you create and update it. Use `--from-example` only to reset from the template.

---

## Phase 1 — Product research

See **MASTER_INSTRUCTIONS Part I §2**.

- Open every product/seller URL; list **all** SKUs.
- Update `productLinks[]` and plan `products.ts` pages (one card + detail per product).
- Pull verified features, requirements, setup/FAQ text **only** from listings.
- **Never silently invent** missing product details — neutral copy or omit; log gaps in `unverifiedNotes`.
- Set `verifiedContent.productSources` (`slug` → seller URL) for traceability.
- **Layout:** change text in `products.ts` / manifests only; do not alter Astro layout, section order, or card grid structure.

---

## Phase 2 — Blog research and content

See **Part I — Blog SEO research & content strategy**.

- Keyword/intent map for all 16 slugs.
- Rewrite articles (≥1,500 words, ≥15 min read time).
- Deliver the final keyword report.

---

## Phase 3 — `verifiedContent` and content rewrite

1. After research, merge into `game.input.json`:

   - `verifiedContent.product` — headline, tagline, description, overview (keys match manifest tokens).
   - `verifiedContent.tokens` — map `[[TOKEN]]` → verified strings for remaining copy.
   - `verifiedContent.unverifiedNotes` — facts that still need seller confirmation.

2. Rewrite homepage, FAQs (preserve counts), forum threads + comments, feature copy, SEO strings per Part I §3.

3. Re-run:

```bash
node scripts/write-game-input.mjs --merge migration/_agent-payload.json
```

---

## Phase 4 — Placeholder resolution (migrated sites only)

Before calling a migration done, eliminate **all** raw `[[…]]` from migrated content (not from `src/game/instances/template/` — keep the master scaffold).

1. Fill `verifiedContent.tokens` and `verifiedContent.product`; run `apply-migration-tokens` via `template:generate`.
2. Editorial pass on: `src/data/**`, `src/config/**`, active `src/game/instances/<slug>/`, pages, components, blogs, FAQs, forums, products, SEO files.
3. Unverified facts → neutral copy or remove unsupported claims; **keep layout**. Log rationale in `unverifiedNotes` (no invented facts, no raw brackets left in shipped copy).

```bash
npm run migration:scan-placeholders -- --src   # optional mid-pass
```

---

## Phase 5 — Tooling and production scan

```bash
npm run template:generate
npm run legacy:scan
npm run migration:signoff    # build + template:verify + placeholder scan + 36-page layout check
```

`migration:signoff` is required before deploy on migrated sites (strict zero `[[…]]` in `dist/`).

Instance wiring only: `npm run migrate:game`  
Structural checks only: `npm run template:verify`

---

## Phase 6 — Report

- What changed
- Placeholder items resolved vs neutral fallback (and why)
- `unverifiedNotes` / missing owner facts
- Blog keyword table (Part I, Blog SEO §6)
- Product traceability table (`productSources` + any neutral/omitted fields)
- Verification results (`migration:signoff`, legacy scan, counts)

---

## Node vs AI (unchanged)

| Node (`template:generate`, etc.) | AI agent |
|----------------------------------|----------|
| Instance, domain, checkout wiring | Research seller pages |
| Neutral scaffolds (16/7/31/120) | Original blogs, FAQ/forum/home copy |
| Mechanical token replace | `verifiedContent`, `game.input.json` |
| Count / word-count verify | Product catalog completeness |

---

## Reuse on every new game

Same phases: **read rules → write JSON from owner chat → research → verifiedContent → generate/verify → report.**  
Never reuse game names, domains, or content from a previous migration.
