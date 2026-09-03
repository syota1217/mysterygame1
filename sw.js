const CACHE_NAME = "jikenbo-cache-v16";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon.ico",
  "./ep1.jpg",
  "./ep2.jpg",
  "./ep3.jpg",
  "./ep4.jpg",
  "./ep5.jpg",
  "./ep6.jpg",
  "./ep7.jpg",
  "./ep8.jpg",
  "./ep9.jpg",
  "./ep10.jpg",
  "./ep11.jpg",
  "./ep12.jpg",
  "./ep13.jpg",
  "./g1.jpg",
  "./g2.jpg",
  "./g3.jpg",
  "./ntt1.jpg",
  "./ntt2.jpg",
  "./ntt3.jpg",
  "./ntt4.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests for our own origin's app shell; let
  // cross-origin requests (e.g. Google Fonts) pass straight through.
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache same-origin successful responses for next time.
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
