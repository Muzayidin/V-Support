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
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-3.5 sm:p-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] bg-overlay backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Centered Modal */}
      <div className="bg-secondary-background w-full max-w-sm sm:max-w-md rounded-[var(--radius-base)] p-4 sm:p-5 flex flex-col gap-3.5 border-2 border-border shadow-[5px_5px_0px_0px_var(--border)] sm:shadow-[6px_6px_0px_0px_var(--border)] max-h-[min(74dvh,540px)] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Success Icon & Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-1">
          <div className="w-12 h-12 rounded-full bg-main border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center mb-2 text-black">
            <CheckCircle2 className="w-7 h-7 stroke-[3]" />
          </div>
          <h2 className="font-black text-base text-foreground tracking-tight">Data Berhasil Disimpan!</h2>
        </div>
        
        {/* System Suggestion Box */}
        <div className="bg-background rounded-[var(--radius-base)] p-3.5 border-2 border-border shadow-[2.5px_2.5px_0px_0px_var(--border)] relative">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-[11px] uppercase tracking-wider text-foreground mb-1">Saran Sistem</h3>
              <p className="font-bold text-xs text-foreground/80 leading-relaxed">
                {suggestionText}
              </p>
              
              <div className="mt-2.5 bg-secondary-background inline-flex px-2.5 py-1 rounded-[var(--radius-base)] border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)] items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-foreground" />
                <span className="text-[10px] font-bold text-foreground/70">Estimasi biaya berikutnya:</span>
                <span className="text-[11px] font-black text-foreground">Rp 45.000</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-1 pt-2 border-t-2 border-border">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-main hover:bg-[#8AE500] text-black rounded-[var(--radius-base)] font-black text-xs uppercase tracking-wider border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Selesai & Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  )
}
