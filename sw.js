/* MathOS — fonctionnement hors connexion (version 202610281046) */
var CACHE = 'mathos-202610281046';
var FICHIERS = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // le programme Google passe toujours par le réseau
  e.respondWith(fetch(e.request).then(function (r) {
    var copie = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copie); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }); }));
});
