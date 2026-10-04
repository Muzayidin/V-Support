import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import WelcomeForm from "./WelcomeForm"
import ResetTestVehiclesButton from "./ResetTestVehiclesButton"
import { FlaskConical } from "lucide-react"

export default async function WelcomePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Hitung jumlah kendaraan user saat ini
  const vehicleCount = await prisma.vehicle.count({
    where: { userId: session.user.id }
  })

  const userName = (session.user.name || "Pengguna").split(" ")[0]

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-4 sm:space-y-5">
        {/* Banner Mode Uji Coba */}
        {vehicleCount > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FACC00] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] rounded-[var(--radius-base)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background border-2 border-border flex items-center justify-center shrink-0 font-bold shadow-[2px_2px_0px_0px_var(--border)]">
                <FlaskConical className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <span className="font-extrabold text-foreground block text-xs tracking-tight">MODE UJI COBA AKTIF</span>
                <span className="text-foreground text-[11px] font-medium leading-tight">
                  Terdapat {vehicleCount} kendaraan tersimpan. Anda bisa menguji ulang atau mereset data.
                </span>
              </div>
            </div>
            <ResetTestVehiclesButton />
          </div>
        )}

        {/* Header Hero */}
        <div className="text-center space-y-1 sm:space-y-1.5 pt-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight uppercase">
            Selamat Datang, <span className="bg-main px-2 py-0.5 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)]">{userName}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-foreground/80 max-w-md mx-auto font-medium">
            Daftarkan motor Anda untuk mengaktifkan pemantauan dan estimasi servis otomatis.
          </p>
        </div>

        {/* Welcome Onboarding Form */}
        <WelcomeForm />

        <p className="text-center text-xs text-foreground/60 pt-2 font-medium">
          Data dapat disesuaikan kembali kapan saja melalui menu Manajemen Kendaraan.
        </p>
      </div>
    </div>
  )
}
