/*
 * Business OS service worker.
 *
 * Deliberately minimal and pass-through.
 *
 * Every page here is server-rendered per user and gated by an auth cookie, so
 * caching responses would risk serving one account's HTML to another — and
 * showing stale projects, hours or revenue is worse than showing a network
 * error. Its only job is to make the app installable; the browser keeps doing
 * the actual fetching.
 *
 * If offline support is ever wanted, cache static build assets only
 * (/_next/static/*), never HTML or RSC payloads.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Present so the app qualifies as installable; no respondWith means the browser
// handles the request exactly as it normally would.
self.addEventListener("fetch", () => {});
