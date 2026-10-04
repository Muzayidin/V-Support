'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import WelcomeForm from '@/app/welcome/WelcomeForm'

export default function AddVehiclePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Sticky */}
      <header className="w-full top-0 sticky bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] flex justify-between items-center px-3.5 sm:px-4 h-14 sm:h-16 z-40 max-w-xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Link 
            href="/vehicles"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="font-black text-base sm:text-lg text-foreground tracking-tight uppercase">Tambah Kendaraan</h1>
            <p className="text-[10px] sm:text-xs font-bold text-foreground/70">
              Lengkapi spesifikasi, riwayat servis & estimasi komponen
            </p>
          </div>
        </div>
        <div className="text-[11px] sm:text-xs font-black bg-main border-2 border-border px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
          Cruz
        </div>
      </header>

      {/* Main Content with Full 4-Step Form */}
      <main className="pb-24 pt-3.5 sm:pt-5 px-4 max-w-xl mx-auto space-y-4">
        <WelcomeForm 
          submitButtonLabel="Simpan Kendaraan"
          onSuccess={(vehicleId) => {
            router.push(`/vehicles?vehicleId=${vehicleId}`)
            router.refresh()
          }}
        />
      </main>
    </div>
  )
}
