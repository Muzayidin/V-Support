import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isOnAuthPage = pathname.startsWith('/login')

  if (!isLoggedIn && !isOnAuthPage) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
  
  if (isLoggedIn && isOnAuthPage) {
    return Response.redirect(new URL('/vehicles', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|privacy).*)'],
}
