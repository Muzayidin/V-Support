'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

export async function getVehicles() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }
    return await prisma.vehicle.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get vehicles:', error)
    return []
  }
}

export async function getVehicleById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }
    return await prisma.vehicle.findFirst({
      where: { id, userId: session.user.id },
      include: {
        serviceRecords: {
          orderBy: { date: 'desc' }
        }
      }
    })
  } catch (error) {
    console.error('Failed to get vehicle:', error)
    return null
  }
}

export async function createVehicle(data: {
  userId: string
  name: string
  image?: string | null
  licensePlate?: string
  vehicleType?: 'MOTORCYCLE' | 'CAR'
  currentMileage: number
}) {
  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        image: data.image || null,
        vehicleType: data.vehicleType || 'MOTORCYCLE',
        swdklljAmount: data.vehicleType === 'CAR' ? 143000 : 35000
      }
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true, vehicle }
  } catch (error) {
    console.error('Failed to create vehicle:', error)
    return { success: false, error: 'Failed to create vehicle' }
  }
}

export async function addVehicleAction(data: {
  name: string
  image?: string | null
  licensePlate?: string
  vehicleType?: 'MOTORCYCLE' | 'CAR'
  engineType: 'ICE' | 'EV'
  transmission: 'AUTOMATIC' | 'MANUAL'
  ccOrKwh?: number | null
  currentMileage: number
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }
    const vehicleType = data.vehicleType || 'MOTORCYCLE'
    const vehicle = await prisma.vehicle.create({
      data: {
        userId: session.user.id,
        name: data.name,
        image: data.image || null,
        licensePlate: data.licensePlate?.trim() || null,
        vehicleType,
        engineType: data.engineType,
        transmission: data.transmission,
        ccOrKwh: data.ccOrKwh,
        currentMileage: data.currentMileage,
        swdklljAmount: vehicleType === 'CAR' ? 143000 : 35000,
        tireConditionFront: 50,
        tireConditionRear: 50,
        brakePadCondition: 50,
        brakePadConditionRear: 50,
        coolantCondition: 50,
        oilCondition: 50
      }
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true, vehicleId: vehicle.id }
  } catch (error) {
    console.error('Failed to add vehicle:', error)
    return { success: false, error: 'Gagal menambahkan kendaraan' }
  }
}

export async function updateVehicle(id: string, data: {
  name?: string
  image?: string | null
  licensePlate?: string
  vehicleType?: string
  currentMileage?: number
  transmission?: string
  ccOrKwh?: number | null
  oilIntervalKm?: number | null
  transmissionOilIntervalKm?: number | null
  coolantIntervalKm?: number | null
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }
    const existing = await prisma.vehicle.findFirst({
      where: { id, userId: session.user.id }
    })
    if (!existing) {
      return { success: false, error: 'Kendaraan tidak ditemukan' }
    }

    // Hitung pengurangan kondisi fisik komponen secara proporsional jika kilometer bertambah
    let conditionWearUpdates = {}
    if (typeof data.currentMileage === 'number' && data.currentMileage > existing.currentMileage) {
      const deltaKm = data.currentMileage - existing.currentMileage
      const isEV = existing.engineType === 'EV'

      const oilInterval = existing.oilIntervalKm || 3000
      const transInterval = existing.transmissionOilIntervalKm || (isEV ? 10000 : 8000)
      const coolantInterval = existing.coolantIntervalKm || (isEV ? 15000 : 12000)

      conditionWearUpdates = {
        oilCondition: isEV ? 50 : Math.max(0, existing.oilCondition - Math.round((deltaKm / oilInterval) * 100)),
        coolantCondition: Math.max(0, (existing.coolantCondition ?? 50) - Math.round((deltaKm / coolantInterval) * 100)),
        brakePadCondition: Math.max(0, existing.brakePadCondition - Math.round((deltaKm / 15000) * 100)),
        brakePadConditionRear: Math.max(0, (existing.brakePadConditionRear ?? 50) - Math.round((deltaKm / 18000) * 100)),
        tireConditionFront: Math.max(0, existing.tireConditionFront - Math.round((deltaKm / 15000) * 100)),
        tireConditionRear: Math.max(0, existing.tireConditionRear - Math.round((deltaKm / 12000) * 100)),
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        ...conditionWearUpdates
      }
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true, vehicle }
  } catch (error) {
    console.error('Failed to update vehicle:', error)
    return { success: false, error: 'Failed to update vehicle' }
  }
}

export async function updateVehicleIntervals(vehicleId: string, intervals: {
  oilIntervalKm?: number | null
  transmissionOilIntervalKm?: number | null
  coolantIntervalKm?: number | null
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }
    const existing = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId: session.user.id }
    })
    if (!existing) {
      return { success: false, error: 'Kendaraan tidak ditemukan' }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        oilIntervalKm: intervals.oilIntervalKm,
        transmissionOilIntervalKm: intervals.transmissionOilIntervalKm,
        coolantIntervalKm: intervals.coolantIntervalKm
      }
    })

    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true, vehicle }
  } catch (error) {
    console.error('Failed to update vehicle intervals:', error)
    return { success: false, error: 'Gagal memperbarui pengaturan interval' }
  }
}

export async function deleteVehicle(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }
    const existing = await prisma.vehicle.findFirst({
      where: { id, userId: session.user.id }
    })
    if (!existing) {
      return { success: false, error: 'Kendaraan tidak ditemukan' }
    }

    // Hapus rincian servis, catatan servis, catatan pajak, dan inspeksi komponen terkait secara transaksional
    await prisma.$transaction([
      prisma.serviceDetail.deleteMany({
        where: { serviceRecord: { vehicleId: id } }
      }),
      prisma.serviceRecord.deleteMany({
        where: { vehicleId: id }
      }),
      prisma.taxRecord.deleteMany({
        where: { vehicleId: id }
      }),
      prisma.componentInspection.deleteMany({
        where: { vehicleId: id }
      }),
      prisma.vehicle.delete({
        where: { id }
      })
    ])

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/vehicles')
    revalidatePath('/history')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete vehicle:', error)
    return { success: false, error: 'Gagal menghapus data kendaraan' }
  }
}

export async function confirmComponentHealth(data: {
  vehicleId: string
  componentId: string
  componentName: string
  condition: number
  inspectorRole?: string
  notes?: string | null
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: data.vehicleId, userId: session.user.id }
    })
    if (!vehicle) {
      return { success: false, error: 'Kendaraan tidak ditemukan' }
    }

    const validCondition = Math.min(100, Math.max(0, Math.round(Number(data.condition))))

    const inspection = await prisma.componentInspection.create({
      data: {
        vehicleId: data.vehicleId,
        componentId: data.componentId,
        componentName: data.componentName,
        condition: validCondition,
        mileageAtCheck: vehicle.currentMileage,
        inspectorRole: data.inspectorRole || 'USER',
        notes: data.notes?.trim() || null,
        checkedAt: new Date()
      }
    })

    // Sinkronkan ke kolom legacy vehicle jika komponen sesuai
    const legacyUpdates: Record<string, number> = {}
    if (data.componentId === 'oil') legacyUpdates.oilCondition = validCondition
    if (data.componentId === 'coolant') legacyUpdates.coolantCondition = validCondition
    if (data.componentId === 'brakePadFront') legacyUpdates.brakePadCondition = validCondition
    if (data.componentId === 'brakePadRear') legacyUpdates.brakePadConditionRear = validCondition
    if (data.componentId === 'tireFront') legacyUpdates.tireConditionFront = validCondition
    if (data.componentId === 'tireRear') legacyUpdates.tireConditionRear = validCondition

    if (Object.keys(legacyUpdates).length > 0) {
      await prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: legacyUpdates
      })
    }

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/vehicles')
    revalidatePath('/vehicles/components')

    return { success: true, inspection }
  } catch (error) {
    console.error('Failed to confirm component health:', error)
    return { success: false, error: 'Gagal mengonfirmasi kelayakan komponen' }
  }
}

