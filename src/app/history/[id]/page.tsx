import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import ServiceDetailClientView from './ServiceDetailClientView'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { id } = await params

  const record = await prisma.serviceRecord.findUnique({
    where: { id },
    include: {
      details: true,
      vehicle: true
    }
  })

  // Pastikan log servis ada dan milik user yang sedang login
  if (!record || record.vehicle.userId !== session.user.id) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-secondary-background border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6 rounded-[var(--radius-base)] max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-[var(--radius-base)] bg-[#FF4D50] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-white flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-foreground">Log Servis Tidak Ditemukan</h2>
            <p className="text-xs text-foreground/70 font-bold">
              Catatan servis ini mungkin telah dihapus atau Anda tidak memiliki akses.
            </p>
          </div>
          <Link
            href="/history"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-main text-black font-black text-xs uppercase border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Kembali ke Riwayat</span>
          </Link>
        </div>
      </div>
    )
  }

  return <ServiceDetailClientView record={record} />
}
