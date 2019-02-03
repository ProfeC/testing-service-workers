let VERSION_NUMBER = '-v1.4';
let CACHE_NAME = 'site-cache' + VERSION_NUMBER;
let DATA_CACHE_NAME = 'data-cache' + VERSION_NUMBER;
let PATH = '/testing-service-workers/';
// let PATH = './';
let urlsToCache = [
    PATH + 'styles/app.css',
    PATH + 'scripts/app.js',
	PATH + 'index.html',
	PATH + 'page2.html',
    PATH + 'page3.html'
];
let newWorker;

console.info('urls', urlsToCache);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
		navigator.serviceWorker.register(PATH + 'worker.js')
        .then(function(registration) {
            // Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);

			registration.addEventListener('updatefound', () => {
				newWorker = registration.installing;

				newWorker.addEventListener('statechange', () => {
					// Has network.state changed?
					console.info('New worker state', newWorker.state);
					switch (newWorker.state) {
					case 'installed':
						if (navigator.serviceWorker.controller) {
						// new update available
						showUpdateBar();
						}
						// No update available
						break;
					}
				});
			});
        })
        .catch(function(error) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', error);
        });
	});

	let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
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

self.addEventListener('message', function (event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

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

self.addEventListener('activate', function(event) {
	var cacheKeeplist = [
		CACHE_NAME,
		DATA_CACHE_NAME
	];

	event.waitUntil(
	  caches.keys().then(function(keyList) {
		return Promise.all(keyList.map(function(key) {
		  if (cacheKeeplist.indexOf(key) === -1) {
			return caches.delete(key);
		  }
		}));
	  })
	);
  });



  /*
  * REFERENCES
  * https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker
  * https://deanhume.com/displaying-a-new-version-available-progressive-web-app/
  *
  */
