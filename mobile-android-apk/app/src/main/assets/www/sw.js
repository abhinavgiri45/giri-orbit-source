/**
 * ============================================================================
 * GIRI ORBIT — HIGH-CONCURRENCY PWA SERVICE WORKER (sw.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * ============================================================================
 * Auto-updating sovereign offline cache with zero-telemetry client data sovereignty.
 * Implements Network-First for code/documents with instant Stale-While-Revalidate fallback.
 */

const CACHE_NAME = 'giri-orbit-sovereign-v12.2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './privacy.html',
  './terms.html',
  './version.json',
  './manifest.json',
  './css/styles.css',
  './css/orbitDesktop.css',
  './css/fontsAndSelection.css',
  './css/hub.css',
  './css/mobile.css',
  './css/sync.css',
  './css/print.css',
  './css/social.css',
  './css/fileMenu.css',
  './js/app.js',
  './js/physics.js',
  './js/components/orbitDesktopSuite.js',
  './js/components/fontPicker.js',
  './js/components/thesaurusManager.js',
  './js/components/symbolsManager.js',
  './js/components/localFileDirectSync.js',
  './js/components/printManager.js',
  './js/components/girionixAgent.js',
  './js/modules/girionixEngine.js',
  './js/modules/driveSyncManager.js',
  './js/modules/syncManager.js',
  './js/modules/drift.js',
  './js/modules/axis.js',
  './js/modules/kinetic.js',
  './js/modules/pdfStudio.js',
  './js/data/fonts.js',
  './js/data/templates.js',
  './js/data/presentationGoCatalog.js',
  './assets/giri-corp-logo-transparent.png',
  './assets/giri-corp-logo.png',
  './assets/giri-group-symbol-dark.png',
  './assets/girionix-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Pre-cache completed with fallbacks:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for HTML documents, version manifest, and code scripts so updates are immediate
  const isCode = event.request.mode === 'navigate' ||
                 event.request.destination === 'document' ||
                 event.request.destination === 'script' ||
                 url.pathname.endsWith('.js') ||
                 url.pathname.endsWith('.css') ||
                 url.pathname.endsWith('.html') ||
                 url.pathname.endsWith('version.json') ||
                 url.pathname === '/' ||
                 url.pathname.endsWith('/');

  if (isCode) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First for media & binary assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
