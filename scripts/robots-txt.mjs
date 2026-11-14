import { DEFAULT_SITE_URL } from './site-url.mjs';

export const SITEMAP_FILES = [
  'sitemap.xml',
  'sitemap-index.xml',
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-blog.xml',
  'sitemap-forum.xml',
];

export function renderRobotsTxt(origin = DEFAULT_SITE_URL) {
  const site = origin.replace(/\/$/, '');
  const allowSitemaps = SITEMAP_FILES.map((file) => `Allow: /${file}`).join('\n');
  const sitemapLines = [
    'sitemap.xml',
    'sitemap-pages.xml',
    'sitemap-products.xml',
    'sitemap-blog.xml',
    'sitemap-forum.xml',
  ]
    .map((file) => `Sitemap: ${site}/${file}`)
    .join('\n');

  return `# Indexable origin only: ${site}
# Pages, Workers, tunnels, and local/dev hosts must Disallow: / and must not be indexed.

User-agent: *
Allow: /
Allow: /robots.txt
Allow: /llms.txt
${allowSitemaps}

Disallow: /go/

# AI crawlers: allow citation of product facts; confirm details with the seller.
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

${sitemapLines}

# Optional machine summary: ${site}/llms.txt
# RSS: ${site}/rss.xml
`;
}

/** Served on Pages, Workers, localhost, and any host that is not the production domain. */
export function renderPreviewRobotsTxt() {
  const site = DEFAULT_SITE_URL;
  return `User-agent: *
Disallow: /

# This host is not indexable. Crawl and index only ${site}/
`;
}
