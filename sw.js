self.addEventListener('fetch', function(event) {
    // Toto je minimální konfigurace pro PWA
    event.respondWith(fetch(event.request));
});
