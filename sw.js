/**
 * Service Worker for Amazon T Levels Hub
 * Provides offline support and caching for faster loading
 */

const CACHE_NAME = 'tlevels-hub-v1';
const STATIC_ASSETS = [
  '/',
  '/Main.html',
  '/index.html',
  '/students.html',
  '/parents.html',
  '/schools.html',
  '/advisors.html',
  '/find-colleges.html',
  '/manifest.json',
  '/translations.js',
  '/fonts/OpenDyslexic-Regular.otf'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip API calls - don't cache dynamic data
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache the fetched response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // If offline, return fallback for HTML pages
        if (event.request.headers.get('Accept').includes('text/html')) {
          return caches.match('/Main.html');
        }
      });
    })
  );
});