import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import NotificationSettingsForm from './NotificationSettingsForm'
import { ArrowLeft, Bell } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfileNotificationsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      odometerReminderDays: true,
      odometerReminderEnabled: true,
      componentReminderEnabled: true,
      taxReminderEnabled: true
    }
  })

  const initialSettings = {
    odometerReminderDays: user?.odometerReminderDays ?? 7,
    odometerReminderEnabled: user?.odometerReminderEnabled ?? true,
    componentReminderEnabled: user?.componentReminderEnabled ?? true,
    taxReminderEnabled: user?.taxReminderEnabled ?? true
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 w-full bg-background sticky top-0 z-40 border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] md:max-w-md md:mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-1.5 rounded-[var(--radius-base)] border-2 border-border bg-secondary-background hover:bg-background text-foreground transition-all shadow-[2px_2px_0px_0px_var(--border)]"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <div className="flex items-center gap-2">
            <CruzLogo className="w-7 h-7" />
            <h1 className="text-base font-black text-foreground tracking-tight">
              Pengaturan Notifikasi
            </h1>
          </div>
        </div>

        <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
          <Bell className="w-4 h-4" />
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 py-5 flex flex-col gap-5 pb-28 md:max-w-md md:mx-auto">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-foreground tracking-tight">
            Preferensi & Jadwal Pengingat
          </h2>
          <p className="text-xs font-bold text-foreground/60 leading-relaxed">
            Atur kapan sistem Cruz mengingatkan Anda untuk memasukkan kilometer odometer dan melakukan servis berkala.
          </p>
        </div>

        <NotificationSettingsForm initialSettings={initialSettings} />
      </main>
    </>
  )
}
