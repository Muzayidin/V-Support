'use client'

import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default function Privacy() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] px-4 h-16 flex items-center gap-3 md:max-w-md md:mx-auto">
        <Link 
          href="/profile" 
          className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </Link>
        <h1 className="font-black text-lg text-foreground tracking-tight">Kebijakan Privasi</h1>
      </header>

      <main className="px-4 py-5 flex flex-col gap-4 md:max-w-md md:mx-auto pb-28">
        <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-border">
            <div className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">Perlindungan Data Pribadi</h2>
              <span className="text-[10px] font-bold text-foreground/60">Terakhir diperbarui: September 2026</span>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed font-bold text-foreground/80">
            <div>
              <h3 className="font-black text-xs text-foreground uppercase mb-1">1. Pengumpulan Data</h3>
              <p>Kami mengumpulkan data yang Anda berikan saat mendaftar, termasuk nama, email, dan detail spesifikasi kendaraan Anda untuk keperluan kalkulasi servis.</p>
            </div>
            <div>
              <h3 className="font-black text-xs text-foreground uppercase mb-1">2. Penggunaan Data</h3>
              <p>Data Anda digunakan secara eksklusif untuk algoritma pengingat servis yang akurat dan estimasi biaya perawatan kendaraan Anda.</p>
            </div>
            <div>
              <h3 className="font-black text-xs text-foreground uppercase mb-1">3. Keamanan & Kerahasiaan</h3>
              <p>Data tersimpan dengan enkripsi standar industri. Kami menjamin data pribadi Anda tidak diperjualbelikan kepada pihak ketiga manapun.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
