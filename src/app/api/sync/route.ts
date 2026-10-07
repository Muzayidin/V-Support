import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const items = body?.items || []

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, processedCount: 0 })
    }

    let processedCount = 0
    const errors: Array<{ id: string; error: string }> = []

    for (const item of items) {
      try {
        if (item.type === 'UPDATE_ODOMETER') {
          const { vehicleId, currentMileage } = item.payload
          if (vehicleId && typeof currentMileage === 'number') {
            await prisma.vehicle.updateMany({
              where: {
                id: vehicleId,
                userId: session.user.id
              },
              data: {
                currentMileage
              }
            })
            processedCount++
          }
        } else if (item.type === 'ADD_SERVICE_RECORD') {
          const { vehicleId, date, mileage, totalCost, laborCost, details } = item.payload
          
          // Pastikan kendaraan milik user yang sedang login
          const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, userId: session.user.id }
          })

          if (vehicle) {
            await prisma.$transaction(async (tx) => {
              const record = await tx.serviceRecord.create({
                data: {
                  vehicleId,
                  date: date ? new Date(date) : new Date(),
                  mileage: Number(mileage),
                  totalCost: Number(totalCost),
                  laborCost: Number(laborCost || 0),
                  details: {
                    create: (details || []).map((d: any) => ({
                      componentName: d.componentName,
                      cost: Number(d.cost || 0)
                    }))
                  }
                }
              })

              // Update odometer kendaraan jika mileage servis lebih besar
              if (Number(mileage) > vehicle.currentMileage) {
                await tx.vehicle.update({
                  where: { id: vehicleId },
                  data: {
                    currentMileage: Number(mileage),
                    lastService: new Date()
                  }
                })
              }
            })
            processedCount++
          }
        } else if (item.type === 'CONFIRM_COMPONENT_HEALTH') {
          const { vehicleId, componentId, componentName, condition, inspectorRole, notes } = item.payload
          const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, userId: session.user.id }
          })

          if (vehicle) {
            const validCondition = Math.min(100, Math.max(0, Math.round(Number(condition))))
            await prisma.componentInspection.create({
              data: {
                vehicleId,
                componentId,
                componentName,
                condition: validCondition,
                mileageAtCheck: vehicle.currentMileage,
                inspectorRole: inspectorRole || 'USER',
                notes: notes ? String(notes).trim() : null,
                checkedAt: new Date(item.timestamp || Date.now())
              }
            })

            const legacyUpdates: Record<string, number> = {}
            if (componentId === 'oil') legacyUpdates.oilCondition = validCondition
            if (componentId === 'coolant') legacyUpdates.coolantCondition = validCondition
            if (componentId === 'brakePadFront') legacyUpdates.brakePadCondition = validCondition
            if (componentId === 'brakePadRear') legacyUpdates.brakePadConditionRear = validCondition
            if (componentId === 'tireFront') legacyUpdates.tireConditionFront = validCondition
            if (componentId === 'tireRear') legacyUpdates.tireConditionRear = validCondition

            if (Object.keys(legacyUpdates).length > 0) {
              await prisma.vehicle.update({
                where: { id: vehicleId },
                data: legacyUpdates
              })
            }

            processedCount++
          }
        }
      } catch (itemErr: any) {
        console.error(`Error processing sync item ${item.id}:`, itemErr)
        errors.push({ id: item.id, error: itemErr.message || 'Gagal menyinkronkan' })
      }
    }

    revalidatePath('/dashboard')
    revalidatePath('/history')
    revalidatePath('/vehicles')
    revalidatePath('/vehicles/components')

    return NextResponse.json({
      success: true,
      processedCount,
      errors
    })
  } catch (error: any) {
    console.error('Offline batch sync error:', error)
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 })
  }
}
