/**
 * In-Memory Sliding Window Rate Limiter untuk Pengendalian Trafik dan Request
 * Dirancang untuk berjalan cepat pada Next.js Proxy/Middleware runtime.
 */

type RateLimitRecord = {
  count: number
  resetTime: number
}

// Map penyimpanan rate limit (IP -> record)
const ipTrafficMap = new Map<string, RateLimitRecord>()

// Batasi ukuran memori: bersihkan entri yang sudah kedaluwarsa setiap 2 menit
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of ipTrafficMap.entries()) {
      if (now > record.resetTime) {
        ipTrafficMap.delete(key)
      }
    }
  }, 120_000)
}

export type RateLimitConfig = {
  limit: number      // Jumlah request maksimal
  windowMs: number   // Jendela waktu (millisecond)
}

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfterSeconds: number
}

/**
 * Memeriksa apakah request dari identifier (IP / Token) melewati batas kuota
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = `${identifier}`
  const existing = ipTrafficMap.get(key)

  if (!existing || now > existing.resetTime) {
    // Window baru dimulai
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs
    }
    ipTrafficMap.set(key, newRecord)

    return {
      success: true,
      limit: config.limit,
      remaining: Math.max(0, config.limit - 1),
      resetTime: newRecord.resetTime,
      retryAfterSeconds: Math.ceil(config.windowMs / 1000)
    }
  }

  // Masih dalam window yang sama
  existing.count += 1
  const remaining = Math.max(0, config.limit - existing.count)
  const isAllowed = existing.count <= config.limit
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetTime - now) / 1000))

  return {
    success: isAllowed,
    limit: config.limit,
    remaining,
    resetTime: existing.resetTime,
    retryAfterSeconds
  }
}
