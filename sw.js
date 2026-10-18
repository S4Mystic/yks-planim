const SURUM = 'yks-v3';
const DOSYALAR = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SURUM).then(c => c.addAll(DOSYALAR))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(isimler => 
      Promise.all(isimler.filter(i => i !== SURUM).map(i => caches.delete(i)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(kayitli => {
      return kayitli || fetch(e.request).then(cevap => {
        if (cevap && cevap.ok && new URL(e.request.url).origin === location.origin) {
          const kopya = cevap.clone();
          caches.open(SURUM).then(c => c.put(e.request, kopya));
        }
        return cevap;
      }).catch(() => kayitli);
    })
  );
});