const SURUM = 'yks-v34';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(isimler =>
      Promise.all(isimler.map(i => caches.delete(i)))
    ).then(() => self.clients.claim())
  );
});

// Önbellekleme yok: tüm istekler doğrudan ağ üzerinden alınır,
// böylece uygulama her zaman güncel index.html'i gösterir.
self.addEventListener('fetch', () => {});
