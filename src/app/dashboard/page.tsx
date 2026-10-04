import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import prisma from '@/lib/prisma'
import { 
  calculateServiceReminder, 
  calculateAllComponentsStatus, 
  estimateNextServiceCost 
} from '@/lib/calculations'
import VehicleDropdown from '@/components/VehicleDropdown'
import QuickOdometerModal from '@/components/QuickOdometerModal'
import NotificationModal from '@/components/NotificationModal'
import NotificationScheduler from '@/components/NotificationScheduler'
import { getUserNotifications } from '@/lib/notifications'
import { formatThousands } from '@/lib/formatters'
import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { 
  Bike, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  FileText, 
  ChevronRight, 
  Plus, 
  Zap, 
  Wrench, 
  History, 
  Gauge, 
  Disc, 
  CircleDot, 
  Lightbulb, 
  Wallet, 
  Fuel, 
  ArrowUpRight 
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard — Cruz',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const resolvedSearchParams = await searchParams
  const vehicleIdParam = typeof resolvedSearchParams.vehicleId === 'string' ? resolvedSearchParams.vehicleId : undefined

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  if (!user) {
    redirect('/login')
  }

  const allVehicles = await prisma.vehicle.findMany({
    where: { userId: user.id }
  })

  // Jika belum punya kendaraan sama sekali, arahkan ke onboarding welcome
  if (allVehicles.length === 0) {
    redirect('/welcome')
  }

  let vehicle = await prisma.vehicle.findFirst({
    where: { 
      userId: user.id,
      ...(vehicleIdParam ? { id: vehicleIdParam } : {})
    },
    include: {
      serviceRecords: {
        orderBy: { date: 'desc' },
        include: { details: true }
      }
    }
  })

  if (!vehicle) {
    vehicle = await prisma.vehicle.findFirst({
      where: { userId: user.id },
      include: {
        serviceRecords: {
          orderBy: { date: 'desc' },
          include: { details: true }
        }
      }
    })
  }

  if (!vehicle) {
    redirect('/welcome')
  }

  // Logika Kalkulasi Servis & Komponen
  const reminderInfo = calculateServiceReminder(vehicle, vehicle.serviceRecords)
  const allComponents = calculateAllComponentsStatus(vehicle, vehicle.serviceRecords)
  const estimatedCost = estimateNextServiceCost(vehicle.serviceRecords)

  // Overall Health Score (rata-rata kondisi komponen)
  const overallHealth = Math.round(
    allComponents.reduce((sum, c) => sum + c.currentCondition, 0) / (allComponents.length || 1)
  )

  const isHealthy = overallHealth >= 60 && !reminderInfo.needsService
  const isEV = vehicle.engineType === 'EV'
  const userName = (user.name || session.user.name || 'Pengguna').split(' ')[0]

  // Rata-rata per sistem
  const lubeComps = allComponents.filter(c => c.category === 'Pelumasan')
  const brakeComps = allComponents.filter(c => c.category === 'Pengereman')
  const tireComps = allComponents.filter(c => c.category === 'Kaki-kaki')

  const avgLube = lubeComps.length ? Math.round(lubeComps.reduce((s, c) => s + c.currentCondition, 0) / lubeComps.length) : 50
  const avgBrake = brakeComps.length ? Math.round(brakeComps.reduce((s, c) => s + c.currentCondition, 0) / brakeComps.length) : 50
  const avgTire = tireComps.length ? Math.round(tireComps.reduce((s, c) => s + c.currentCondition, 0) / tireComps.length) : 50

  // Komponen yang perlu perhatian
  const urgentComponents = allComponents.filter(c => c.status === 'CRITICAL' || c.status === 'WARNING')

  // Preview 4 komponen utama
  const previewComponents = allComponents.slice(0, 4)

  // Statistik Servis
  const totalServiceSpent = vehicle.serviceRecords.reduce((sum, r) => sum + r.totalCost, 0)
  const lastRecord = vehicle.serviceRecords[0]

  // Status Pajak STNK
  const todayZero = new Date()
  todayZero.setHours(0, 0, 0, 0)
  const taxDaysLeft = vehicle.stnkTaxDueDate
    ? Math.ceil((new Date(vehicle.stnkTaxDueDate).getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24))
    : null
  const fiveYearDaysLeft = vehicle.stnkFiveYearDueDate
    ? Math.ceil((new Date(vehicle.stnkFiveYearDueDate).getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Notifikasi Pengingat Odometer & Komponen
  const userNotificationsData = await getUserNotifications(user.id)
  const currentVehicleOdoNotif = userNotificationsData.notifications.find(
    (n) => n.type === 'ODOMETER' && n.vehicleId === vehicle.id
  )

  const isTaxAlert = (taxDaysLeft !== null && taxDaysLeft <= 30) || (fiveYearDaysLeft !== null && fiveYearDaysLeft <= 30)
  const isAnyOverdue = (taxDaysLeft !== null && taxDaysLeft < 0) || (fiveYearDaysLeft !== null && fiveYearDaysLeft < 0)

  const getConditionColor = (val: number) => {
    if (val >= 70) return 'text-[#8AE500]'
    if (val >= 40) return 'text-[#FACC00]'
    return 'text-[#FF4D50]'
  }

  const getConditionBadgeBg = (val: number) => {
    if (val >= 70) return 'bg-[#8AE500] text-black'
    if (val >= 40) return 'bg-[#FACC00] text-black'
    return 'bg-[#FF4D50] text-white'
  }

  return (
    <>
      <NotificationScheduler
        scheduledTime={userNotificationsData.settings.odometerReminderTime}
        enabled={userNotificationsData.settings.odometerReminderEnabled}
        notifications={userNotificationsData.notifications}
      />
      {/* Header */}
      <header className="w-full top-0 sticky bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] flex justify-between items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 z-40 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <CruzLogo className="w-8 h-8 sm:w-9 sm:h-9" />
          <span className="font-black text-base sm:text-lg text-foreground tracking-tight">Cruz</span>
        </div>
        <div className="flex items-center gap-2 relative min-w-0">
          <Suspense fallback={<div className="w-24 sm:w-28 h-7 sm:h-8 bg-secondary-background border-2 border-border animate-pulse rounded-[var(--radius-base)]" />}>
            <VehicleDropdown vehicles={allVehicles} activeVehicleId={vehicle.id} />
          </Suspense>
          <NotificationModal
            notifications={userNotificationsData.notifications}
            counts={userNotificationsData.counts}
            vehicles={allVehicles.map((v) => ({ id: v.id, name: v.name, currentMileage: v.currentMileage }))}
          />
        </div>
      </header>
      
      <main className="px-3 sm:px-4 py-3.5 sm:py-5 space-y-4 sm:space-y-5 pb-24 sm:pb-28 md:max-w-md md:mx-auto max-w-full overflow-hidden">
        {/* Greeting Banner & Active Vehicle Tag */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-black text-foreground tracking-tight truncate">Halo, {userName}! 👋</h2>
            <p className="text-[11px] sm:text-xs text-foreground/80 mt-0.5 font-bold flex items-center gap-1.5 truncate">
              <span className="truncate">{vehicle.name}</span>
              {vehicle.licensePlate && (
                <span className="px-1.5 py-0.2 bg-background border border-border rounded-[var(--radius-base)] text-[9px] uppercase font-black shrink-0">
                  {vehicle.licensePlate}
                </span>
              )}
            </p>
          </div>
          {isEV ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-[var(--radius-base)] text-[11px] sm:text-xs font-black bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
              {vehicle.vehicleType === 'CAR' ? 'Mobil Listrik' : 'Motor Listrik'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-[var(--radius-base)] text-[11px] sm:text-xs font-black bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
              <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              {vehicle.vehicleType === 'CAR' ? 'Mobil Bensin' : 'Bensin (ICE)'}
            </span>
          )}
        </div>

        {/* Peringatan Update Odometer jika sudah jatuh tempo */}
        {currentVehicleOdoNotif && (
          <div className="rounded-[var(--radius-base)] p-3 sm:p-3.5 bg-main border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-between gap-2.5 text-black">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-black text-white border-2 border-border flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_var(--border)]">
                <Gauge className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-black text-[9px] uppercase tracking-wider bg-black text-white px-1.5 py-0.2 rounded-[var(--radius-base)] shrink-0">
                  Update Odometer
                </span>
                <p className="text-[11px] font-black mt-0.5 truncate">
                  Sudah {currentVehicleOdoNotif.daysSinceLastUpdate} hari belum diupdate ({formatThousands(vehicle.currentMileage)} km)
                </p>
              </div>
            </div>
            <QuickOdometerModal
              vehicleId={vehicle.id}
              vehicleName={vehicle.name}
              currentMileage={vehicle.currentMileage}
              buttonClassName="px-2.5 py-1 bg-background hover:bg-slate-200 text-foreground border-2 border-border text-[10px] sm:text-xs font-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] shrink-0 cursor-pointer transition-all"
            />
          </div>
        )}

        {/* Peringatan Jatuh Tempo Pajak STNK (H-30 atau Terlambat) */}
        {isTaxAlert && (
          <Link
            href={`/tax?vehicleId=${vehicle.id}`}
            className={`rounded-[var(--radius-base)] p-3 sm:p-3.5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-between gap-2 text-black transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer max-w-full ${
              isAnyOverdue ? 'bg-[#FF4D50]' : 'bg-[#FACC00]'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-black text-white border-2 border-border flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_var(--border)]">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-[9px] uppercase tracking-wider bg-black text-white px-1.5 py-0.2 rounded-[var(--radius-base)] shrink-0">
                    {isAnyOverdue ? 'Pajak Terlambat' : 'Pajak Segera Jatuh Tempo'}
                  </span>
                  {taxDaysLeft !== null && taxDaysLeft >= 0 && taxDaysLeft <= 30 && (
                    <span className="text-[10px] font-black underline shrink-0">
                      H-{taxDaysLeft} Hari Lagi
                    </span>
                  )}
                  {fiveYearDaysLeft !== null && fiveYearDaysLeft >= 0 && fiveYearDaysLeft <= 30 && (
                    <span className="text-[10px] font-black underline shrink-0">
                      Ganti Plat H-{fiveYearDaysLeft}
                    </span>
                  )}
                </div>
                <p className="text-xs font-black mt-0.5 leading-snug line-clamp-2">
                  {taxDaysLeft !== null && taxDaysLeft < 0
                    ? `Pajak tahunan STNK terlewat ${Math.abs(taxDaysLeft)} hari! Segera perpanjang.`
                    : taxDaysLeft !== null && taxDaysLeft <= 30
                      ? `Pajak tahunan STNK jatuh tempo dalam ${taxDaysLeft} hari (${new Date(vehicle.stnkTaxDueDate!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}).`
                      : fiveYearDaysLeft !== null && fiveYearDaysLeft < 0
                        ? `Plat 5 Tahunan terlewat ${Math.abs(fiveYearDaysLeft)} hari!`
                        : `Masa berlaku Plat 5 Tahunan segera habis!`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 font-black text-xs shrink-0 pl-1">
              <span className="hidden sm:inline">Kelola</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </Link>
        )}

        {/* Hero Card: Health Status & Odometer */}
        <div className="bg-secondary-background border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] rounded-[var(--radius-base)] p-4 sm:p-5 flex flex-col items-center relative">
          {/* Circular Gauge Score */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-1 mt-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="42" stroke="var(--background)" strokeWidth="10" className="border-2"></circle>
              <circle 
                className="transition-all duration-1000 ease-out" 
                cx="50" cy="50" fill="none" r="42" 
                stroke={isHealthy ? "#8AE500" : "#FF4D50"} 
                strokeDasharray="264" 
                strokeDashoffset={264 - (264 * overallHealth) / 100} 
                strokeWidth="10"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black text-foreground leading-none">
                {overallHealth}%
              </span>
              <span className={`text-[10px] sm:text-[11px] font-black uppercase mt-1 px-2 py-0.5 rounded-[var(--radius-base)] border border-border ${
                isHealthy ? 'bg-main text-black' : 'bg-[#FF4D50] text-white'
              }`}>
                {isHealthy ? 'Kondisi Prima' : 'Perlu Servis'}
              </span>
            </div>
          </div>

          {/* Odometer Display */}
          <div className="text-center flex flex-col items-center w-full pt-3 border-t-2 border-border mt-2">
            <span className="text-[10px] sm:text-[11px] font-black text-foreground/70 uppercase tracking-widest block mb-0.5">
              Total Jarak Tempuh
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {vehicle.currentMileage.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] sm:text-xs font-black bg-main text-black border-2 border-border px-1.5 py-0.5 rounded-[var(--radius-base)] uppercase">
                KM
              </span>
            </div>
            
            <QuickOdometerModal 
              vehicleId={vehicle.id} 
              vehicleName={vehicle.name} 
              currentMileage={vehicle.currentMileage} 
              buttonClassName="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-base)] text-[11px] sm:text-xs font-black bg-background hover:bg-main text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer"
            />
          </div>

          {/* 3 Status Pillar Mini-Cards */}
          <div className="grid grid-cols-3 gap-2 w-full pt-3 mt-3 border-t-2 border-border">
            <div className="p-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-center shadow-[1px_1px_0px_0px_var(--border)]">
              <span className="text-[9px] font-black text-foreground/70 uppercase block">
                {isEV ? 'Sistem EV' : 'Pelumasan'}
              </span>
              <span className={`text-xs font-black block mt-0.5 ${getConditionColor(avgLube)}`}>
                {avgLube}%
              </span>
            </div>
            <div className="p-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-center shadow-[1px_1px_0px_0px_var(--border)]">
              <span className="text-[9px] font-black text-foreground/70 uppercase block">
                Pengereman
              </span>
              <span className={`text-xs font-black block mt-0.5 ${getConditionColor(avgBrake)}`}>
                {avgBrake}%
              </span>
            </div>
            <div className="p-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-center shadow-[1px_1px_0px_0px_var(--border)]">
              <span className="text-[9px] font-black text-foreground/70 uppercase block">
                Roda & Ban
              </span>
              <span className={`text-xs font-black block mt-0.5 ${getConditionColor(avgTire)}`}>
                {avgTire}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Access Menu (Akses Cepat) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
              Akses Cepat
            </h3>
            <span className="text-[10px] font-bold text-foreground/60">Menu Pintas</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {/* 1. Tambah Servis */}
            <Link
              href={`/add-service?vehicleId=${vehicle.id}`}
              className="p-1.5 sm:p-2.5 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] sm:shadow-[3px_3px_0px_0px_var(--border)] flex flex-col items-center text-center gap-1 sm:gap-1.5 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer group min-w-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-main group-hover:bg-black group-hover:text-white border-2 border-border flex items-center justify-center text-black shadow-[1px_1px_0px_0px_var(--border)] transition-colors shrink-0">
                <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black leading-tight text-foreground uppercase truncate w-full">
                Servis
              </span>
            </Link>

            {/* 2. Riwayat Servis */}
            <Link
              href="/history"
              className="p-1.5 sm:p-2.5 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] sm:shadow-[3px_3px_0px_0px_var(--border)] flex flex-col items-center text-center gap-1 sm:gap-1.5 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer group min-w-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-background group-hover:bg-black group-hover:text-white border-2 border-border flex items-center justify-center text-foreground shadow-[1px_1px_0px_0px_var(--border)] transition-colors shrink-0">
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black leading-tight text-foreground uppercase truncate w-full">
                Riwayat
              </span>
            </Link>

            {/* 3. Pajak STNK */}
            <Link
              href={`/tax?vehicleId=${vehicle.id}`}
              className="p-1.5 sm:p-2.5 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] sm:shadow-[3px_3px_0px_0px_var(--border)] flex flex-col items-center text-center gap-1 sm:gap-1.5 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer group min-w-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-background group-hover:bg-black group-hover:text-white border-2 border-border flex items-center justify-center text-foreground shadow-[1px_1px_0px_0px_var(--border)] transition-colors shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black leading-tight text-foreground uppercase truncate w-full">
                Pajak STNK
              </span>
            </Link>

            {/* 4. Detail & Komponen */}
            <Link
              href={`/vehicles?vehicleId=${vehicle.id}`}
              className="p-1.5 sm:p-2.5 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] sm:shadow-[3px_3px_0px_0px_var(--border)] flex flex-col items-center text-center gap-1 sm:gap-1.5 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer group min-w-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-background group-hover:bg-black group-hover:text-white border-2 border-border flex items-center justify-center text-foreground shadow-[1px_1px_0px_0px_var(--border)] transition-colors shrink-0">
                <Disc className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black leading-tight text-foreground uppercase truncate w-full">
                Komponen
              </span>
            </Link>
          </div>
        </section>

        {/* Section: Perhatian & Rekomendasi Utama */}
        <section className="space-y-3 pt-1">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
              Perhatian & Rekomendasi
            </h3>
            <span className={`text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] shrink-0 ${
              isHealthy 
                ? 'bg-main text-black' 
                : 'bg-[#FF4D50] text-white'
            }`}>
              {urgentComponents.length > 0 ? `${urgentComponents.length} Perlu Dicek` : 'Semua Aman'}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Reminder Utama */}
            <Link 
              href={`/vehicles?vehicleId=${vehicle.id}`} 
              className="bg-secondary-background rounded-[var(--radius-base)] p-3 sm:p-4 flex items-center justify-between gap-2 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] sm:shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all group max-w-full"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center shrink-0 ${
                  isHealthy ? 'bg-main text-black' : 'bg-[#FF4D50] text-white'
                }`}>
                  {isEV ? <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Droplet className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-foreground truncate">
                    {reminderInfo.mostUrgentComponent?.name || (isEV ? 'Sistem Penggerak EV' : 'Oli Mesin')}
                  </h4>
                  <p className={`text-[10px] sm:text-xs mt-0.5 font-bold truncate ${isHealthy ? 'text-foreground/70' : 'text-[#FE2C1D]'}`}>
                    {reminderInfo.message}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1 shrink-0">
                <span className="px-2 py-0.5 rounded-[var(--radius-base)] text-[10px] sm:text-xs font-black bg-[#FACC00] text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] whitespace-nowrap">
                  Est. Rp {estimatedCost.toLocaleString('id-ID')}
                </span>
                <div className="flex items-center text-foreground font-black text-[10px] gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Cek <ChevronRight className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </Link>

            {/* Reminder Pajak STNK */}
            <Link 
              href={`/tax?vehicleId=${vehicle.id}`} 
              className="bg-secondary-background rounded-[var(--radius-base)] p-3 sm:p-4 flex items-center justify-between gap-2 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] sm:shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all group max-w-full"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center shrink-0 ${
                  taxDaysLeft !== null && taxDaysLeft <= 30 ? 'bg-[#FF4D50] text-white' : 'bg-background text-foreground'
                }`}>
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-foreground truncate">Pajak Tahunan STNK</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/70 mt-0.5 font-bold truncate">
                    {taxDaysLeft === null 
                      ? 'Belum diatur tanggal jatuh tempo' 
                      : taxDaysLeft < 0 
                        ? `Terlambat ${Math.abs(taxDaysLeft)} hari!` 
                        : taxDaysLeft <= 30 
                          ? `Jatuh tempo dalam ${taxDaysLeft} hari` 
                          : `Jatuh tempo ${new Date(vehicle.stnkTaxDueDate!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1 shrink-0">
                <span className={`px-2 py-0.5 rounded-[var(--radius-base)] text-[10px] sm:text-xs font-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] whitespace-nowrap ${
                  taxDaysLeft !== null && taxDaysLeft <= 30 ? 'bg-[#FF4D50] text-white' : 'bg-background text-foreground'
                }`}>
                  {taxDaysLeft === null ? 'Atur' : taxDaysLeft < 0 ? 'Terlambat' : taxDaysLeft <= 30 ? 'Segera' : 'Aktif'}
                </span>
                <div className="flex items-center text-foreground font-black text-[10px] gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Cek Pajak <ChevronRight className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Ringkasan Kondisi Komponen Cepat (Mini Monitor) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-tight">
                Ringkasan Komponen Cepat
              </h3>
              <p className="text-[10px] font-bold text-foreground/65">
                Estimasi sisa pemakaian berdasarkan jarak tempuh
              </p>
            </div>
            <Link 
              href={`/vehicles?vehicleId=${vehicle.id}`}
              className="text-[10px] font-black uppercase text-foreground hover:bg-main border border-border px-2 py-0.5 rounded-[var(--radius-base)] bg-background shadow-[1px_1px_0px_0px_var(--border)] flex items-center gap-0.5"
            >
              <span>Semua ({allComponents.length})</span>
              <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-0.5">
            {previewComponents.map((comp) => {
              const isOverdue = comp.remainingKm < 0
              return (
                <div key={comp.id} className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] space-y-1.5 max-w-full">
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span className="font-black text-foreground flex items-center gap-1.5 text-[11px] min-w-0 truncate">
                      {comp.category === 'Pelumasan' && <Fuel className="w-3 h-3 shrink-0" />}
                      {comp.category === 'Pendinginan' && <Droplet className="w-3 h-3 shrink-0" />}
                      {comp.category === 'Pengereman' && <Disc className="w-3 h-3 shrink-0" />}
                      {comp.category === 'Kaki-kaki' && <CircleDot className="w-3 h-3 shrink-0" />}
                      <span className="truncate">{comp.name}</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-[var(--radius-base)] border border-border shrink-0 whitespace-nowrap ${
                        isOverdue ? 'bg-[#FF4D50] text-white' : comp.remainingKm <= 350 ? 'bg-[#FACC00] text-black' : 'bg-secondary-background text-foreground'
                      }`}>
                        {isOverdue ? `-${Math.abs(comp.remainingKm).toLocaleString('id-ID')} KM` : `Sisa ${comp.remainingKm.toLocaleString('id-ID')} KM`}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-[var(--radius-base)] shrink-0 whitespace-nowrap ${getConditionBadgeBg(comp.currentCondition)}`}>
                        {comp.currentCondition}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-secondary-background border border-border rounded-[var(--radius-base)] overflow-hidden">
                    <div 
                      className={`h-full ${comp.currentCondition >= 70 ? 'bg-[#8AE500]' : comp.currentCondition >= 40 ? 'bg-[#FACC00]' : 'bg-[#FF4D50]'}`}
                      style={{ width: `${comp.currentCondition}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Statistik Pengeluaran & Servis Terakhir */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
            <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-tight flex items-center gap-1.5">
              <Wallet className="w-4 h-4 stroke-[2.5]" />
              Statistik Servis & Biaya
            </h3>
            <span className="text-[10px] font-black bg-main text-black px-2 py-0.5 rounded-[var(--radius-base)] border border-border">
              {vehicle.serviceRecords.length}x Servis
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="text-[10px] font-bold text-foreground/70 uppercase block">Total Pengeluaran</span>
              <span className="text-sm sm:text-base font-black text-foreground mt-0.5 block">
                Rp {totalServiceSpent.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="text-[10px] font-bold text-foreground/70 uppercase block">Servis Terakhir</span>
              <span className="text-xs sm:text-sm font-black text-foreground mt-0.5 block truncate">
                {lastRecord ? `${lastRecord.mileage.toLocaleString('id-ID')} KM` : 'Belum Ada'}
              </span>
            </div>
          </div>
        </section>

        {/* Tips Pintar Perawatan Motor */}
        <section className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-[var(--radius-base)] bg-[#FACC00] border-2 border-border flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_var(--border)]">
            <Lightbulb className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div className="text-[11px] leading-tight font-semibold text-foreground/90">
            {isEV ? (
              <>
                <strong className="font-black text-foreground uppercase block text-[10px] mb-0.5">Tips Motor Listrik:</strong>
                Hindari membiarkan kapasitas baterai di bawah 20% secara terus-menerus dan lakukan pengecekan torsi baut rangka saat servis rutin 5.000 KM.
              </>
            ) : (
              <>
                <strong className="font-black text-foreground uppercase block text-[10px] mb-0.5">Tips Motor Bensin:</strong>
                Rutin mengganti oli mesin setiap 2.000 – 3.000 KM di jalanan macet menjaga tarikan mesin tetap enteng dan konsumsi BBM tetap irit.
              </>
            )}
          </div>
        </section>
      </main>

      {/* FAB: Catat Servis Baru */}
      <Link 
        href={`/add-service?vehicleId=${vehicle.id}`} 
        className="fab-safe fixed right-4 md:right-[calc(50%-224px+16px)] w-12 h-12 sm:w-14 sm:h-14 bg-main hover:bg-[#8AE500] text-black border-2 border-border rounded-full shadow-[3px_3px_0px_0px_var(--border)] sm:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center transition-all z-40 cursor-pointer"
        title="Catat Servis Baru"
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
      </Link>
    </>
  )
}
