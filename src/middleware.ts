import { defineMiddleware } from 'astro:middleware';
import { resolveCheckoutPathRedirect } from './config/checkout-redirects.mjs';
import { getLocaleFromPathname } from './i18n/utils';
import { isCanonicalProductionHost, isPreviewOrPlatformHost } from './config/canonical';
import { renderPreviewRobotsTxt } from '../scripts/robots-txt.mjs';

export const onRequest = defineMiddleware(async (context, next) => {
  const destination = resolveCheckoutPathRedirect(context.url.pathname);
  if (destination) return context.redirect(destination, 302);
  const requestHost = context.request.headers.get('host') || context.url.hostname;
  const crawlerPath = context.url.pathname.replace(/\/+$/, '') || '/';
  if (isPreviewOrPlatformHost(requestHost) || (import.meta.env.DEV && !isCanonicalProductionHost(requestHost))) {
    if (crawlerPath === '/robots.txt') {
      return new Response(renderPreviewRobotsTxt(), {
        status: 200,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
    if (crawlerPath === '/llms.txt' || /^\/sitemap[^/]*\.xml$/i.test(crawlerPath)) {
      return new Response('Not found', {
        status: 404,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
  }
  const locale = getLocaleFromPathname(context.url.pathname);
  context.locals.locale = locale;
  const response = await next();
  const headers = new Headers(response.headers);
  const host = context.request.headers.get('host') || context.url.hostname;
  if (!isCanonicalProductionHost(host)) {
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});
