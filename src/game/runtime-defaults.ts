/**
 * Valid hosts and URLs for builds (schema.org, canonical, mailto).
 * Updated by scripts/migrate-game.mjs — keep in sync with scripts/template-site.mjs
 */
export const TEMPLATE_RUNTIME = {
  canonicalDomain: "your-domain.example",
  checkoutUrl: "https://checkout.example/your-game",
  discordUrl: "https://discord.gg/template-placeholder",
} as const;
