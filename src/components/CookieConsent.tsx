'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, Shield, Check, X, ChevronDown, ChevronUp, Lock } from 'lucide-react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Cek apakah persetujuan cookie sudah disimpan sebelumnya
    const consent = localStorage.getItem('cruz_cookie_consent')
    if (!consent) {
      // Tampilkan banner setelah sedikit delay agar tidak mengganggu first render
      const timer = setTimeout(() => setIsVisible(true), 800)
      return () => clearTimeout(timer)
    }

    // Dengarkan event kustom untuk membuka kembali preferensi cookie dari halaman profil
    const handleReopen = () => setIsVisible(true)
    window.addEventListener('cruz_open_cookie_preferences', handleReopen)
    return () => window.removeEventListener('cruz_open_cookie_preferences', handleReopen)
  }, [])

  const saveConsent = (type: 'all' | 'essential') => {
    localStorage.setItem('cruz_cookie_consent', type)
    document.cookie = `cruz_cookie_consent=${type}; path=/; max-age=31536000; SameSite=Lax`
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="Pemberitahuan Cookie & Privasi"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300"
    >
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[6px_6px_0px_0px_var(--border)] space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)] flex items-center justify-center text-black font-black shrink-0">
              <Cookie className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-foreground">Penggunaan Cookie di Cruz</h3>
              <p className="text-[11px] font-bold text-foreground/60">Privasi & kenyamanan Anda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => saveConsent('essential')}
            className="w-7 h-7 rounded-[var(--radius-base)] border-2 border-border bg-background flex items-center justify-center text-foreground hover:bg-slate-200 cursor-pointer"
            title="Tutup & Gunakan Cookie Esensial Saja"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-foreground/80 font-medium leading-relaxed">
          Kami menggunakan cookie untuk memastikan sesi login Anda aman, menjaga preferensi kendaraan aktif, serta mempercepat waktu muat aplikasi.
        </p>

        {/* Expandable Details */}
        {showDetails && (
          <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] text-[11px] space-y-2.5 animate-in fade-in">
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-main stroke-[3] shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-foreground">1. Cookie Esensial (Wajib):</p>
                <p className="text-foreground/70">
                  Digunakan untuk otentikasi login terenkripsi (Auth.js) dan perlindungan dari serangan web (CSRF Token).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-foreground">2. Cookie Preferensi & Pengingat:</p>
                <p className="text-foreground/70">
                  Menyimpan pilihan kendaraan motor terakhir dan pengaturan notifikasi lokal pada perangkat Anda.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-foreground/60 pt-1 border-t border-border/50">
              Kami tidak menggunakan cookie pelacak pihak ketiga atau iklan. Baca detail di{' '}
              <Link href="/privacy" className="underline font-bold text-foreground hover:text-main">
                Kebijakan Privasi
              </Link>.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-black text-foreground/70 hover:text-foreground flex items-center gap-1 cursor-pointer"
          >
            <span>{showDetails ? 'Sembunyikan Rincian' : 'Rincian Cookie'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => saveConsent('essential')}
              className="py-1.5 px-3 bg-background hover:bg-slate-200 border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)] cursor-pointer"
            >
              Hanya Esensial
            </button>
            <button
              type="button"
              onClick={() => saveConsent('all')}
              className="py-1.5 px-3 bg-main hover:bg-[#8AE500] border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Setujui Semua</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
