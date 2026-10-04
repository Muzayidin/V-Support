'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getServiceRecords(vehicleId: string) {
  try {
    return await prisma.serviceRecord.findMany({
      where: { vehicleId },
      include: {
        details: true
      },
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get service records:', error)
    return []
  }
}

export async function getServiceRecordById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    const record = await prisma.serviceRecord.findUnique({
      where: { id },
      include: {
        details: true,
        vehicle: true
      }
    })

    if (!record || record.vehicle.userId !== session.user.id) {
      return null
    }

    return record
  } catch (error) {
    console.error('Failed to get service record by id:', error)
    return null
  }
}

export async function deleteServiceRecord(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const record = await prisma.serviceRecord.findUnique({
      where: { id },
      include: { vehicle: true }
    })

    if (!record || record.vehicle.userId !== session.user.id) {
      return { success: false, error: 'Log servis tidak ditemukan atau tidak memiliki akses' }
    }

    await prisma.serviceRecord.delete({
      where: { id }
    })

    revalidatePath('/')
    revalidatePath('/history')
    revalidatePath('/vehicles')
    return { success: true, vehicleId: record.vehicleId }
  } catch (error) {
    console.error('Failed to delete service record:', error)
    return { success: false, error: 'Gagal menghapus log servis' }
  }
}

export async function createServiceRecord(data: {
  vehicleId: string
  date?: Date
  mileage: number
  totalCost: number
  laborCost?: number
  details: { componentName: string; cost: number }[]
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat Service Record dan Details-nya sekaligus
      const serviceRecord = await tx.serviceRecord.create({
        data: {
          vehicleId: data.vehicleId,
          date: data.date ?? new Date(),
          mileage: data.mileage,
          totalCost: data.totalCost,
          laborCost: data.laborCost ?? 0,
          details: {
            create: data.details
          }
        },
        include: {
          details: true
        }
      })

      // 2. Perbarui Odometer dan reset kondisi komponen yang diservis ke 100%
      const detailsNames = data.details.map((d) => d.componentName.toLowerCase())
      const vehicleUpdates: Record<string, any> = {
        currentMileage: data.mileage,
        lastService: data.date ?? new Date()
      }

      if (detailsNames.some((n) => n.includes('oli mesin') || n.includes('oli '))) {
        vehicleUpdates.oilCondition = 100
        vehicleUpdates.lastOilChange = data.date ?? new Date()
      }
      if (detailsNames.some((n) => n.includes('radiator') || n.includes('coolant'))) {
        vehicleUpdates.coolantCondition = 100
      }
      if (detailsNames.some((n) => n.includes('kampas rem depan') || n.includes('rem depan'))) {
        vehicleUpdates.brakePadCondition = 100
      }
      if (detailsNames.some((n) => n.includes('kampas rem belakang') || n.includes('rem belakang') || n.includes('tromol'))) {
        vehicleUpdates.brakePadConditionRear = 100
      }
      if (detailsNames.some((n) => n.includes('ban depan'))) {
        vehicleUpdates.tireConditionFront = 100
      }
      if (detailsNames.some((n) => n.includes('ban belakang'))) {
        vehicleUpdates.tireConditionRear = 100
      }

      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: vehicleUpdates
      })

      return serviceRecord
    })

    revalidatePath('/')
    revalidatePath('/history')
    return { success: true, serviceRecord: result }
  } catch (error) {
    console.error('Failed to create service record:', error)
    return { success: false, error: 'Failed to create service record' }
  }
}
