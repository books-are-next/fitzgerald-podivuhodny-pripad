/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-c91877f';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./podivuhodny_pripad_benjamina_buttona_002.html","./podivuhodny_pripad_benjamina_buttona_003.html","./podivuhodny_pripad_benjamina_buttona_005.html","./podivuhodny_pripad_benjamina_buttona_006.html","./podivuhodny_pripad_benjamina_buttona_007.html","./podivuhodny_pripad_benjamina_buttona_008.html","./podivuhodny_pripad_benjamina_buttona_009.html","./podivuhodny_pripad_benjamina_buttona_010.html","./podivuhodny_pripad_benjamina_buttona_011.html","./podivuhodny_pripad_benjamina_buttona_012.html","./podivuhodny_pripad_benjamina_buttona_013.html","./podivuhodny_pripad_benjamina_buttona_014.html","./podivuhodny_pripad_benjamina_buttona_015.html","./fonts/Literata-Italic-var.woff2","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/LiterataTT-TextRegular.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/SpaceGroteskVF.woff2","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image001.jpg","./resources/image002.png","./resources/obalka.jpg","./resources/upoutavka_eknihy.jpg","./scripts/bundle.js","./style/style.min.css","./template-images/circles.png"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
