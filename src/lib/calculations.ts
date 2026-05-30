import { ServiceRecord, ServiceDetail } from '@/generated/prisma/client'

type RecordWithDetails = ServiceRecord & { details: ServiceDetail[] }

/**
 * Kalkulasi apakah kendaraan membutuhkan servis berdasarkan odometer
 */
export function calculateServiceReminder(
  currentMileage: number,
  lastServiceMileage?: number
) {
  const SERVICE_INTERVAL = 2000 // Interval servis standar (KM)
  const WARNING_THRESHOLD = 200 // Peringatan muncul jika sisa < 200 KM
  
  if (!lastServiceMileage) {
    return {
      needsService: false,
      remainingMileage: SERVICE_INTERVAL,
      message: 'Belum ada riwayat servis. Catat servis pertama Anda.'
    }
  }

  const nextServiceMileage = lastServiceMileage + SERVICE_INTERVAL
  const remainingMileage = nextServiceMileage - currentMileage

  const needsService = remainingMileage <= WARNING_THRESHOLD

  return {
    needsService,
    remainingMileage: Math.max(0, remainingMileage),
    message: needsService 
      ? `Servis rutin disarankan dalam ${Math.max(0, remainingMileage)} KM.` 
      : 'Kondisi Prima'
  }
}

/**
 * Estimasi biaya servis berdasarkan riwayat servis sebelumnya
 */
export function estimateNextServiceCost(
  history: RecordWithDetails[]
) {
  const DEFAULT_ESTIMATE = 65000 // Asumsi harga ganti oli standar jika tidak ada riwayat

  if (!history || history.length === 0) {
    return DEFAULT_ESTIMATE
  }

  // Mengambil maksimal 3 riwayat servis terakhir
  const recentServices = history.slice(0, 3)
  const totalCost = recentServices.reduce((sum, record) => sum + record.totalCost, 0)
  
  // Mengembalikan rata-rata biaya
  return Math.round(totalCost / recentServices.length)
}
