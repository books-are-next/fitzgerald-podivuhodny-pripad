/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-1d816d5';

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
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./podivuhodny_pripad_benjamina_buttona_001.html","./podivuhodny_pripad_benjamina_buttona_002.html","./podivuhodny_pripad_benjamina_buttona_003.html","./podivuhodny_pripad_benjamina_buttona_005.html","./podivuhodny_pripad_benjamina_buttona_006.html","./podivuhodny_pripad_benjamina_buttona_007.html","./podivuhodny_pripad_benjamina_buttona_008.html","./podivuhodny_pripad_benjamina_buttona_009.html","./podivuhodny_pripad_benjamina_buttona_010.html","./podivuhodny_pripad_benjamina_buttona_011.html","./podivuhodny_pripad_benjamina_buttona_012.html","./podivuhodny_pripad_benjamina_buttona_013.html","./podivuhodny_pripad_benjamina_buttona_014.html","./podivuhodny_pripad_benjamina_buttona_015.html","./resources.html","./resources/image001.jpg","./resources/image002.png","./resources/index.xml","./resources/obalka.jpg","./resources/upoutavka_eknihy.jpg","./style/style.min.css","./scripts/bundle.js"]));
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
