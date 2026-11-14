import { LOCALES } from './src/i18n/locales.ts';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { sitemapSerialize } from './src/config/sitemap.ts';
import { PATH_REDIRECTS } from './scripts/redirects.mjs';
import { accordionRafPlugin } from './scripts/vite-accordion-raf.mjs';

/**
 * Prefer slash-suffixed sources to match trailingSlash: 'always' + Cloudflare
 * force-trailing-slash. PATH_REDIRECTS already stores single-hop finals (both
 * slash variants as keys → same destination) so Astro never chains hops.
 */
const astroRedirects = Object.fromEntries(
  [...PATH_REDIRECTS.entries()].filter(([from]) => from.endsWith('/') || from === '/'),
);

/** Production canonical origin — preview hosts serve the same HTML but should not be indexed. */
const site = 'https://your-domain.example';

export default defineConfig({
  site,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: LOCALES.map((locale) => locale.code),
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  redirects: astroRedirects,
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !PATH_REDIRECTS.has(new URL(page).pathname) &&
        !page.includes('/404') &&
        (!page.includes('/reviews/') || new URL(page).pathname === '/reviews/') &&
        !page.includes('/go/') &&
        !page.includes('/guides/') &&
        !page.includes('/products/cheats/feature-comparison/'),
      serialize: sitemapSerialize,
    }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  vite: {
    plugins: [accordionRafPlugin(), tailwindcss()],
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    },
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      minify: 'esbuild',
      target: 'es2022',
      sourcemap: false,
      // Don't hoist route JS into <head>. Those modulepreload links were
      // competing with the LCP image on the critical path.
      modulePreload: false,
      rollupOptions: {
        treeshake: {
          moduleSideEffects: 'no-external',
        },
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('embla-carousel')) return 'vendor-embla';
            if (id.includes('@lucide') || id.includes('lucide')) return 'vendor-icons';
            return undefined;
          },
        },
      },
    },
  },
  build: {
    // Keep CSS external so post-build defer-css can preload/async-swap.
    // Above-the-fold rules live in critical.css (inlined in BaseLayout).
    inlineStylesheets: 'never',
  },
});
