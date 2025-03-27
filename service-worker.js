self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('nonlivetv-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/style.css',
                '/app.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request).then(response => response || caches.match('/offline.html')))
    );
});