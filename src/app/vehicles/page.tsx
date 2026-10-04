import prisma from '@/lib/prisma'
import { 
  calculateServiceReminder, 
  calculateAllComponentsStatus,
  calculateNextServiceSchedule 
} from '@/lib/calculations'
import VehicleDropdown from '@/components/VehicleDropdown'
import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { 
  Bike, 
  Car,
  Plus, 
  Wrench, 
  Calendar, 
  Gauge, 
  Fuel, 
  Zap, 
  CircleDot, 
  Disc, 
  Pencil,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  FileText,
  ArrowUpRight,
  ChevronRight,
  Coins
} from 'lucide-react'

export default async function Vehicles({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const resolvedSearchParams = await searchParams;
  const vehicleIdParam = typeof resolvedSearchParams.vehicleId === 'string' ? resolvedSearchParams.vehicleId : undefined;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  if (!user) {
    redirect('/login')
  }

  const allVehicles = await prisma.vehicle.findMany({
    where: { userId: user.id }
  })

  if (allVehicles.length === 0) {
    redirect('/welcome')
  }

  const activeVehicleId = vehicleIdParam || allVehicles[0]?.id

  const vehicle = allVehicles.find(v => v.id === activeVehicleId) || allVehicles[0]

  const serviceRecords = await prisma.serviceRecord.findMany({
    where: { vehicleId: vehicle.id },
    include: { details: true },
    orderBy: { date: 'desc' }
  })

  const reminderInfo = calculateServiceReminder(vehicle, serviceRecords)
  const componentsStatus = calculateAllComponentsStatus(vehicle, serviceRecords)
  const nextSchedule = calculateNextServiceSchedule(vehicle, serviceRecords)
  const isEV = vehicle.engineType === 'EV'

  // Ringkasan Kondisi Komponen
  const overallCondition = Math.round(
    componentsStatus.reduce((sum, c) => sum + c.currentCondition, 0) / (componentsStatus.length || 1)
  )
  const urgentComps = componentsStatus.filter(c => c.status === 'CRITICAL' || c.status === 'WARNING')
  const healthyCount = componentsStatus.length - urgentComps.length
  const previewComps = [...componentsStatus].sort((a, b) => a.remainingKm - b.remainingKm).slice(0, 3)

  // Logika Jatuh Tempo Pajak STNK & Plat
  const todayZero = new Date()
  todayZero.setHours(0, 0, 0, 0)
  const taxDaysLeft = vehicle.stnkTaxDueDate
    ? Math.ceil((new Date(vehicle.stnkTaxDueDate).getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24))
    : null
  const fiveYearDaysLeft = vehicle.stnkFiveYearDueDate
    ? Math.ceil((new Date(vehicle.stnkFiveYearDueDate).getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isTaxAlert = (taxDaysLeft !== null && taxDaysLeft <= 30) || (fiveYearDaysLeft !== null && fiveYearDaysLeft <= 30)
  const isAnyOverdue = (taxDaysLeft !== null && taxDaysLeft < 0) || (fiveYearDaysLeft !== null && fiveYearDaysLeft < 0)

  const getConditionBadge = (val: number) => {
    if (val >= 70) return "text-black bg-[#8AE500] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
    if (val >= 40) return "text-black bg-[#FACC00] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
    return "text-black bg-[#FF4D50] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
  }

  const getConditionBarColor = (val: number) => {
    if (val >= 70) return "bg-[#8AE500]"
    if (val >= 40) return "bg-[#FACC00]"
    return "bg-[#FF4D50]"
  }

  return (
    <>
      {/* Header */}
      <header className="w-full top-0 sticky z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] flex justify-between items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <CruzLogo className="w-8 h-8 sm:w-9 sm:h-9" />
          <span className="font-black text-base sm:text-lg text-foreground tracking-tight">Detail Kendaraan</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 relative min-w-0">
          <Suspense fallback={<div className="w-24 sm:w-28 h-7 sm:h-8 bg-secondary-background border-2 border-border animate-pulse rounded-[var(--radius-base)]" />}>
            <VehicleDropdown vehicles={allVehicles} activeVehicleId={vehicle.id} />
          </Suspense>
          <Link
            href="/vehicles/add"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer shrink-0"
            title="Tambah Kendaraan"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3.5 sm:px-4 py-3.5 sm:py-5 space-y-4 sm:space-y-5 pb-24 sm:pb-28 md:max-w-md md:mx-auto">
        {/* Peringatan Jatuh Tempo Pajak (H-30 atau Terlambat) */}
        {isTaxAlert && (
          <section className={`rounded-[var(--radius-base)] p-3.5 sm:p-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] text-black ${
            isAnyOverdue ? 'bg-[#FF4D50]' : 'bg-[#FACC00]'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-base)] bg-black text-white border-2 border-border flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_var(--border)]">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-[10px] uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-[var(--radius-base)]">
                    {isAnyOverdue ? 'Pajak Terlambat' : 'Peringatan Jatuh Tempo'}
                  </span>
                  {taxDaysLeft !== null && taxDaysLeft >= 0 && taxDaysLeft <= 30 && (
                    <span className="text-[11px] font-black underline">
                      H-{taxDaysLeft} Hari Lagi
                    </span>
                  )}
                  {fiveYearDaysLeft !== null && fiveYearDaysLeft >= 0 && fiveYearDaysLeft <= 30 && (
                    <span className="text-[11px] font-black underline">
                      Ganti Plat H-{fiveYearDaysLeft}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-black mt-1 leading-snug">
                  {taxDaysLeft !== null && taxDaysLeft < 0
                    ? `Pajak tahunan STNK terlewat ${Math.abs(taxDaysLeft)} hari!`
                    : taxDaysLeft !== null && taxDaysLeft <= 30
                      ? `Pajak tahunan STNK jatuh tempo dalam ${taxDaysLeft} hari (${new Date(vehicle.stnkTaxDueDate!).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})`
                      : fiveYearDaysLeft !== null && fiveYearDaysLeft < 0
                        ? `Masa berlaku Plat 5 Tahunan terlewat ${Math.abs(fiveYearDaysLeft)} hari!`
                        : `Masa berlaku Plat 5 Tahunan jatuh tempo dalam ${fiveYearDaysLeft} hari!`
                  }
                </h3>

                <p className="text-[11px] font-bold mt-1 text-black/85 leading-tight">
                  {isAnyOverdue
                    ? 'Segera lakukan perpanjangan di Samsat atau aplikasi Signal untuk menghindari denda administrasi & sanksi tilang.'
                    : 'Siapkan STNK asli, KTP pemilik sesuai STNK, dan perkiraan biaya sebelum masa berlaku habis.'
                  }
                </p>

                <div className="mt-2.5">
                  <Link
                    href={`/tax?vehicleId=${vehicle.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Periksa & Bayar Pajak</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hero Card */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] relative text-foreground">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-[var(--radius-base)] text-[11px] sm:text-xs font-black bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] mb-2">
                {isEV ? <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" /> : <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />}
                <span>
                  {vehicle.vehicleType === 'CAR'
                    ? (isEV ? 'Mobil Listrik (EV)' : 'Mobil Bensin (ICE)')
                    : (isEV ? 'Motor Listrik (EV)' : 'Mesin Bensin (ICE)')}
                </span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">{vehicle.name}</h2>
              <p className="text-[11px] sm:text-xs font-black text-foreground/80 mt-1 px-2 py-0.5 bg-background border-2 border-border rounded-[var(--radius-base)] inline-block uppercase tracking-wider">
                {vehicle.licensePlate || 'Tanpa Plat'}
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-black">
              {vehicle.vehicleType === 'CAR' ? (
                <Car className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Bike className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t-2 border-border grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-black text-foreground/70 uppercase tracking-wider block">Odometer</span>
              <span className="text-lg font-black text-foreground mt-0.5 block">
                {vehicle.currentMileage.toLocaleString('id-ID')} <span className="text-xs bg-main text-black border border-border px-1 py-0.2 rounded-[var(--radius-base)] font-black">KM</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-black text-foreground/70 uppercase tracking-wider block">
                {isEV ? 'Kapasitas Baterai' : 'Kapasitas Mesin'}
              </span>
              <span className="text-lg font-black text-foreground mt-0.5 block">
                {vehicle.ccOrKwh ? `${vehicle.ccOrKwh.toLocaleString('id-ID')} ${isEV ? 'kWh' : 'CC'}` : '-'}
              </span>
            </div>
          </div>
        </section>

        {/* Specs Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-secondary-background rounded-[var(--radius-base)] p-4 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)]">
            <span className="text-[11px] font-black text-foreground/70 uppercase tracking-wider block mb-1">Transmisi</span>
            <span className="text-sm font-black text-foreground block">
              {vehicle.transmission === 'AUTOMATIC' ? 'Matic / Otomatis' : 'Manual / Kopling'}
            </span>
          </div>

          <div className="bg-secondary-background rounded-[var(--radius-base)] p-4 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)]">
            <span className="text-[11px] font-black text-foreground/70 uppercase tracking-wider block mb-1">Status Servis</span>
            <span className="text-sm font-black text-foreground flex items-center gap-1.5">
              {!reminderInfo.needsService ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#8AE500] stroke-[3]" />
                  <span className="text-foreground">Prima</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#FF4D50] stroke-[3]" />
                  <span className="text-foreground">Perlu Cek</span>
                </>
              )}
            </span>
          </div>
        </section>

        {/* Rekomendasi Jadwal Servis Selanjutnya (Service Schedule) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-border pb-3 gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-main text-black px-2 py-0.5 rounded-[var(--radius-base)] border border-border shadow-[1px_1px_0px_0px_var(--border)]">
                  Jadwal Servis Berikutnya
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-background text-foreground px-2 py-0.5 rounded-[var(--radius-base)] border border-border">
                  {nextSchedule.fuelSystem === 'INJECTION' ? 'Injeksi (FI)' : 'Karburator'}
                </span>
                {nextSchedule.isCVT && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-background text-foreground px-2 py-0.5 rounded-[var(--radius-base)] border border-border">
                    CVT Matic
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                Target KM {nextSchedule.nextServiceMileage.toLocaleString('id-ID')}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-foreground/75">
                Estimasi sisa {nextSchedule.remainingKm.toLocaleString('id-ID')} KM ({nextSchedule.estimatedDays} hari lagi • {nextSchedule.estimatedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
              </p>
            </div>

            <Link
              href={`/add-service?vehicleId=${vehicle.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-main hover:bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Catat Servis</span>
            </Link>
          </div>

          {/* Banner Rincian Paket Servis Terdekat */}
          <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black shadow-[1px_1px_0px_0px_var(--border)] shrink-0">
                <Coins className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-foreground/70 block">Estimasi Biaya Paket Servis:</span>
                <span className="text-sm font-black text-foreground">
                  Rp {nextSchedule.estimatedTotalCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-[var(--radius-base)] bg-[#FACC00] text-black border border-border">
                {nextSchedule.dueServices.length} Item Servis
              </span>
            </div>
          </div>

          {/* List Item Servis Terjadwal */}
          <div className="space-y-2.5 pt-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 block">
              Daftar Servis yang Harus Dilakukan:
            </span>
            {nextSchedule.dueServices.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-[var(--radius-base)] bg-secondary-background border border-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
                      <Wrench className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground">{item.name}</h4>
                      <span className="text-[9px] font-black px-1.5 py-0.2 bg-secondary-background border border-border rounded-[var(--radius-base)] text-foreground/80 mt-0.5 inline-block">
                        Interval: {item.intervalKm.toLocaleString('id-ID')} KM
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-foreground block">
                      Est. Rp {item.estimatedCost.toLocaleString('id-ID')}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-[var(--radius-base)] border border-border inline-block mt-0.5 ${
                      item.isOverdue 
                        ? 'bg-[#FF4D50] text-black font-black' 
                        : item.isUrgent 
                          ? 'bg-[#FACC00] text-black font-black' 
                          : 'bg-main text-black font-black'
                    }`}>
                      {item.isOverdue ? 'Terlewat' : item.isUrgent ? 'Segera' : `Sisa ${item.remainingKm.toLocaleString('id-ID')} KM`}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] font-bold text-foreground/80 leading-relaxed pl-8">
                  {item.actionDescription}
                </p>

                <div className="pt-0.5 pl-8 text-[9px] font-bold text-foreground/60 flex items-center gap-1 flex-wrap">
                  <span>Sumber Resmi:</span>
                  <span className="italic">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ringkasan Estimasi Fisik Komponen (Compact) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] space-y-3.5">
          <div className="border-b-2 border-border pb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-background border border-border px-1.5 py-0.2 rounded-[var(--radius-base)]">
                {componentsStatus.length} Komponen
              </span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-[var(--radius-base)] border border-border ${
                urgentComps.length > 0 ? 'bg-[#FF4D50] text-black' : 'bg-[#8AE500] text-black'
              }`}>
                {urgentComps.length > 0 ? `${urgentComps.length} Perlu Dicek` : 'Semua Prima'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight">
              Ringkasan Fisik Komponen
            </h3>
            <p className="text-[10px] sm:text-[11px] font-bold text-foreground/70 mt-0.5">
              Kondisi rata-rata: <span className="text-foreground font-black">{overallCondition}%</span> • Terhitung dari jarak tempuh
            </p>
          </div>

          {/* Preview Komponen Paling Mendesak (Ringkas) */}
          <div className="space-y-2 pt-0.5">
            {previewComps.map((comp) => {
              const isOverdue = comp.remainingKm < 0
              return (
                <Link
                  key={comp.id}
                  href={`/vehicles/components?vehicleId=${vehicle.id}`}
                  className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-[var(--radius-base)] bg-secondary-background border border-border flex items-center justify-center text-foreground shrink-0 shadow-[1px_1px_0px_0px_var(--border)]">
                      {comp.category === 'Pelumasan' && <Fuel className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'CVT & Transmisi' && <Gauge className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'Sistem Bahan Bakar' && <Fuel className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'Pengapian & Kelistrikan' && <Zap className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'Mesin & Pembakaran' && <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'Pendinginan' && <Droplets className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'Pengereman' && <Disc className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category === 'Penyalur Tenaga' && <CircleDot className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {(comp.category.includes('Kaki-kaki') || comp.category.includes('Ban')) && <CircleDot className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {comp.category.includes('EV') && <Zap className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-black text-foreground block truncate group-hover:underline">
                        {comp.name}
                      </span>
                      <span className="text-[10px] font-bold text-foreground/70">
                        {isOverdue 
                          ? `Terlewat ${Math.abs(comp.remainingKm).toLocaleString('id-ID')} KM` 
                          : `Sisa ${comp.remainingKm.toLocaleString('id-ID')} KM`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className={`px-2 py-0.5 rounded-[var(--radius-base)] text-[10px] sm:text-[11px] font-black ${getConditionBadge(comp.currentCondition)}`}>
                      {comp.currentCondition}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-foreground/70 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Tombol Menuju Halaman Detail Komponen Lengkap */}
          <Link
            href={`/vehicles/components?vehicleId=${vehicle.id}`}
            className="w-full py-2.5 px-3 bg-main hover:bg-[#8AE500] text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-xs font-black flex items-center justify-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer mt-1"
          >
            <span>Buka Detail Seluruh Komponen ({componentsStatus.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </section>

        {/* Status Pajak STNK & Plat Kendaraan (Posisi Paling Bawah) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] space-y-3.5">
          <div className="flex items-center justify-between border-b-2 border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black shadow-[1px_1px_0px_0px_var(--border)]">
                <FileText className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight">
                  Status Pajak & Plat STNK
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-foreground/70">
                  Masa berlaku pajak tahunan & ganti kaleng plat 5 tahun
                </p>
              </div>
            </div>
            <Link
              href={`/tax?vehicleId=${vehicle.id}`}
              className="text-[11px] font-black px-2.5 py-1 bg-main hover:bg-main/80 text-black border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center gap-1 transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Kelola</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1: Pajak Tahunan STNK */}
            <div className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70">
                    Pajak Tahunan STNK
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-[var(--radius-base)] border border-border ${
                    taxDaysLeft === null
                      ? 'bg-secondary-background text-foreground'
                      : taxDaysLeft < 0
                        ? 'bg-[#FF4D50] text-black font-black'
                        : taxDaysLeft <= 30
                          ? 'bg-[#FACC00] text-black font-black'
                          : 'bg-[#8AE500] text-black font-black'
                  }`}>
                    {taxDaysLeft === null
                      ? 'Belum Diatur'
                      : taxDaysLeft < 0
                        ? `Telat ${Math.abs(taxDaysLeft)} Hari`
                        : taxDaysLeft <= 30
                          ? `H-${taxDaysLeft} Hari`
                          : `Sisa ${taxDaysLeft} Hari`
                    }
                  </span>
                </div>
                <div className="text-sm font-black text-foreground">
                  {vehicle.stnkTaxDueDate
                    ? new Date(vehicle.stnkTaxDueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Tanggal Belum Diset'
                  }
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-foreground/70 font-bold">Est. PKB + SWDKLLJ:</span>
                <span className="font-black text-foreground">
                  {vehicle.annualTaxAmount
                    ? `Rp ${(vehicle.annualTaxAmount + (vehicle.swdklljAmount || 35000)).toLocaleString('id-ID')}`
                    : 'Belum diisi'
                  }
                </span>
              </div>
            </div>

            {/* Card 2: TNKB Plat 5 Tahunan */}
            <div className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70">
                    Ganti Plat (5 Tahun)
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-[var(--radius-base)] border border-border ${
                    fiveYearDaysLeft === null
                      ? 'bg-secondary-background text-foreground'
                      : fiveYearDaysLeft < 0
                        ? 'bg-[#FF4D50] text-black font-black'
                        : fiveYearDaysLeft <= 30
                          ? 'bg-[#FACC00] text-black font-black'
                          : 'bg-[#8AE500] text-black font-black'
                  }`}>
                    {fiveYearDaysLeft === null
                      ? 'Belum Diatur'
                      : fiveYearDaysLeft < 0
                        ? `Telat ${Math.abs(fiveYearDaysLeft)} Hari`
                        : fiveYearDaysLeft <= 30
                          ? `H-${fiveYearDaysLeft} Hari`
                          : `Sisa ${fiveYearDaysLeft} Hari`
                    }
                  </span>
                </div>
                <div className="text-sm font-black text-foreground">
                  {vehicle.stnkFiveYearDueDate
                    ? new Date(vehicle.stnkFiveYearDueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Tanggal Belum Diset'
                  }
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-foreground/70 font-bold">Plat Nomor:</span>
                <span className="font-black text-foreground uppercase">
                  {vehicle.licensePlate || 'Tanpa Plat'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-1">
          <Link 
            href={`/vehicles/${vehicle.id}/edit`} 
            className="w-full py-3.5 px-4 bg-secondary-background hover:bg-main border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-sm font-black text-foreground flex items-center justify-center gap-2 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
          >
            <Pencil className="w-4 h-4 stroke-[2.5]" />
            <span>Ubah Spesifikasi & Data Kendaraan</span>
          </Link>
        </div>
      </main>
    </>
  )
}
