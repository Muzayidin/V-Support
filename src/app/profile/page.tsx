import prisma from '@/lib/prisma'
import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { 
  User, 
  ShieldCheck, 
  ChevronRight, 
  UserPen, 
  KeyRound, 
  Bell, 
  HelpCircle, 
  FileText, 
  LogOut,
  Sparkles,
  Bike,
  ExternalLink,
  Trash2
} from 'lucide-react'

import { isDeveloper } from '@/lib/admin'
import DeleteAccountModal from './DeleteAccountModal'
import CookieSettingsTrigger from '@/components/CookieSettingsTrigger'

export default async function Profile() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vehicles: true
    }
  })

  const userName = user?.name || session.user.name || 'Pengguna'
  const userEmail = user?.email || session.user.email || ''
  const vehicleCount = user?.vehicles?.length || 0
  const isUserDev = isDeveloper(userEmail, user?.role)

  const userImage = user?.image || session.user.image
  const isPhoto = userImage && (userImage.startsWith('http') || userImage.startsWith('/') || userImage.startsWith('data:'))

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 w-full bg-background sticky top-0 z-40 border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] md:max-w-md md:mx-auto">
        <div className="flex items-center gap-2">
          <CruzLogo className="w-8 h-8 shrink-0" />
          <h1 className="text-lg font-black text-foreground tracking-tight">Profil Akun</h1>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-base)] bg-main text-black text-xs font-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Cruz</span>
        </div>
      </header>

      <main className="px-4 py-5 flex flex-col gap-5 pb-28 md:max-w-md md:mx-auto">
        {/* Profile Card */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-5 border-2 border-border shadow-[5px_5px_0px_0px_var(--border)] flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-[var(--radius-base)] overflow-hidden shrink-0 border-2 border-border bg-main shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="w-full h-full bg-secondary-background flex items-center justify-center overflow-hidden">
              {isPhoto ? (
                <img 
                  alt="Profile Picture" 
                  className="w-full h-full object-cover" 
                  src={userImage!}
                  referrerPolicy="no-referrer"
                />
              ) : userImage ? (
                <span className="text-3xl select-none">{userImage}</span>
              ) : (
                <User className="w-8 h-8 text-black stroke-[2.5]" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-foreground truncate">{userName}</h2>
            <p className="text-xs text-foreground/70 font-bold truncate">{userEmail}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[var(--radius-base)] text-[11px] font-black bg-main text-black border-2 border-border shadow-[1px_1px_0px_0px_var(--border)]">
                <ShieldCheck className="w-3 h-3 stroke-[3]" />
                Terverifikasi
              </span>
              <span className="text-[11px] font-black text-foreground/80 px-2 py-0.5 bg-background rounded-[var(--radius-base)] border-2 border-border">
                {vehicleCount.toLocaleString('id-ID')} Kendaraan
              </span>
            </div>
          </div>
        </section>

        {/* Area Khusus Developer / Admin */}
        {isUserDev && (
          <section className="space-y-2">
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider px-1 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Developer & Admin Area
            </h3>
            <div className="bg-amber-400/10 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
              <Link 
                href="/admin" 
                className="flex items-center justify-between p-3.5 hover:bg-amber-400/25 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[var(--radius-base)] bg-amber-400 border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-black font-black">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-foreground block">Panel Admin & Statistik</span>
                    <span className="text-[11px] font-bold text-foreground/70">Akses khusus developer sistem</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </section>
        )}

        {/* Pengaturan Akun */}
        <section className="space-y-2">
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider px-1">
            Pengaturan Akun
          </h3>
          <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] divide-y-2 divide-border">
            
            <Link 
              href="/profile/edit" 
              className="flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
                  <UserPen className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black text-foreground block">Edit Profil</span>
                  <span className="text-[11px] font-bold text-foreground/60">Ubah nama dan data pribadi</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <Link 
              href="/profile/password" 
              className="flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black text-foreground block">Ubah Kata Sandi</span>
                  <span className="text-[11px] font-bold text-foreground/60">Keamanan & autentikasi akun</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link 
              href="/profile/notifications" 
              className="flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
                  <Bell className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black text-foreground block">Pengaturan Notifikasi</span>
                  <span className="text-[11px] font-bold text-foreground/60">Pengingat servis & batas odometer</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Info Aplikasi */}
        <section className="space-y-2">
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider px-1">
            Bantuan & Privasi
          </h3>
          <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] divide-y-2 divide-border">
            
            <Link 
              href="/help" 
              className="flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
                  <HelpCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black text-foreground">Pusat Bantuan & Panduan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <Link 
              href="/" 
              className="flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black text-foreground">Halaman Depan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link 
              href="/privacy" 
              className="flex items-center justify-between p-3.5 hover:bg-background transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground group-hover:bg-main group-hover:text-black transition-colors">
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black text-foreground">Kebijakan Privasi</span>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <CookieSettingsTrigger />
          </div>
        </section>

        {/* Zona Hapus Akun */}
        <section className="space-y-2">
          <h3 className="text-xs font-black text-red-600 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Kelola Akun & Zona Bahaya
          </h3>
          <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-red-500/50 shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
            <DeleteAccountModal userEmail={userEmail} />
          </div>
        </section>

        {/* Tombol Logout Nyata & Berfungsi */}
        <div className="mt-2 flex flex-col items-center gap-3">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
            className="w-full"
          >
            <button 
              type="submit"
              className="w-full py-3 px-4 border-2 border-border bg-[#FF4D50] hover:bg-[#e0383b] text-black font-black rounded-[var(--radius-base)] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span>Keluar dari Akun</span>
            </button>
          </form>
          <p className="text-[11px] font-black text-foreground/60">Cruz • Versi 1.2</p>
        </div>
      </main>
    </>
  )
}
