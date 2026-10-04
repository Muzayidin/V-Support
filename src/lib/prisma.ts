import { PrismaClient } from '@/generated/prisma/client'

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

  // Jika koneksi MySQL / Remote Database
  if (dbUrl.startsWith('mysql:') || dbUrl.startsWith('postgresql:')) {
    return new PrismaClient({} as any)
  }

  // Fallback ke SQLite untuk lingkungan lokal
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  const adapter = new PrismaBetterSqlite3({ url: dbUrl })
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Selalu buat instance baru saat skema prisma di-update agar Next.js dev server tidak memakai cache instance lama
const prisma = prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
