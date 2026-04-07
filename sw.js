const CACHE_NAME = 'chau-misil-v1';
// Lista de todos los archivos de tu juego que quieres guardar
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './js/juego.js',       // Revisa que la ruta sea correcta
  './img/fondo.png',     // Agrega aquí todas tus imágenes
  './audio/musica.mp3'   // Agrega aquí tus sonidos si tienes
];

// 1. Instalar y guardar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Hacer que el juego funcione sin internet (Modo Offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el archivo está en la memoria (caché), lo usa. Si no, lo busca en internet.
      return response || fetch(event.request);
    })
  );
});
