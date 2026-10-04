import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isPublicPage =
    pathname === '/' ||
    pathname === '/landing' ||
    pathname.startsWith('/landing') ||
    pathname.startsWith('/help') ||
    pathname.startsWith('/privacy')

  const isOnAuthPage = pathname.startsWith('/login')

  // Jika belum login dan mengakses halaman yang butuh autentikasi (dashboard, history, vehicles, profile, admin, dll.)
  if (!isLoggedIn && !isOnAuthPage && !isPublicPage) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  // Jika sudah login dan membuka halaman login, arahkan ke dashboard
  if (isLoggedIn && isOnAuthPage) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon.svg|logo.svg|logo.webp).*)'],
}
