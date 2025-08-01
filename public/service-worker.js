// service-worker.js
// 1. Import Workbox and the 'offlineFallback' recipe
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
const { offlineFallback } = workbox.recipes;

// 2. Define caching strategies for your app's assets (images, fonts, etc.)
// This part caches things that are not your main page.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new workbox.strategies.CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      })
    ]
  })
);

// 3. Apply the offline fallback recipe for your main pages.
// THIS IS THE KEY PART. It ensures your app shell (index.html) is cached
// and can be served offline, and it handles updates correctly.
offlineFallback({
  pageFallback: '/index.html',
});