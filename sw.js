// sw.js - Vyčištěný Service Worker pro PWA (Naděje v2.0)

const CACHE_NAME = 'nadeje-v2-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './IMG_8429.png',
  './manifest.json'
];

// Instalace Service Workeru a cachování základních souborů
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivace a smazání starých verzí cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Obsluha požadavků (aby appka běžela svižně)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
