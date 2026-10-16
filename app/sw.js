/* DreamOS SW v1.5.0 — app-shell precache + NetworkFirst navigations con fallback offline. */
const VERSION = "dreamos-v1.5.0";
const SHELL = ["./", "./index.html", "./offline.html", "./manifest.webmanifest",
  "./css/tokens.css", "./css/app.css", "./js/db.js", "./js/knowledge.js",
  "./js/interpret.js", "./js/stars.js", "./js/fx.js", "./js/app.js",
  "./data/knowledge_base.json", "./data/synonyms.json",
  "./assets/icons/icon.svg", "./assets/icons/maskable.svg",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png", "./assets/icons/favicon-32x32.png",
  "./assets/nebula.jpg", "./assets/cosmos.jpg", "./assets/astrolabe.jpg",
  "./assets/og-cover.jpg", "./assets/moon-crescent.jpg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) return;
  if (request.mode === "navigate") {
    e.respondWith(fetch(request).then((r) => {
      const c = r.clone(); caches.open(VERSION).then((cache) => cache.put(request, c)); return r;
    }).catch(() => caches.match("./offline.html")));
    return;
  }
  e.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((r) => {
    const c = r.clone(); caches.open(VERSION).then((cache) => cache.put(request, c)); return r;
  }).catch(() => caches.match(request))));
});
