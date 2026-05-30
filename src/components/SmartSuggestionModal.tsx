'use client'

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
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .scrim-anim { animation: fadeIn 0.3s ease-out forwards; }
        .sheet-anim { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      {/* Scrim (Dark Overlay) */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-40 scrim-anim"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Modal */}
      <div className="sheet-anim fixed bottom-0 left-1/2 -translate-x-1/2 bg-surface-card w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl rounded-b-none z-50 p-margin-page flex flex-col gap-gutter-stack shadow-2xl">
        {/* Drag Handle (Mobile indication) */}
        <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-2 sm:hidden" />
        
        {/* Success Icon & Header */}
        <div className="flex flex-col items-center text-center mt-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-on-secondary-container text-4xl" data-weight="fill">
              check_circle
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-text-main">Data Berhasil Disimpan!</h2>
        </div>
        
        {/* System Suggestion Box */}
        <div className="bg-surface-container-low rounded-xl p-padding-card border border-surface-variant/50 relative overflow-hidden">
          {/* Decorative subtle accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-xl" />
          
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5">
              insights
            </span>
            <div className="flex-1">
              <h3 className="font-label-bold text-label-bold text-text-main mb-1">Saran Sistem</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {suggestionText}
              </p>
              
              <div className="mt-3 bg-surface-card inline-flex px-3 py-1.5 rounded-lg border border-surface-variant/30 shadow-sm items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">
                  payments
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Estimasi biaya berikutnya:</span>
                <span className="font-label-bold text-label-bold text-text-main">Rp 45.000</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-4 pt-2 border-t border-surface-variant/30 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
          <button 
            onClick={onClose}
            className="w-full h-touch-target-min bg-primary text-on-primary rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg" data-weight="fill">
              home
            </span>
            Selesai & Kembali ke Beranda
          </button>
        </div>
      </div>
    </>
  )
}
