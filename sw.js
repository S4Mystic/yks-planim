const SURUM = 'yks-v32';
// Kabuk dosyaları: önbellekten önce (hızlı ilk çizim)
const SHELL = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];
// Firebase/CDN ve API istekleri: ağ önceliği, başarısız olursa önbellek
const AGE_ORIGINS = [
  'https://www.gstatic.com',
  'https://generativelanguage.googleapis.com',
  'https://integrate.api.nvidia.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SURUM).then(c => c.addAll(SHELL))
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

function ageOrigin(url) {
  try { return AGE_ORIGINS.some(o => url.startsWith(o)); } catch { return false; }
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;

  // Kabuk dosyaları: önce önbellek, sonra ağ
  if (SHELL.some(s => url.endsWith(s))) {
    e.respondWith(
      caches.match(e.request).then(kayitli => {
        if (kayitli) return kayitli;
        return fetch(e.request).then(cevap => {
          if (cevap && cevap.ok) {
            const kopya = cevap.clone();
            caches.open(SURUM).then(c => c.put(e.request, kopya));
          }
          return cevap;
        }).catch(() => kayitli);
      })
    );
    return;
  }

  // Firebase/CDN/API: önce ağ, başarısız olursa önbellek (senkron için Kritik)
  if (ageOrigin(url)) {
    e.respondWith(
      fetch(e.request).then(cevap => {
        if (cevap && cevap.ok) {
          const kopya = cevap.clone();
          caches.open(SURUM).then(c => c.put(e.request, kopya));
        }
        return cevap;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Diğer istekler: önce önbellek, sonra ağ
  e.respondWith(
    caches.match(e.request).then(kayitli => {
      return kayitli || fetch(e.request).then(cevap => {
        if (cevap && cevap.ok) {
          const kopya = cevap.clone();
          caches.open(SURUM).then(c => c.put(e.request, kopya));
        }
        return cevap;
      }).catch(() => kayitli);
    })
  );
});
