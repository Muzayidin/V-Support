'use client'

import Link from 'next/link'

export default function ProfileEdit() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface shadow-sm px-margin-page h-14 flex items-center gap-4 md:max-w-md md:mx-auto">
        <Link href="/profile" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-surface-container-high">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-surface">Edit Profil</h1>
      </header>

      <main className="p-margin-page flex flex-col gap-6 md:max-w-md md:mx-auto pb-24">
        {/* Avatar Edit */}
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-container-high bg-surface-container-high">
              <img 
                alt="Profile Picture" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9jnawtGqrs8KI6gVUkFEhhW7Uj2J6mO4BXQVwD7sBinZd79mwMjhMBTX_45uKe1b-eUIfF8M9BvAGdN99F7n3uZSSqHY76Ak-OrS_9gf5l06_NK7Op2i4h564r1KneQERymMNLh8PALkT-ed8n6lfkrBNI22tk-A4Nrubncazc6S5NzxcBrFOZAKsz6wiXudq5ThetPmSmOaj7TRv2-nE8jxpMrQJJ-TwbyISs-uT4p1ezepaSK9ZesjsnrCzflLDV_3ZfdPx8qbg"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm border-2 border-surface">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Nama Lengkap</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">person</span>
              <input 
                type="text" 
                defaultValue="Budi Pratama"
                className="w-full h-full pl-10 pr-3 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Email</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">mail</span>
              <input 
                type="email" 
                defaultValue="budi.pratama@example.com"
                className="w-full h-full pl-10 pr-3 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Nomor Telepon</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">call</span>
              <input 
                type="tel" 
                defaultValue="+6281234567890"
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
            Simpan Perubahan
          </Link>
        </div>
      </main>
    </>
  )
}
