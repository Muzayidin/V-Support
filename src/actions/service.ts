'use server'

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

export async function createServiceRecord(data: {
  vehicleId: string
  date?: Date
  mileage: number
  totalCost: number
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
          details: {
            create: data.details
          }
        },
        include: {
          details: true
        }
      })

      // 2. Update Odometer (currentMileage) di tabel Vehicle
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: {
          currentMileage: data.mileage
        }
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
