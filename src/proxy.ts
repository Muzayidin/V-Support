import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { checkRateLimit } from "./lib/rateLimit"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  // 0. Abaikan seluruh berkas statis, uploads, aset publik, dan rute autentikasi
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return
  }

  // 1. Pengendalian Trafik & Request Rate Limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/api/auth')
  const rateLimitConfig = isAuthRoute
    ? { limit: 40, windowMs: 60_000 }  // 40 request per menit untuk rute login/auth
    : { limit: 120, windowMs: 60_000 } // 120 request per menit untuk rute aplikasi umum

  const rateCheck = checkRateLimit(`${ip}:${isAuthRoute ? 'auth' : 'general'}`, rateLimitConfig)

  if (!rateCheck.success) {
    if (pathname.startsWith('/api/')) {
      return Response.json(
        {
          error: "Trafik request terlalu padat (Rate Limit Exceeded).",
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }

    const html429 = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Trafik Terlalu Padat — Cruz</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #e0e7ff; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; box-sizing: border-box; }
    .card { background: #fff; border: 3px solid #000; border-radius: 6px; box-shadow: 6px 6px 0 #000; padding: 2rem; max-width: 400px; text-align: center; }
    h1 { font-size: 1.25rem; font-weight: 900; margin: 0 0 0.5rem; color: #000; }
    p { font-size: 0.875rem; font-weight: 600; color: #222; margin: 0 0 1.5rem; line-height: 1.5; }
    .btn { display: inline-block; padding: 0.75rem 1.5rem; background: #ffe500; color: #000; border: 2px solid #000; border-radius: 6px; box-shadow: 3px 3px 0 #000; font-weight: 900; text-decoration: none; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    .btn:hover { background: #8ae500; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 2.75rem; margin-bottom: 0.75rem;">🚦</div>
    <h1>Trafik Terlalu Cepat (429)</h1>
    <p>Perangkat Anda mengirim terlalu banyak permintaan dalam waktu singkat demi keamanan sistem. Silakan tunggu <strong>${rateCheck.retryAfterSeconds} detik</strong> sebelum mencoba kembali.</p>
    <a href="${pathname}" class="btn">Coba Muat Ulang</a>
  </div>
</body>
</html>`

    return new Response(html429, {
      status: 429,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": String(rateCheck.retryAfterSeconds),
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": "0",
      },
    })
  }

  // 2. Kontrol Akses Halaman & Autentikasi
  const isLoggedIn = !!req.auth

  const isPublicPage =
    pathname === '/' ||
    pathname === '/landing' ||
    pathname.startsWith('/landing') ||
    pathname.startsWith('/help') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/api/auth')

  const isOnAuthPage = pathname.startsWith('/login')

  // Jika belum login dan mengakses halaman yang butuh autentikasi
  if (!isLoggedIn && !isOnAuthPage && !isPublicPage) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  // Jika sudah login dan membuka halaman login, arahkan ke dashboard
  if (isLoggedIn && isOnAuthPage) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js)$).*)'],
}
