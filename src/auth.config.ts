import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/welcome", // Redirect pengguna baru ke onboarding
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        // user is defined if using database session, token is defined if JWT
        session.user.id = user ? user.id : (token?.sub as string);
      }
      return session;
    },
  },
} satisfies NextAuthConfig
