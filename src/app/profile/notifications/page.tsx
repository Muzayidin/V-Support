'use client'

import Link from 'next/link'

export default function ProfileNotifications() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface shadow-sm px-margin-page h-14 flex items-center gap-4 md:max-w-md md:mx-auto">
        <Link href="/profile" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-surface-container-high">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-surface">Notifikasi</h1>
      </header>

      <main className="p-margin-page flex flex-col gap-6 md:max-w-md md:mx-auto pb-24">
        
        <div className="bg-surface-card rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-surface-container-low flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-body-md text-body-md text-on-surface font-semibold">Pengingat Servis</span>
              <span className="font-label-sm text-label-sm text-text-muted">Notifikasi saat jadwal servis mendekat</span>
            </div>
            {/* Custom toggle switch */}
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
          
          <hr className="border-surface-container-highest" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-body-md text-body-md text-on-surface font-semibold">Pengingat Pajak</span>
              <span className="font-label-sm text-label-sm text-text-muted">Notifikasi perpanjangan STNK & Pajak tahunan</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
          
          <hr className="border-surface-container-highest" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-body-md text-body-md text-on-surface font-semibold">Promo & Penawaran</span>
              <span className="font-label-sm text-label-sm text-text-muted">Informasi diskon bengkel rekanan</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>

        </div>

      </main>
    </>
  )
}
