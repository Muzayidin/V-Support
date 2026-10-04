import prisma from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * Memeriksa apakah user adalah developer / admin
 * 1. Melalui role "ADMIN" di database
 * 2. ATAU melalui environment variable ADMIN_EMAILS (email developer)
 */
export function isDeveloper(email?: string | null, role?: string | null): boolean {
  if (role === 'ADMIN') return true

  const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
  const adminEmails = adminEmailsEnv
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (email && adminEmails.includes(email.toLowerCase())) {
    return true
  }

  return false
}

/**
 * Helper Server Component untuk mendapatkan sesi developer yang terverifikasi
 * Mengembalikan user data atau null jika bukan developer
 */
export async function getVerifiedDeveloper() {
  const session = await auth()
  if (!session?.user?.id && !session?.user?.email) {
    return null
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        session.user.id ? { id: session.user.id } : undefined,
        session.user.email ? { email: session.user.email } : undefined,
      ].filter(Boolean) as any,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
  })

  if (!user) return null

  const isDev = isDeveloper(user.email, user.role)
  if (!isDev) return null

  return user
}
