const SURUM = 'yks-v37';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(isimler =>
      Promise.all(isimler.map(i => caches.delete(i)))
    ).then(() => self.clients.claim())
  );
});

// SW hiçbir istekleri yakalamaz, engellemez.
// Tüm istekler doğrudan ağ üzerinden alınır.
self.addEventListener('fetch', () => {});
