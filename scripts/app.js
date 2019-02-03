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

// The click event on the pop up notification
document.getElementById('reload').addEventListener('click', function(){
	newWorker.postMessage({ action: 'skipWaiting' });
});

let contentHolder = document.querySelector('#content');
contentHolder.insertAdjacentHTML('afterbegin', '<p>Added some content with JS.</p>');

// NOTE: Function to get JSON data.
