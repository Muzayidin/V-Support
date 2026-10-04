// Cruz Service Worker v1.3.0
// Cache-first strategy untuk assets statis, network-first untuk API

const CACHE_NAME = 'cruz-v1.3.0'
const STATIC_CACHE = 'cruz-static-v1.3.0'

// Assets yang di-pre-cache saat instalasi
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon.svg',
]

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Hanya handle request dari origin yang sama
  if (url.origin !== self.location.origin) return

  // Jangan cache API routes, auth, atau server actions
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname === '/favicon.ico' ||
    request.method !== 'GET'
  ) {
    return
  }

  // Untuk halaman navigasi: Network-first, fallback ke cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Simpan salinan respons terbaru ke cache
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone)
          })
          return response
        })
        .catch(() => {
          // Offline: kembalikan dari cache atau halaman offline
          return caches.match(request).then((cached) => {
            return cached || caches.match('/')
          })
        })
    )
    return
  }

  // Untuk assets statis (_next/static sudah di-handle di atas): Cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone)
          })
        }
        return response
      })
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

