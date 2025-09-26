const CACHE_NAME = 'cds-167-calculator-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // La libreria Tailwind è caricata via CDN, ma è considerata esterna.
];

// Installa il Service Worker e mette in cache le risorse essenziali
self.addEventListener('install', event => {
    console.log('Service Worker: Evento Installazione');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Pre-caching risorse...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Attivazione del Service Worker e pulizia delle vecchie cache
self.addEventListener('activate', event => {
    console.log('Service Worker: Evento Attivazione');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Cancello vecchia cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercettazione delle richieste per servire risorse dalla cache (strategia Cache First)
self.addEventListener('fetch', event => {
    // Gestisce solo le richieste per le risorse nell'ambito dell'applicazione
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Se la risorsa è in cache, la restituisce immediatamente
                    if (response) {
                        return response;
                    }
                    // Altrimenti, fa una richiesta di rete
                    return fetch(event.request);
                })
        );
    } else {
        // Lascia che le richieste CDN (come Tailwind) passino direttamente
        event.respondWith(fetch(event.request));
    }
});

