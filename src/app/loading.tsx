import Image from 'next/image'

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 gap-4 animate-in fade-in duration-200">
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl bg-white border-3 border-border shadow-[5px_5px_0px_0px_var(--border)] flex items-center justify-center p-2.5 animate-bounce">
          <Image
            src="/cruz-splash-logo.png"
            alt="Cruz Logo"
            width={85}
            height={85}
            priority
            unoptimized
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-main border-2 border-border animate-ping" />
      </div>

      <div className="text-center space-y-1 mt-2">
        <h3 className="text-sm font-black text-foreground tracking-tight">Memuat Halaman...</h3>
        <p className="text-xs font-bold text-foreground/60">Menyiapkan data kendaraan & sistem Cruz</p>
      </div>

      {/* Neo-brutalist Progress Bar Pulse */}
      <div className="w-48 h-3 bg-secondary-background border-2 border-border rounded-full overflow-hidden shadow-[2px_2px_0px_0px_var(--border)] p-0.5">
        <div className="h-full bg-main border border-border rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  )
}
