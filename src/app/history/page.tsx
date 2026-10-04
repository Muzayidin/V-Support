import Link from 'next/link'
import prisma from '@/lib/prisma'
import VehicleDropdown from '@/components/VehicleDropdown'
import ExportServiceBookButton from '@/components/ExportServiceBookButton'
import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { 
  Bike, 
  Search, 
  SlidersHorizontal, 
  Wrench, 
  Calendar, 
  Gauge, 
  Sparkles,
  ClipboardList,
  ChevronRight
} from 'lucide-react'

export default async function History({
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

  let history: any[] = []
  const vehicle = allVehicles.find(v => v.id === activeVehicleId) || allVehicles[0]
  
  if (vehicle) {
    history = await prisma.serviceRecord.findMany({
      where: { vehicleId: vehicle.id },
      include: { details: true },
      orderBy: { date: 'desc' }
    })
  }

  return (
    <>
      {/* Header */}
      <header className="w-full top-0 sticky z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] flex justify-between items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black font-black shrink-0">
            <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
          <span className="font-black text-base sm:text-lg text-foreground tracking-tight">Riwayat Servis</span>
        </div>
        <div className="flex items-center relative min-w-0">
          {vehicle && (
            <Suspense fallback={<div className="w-24 sm:w-28 h-7 sm:h-8 bg-secondary-background border-2 border-border animate-pulse rounded-[var(--radius-base)]" />}>
              <VehicleDropdown vehicles={allVehicles} activeVehicleId={vehicle.id} />
            </Suspense>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-28 md:max-w-md md:mx-auto space-y-5">
        {/* Title & Export Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight">Log Servis</h2>
            <p className="text-xs text-foreground/80 mt-0.5 font-bold">Catatan perawatan & penggantian suku cadang.</p>
          </div>
          {vehicle && (
            <ExportServiceBookButton vehicle={vehicle} history={history} />
          )}
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/70" />
            <input 
              type="text"
              placeholder="Cari suku cadang atau tanggal..." 
              className="w-full pl-10 pr-4 py-2.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
            />
          </div>
          <button 
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] text-foreground shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Timeline Container */}
        {history.length === 0 ? (
          <div className="text-center py-12 px-4 bg-secondary-background rounded-[var(--radius-base)] border-2 border-dashed border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="w-12 h-12 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-black flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black text-foreground">Belum Ada Riwayat</h3>
            <p className="text-xs text-foreground/70 mt-1 max-w-xs mx-auto font-bold">
              Servis pertama Anda akan tercatat di sini dan membantu estimasi biaya servis berikutnya.
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {history.map((record, index) => {
              const dateStr = record.date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
              const componentsStr = record.details.map((d: any) => d.componentName).join(', ')
              const isLatest = index === 0

              return (
                <div 
                  key={record.id} 
                  className={`bg-secondary-background rounded-[var(--radius-base)] p-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 ${
                    isLatest 
                      ? 'border-border' 
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-xs font-black ${
                        isLatest 
                          ? 'bg-main text-black' 
                          : 'bg-background text-foreground'
                      }`}>
                        <Wrench className="w-4 h-4 stroke-[2.5]" />
                      </span>
                      <span className="text-xs font-black text-foreground">{dateStr}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-foreground bg-background border-2 border-border px-2.5 py-0.5 rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]">
                      <Gauge className="w-3 h-3 stroke-[2.5]" />
                      {record.mileage.toLocaleString('id-ID')} KM
                    </span>
                  </div>

                  <div className="text-xs font-bold text-foreground leading-relaxed bg-background p-3 rounded-[var(--radius-base)] border-2 border-border">
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 block mb-0.5">
                      Pekerjaan / Komponen
                    </span>
                    {componentsStr || 'Servis Umum & Pengecekan'}
                  </div>

                  {record.laborCost > 0 && (
                    <div className="flex items-center justify-between text-[11px] font-bold text-foreground/80 bg-background px-3 py-1.5 rounded-[var(--radius-base)] border-2 border-border">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FACC00] border border-border inline-block"></span>
                        Biaya Jasa Servis:
                      </span>
                      <span className="font-black text-foreground">Rp {record.laborCost.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t-2 border-border/40">
                    <div>
                      <span className="text-[10px] font-bold text-foreground/60 block">Total Biaya</span>
                      <span className="text-sm font-black text-foreground bg-[#FACC00] border-2 border-border px-2.5 py-0.5 rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] inline-block">
                        Rp {record.totalCost.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <Link
                      href={`/history/${record.id}`}
                      className="py-1.5 px-3 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] text-[11px] font-black uppercase text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
