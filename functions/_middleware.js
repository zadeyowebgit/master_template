/** Keep in sync with scripts/template-site.mjs — TEMPLATE_CANONICAL_DOMAIN */
const CANONICAL_HOST = "your-domain.example";
const WWW_HOST = `www.${CANONICAL_HOST}`;
const PREVIEW_ROBOTS = `User-agent: *
Disallow: /

# This host is not indexable. Crawl and index only https://${CANONICAL_HOST}/
`;

function hostnameOnly(raw) {
  return String(raw || '')
    .split(',')[0]
    .trim()
    .split(':')[0]
    .toLowerCase()
    .replace(/\.$/, '');
}

function crawlerKind(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/robots.txt') return 'robots';
  if (p === '/llms.txt' || /^\/sitemap[^/]*\.xml$/i.test(p)) return 'sitemap';
  return null;
}

function publicHost(request) {
  return hostnameOnly(request.headers.get('host')) || hostnameOnly(new URL(request.url).hostname);
}

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const host = publicHost(context.request);

    if (host === WWW_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const isCanonical = host === CANONICAL_HOST;
    const kind = crawlerKind(url.pathname);

    if (!isCanonical && kind === 'robots') {
      return new Response(PREVIEW_ROBOTS, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const response = await context.next();
    if (!isCanonical) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(response.body, { status: response.status, headers });
    }
    return response;
  } catch (error) {
    return new Response(`Middleware error: ${error?.message ?? error}`, { status: 500 });
  }
}
