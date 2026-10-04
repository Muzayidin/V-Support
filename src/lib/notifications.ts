import prisma from '@/lib/prisma'
import { calculateAllComponentsStatus } from './calculations'

export type NotificationItem = {
  id: string
  type: 'ODOMETER' | 'COMPONENT_CRITICAL' | 'COMPONENT_WARNING' | 'TAX'
  title: string
  message: string
  vehicleId: string
  vehicleName: string
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  date: string
  actionUrl?: string
  actionLabel?: string
  componentName?: string
  currentCondition?: number
  remainingKm?: number
  daysSinceLastUpdate?: number
}

export async function getUserNotifications(userId: string): Promise<{
  notifications: NotificationItem[]
  counts: {
    total: number
    odometer: number
    components: number
    tax: number
    critical: number
  }
  settings: {
    odometerReminderDays: number
    odometerReminderEnabled: boolean
    componentReminderEnabled: boolean
    taxReminderEnabled: boolean
  }
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vehicles: {
        include: {
          serviceRecords: {
            include: { details: true },
            orderBy: { date: 'desc' }
          }
        }
      }
    }
  })

  if (!user) {
    return {
      notifications: [],
      counts: { total: 0, odometer: 0, components: 0, tax: 0, critical: 0 },
      settings: {
        odometerReminderDays: 7,
        odometerReminderEnabled: true,
        componentReminderEnabled: true,
        taxReminderEnabled: true
      }
    }
  }

  const now = Date.now()
  const notifications: NotificationItem[] = []
  const odoIntervalDays = user.odometerReminderDays || 7

  for (const vehicle of user.vehicles) {
    // 1. PENGINGAT UPDATE ODOMETER
    if (user.odometerReminderEnabled) {
      const lastUpdatedTime = new Date(vehicle.updatedAt).getTime()
      const diffMs = now - lastUpdatedTime
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays >= odoIntervalDays) {
        notifications.push({
          id: `odo-${vehicle.id}`,
          type: 'ODOMETER',
          title: `Update Odometer: ${vehicle.name}`,
          message: `Sudah ${diffDays} hari sejak odometer terakhir diperbarui (${vehicle.currentMileage.toLocaleString('id-ID')} km). Masukkan angka kilometer terbaru untuk kalkulasi akurat.`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          urgency: diffDays >= odoIntervalDays * 2 ? 'HIGH' : 'MEDIUM',
          date: new Date(vehicle.updatedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
          }),
          actionLabel: 'Input KM',
          daysSinceLastUpdate: diffDays
        })
      }
    }

    // 2. PENGECEKAN STATUS KOMPONEN (AUS / KRITIS)
    if (user.componentReminderEnabled) {
      const components = calculateAllComponentsStatus(vehicle as any, vehicle.serviceRecords as any)

      for (const comp of components) {
        if (comp.status === 'CRITICAL') {
          notifications.push({
            id: `comp-crit-${vehicle.id}-${comp.id}`,
            type: 'COMPONENT_CRITICAL',
            title: `Wajib Ganti: ${comp.name} (${vehicle.name})`,
            message: `Kondisi ${comp.name} kritis di ${comp.currentCondition}%. ${
              comp.remainingKm <= 0
                ? 'Sudah melewati batas masa pakai pabrikan!'
                : `Sisa estimasi pemakaian tinggal ${comp.remainingKm.toLocaleString('id-ID')} km.`
            } ${comp.advice}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            urgency: 'HIGH',
            date: 'Hari ini',
            actionLabel: 'Catat Servis',
            actionUrl: `/add-service?vehicleId=${vehicle.id}`,
            componentName: comp.name,
            currentCondition: comp.currentCondition,
            remainingKm: comp.remainingKm
          })
        } else if (comp.status === 'WARNING') {
          notifications.push({
            id: `comp-warn-${vehicle.id}-${comp.id}`,
            type: 'COMPONENT_WARNING',
            title: `Perlu Dicek: ${comp.name} (${vehicle.name})`,
            message: `Kondisi ${comp.name} berada pada ${comp.currentCondition}% (sisa ${comp.remainingKm.toLocaleString('id-ID')} km). Segera lakukan inspeksi visual di bengkel.`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            urgency: 'MEDIUM',
            date: 'Hari ini',
            actionLabel: 'Lihat Komponen',
            actionUrl: `/vehicles/components?vehicleId=${vehicle.id}`,
            componentName: comp.name,
            currentCondition: comp.currentCondition,
            remainingKm: comp.remainingKm
          })
        }
      }
    }

    // 3. PENGINGAT PAJAK STNK
    if (user.taxReminderEnabled && vehicle.stnkTaxDueDate) {
      const taxDue = new Date(vehicle.stnkTaxDueDate).getTime()
      const diffTaxDays = Math.ceil((taxDue - now) / (1000 * 60 * 60 * 24))

      if (diffTaxDays <= 30) {
        notifications.push({
          id: `tax-${vehicle.id}`,
          type: 'TAX',
          title: `Pajak STNK: ${vehicle.name}`,
          message:
            diffTaxDays < 0
              ? `Pajak STNK sudah lewat tempo ${Math.abs(diffTaxDays)} hari yang lalu! Segera bayar untuk menghindari denda.`
              : `Pajak STNK tahunan jatuh tempo dalam ${diffTaxDays} hari lagi (${new Date(vehicle.stnkTaxDueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}).`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          urgency: diffTaxDays <= 7 ? 'HIGH' : 'MEDIUM',
          date: new Date(vehicle.stnkTaxDueDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
          }),
          actionLabel: 'Cek Pajak',
          actionUrl: `/tax?vehicleId=${vehicle.id}`
        })
      }
    }
  }

  // Urutkan notifikasi: HIGH urgency di atas, lalu ODOMETER/CRITICAL
  notifications.sort((a, b) => {
    const urgencyWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    return urgencyWeight[b.urgency] - urgencyWeight[a.urgency]
  })

  const counts = {
    total: notifications.length,
    odometer: notifications.filter((n) => n.type === 'ODOMETER').length,
    components: notifications.filter((n) => n.type.startsWith('COMPONENT')).length,
    tax: notifications.filter((n) => n.type === 'TAX').length,
    critical: notifications.filter((n) => n.urgency === 'HIGH').length
  }

  return {
    notifications,
    counts,
    settings: {
      odometerReminderDays: user.odometerReminderDays,
      odometerReminderEnabled: user.odometerReminderEnabled,
      componentReminderEnabled: user.componentReminderEnabled,
      taxReminderEnabled: user.taxReminderEnabled
    }
  }
}
