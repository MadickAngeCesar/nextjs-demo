/**
 * Service Worker for Next.js app
 *
 * - Precaches a small set of public assets.
 * - Provides runtime caching strategies:
 *   - Network-first for navigation requests (app shell) to get fresh HTML/SSR responses.
 *   - Cache-first for static assets under /_next/ and common media types.
 * - Supports skipWaiting via postMessage.
 *
 * Place this file at /public/sw.js and register it from the client.
 */

/** Versioned cache names */
const CACHE_VERSION = "v1";
const PRECACHE = `nextjs-demo-precache-${CACHE_VERSION}`;
const RUNTIME = `nextjs-demo-runtime-${CACHE_VERSION}`;

/** URLs to precache. Update as you add public assets. */
const PRECACHE_URLS = [
  "/",
  "/favicon.ico",
  "/manifest.json",
  "/robots.txt",
  // Add other public assets you want available offline initially
];

/**
 * Limits the number of entries in a cache by deleting the oldest entries.
 * @param {string} cacheName - Name of the cache to trim.
 * @param {number} maxEntries - Maximum number of entries to keep.
 * @returns {Promise<void>}
 */
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await cache.delete(keys[0]);
  return limitCacheSize(cacheName, maxEntries);
}

/**
 * Determines if a request is for a navigation (document) page.
 * @param {Request} request
 * @returns {boolean}
 */
function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept") &&
      request.headers.get("accept").includes("text/html"))
  );
}

/**
 * Determines if a request is for static assets that benefit from cache-first strategy.
 * @param {URL} url
 * @returns {boolean}
 */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|ico|json)$/.test(url.pathname)
  );
}

/* Install: Precache essential assets */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

/* Activate: Clean up old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== PRECACHE && name !== RUNTIME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

/* Fetch: Apply runtime caching strategies */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests (do not proxy cross-origin by default)
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first (try fresh SSR/html)
  if (isNavigationRequest(request)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // Put a copy in runtime cache for offline fallback
          const cache = await caches.open(RUNTIME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (err) {
          console.warn("Fetch failed; returning cached page instead.", err);
          const cached = await caches.match(request);
          if (cached) return cached;
          // Fallback to cached root if available
          const fallback = await caches.match("/");
          return (
            fallback ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          );
        }
      })(),
    );
    return;
  }

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (
              !response ||
              response.status !== 200 ||
              response.type === "opaque"
            ) {
              return response;
            }
            return caches.open(RUNTIME).then((cache) => {
              cache.put(request, response.clone());
              // Keep runtime cache to a reasonable size
              limitCacheSize(RUNTIME, 100).catch(() => {});
              return response;
            });
          })
          .catch(() => {
            // Optionally serve fallback images/icons here if desired
            return caches.match("/favicon.ico");
          });
      }),
    );
    return;
  }

  // Default: try network, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Put successful GET responses into runtime cache
        if (request.method === "GET" && response && response.status === 200) {
          const clone = response.clone();
          caches.open(RUNTIME).then((cache) => {
            cache.put(request, clone);
            limitCacheSize(RUNTIME, 100).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});

/* Message handler: support skipWaiting from the page to activate new SW immediately */
self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
