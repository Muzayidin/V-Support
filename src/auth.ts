import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

function writeAuthLog(level: string, data: unknown) {
  try {
    const err = data as any
    const cause = err?.cause?.err
    const line = [
      `[${new Date().toISOString()}] [${level}] ${err?.type ?? err?.name ?? ""}: ${err?.message ?? String(data)}`,
      cause ? `  cause: ${cause.stack ?? cause}` : err?.stack ? `  stack: ${err.stack}` : "",
    ].join("\n")
    fs.appendFileSync(path.join(process.cwd(), "auth-error.log"), line + "\n\n")
  } catch {}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  logger: {
    error(error) {
      console.error("[auth][error]", error)
      writeAuthLog("error", error)
    },
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const isMatch = await bcrypt.compare(credentials.password as string, user.password)
        
        if (isMatch) return user
        
        return null
      }
    })
  ]
})
