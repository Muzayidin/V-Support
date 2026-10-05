'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Sparkles, Bike } from 'lucide-react'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [progress, setProgress] = useState(20)

  useEffect(() => {
    // Cek apakah ada query test (?splash=1) atau belum pernah melihat splash di sesi ini
    const isTestParam = typeof window !== 'undefined' && window.location.search.includes('splash=1')
    const hasSeenSplash = sessionStorage.getItem('cruz_splash_seen')
    
    if (hasSeenSplash && !isTestParam) {
      return
    }

    setIsVisible(true)

    // Progress bar animation
    const p1 = setTimeout(() => setProgress(65), 350)
    const p2 = setTimeout(() => setProgress(100), 850)

    // Fade out setelah ~1.4 detik
    const timerFade = setTimeout(() => {
      setIsFading(true)
    }, 1400)

    // Hilangkan dari DOM setelah animasi fade selesai
    const timerDismiss = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('cruz_splash_seen', 'true')
    }, 1800)

    return () => {
      clearTimeout(p1)
      clearTimeout(p2)
      clearTimeout(timerFade)
      clearTimeout(timerDismiss)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      onClick={() => {
        setIsFading(true)
        setTimeout(() => {
          setIsVisible(false)
          sessionStorage.setItem('cruz_splash_seen', 'true')
        }, 300)
      }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 bg-[#FFE500] text-black select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Cruz Splash Screen"
    >
      {/* Top Decor Header */}
      <div className="w-full flex justify-between items-center pt-2">
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-black text-white rounded-[var(--radius-base)] border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Cruz v1.3
        </span>
        <div className="flex items-center gap-1.5 text-xs font-black bg-white/90 px-2.5 py-1 rounded-[var(--radius-base)] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Smart Assistant</span>
        </div>
      </div>

      {/* Main Center Logo with Dedicated Background Card */}
      <div className="flex flex-col items-center text-center gap-5 my-auto animate-in zoom-in-95 duration-200">
        <div className="relative">
          {/* Card background untuk icon/logo utama */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white border-[3.5px] border-black shadow-[8px_8px_0px_0px_#000] flex items-center justify-center p-3 sm:p-4">
            <Image
              src="/cruz-splash-logo.png"
              alt="Cruz Logo"
              width={180}
              height={180}
              priority
              unoptimized
              className="w-full h-full object-contain select-none drop-shadow-sm"
            />
          </div>
          {/* Badge Aksen */}
          <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-xl bg-black text-[#FFE500] border-2 border-white shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 text-[11px] font-black">
            <Bike className="w-4 h-4 stroke-[2.5]" />
            <span>APP</span>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <p className="text-xs sm:text-sm font-black text-black/85 max-w-xs leading-relaxed uppercase tracking-wider">
            Asisten Perawatan Motor Pintar
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black rounded-full text-[11px] font-black shadow-[2px_2px_0px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-[#00D696] animate-pulse" />
            <span>Motor Bensin (ICE) & Listrik (EV)</span>
          </div>
        </div>

        {/* Loading Progress Bar Neo-Brutalist */}
        <div className="w-52 sm:w-60 space-y-2 mt-3">
          <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden shadow-[3px_3px_0px_0px_#000] p-0.5">
            <div
              className="h-full bg-black rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-black/75 px-1">
            <span>{progress < 100 ? 'Memuat Sistem...' : 'Siap Digunakan'}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center pb-2">
        <p className="text-[10px] font-black text-black/60">
          Mode Offline & PWA Aktif • Sentuh layar untuk lewati
        </p>
      </div>
    </div>
  )
}
