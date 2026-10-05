'use client'

import { Cookie, ChevronRight } from 'lucide-react'

export default function CookieSettingsTrigger() {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cruz_open_cookie_preferences'))
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
          <Cookie className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs font-black text-foreground block">Preferensi Cookie</span>
          <span className="text-[11px] font-bold text-foreground/60">Atur izin cookie aplikasi</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
    </button>
  )
}
