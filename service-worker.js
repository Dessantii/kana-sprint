const CACHE_NAME = "kana-sprint-shell-v5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./logo-kana-sprint.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./supabase-config.js",
];
const NETWORK_FIRST_FILES = new Set([
  "",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "supabase-config.js",
]);

function getScopedPath(url) {
  const scopePath = new URL(self.registration.scope).pathname;
  return url.pathname.startsWith(scopePath) ? url.pathname.slice(scopePath.length) : null;
}

async function cacheSuccessfulResponse(request, response) {
  if (response?.status === 200 && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackRequest = request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      return cacheSuccessfulResponse(request, response);
    }
    return (await caches.match(fallbackRequest)) || response;
  } catch {
    return caches.match(fallbackRequest);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const scopedPath = getScopedPath(requestUrl);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (scopedPath === "api/runtime-config") {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, "./index.html"));
    return;
  }

  if (scopedPath !== null && NETWORK_FIRST_FILES.has(scopedPath)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
