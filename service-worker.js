/* ===============================
   TourGuide Pro – Service Worker
   =============================== */
const CACHE   = "tourguide-pro-v1";
const ASSETS  = [
  "/",               // your root
  "/index.html",
  "/styles.css",
  "/app.js"
  // add icons / images / fonts if needed
];

/* -----  INSTALL  ----- */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* -----  ACTIVATE (cleanup old)  ----- */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* -----  FETCH  ----- */
self.addEventListener("fetch", e => {
  // Network-first for API calls, cache-first for static assets
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then(cacheRes =>
        cacheRes || fetch(e.request).then(netRes => {
          // Save new copies of GET requests to cache
          if (e.request.method === "GET" && netRes.status === 200) {
            const clone = netRes.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return netRes;
        }).catch(() => caches.match("/index.html")) // fallback offline
      )
    );
  }
});
