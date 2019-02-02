// document.querySelector('#content').innerHTML('<p>Some text added with js</p>');


// REFERENCE: https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sripts/index.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

let CACHE_NAME = 'site-cache-v1';
let urlsToCache = [
    'styles/index.css',
    'scripts/index.js'
];

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
