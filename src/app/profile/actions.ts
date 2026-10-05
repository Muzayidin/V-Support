'use server'

import prisma from '@/lib/prisma'
import { auth, signOut } from '@/auth'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function updateProfile(data: { name: string; image?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Sesi tidak valid. Silakan login kembali.')
  }

  const trimmedName = data.name.trim()
  if (!trimmedName) {
    throw new Error('Nama lengkap tidak boleh kosong.')
  }

  if (trimmedName.length > 60) {
    throw new Error('Nama lengkap maksimal 60 karakter.')
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: trimmedName,
      ...(data.image !== undefined ? { image: data.image } : {})
    }
  })

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function changePassword(data: { currentPassword?: string; newPassword: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Sesi tidak valid. Silakan login kembali.')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    throw new Error('Pengguna tidak ditemukan.')
  }

  if (data.newPassword.length < 6) {
    throw new Error('Kata sandi baru minimal 6 karakter.')
  }

  // Jika user sudah memiliki kata sandi sebelumnya, wajib verifikasi kata sandi lama
  if (user.password) {
    if (!data.currentPassword) {
      throw new Error('Harap masukkan kata sandi saat ini.')
    }
    const isMatch = await bcrypt.compare(data.currentPassword, user.password)
    if (!isMatch) {
      throw new Error('Kata sandi saat ini salah.')
    }
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  })

  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Sesi tidak valid. Silakan login kembali.')
  }

  const userId = session.user.id

  await prisma.$transaction(async (tx) => {
    // 1. Ambil semua kendaraan pengguna
    const vehicles = await tx.vehicle.findMany({
      where: { userId },
      select: { id: true }
    })
    const vehicleIds = vehicles.map((v) => v.id)

    if (vehicleIds.length > 0) {
      // Hapus data pajak kendaraan
      await tx.taxRecord.deleteMany({
        where: { vehicleId: { in: vehicleIds } }
      })

      // Cari semua riwayat servis
      const serviceRecords = await tx.serviceRecord.findMany({
        where: { vehicleId: { in: vehicleIds } },
        select: { id: true }
      })
      const serviceRecordIds = serviceRecords.map((s) => s.id)

      if (serviceRecordIds.length > 0) {
        // Hapus detail servis
        await tx.serviceDetail.deleteMany({
          where: { serviceRecordId: { in: serviceRecordIds } }
        })
        // Hapus riwayat servis
        await tx.serviceRecord.deleteMany({
          where: { id: { in: serviceRecordIds } }
        })
      }

      // Hapus kendaraan
      await tx.vehicle.deleteMany({
        where: { id: { in: vehicleIds } }
      })
    }

    // 2. Hapus akun oauth & session
    await tx.account.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })

    // 3. Hapus user
    await tx.user.delete({ where: { id: userId } })
  })

  // Sign out user dan redirect
  await signOut({ redirectTo: '/login?deleted=true' })
}
