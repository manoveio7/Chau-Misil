const CACHE_NAME = 'chau-misil-v3';

// Esta es la lista de archivos que el celular guardará en su memoria

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './sw.js',
  
  // SCRIPTS (Carpeta js)
  './js/comandoVoz.js',
  './js/comdevoz.js',
  './js/console.js',
  './js/console2.js',
  './js/entrada.js',
  './js/inicio.js',
  './js/libreriaVoz.js',
  './js/main.js',
  './js/phaser.js',
  './js/phaser.min.js',

  // SONIDOS (Carpeta audio)
  './audio/AudioTiroAvion.mp3',
  './audio/apareceMisil.mp3',
  './audio/audioArma.mp3',
  './audio/estrella.mp3',
  './audio/explosion.mp3',
  './audio/motor.mp3',
  './audio/motor_2.mp3',
  './audio/peligro.mp3',
  './audio/peligro2.mp3',
  './audio/toca.mp3',

  // IMÁGENES (Carpeta img)
  './img/PanelAzul.png',
  './img/aguja.png',
  './img/alerta.png',
  './img/alertaArma.png',
  './img/arma.png',
  './img/avion.png',
  './img/bala.png',
  './img/blanco.png',
  './img/brillo.png',
  './img/brillo2.png',
  './img/btn.png',
  './img/btnBala.png',
  './img/btnBorrar.png',
  './img/btnOk.png',
  './img/cielo.png',
  './img/entrada.png',
  './img/estrella.png',
  './img/explosion.png',
  './img/flares.json',
  './img/flares.png',
  './img/fuel.png',
  './img/fuel2.png',
  './img/fuelAlerta.png',
  './img/fuelBase.png',
  './img/gameOver.png',
  './img/llave.png',
  './img/menu.png',
  './img/misil.png',
  './img/panel.png',
  './img/panel1.png',
  './img/panel2.png',
  './img/panelEstrellas.png',
  './img/panelMisiles.png',
  './img/panelReloj.png',
  './img/play.png',
  './img/play2.png',
  './img/reinstalar.png',
  './img/reloj.png',
  './img/rojo.png',
  './img/starVerde.png'
];

// 1. Instalación: Guarda los archivos en el dispositivo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Instalando caché: ' + CACHE_NAME);
      return cache.addAll(ASSETS).catch(err => {
        console.error('Error cargando archivos a la caché:', err);
      });
    })
  );
});

// 2. Activación: Limpia cachés antiguas si cambias el nombre (v1, v2...)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Estrategia: Cargar desde la memoria si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

