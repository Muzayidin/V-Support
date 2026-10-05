import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      checks: ["none"],
      // Email Google sudah terverifikasi, jadi aman ditautkan ke akun email/password yang sama
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/welcome", // Redirect pengguna baru ke onboarding
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user ? user.id : (token?.sub as string);
        (session.user as any).role = (token?.role as string) || (user as any)?.role || "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig
