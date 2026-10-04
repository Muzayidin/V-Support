/**
 * Format string atau number menjadi angka berpemisah ribuan titik (.) khas Indonesia
 * Contoh: "15500" -> "15.500"
 */
export function formatThousands(value: string | number | null | undefined): string {
  if (value === '' || value === null || value === undefined) return ''
  const str = typeof value === 'number' ? Math.round(value).toString() : value.toString()
  const digitsOnly = str.replace(/\D/g, '')
  if (!digitsOnly) return ''
  return Number(digitsOnly).toLocaleString('id-ID')
}

/**
 * Mengambil angka murni (number) dari input berpemisah ribuan
 * Contoh: "15.500" -> 15500
 */
export function parseThousands(value: string | number | null | undefined): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : Math.round(value)
  if (!value) return 0
  const digitsOnly = value.toString().replace(/\D/g, '')
  return digitsOnly ? parseInt(digitsOnly, 10) : 0
}
