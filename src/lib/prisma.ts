import { PrismaClient } from '@/generated/prisma/client'

function parseMysqlUrl(urlStr: string) {
  try {
    const parsed = new URL(urlStr)
    const hostname = parsed.hostname || '127.0.0.1'
    return {
      host: hostname === 'localhost' ? '127.0.0.1' : hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: parsed.pathname.replace(/^\//, '') || '',
      connectionLimit: 10
    }
  } catch (err) {
    return {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: ''
    }
  }
}

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

  // Jika koneksi MySQL / MariaDB (Production aaPanel)
  if (dbUrl.startsWith('mysql:') || dbUrl.startsWith('mariadb:')) {
    const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
    const config = parseMysqlUrl(dbUrl)
    const adapter = new PrismaMariaDb(config)
    return new PrismaClient({ adapter })
  }

  // Fallback ke SQLite untuk lingkungan lokal
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  const adapter = new PrismaBetterSqlite3({ url: dbUrl })
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Singleton pattern untuk Prisma Client
const prisma = prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
