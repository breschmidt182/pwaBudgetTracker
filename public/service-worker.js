/*
  INFO: Your data needs a place to live when there is no Internet connection. That's what 
  the cache is for. There is the general cache for images and such, and a data cache for 
  data-specific stuff. I would just follow the naming conventions you see here. Note the 
  versioning on each cache name. This is important.
*/
const APP_PREFIX = 'my-site-cache-';  
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = "data-cache-" + VERSION;

/*
  INFO: We need to provide an array of all urls that our PWA should cache (or basically make 
  local copies of). In other words, we're telling the PWA to be prepared to use the service 
  worker anytime the browser tries to hit any of these routes. In a large web app there could 
  be lots of entries here.
*/
const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./css/styles.css",
  // TODO: add the two files in the js directory
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png"
];

/*
  INFO: This code, as you might imagine, fires when the user has chosen to install the web app on 
  their machine as a standalone PWA. You won't need to modify this code. Keep it exactly as-is. Notice 
  the rather cryptic syntax. Yet another reason why PWA coding is evil.
*/
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});


/*
  INFO: This is the heart of the PWA functionality. This code tells the service worker to listen for any events 
  where a call is made to our server api. Remember that fetch is a utility built into every browser that allows 
  it to make server calls. So we are listening for when fetch is being used. You can use all of this code 
  below as-is. Again, more cryptic code.

  Notice that if the route being requested (line 64) includes "/api/" we are assuming that it's an api call. 
  In other words, it's a request for data. This is the kind of thing that would fail if there's no Internet 
  connection. So, if the Internet *is* working, we tell the service worker to make a cached copy of any 
  data that comes back from that request. If the Internet *isn't* working, we tell the service worker to 
  look up that cached copy and use that instead.
*/
self.addEventListener("fetch", function(event) {
  // cache all get requests to /api routes
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

/*
  INFO: This code is triggered if the request is NOT an api request. In the case of this app, that means 
  it's a request for the home page, so we tell the service worker to grab its local copy of the home page.
*/
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );
});

/*
  INFO: More cryptic code. Basically, whenever our service worker is activated, we want to clear out
  anything it has in its cache and get a fresh new cache set up. This code looks like it was written 
  by someone with a background in Medieval Torture.
*/
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
      // add current cache name to white list
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
