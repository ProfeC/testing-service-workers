let CACHE_NAME = 'site-cache-v1';
let urlsToCache = [
    '/testing-service-workers/styles/index.css',
    '/testing-service-workers/scripts/index.js'
];

console.info('urls', urlsToCache);

// REFERENCE: https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/testing-service-workers/scripts/index.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

self.addEventListener('install', function(event) {
    // perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

console.info('caches', caches);

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
*/
