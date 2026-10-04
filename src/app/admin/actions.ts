'use server'

import prisma from '@/lib/prisma'
import { getVerifiedDeveloper } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN') {
  const currentDev = await getVerifiedDeveloper()
  if (!currentDev) {
    throw new Error('Akses ditolak: Hanya developer yang dapat mengubah peran pengguna.')
  }

  // Prevent demoting self if currently the only admin
  if (currentDev.id === userId && newRole === 'USER') {
    throw new Error('Anda tidak dapat menurunkan hak akses akun developer Anda sendiri.')
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteUser(userId: string) {
  const currentDev = await getVerifiedDeveloper()
  if (!currentDev) {
    throw new Error('Akses ditolak: Hanya developer yang dapat menghapus data pengguna.')
  }

  if (currentDev.id === userId) {
    throw new Error('Anda tidak dapat menghapus akun Anda sendiri dari panel admin.')
  }

  // Delete all user related data
  await prisma.$transaction(async (tx) => {
    // Delete service details and service records
    const vehicles = await tx.vehicle.findMany({
      where: { userId },
      select: { id: true }
    })
    const vehicleIds = vehicles.map(v => v.id)

    if (vehicleIds.length > 0) {
      await tx.taxRecord.deleteMany({
        where: { vehicleId: { in: vehicleIds } }
      })

      const serviceRecords = await tx.serviceRecord.findMany({
        where: { vehicleId: { in: vehicleIds } },
        select: { id: true }
      })
      const serviceRecordIds = serviceRecords.map(s => s.id)

      if (serviceRecordIds.length > 0) {
        await tx.serviceDetail.deleteMany({
          where: { serviceRecordId: { in: serviceRecordIds } }
        })
        await tx.serviceRecord.deleteMany({
          where: { id: { in: serviceRecordIds } }
        })
      }

      await tx.vehicle.deleteMany({
        where: { id: { in: vehicleIds } }
      })
    }

    await tx.account.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })
    await tx.user.delete({ where: { id: userId } })
  })

  revalidatePath('/admin')
  return { success: true }
}
