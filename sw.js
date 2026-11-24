// Service worker : l'appli fonctionne hors ligne (sauf vidéos YouTube et synchronisation)
const VERSION = 'gratte-v2';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon.svg', 'icons/maskable-512.png',
  'js/app.js', 'js/util.js', 'js/store.js', 'js/sync.js', 'js/config.js', 'js/music.js',
  'js/audio/clock.js', 'js/audio/engine.js', 'js/audio/mic.js',
  'js/data/chords.js', 'js/data/lessons.js', 'js/data/songs.js', 'js/data/videos.js',
  'js/ui/changes.js', 'js/ui/charts.js', 'js/ui/chord.js', 'js/ui/practice.js', 'js/ui/tab.js', 'js/ui/video.js',
  'js/views/calibrate.js', 'js/views/chords.js', 'js/views/home.js', 'js/views/lesson.js', 'js/views/metronome.js',
  'js/views/path.js', 'js/views/progress.js', 'js/views/settings.js', 'js/views/song.js', 'js/views/songs.js',
  'js/views/tools.js', 'js/views/tuner.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Fichiers de l'appli : réseau d'abord (pour les mises à jour), cache en secours
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
    return;
  }
  // Polices Google et bibliothèque Supabase : cache puis réseau
  if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(url.host)) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return r; })));
  }
});
