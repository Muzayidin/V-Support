'use client'

import Link from 'next/link'

export default function ProfilePassword() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface shadow-sm px-margin-page h-14 flex items-center gap-4 md:max-w-md md:mx-auto">
        <Link href="/profile" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-surface-container-high">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-surface">Ubah Kata Sandi</h1>
      </header>

      <main className="p-margin-page flex flex-col gap-6 md:max-w-md md:mx-auto pb-24">
        <form className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Kata Sandi Saat Ini</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">lock</span>
              <input 
                type="password" 
                placeholder="Masukkan kata sandi saat ini"
                className="w-full h-full pl-10 pr-3 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Kata Sandi Baru</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">key</span>
              <input 
                type="password" 
                placeholder="Masukkan kata sandi baru"
                className="w-full h-full pl-10 pr-3 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
              />
            </div>
            <p className="text-label-sm font-label-sm text-text-muted mt-1 px-1">Minimal 8 karakter, mengandung huruf dan angka.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Konfirmasi Kata Sandi Baru</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">check_circle</span>
              <input 
                type="password" 
                placeholder="Ulangi kata sandi baru"
                className="w-full h-full pl-10 pr-3 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
              />
            </div>
          </div>
        </form>

        {/* Fixed Bottom Action */}
        <div className="fixed bottom-0 left-0 w-full bg-surface p-margin-page shadow-[0_-4px_16px_rgba(0,0,0,0.05)] border-t border-surface-container z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2">
          <Link 
            href="/profile"
            className="w-full min-h-[touch-target-min] bg-primary text-on-primary font-label-bold text-label-bold rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-200 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            Simpan Kata Sandi
          </Link>
        </div>
      </main>
    </>
  )
}
