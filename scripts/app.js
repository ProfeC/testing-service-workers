let CACHE_NAME = 'site-cache';
let DATA_CACHE_NAME = 'data-cache';
let PATH = '/testing-service-workers/';
let urlsToCache = [
    PATH + 'styles/app.css',
    PATH + 'scripts/app.js'
];

// console.info('urls', urlsToCache);

// REFERENCE: https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register(PATH + 'scripts/app.js')
        .then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', error);
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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
