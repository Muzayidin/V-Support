import prisma from '@/lib/prisma'
import { calculateServiceReminder } from '@/lib/calculations'

export default async function Vehicles() {
  const vehicle = await prisma.vehicle.findFirst({
    include: {
      serviceRecords: {
        orderBy: { date: 'desc' }
      }
    }
  })

  const lastServiceMileage = vehicle?.serviceRecords[0]?.mileage
  const reminderInfo = vehicle ? calculateServiceReminder(vehicle.currentMileage, lastServiceMileage) : null

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface-bg md:max-w-md md:mx-auto">
        <div className="flex items-center justify-between px-margin-page h-14 w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl" data-weight="fill">motorcycle</span>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">Kendaraan</h1>
          </div>
          <button aria-label="More options" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-text-main">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-16 px-margin-page space-y-gutter-stack pb-6">
        {/* Hero Section: Motorcycle Image */}
        <section className="w-full aspect-[4/3] rounded-xl overflow-hidden card-shadow relative bg-surface-variant">
          <img 
            alt={vehicle?.name || "Kendaraan"}
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDRBRaUve_IP-HeUPRpt9KXYa68k86NFlyKhtTdevDIyVeznO6biWaTmmBMZ5ybP2CANx8Z3sZJMrfbY2jLAVJXudZQsPxdp1SgCnpmoUb4szhQwVT1efVS1GaEAqWeKCtsBvarNLhaXbB2A-IhXEIryr_2mhCx8U9ZVHSo0sb_z1TntzlAyUgUx6dKm8kYPx-NdffI92rCt0yunn2QTbw7_5apk5eLaiEa-_ArJzv4WMfMzFU9QC8RIOCL_Q9m7DpnQcP7P7TMrlz"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-on-primary">
            <h2 className="text-headline-md font-headline-md">{vehicle?.name || 'Belum Ada Kendaraan'}</h2>
            <p className="text-label-bold font-label-bold opacity-90 text-gray-200">Matic Harian</p>
          </div>
        </section>

        {/* Vehicle Specs (Bento Grid) */}
        <section className="grid grid-cols-2 gap-3">
          {/* License Plate */}
          <div className="col-span-2 bg-surface-card rounded-lg p-padding-card card-shadow border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-label-sm font-label-sm text-text-muted mb-1 uppercase tracking-wider">Nomor Polisi</p>
              <p className="text-headline-lg font-headline-lg text-primary tracking-tight">B 1234 ABC</p>
            </div>
            <div className="bg-primary-fixed text-on-primary-fixed w-10 h-10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">pin</span>
            </div>
          </div>
          
          {/* Brand */}
          <div className="bg-surface-card rounded-lg p-4 card-shadow border border-surface-variant">
            <p className="text-label-sm font-label-sm text-text-muted mb-1">Merek</p>
            <p className="text-body-lg font-body-lg font-semibold">{vehicle?.name.split(' ')[0] || 'N/A'}</p>
          </div>
          
          {/* Year */}
          <div className="bg-surface-card rounded-lg p-4 card-shadow border border-surface-variant">
            <p className="text-label-sm font-label-sm text-text-muted mb-1">Tahun</p>
            <p className="text-body-lg font-body-lg font-semibold">2023</p>
          </div>
        </section>

        {/* Status Summary */}
        <section className="space-y-3 pt-2">
          <h3 className="text-label-bold font-label-bold text-text-muted uppercase tracking-wider pl-1">Ringkasan Status</h3>
          
          {/* Last Service */}
          <div className="bg-surface-card rounded-lg p-4 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-bg flex items-center justify-center shrink-0 text-text-main">
              <span className="material-symbols-outlined text-2xl">build</span>
            </div>
            <div className="flex-1">
              <p className="text-label-sm font-label-sm text-text-muted">Servis Terakhir</p>
              <p className="text-body-lg font-body-lg font-semibold">
                {vehicle?.serviceRecords[0] ? vehicle.serviceRecords[0].date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'Belum Pernah'}
              </p>
            </div>
          </div>
          
          {/* Next Service (Derived from calculation) */}
          <div className={`bg-surface-card rounded-lg p-4 card-shadow flex items-center gap-4 border-l-4 ${reminderInfo?.needsService ? 'border-accent-amber' : 'border-primary-fixed-dim'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${reminderInfo?.needsService ? 'bg-[#FEF3C7] text-accent-amber' : 'bg-surface-bg text-secondary'}`}>
              <span className="material-symbols-outlined text-2xl">event</span>
            </div>
            <div className="flex-1">
              <p className="text-label-sm font-label-sm text-text-muted">Estimasi Berikutnya</p>
              <p className="text-body-lg font-body-lg font-semibold">
                {reminderInfo ? `Sisa ${reminderInfo.remainingMileage.toLocaleString('id-ID')} KM` : 'N/A'}
              </p>
            </div>
            {reminderInfo?.needsService && (
              <div className="text-right">
                <span className="text-label-bold font-label-bold text-accent-amber bg-[#FEF3C7] px-2 py-1 rounded">Segera</span>
              </div>
            )}
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-4">
          <button className="w-full h-touch-target-min bg-primary text-on-primary rounded-lg text-body-lg font-body-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
            <span className="material-symbols-outlined text-xl">edit</span>
            Ubah Detail Kendaraan
          </button>
        </div>
      </main>
    </>
  )
}
