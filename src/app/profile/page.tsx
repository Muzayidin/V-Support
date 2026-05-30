import prisma from '@/lib/prisma'

export default async function Profile() {
  const user = await prisma.user.findFirst()

  return (
    <>
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-margin-page h-14 w-full bg-surface-bg sticky top-0 z-40 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" data-weight="fill">motorcycle</span>
          <h1 className="text-headline-md font-headline-md font-bold text-primary">V-Support</h1>
        </div>
      </header>

      <main className="px-margin-page py-4 flex flex-col gap-gutter-stack pb-24 md:max-w-md md:mx-auto">
        {/* Profile Header */}
        <section className="bg-surface-card rounded-xl p-padding-card shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex items-center gap-4 border border-surface-container-low">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-surface-container-high bg-surface-container-high relative">
            <img 
              alt="Profile Picture" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9jnawtGqrs8KI6gVUkFEhhW7Uj2J6mO4BXQVwD7sBinZd79mwMjhMBTX_45uKe1b-eUIfF8M9BvAGdN99F7n3uZSSqHY76Ak-OrS_9gf5l06_NK7Op2i4h564r1KneQERymMNLh8PALkT-ed8n6lfkrBNI22tk-A4Nrubncazc6S5NzxcBrFOZAKsz6wiXudq5ThetPmSmOaj7TRv2-nE8jxpMrQJJ-TwbyISs-uT4p1ezepaSK9ZesjsnrCzflLDV_3ZfdPx8qbg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-headline-md font-headline-md text-on-surface">{user?.name || 'Pengguna'}</h2>
            <div className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full mt-1">
              <span className="material-symbols-outlined text-[14px]" data-weight="fill">verified</span>
              <span className="text-label-sm font-label-sm font-semibold">Premium Member</span>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="flex flex-col gap-2 mt-2">
          <h3 className="text-label-bold font-label-bold text-text-muted px-2 uppercase tracking-wider">Pengaturan Akun</h3>
          <div className="bg-surface-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-surface-container-low">
            
            <button className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors min-h-[touch-target-min] border-b border-surface-container-highest last:border-0 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">person_edit</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface font-medium">Edit Profil</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </button>
            
            <button className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors min-h-[touch-target-min] border-b border-surface-container-highest last:border-0 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface font-medium">Ubah Kata Sandi</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </button>

            <button className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors min-h-[touch-target-min] border-b border-surface-container-highest last:border-0 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface font-medium">Pengaturan Notifikasi</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </button>
          </div>
        </section>

        {/* App Info */}
        <section className="flex flex-col gap-2 mt-2">
          <h3 className="text-label-bold font-label-bold text-text-muted px-2 uppercase tracking-wider">Info Aplikasi</h3>
          <div className="bg-surface-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-surface-container-low">
            
            <button className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors min-h-[touch-target-min] border-b border-surface-container-highest last:border-0 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">help</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface font-medium">Pusat Bantuan</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </button>
            
            <button className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors min-h-[touch-target-min] border-b border-surface-container-highest last:border-0 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface font-medium">Kebijakan Privasi</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Logout & Version */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <button className="w-full min-h-[touch-target-min] border border-error-container text-error bg-error-container/10 rounded-lg text-body-lg font-body-lg font-semibold flex items-center justify-center gap-2 hover:bg-error-container transition-colors shadow-sm">
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
          <p className="text-label-sm font-label-sm text-text-muted">Versi 1.2.0</p>
        </div>
      </main>
    </>
  )
}
