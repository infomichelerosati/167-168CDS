const CACHE_NAME = 'assistente-cds-v3'; // Incremento la versione per forzare l'aggiornamento
const urlsToCache = [
    'index.html',
    'manifest.json'
];

// Evento di installazione: mette in cache le risorse essenziali
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aperta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento di attivazione: pulisce le vecchie cache non più necessarie
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento fetch: intercetta le richieste e serve dalla cache se disponibile (strategia Cache First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se la risorsa è in cache, la restituisce, altrimenti esegue la fetch di rete
                return response || fetch(event.request);
            })
    );
});

