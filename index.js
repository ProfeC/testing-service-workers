// document.querySelector('#content').innerHTML('<p>Some text added with js</p>');


// REFERENCE: https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('index.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
