// Minimal service worker for the Missing Children Reporting System PWA.
// Enables "Add to Home Screen" / install, and caches the app shell for fast loads.

const CACHE_NAME = "mcrs-cache-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest"];

// Install: pre-cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - Never cache API calls (always go to network so data stays fresh)
// - For navigations/static assets: try network, fall back to cache when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Bypass caching for backend API and images served by the backend
  if (url.pathname.startsWith("/api") || url.port === "8080" || url.port === "8000") {
    return; // let the browser handle it normally
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
  );
});