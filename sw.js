// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

const CORE_URLS = [
    './index.html',
    './assets/scripts/main.js',
    './assets/scripts/Router.js',
]


// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
    /**
     * TODO - Part 2 Step 2
     * Create a function as outlined above
     */

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(() => {
                console.log("Opened Cache");
                return caches.addAll(CORE_URLS);
            })
    )
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
    /**
     * TODO - Part 2 Step 3
     * Create a function as outlined above, it should be one line
     */

    event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
    /**
     * TODO - Part 2 Step 4
     * Create a function as outlined above
     */

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    if (!response || response.status != 200 || response.type != "basic")
                        return response;

                    var respToCache = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, respToCache)
                    });

                    return response
                })
            })
    )
});