'use client'

import { CheckCircle2, Sparkles, Coins, Home } from 'lucide-react'

interface SmartSuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  suggestionText?: string
}

export default function SmartSuggestionModal({ 
  isOpen, 
  onClose,
  suggestionText = "Berdasarkan riwayat, Kampas Rem Belakang Anda perlu diperiksa dalam 1.000 KM lagi."
}: SmartSuggestionModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Scrim (Dark Overlay) */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 bg-overlay backdrop-blur-xs z-40 animate-in fade-in duration-150"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-secondary-background w-full sm:max-w-md rounded-t-[var(--radius-base)] sm:rounded-[var(--radius-base)] z-50 p-6 flex flex-col gap-4 border-2 border-border shadow-[0_-4px_0px_0px_var(--border)] sm:shadow-[6px_6px_0px_0px_var(--border)] animate-in slide-in-from-bottom duration-200">
        {/* Success Icon & Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-1">
          <div className="w-14 h-14 rounded-full bg-main border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center mb-3 text-black">
            <CheckCircle2 className="w-8 h-8 stroke-[3]" />
          </div>
          <h2 className="font-black text-lg text-foreground tracking-tight">Data Berhasil Disimpan!</h2>
        </div>
        
        {/* System Suggestion Box */}
        <div className="bg-background rounded-[var(--radius-base)] p-4 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] relative">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 fill-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xs uppercase tracking-wider text-foreground mb-1">Saran Sistem</h3>
              <p className="font-bold text-xs text-foreground/80 leading-relaxed">
                {suggestionText}
              </p>
              
              <div className="mt-3 bg-secondary-background inline-flex px-3 py-1.5 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] items-center gap-2">
                <Coins className="w-4 h-4 text-foreground" />
                <span className="text-[11px] font-bold text-foreground/70">Estimasi biaya berikutnya:</span>
                <span className="text-xs font-black text-foreground">Rp 45.000</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-2 pt-2 border-t-2 border-border pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-main hover:bg-[#8AE500] text-black rounded-[var(--radius-base)] font-black text-xs uppercase tracking-wider border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Selesai & Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </>
  )
}
