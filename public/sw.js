// Cruz Service Worker v1.4.0
// Offline-first PWA caching strategy & Background Sync support

const CACHE_NAME = 'cruz-app-v1.4.0'
const STATIC_CACHE = 'cruz-static-v1.4.0'

// Assets inti yang di-pre-cache saat instalasi
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/add-service',
  '/history',
  '/vehicles',
  '/profile',
  '/manifest.json',
  '/icon.svg',
]

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        // Gunakan Promise.allSettled agar jika 1 halaman butuh auth tetap lanjut install
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            fetch(url)
              .then((res) => {
                if (res.ok) return cache.put(url, res)
              })
              .catch((err) => console.warn('Pre-cache item skipped:', url, err))
          )
        )
      })
      .then(() => self.skipWaiting())
  )
})

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
            .map((name) => caches.delete(name))
        )
      })
      .then(() => self.clients.claim())
  )
})

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Hanya tangani request dari origin yang sama
  if (url.origin !== self.location.origin) return

  // Abaikan non-GET requests dan websocket dev / HMR
  if (request.method !== 'GET') return
  if (url.pathname.includes('/_next/webpack-hmr')) return

  // API sync and dynamic API routes should always go to network
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // 1. Assets Statis Next.js (_next/static): Cache-First dengan background update
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return networkResponse
        })
      })
    )
    return
  }

  // 2. Navigasi Halaman (HTML): Network-First, fallback ke Cache saat offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return networkResponse
        })
        .catch(async () => {
          // Offline fallback
          const cachedPage = await caches.match(request)
          if (cachedPage) return cachedPage

          // Fallback ke halaman dashboard atau home yang tersimpan di cache
          const fallbackDashboard = await caches.match('/dashboard')
          if (fallbackDashboard) return fallbackDashboard

          const fallbackHome = await caches.match('/')
          if (fallbackHome) return fallbackHome

          return new Response(
            `<!DOCTYPE html>
            <html lang="id">
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Mode Offline — Cruz</title>
                <style>
                  body { font-family: system-ui, sans-serif; background: #FFE500; color: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; text-align: center; }
                  .card { background: #fff; border: 3px solid #000; box-shadow: 4px 4px 0 #000; border-radius: 12px; padding: 2rem; max-width: 380px; width: 100%; }
                  h1 { font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem; }
                  p { font-size: 0.875rem; font-weight: 600; color: #333; margin: 0 0 1.5rem; }
                  button { font-size: 0.875rem; font-weight: 800; background: #FFE500; border: 2px solid #000; box-shadow: 2px 2px 0 #000; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>Mode Offline</h1>
                  <p>Anda sedang tidak terhubung ke internet. Silakan periksa koneksi Anda dan muat ulang halaman.</p>
                  <button onclick="window.location.reload()">Coba Muat Ulang</button>
                </div>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          )
        })
    )
    return
  }

  // 3. Asset umum (gambar, fonts, icon): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})

// ===== NOTIFICATION CLICK (MOBILE / PHONE PUSH) =====
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
