'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, ChevronDown, Headphones } from 'lucide-react'

const PART_STANDARDS = [
  {
    name: 'Oli Mesin',
    interval: '2.000 - 3.000 KM / 2 Bulan',
    importance: 'Krusial',
    tagColor: 'bg-[#FF4D50] text-black border-2 border-border',
    description: 'Melumasi, mendinginkan, dan membersihkan ruang bakar. Keterlambatan memicu keausan piston.'
  },
  {
    name: 'Oli Gardan (Matic)',
    interval: '6.000 - 8.000 KM',
    importance: 'Penting',
    tagColor: 'bg-[#FACC00] text-black border-2 border-border',
    description: 'Melindungi gear transmisi rasio. Ganti secara berkala (rasio 2-3x ganti oli mesin).'
  },
  {
    name: 'Busi Motor',
    interval: '6.000 - 8.000 KM',
    importance: 'Penting',
    tagColor: 'bg-[#FACC00] text-black border-2 border-border',
    description: 'Menjaga percikan api tetap optimal. Busi aus membuat tarikan berat dan boros BBM.'
  },
  {
    name: 'Filter Udara',
    interval: '8.000 - 10.000 KM',
    importance: 'Disarankan',
    tagColor: 'bg-main text-black border-2 border-border',
    description: 'Menyaring kotoran masuk ke karburator/injektor. Filter tipe kertas basah wajib ganti baru.'
  },
  {
    name: 'Kampas Rem',
    interval: '10.000 - 15.000 KM',
    importance: 'Keselamatan',
    tagColor: 'bg-[#FF4D50] text-black border-2 border-border',
    description: 'Komponen penentu keselamatan. Segera ganti jika ketebalan kampas < 2 mm atau berbunyi decit.'
  },
  {
    name: 'V-Belt & Roller CVT',
    interval: '20.000 - 24.000 KM',
    importance: 'Penting',
    tagColor: 'bg-[#FACC00] text-black border-2 border-border',
    description: 'Penyalur tenaga roda belakang motor matic. Putus di jalan menyebabkan motor mati total.'
  }
]

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Cara menambahkan kendaraan?',
      a: 'Buka menu Kendaraan di bilah navigasi bawah, lalu klik tombol "+" di bagian atas untuk mengisi nama, plat nomor, tipe penggerak (ICE/EV), dan angka odometer awal.'
    },
    {
      q: 'Bagaimana cara memperbarui angka Odometer (KM)?',
      a: 'Anda dapat memperbarui KM langsung di halaman Beranda dengan menekan tombol "Perbarui KM" pada kartu Total Jarak Tempuh, atau otomatis diperbarui saat Anda mencatat servis baru.'
    },
    {
      q: 'Apa itu Buku Servis Digital Cruz?',
      a: 'Buku Servis Digital adalah rekam jejak resmi riwayat perawatan motor Anda yang bisa dicetak atau disimpan sebagai file PDF di halaman Riwayat Servis, berguna untuk membuktikan motor terawat saat dijual kembali.'
    },
    {
      q: 'Bagaimana cara kerja pengingat servis?',
      a: 'Sistem Cruz secara otomatis menghitung selisih odometer saat ini dengan jadwal servis berkala (interval 2.000 KM). Bila sisa jarak tempuh kurang dari 200 KM, status akan berganti menjadi "Perlu Servis".'
    }
  ]

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] px-4 h-16 flex items-center gap-3 md:max-w-md md:mx-auto">
        <Link 
          href="/profile" 
          className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </Link>
        <h1 className="font-black text-lg text-foreground tracking-tight">Pusat Bantuan & Edukasi</h1>
      </header>

      <main className="px-4 py-5 flex flex-col gap-6 md:max-w-md md:mx-auto pb-28">
        {/* Section: Standar Pabrikan */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="font-black text-base text-foreground">Standar Umur Suku Cadang</h2>
          </div>
          <p className="text-foreground/70 mb-3 text-xs font-bold leading-relaxed">
            Panduan acuan pabrikan untuk batas pemakaian ideal komponen agar motor tetap prima dan terhindar dari servis berlebih.
          </p>

          <div className="space-y-3">
            {PART_STANDARDS.map((part) => (
              <div key={part.name} className="bg-secondary-background rounded-[var(--radius-base)] p-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-black text-sm text-foreground">{part.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] ${part.tagColor}`}>
                    {part.importance}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground text-xs font-black">
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{part.interval}</span>
                </div>
                <p className="text-[11px] text-foreground/80 mt-0.5 leading-relaxed font-bold">
                  {part.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: FAQ */}
        <div>
          <h2 className="font-black text-base text-foreground mb-3">Tanya Jawab (FAQ)</h2>
          <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] divide-y-2 divide-border overflow-hidden">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-background transition-colors text-left cursor-pointer"
                >
                  <span className="text-xs font-black text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-foreground stroke-[3] transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-foreground/80 font-bold leading-relaxed bg-background border-t border-border/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Banner */}
        <div className="bg-main text-black p-4 rounded-[var(--radius-base)] flex items-center gap-3.5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="w-10 h-10 bg-secondary-background rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center text-black shrink-0">
            <Headphones className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-black uppercase tracking-wider mb-0.5">Butuh Bantuan Lain?</h3>
            <p className="text-[11px] font-bold text-black/80 leading-relaxed">Aplikasi Cruz dirancang untuk kemandirian perawatan motor Anda.</p>
          </div>
        </div>
      </main>
    </>
  )
}

