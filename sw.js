const SURUM = 'yks-v35';

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

// Önbellekleme yok: tüm istekler doğrudan ağ üzerinden alınır.
// SW istekleri engellemez, doğrudan ağa geçer.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
