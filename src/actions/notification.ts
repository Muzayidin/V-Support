'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updateNotificationSettings(data: {
  odometerReminderDays: number
  odometerReminderEnabled: boolean
  componentReminderEnabled: boolean
  taxReminderEnabled: boolean
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Tidak terautentikasi')
  }

  const days = Math.max(1, Math.min(90, Number(data.odometerReminderDays) || 7))

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      odometerReminderDays: days,
      odometerReminderEnabled: Boolean(data.odometerReminderEnabled),
      componentReminderEnabled: Boolean(data.componentReminderEnabled),
      taxReminderEnabled: Boolean(data.taxReminderEnabled)
    }
  })

  revalidatePath('/profile/notifications')
  revalidatePath('/dashboard')
  return { success: true }
}
