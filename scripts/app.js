

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
		navigator.serviceWorker
			.register(PATH + 'worker.js')
			.then(registration => {
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
			.catch(error => {
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

// NOTE: Add notification area
let notificationHolder = document.createElement('section');
console.info('Notifications', notificationHolder);
document.querySelector('body').insertAdjacentElement('afterbegin', notificationHolder);
notificationHolder.setAttribute('id','notify');
notificationHolder.className = 'hide';
notificationHolder.insertAdjacentHTML('afterbegin', '<p><strong>A new version of this app is available. Click <a id="reload">here</a> to update.</strong></p>');

function showUpdateBar() {
	notificationHolder.className = 'show';
}

// NOTE: Update content area
let contentHolder = document.querySelector('#content');
contentHolder.insertAdjacentHTML('afterbegin', `<p>Added some content with JS for version ${VERSION_NUMBER}</p>`);

// NOTE: Function to get JSON data.


// The click event on the pop up notification
document.getElementById('reload').addEventListener('click', function(){
	newWorker.postMessage({ action: 'skipWaiting' });
});
