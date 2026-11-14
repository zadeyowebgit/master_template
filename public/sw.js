/* PWA service worker — cache shell + static assets */
const CACHE = 'game-template-v1';
const PRECACHE = [
 '/site.webmanifest',
 '/favicon.svg',
 '/offline.html',
];

self.addEventListener('install', (event) => {
 event.waitUntil(
 caches
 .open(CACHE)
 .then((cache) => cache.addAll(PRECACHE))
 .then(() => self.skipWaiting()),
 );
});

self.addEventListener('activate', (event) => {
 event.waitUntil(
 caches
 .keys()
 .then((keys) =>
 Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
 )
 .then(() => self.clients.claim()),
 );
});

self.addEventListener('fetch', (event) => {
 const { request } = event;
 if (request.method !== 'GET') return;

 const url = new URL(request.url);
 if (url.origin !== self.location.origin) return;

 // Range / video / audio: bypass SW — browser fetches directly from the network (no respondWith).
 if (
 request.headers.has('range') ||
 url.pathname.startsWith('/videos/') ||
 request.destination === 'video' ||
 request.destination === 'audio'
 ) {
 return;
 }

 // Network-first for HTML navigations — never fall back to English `/`
 // (that made language switching look broken when offline/cache missed).
 if (request.mode === 'navigate') {
 event.respondWith(
 fetch(request)
 .then((response) => {
 if (response.ok) {
 const copy = response.clone();
 caches.open(CACHE).then((cache) => cache.put(request, copy));
 }
 return response;
 })
 .catch(async () => (await caches.match(request)) || (await caches.match('/offline.html')) || Response.error()),
 );
 return;
 }

 // Cache-first for hashed assets / images / videos / fonts
 if (
 url.pathname.startsWith('/_astro/') ||
 url.pathname.startsWith('/images/') ||
 url.pathname.startsWith('/videos/') ||
 url.pathname.startsWith('/fonts/') ||
 /\.(?:js|css|webp|png|jpg|jpeg|svg|woff2|mp4|webm)$/i.test(url.pathname)
 ) {
 event.respondWith(
 caches.match(request).then((cached) => {
 if (cached) return cached;
 return fetch(request).then((response) => {
 if (!response.ok) return response;
 const copy = response.clone();
 caches.open(CACHE).then((cache) => cache.put(request, copy));
 return response;
 });
 }),
 );
 }
});
