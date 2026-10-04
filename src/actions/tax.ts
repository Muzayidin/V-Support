'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updateTaxSettings(
  vehicleId: string,
  data: {
    stnkTaxDueDate?: string | null
    stnkFiveYearDueDate?: string | null
    annualTaxAmount?: number | null
    swdklljAmount?: number | null
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId: session.user.id }
    })
    if (!vehicle) {
      return { success: false, error: 'Kendaraan tidak ditemukan' }
    }

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        stnkTaxDueDate: data.stnkTaxDueDate ? new Date(data.stnkTaxDueDate) : null,
        stnkFiveYearDueDate: data.stnkFiveYearDueDate ? new Date(data.stnkFiveYearDueDate) : null,
        annualTaxAmount: typeof data.annualTaxAmount === 'number' ? data.annualTaxAmount : null,
        swdklljAmount: typeof data.swdklljAmount === 'number' ? data.swdklljAmount : 35000
      }
    })

    revalidatePath('/tax')
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true }
  } catch (error) {
    console.error('Failed to update tax settings:', error)
    return { success: false, error: 'Gagal memperbarui pengaturan pajak' }
  }
}

export async function recordTaxPayment(
  vehicleId: string,
  data: {
    taxType: 'ANNUAL' | 'FIVE_YEAR'
    paymentDate: string
    amount: number
    note?: string
    advanceDueDate?: boolean
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId: session.user.id }
    })
    if (!vehicle) {
      return { success: false, error: 'Kendaraan tidak ditemukan' }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Buat catatan pembayaran
      await tx.taxRecord.create({
        data: {
          vehicleId,
          taxType: data.taxType,
          paymentDate: new Date(data.paymentDate),
          amount: data.amount,
          note: data.note?.trim() || null
        }
      })

      // 2. Majukan tanggal jatuh tempo jika dipilih
      if (data.advanceDueDate) {
        const updates: Record<string, any> = {}

        if (data.taxType === 'ANNUAL') {
          const currentDue = vehicle.stnkTaxDueDate ? new Date(vehicle.stnkTaxDueDate) : new Date(data.paymentDate)
          const nextYearDue = new Date(currentDue)
          nextYearDue.setFullYear(nextYearDue.getFullYear() + 1)
          updates.stnkTaxDueDate = nextYearDue
        } else if (data.taxType === 'FIVE_YEAR') {
          const current5Year = vehicle.stnkFiveYearDueDate ? new Date(vehicle.stnkFiveYearDueDate) : new Date(data.paymentDate)
          const next5Year = new Date(current5Year)
          next5Year.setFullYear(next5Year.getFullYear() + 5)
          updates.stnkFiveYearDueDate = next5Year

          // Pajak tahunan juga otomatis maju 1 tahun
          const currentAnnual = vehicle.stnkTaxDueDate ? new Date(vehicle.stnkTaxDueDate) : new Date(data.paymentDate)
          const nextAnnual = new Date(currentAnnual)
          nextAnnual.setFullYear(nextAnnual.getFullYear() + 1)
          updates.stnkTaxDueDate = nextAnnual
        }

        if (Object.keys(updates).length > 0) {
          await tx.vehicle.update({
            where: { id: vehicleId },
            data: updates
          })
        }
      }
    })

    revalidatePath('/tax')
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true }
  } catch (error) {
    console.error('Failed to record tax payment:', error)
    return { success: false, error: 'Gagal mencatat pembayaran pajak' }
  }
}

export async function deleteTaxRecord(recordId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const record = await prisma.taxRecord.findUnique({
      where: { id: recordId },
      include: { vehicle: true }
    })
    if (!record || record.vehicle.userId !== session.user.id) {
      return { success: false, error: 'Data tidak ditemukan atau tidak memiliki hak akses' }
    }

    await prisma.taxRecord.delete({
      where: { id: recordId }
    })

    revalidatePath('/tax')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete tax record:', error)
    return { success: false, error: 'Gagal menghapus riwayat pajak' }
  }
}
