'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getVehicles() {
  try {
    return await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get vehicles:', error)
    return []
  }
}

export async function getVehicleById(id: string) {
  try {
    return await prisma.vehicle.findUnique({
      where: { id },
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
  licensePlate?: string
  currentMileage: number
}) {
  try {
    const vehicle = await prisma.vehicle.create({
      data
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true, vehicle }
  } catch (error) {
    console.error('Failed to create vehicle:', error)
    return { success: false, error: 'Failed to create vehicle' }
  }
}

export async function updateVehicle(id: string, data: {
  name?: string
  licensePlate?: string
  currentMileage?: number
}) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true, vehicle }
  } catch (error) {
    console.error('Failed to update vehicle:', error)
    return { success: false, error: 'Failed to update vehicle' }
  }
}

export async function deleteVehicle(id: string) {
  try {
    await prisma.vehicle.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete vehicle:', error)
    return { success: false, error: 'Failed to delete vehicle' }
  }
}
