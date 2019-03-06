const VERSION_NUMBER = '1.1.1';
let CACHE_NAME = 'site-cache-' + VERSION_NUMBER;
let DATA_CACHE_NAME = 'data-cache-' + VERSION_NUMBER;
// let PATH = '/testing-service-workers/';
let PATH = '/';
let urlsToCache = [
		PATH + 'styles/app.css',
		PATH + 'scripts/app.js',
	// PATH + 'index.html',
	// PATH + 'page2.html',
		// PATH + 'page3.html'
];
let newWorker;

console.info('urls', urlsToCache);

// NOTE: Install
self.addEventListener('install', (event) => {
	console.info('Service Worker Installed.');

		// perform install steps
		event.waitUntil(
			caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log('opened cache');
				cache.addAll(urlsToCache);
			})
			.then(() => self.skipWaiting())
		);
});

// NOTE: Activate
self.addEventListener('activate', (event) => {
	console.info('Service Worker Activated.');
	var cacheKeeplist = [
		CACHE_NAME,
		DATA_CACHE_NAME
	];

	// NOTE: Remove old caches.
	event.waitUntil(
		caches.keys().then(cacheList => {
		return Promise.all(cacheList.map(name => {
			if (cacheKeeplist.indexOf(name) === -1) {
				console.info(`Removing cache: ${name}`)
			return caches.delete(name);
			}
		}));
		})
	);
	});

console.info('caches', caches);

self.addEventListener('message', function (event) {
	console.info('Message Event => ', event);

	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			console.info('Cache Response', response);
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
				console.info('Cache Info',cache);
				cache.put(event.request, responseToCache);
			});

					return response;
				}
			);
		})
	);
});

self.addEventListener('push', function(event) {
		event.waitUntil(
			self.registration.showNotification('Hello!', options)
	);
});





	/*
	* REFERENCES (in no particular order)
	* https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker
	* https://deanhume.com/displaying-a-new-version-available-progressive-web-app/
	* https://www.youtube.com/watch?v=ksXwaWHCW6k
	*
	*/
