import Link from 'next/link'
import prisma from '@/lib/prisma'
import { calculateServiceReminder, estimateNextServiceCost } from '@/lib/calculations'

export default async function Home() {
  // Auto-seeding dummy data for MVP
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: { name: 'Pengguna Uji', email: 'test@example.com' }
    })
  }

  let vehicle = await prisma.vehicle.findFirst({
    where: { userId: user.id },
    include: {
      serviceRecords: {
        orderBy: { date: 'desc' },
        include: { details: true }
      }
    }
  })

  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        name: 'Honda Vario 150',
        currentMileage: 24000
      },
      include: {
        serviceRecords: {
          orderBy: { date: 'desc' },
          include: { details: true }
        }
      }
    })
  }

  // Logika Kalkulasi
  const lastServiceMileage = vehicle.serviceRecords[0]?.mileage
  const reminderInfo = calculateServiceReminder(vehicle.currentMileage, lastServiceMileage)
  const estimatedCost = estimateNextServiceCost(vehicle.serviceRecords)

  // Circular gauge logic (simplified representation)
  const isHealthy = !reminderInfo.needsService
  const strokeColor = isHealthy ? '#006c49' : '#ba1a1a' // secondary or error
  const iconName = isHealthy ? 'check_circle' : 'warning'
  const iconColorClass = isHealthy ? 'text-secondary' : 'text-error'

  return (
    <>
      <header className="w-full top-0 sticky bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex justify-between items-center px-margin-page h-14 z-40 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" data-weight="fill">motorcycle</span>
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">V-Support</h1>
        </div>
        <div className="flex items-center">
          <button className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full text-primary text-sm font-medium hover:bg-surface-variant transition-colors">
            {vehicle.name}
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
      </header>
      
      <main className="p-margin-page space-y-gutter-stack pb-[90px]">
        {/* Greeting */}
        <div className="pt-2">
          <h2 className="font-headline-lg text-headline-lg text-text-main">Halo, {user.name.split(' ')[0]}!</h2>
          <p className="font-body-md text-body-md text-text-muted mt-1">Berikut ringkasan kondisi kendaraan Anda.</p>
        </div>

        {/* Hero Card: Health Status & Odometer */}
        <div className="bg-surface-card rounded-xl ambient-shadow p-padding-card flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="#e3e2e6" strokeWidth="10"></circle>
              <circle 
                className="transition-all duration-1000 ease-out" 
                cx="50" cy="50" fill="none" r="45" 
                stroke={strokeColor} 
                strokeDasharray="283" 
                strokeDashoffset={isHealthy ? "56" : "20"} 
                strokeWidth="10"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`material-symbols-outlined ${iconColorClass} text-3xl`} data-weight="fill">{iconName}</span>
              <span className={`font-label-bold text-label-bold ${iconColorClass} mt-1 text-center leading-tight max-w-[70px]`}>
                {isHealthy ? 'Kondisi Prima' : 'Perlu Servis'}
              </span>
            </div>
          </div>
          <div className="text-center">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider block mb-1">Total Jarak Tempuh</span>
            <span className="font-odometer-display text-odometer-display text-primary tracking-tight">
              {vehicle.currentMileage.toLocaleString('id-ID')} <span className="text-lg text-text-muted font-normal tracking-normal">KM</span>
            </span>
          </div>
        </div>

        {/* Section: Perlu Perhatian */}
        <div>
          <h3 className="font-headline-md text-headline-md text-text-main mb-3">Perlu Perhatian</h3>
          <div className="space-y-3">
            {/* Reminder Card */}
            <div className={`bg-surface-card rounded-lg ambient-shadow p-4 flex items-center justify-between border-l-4 ${isHealthy ? 'border-primary-fixed-dim' : 'border-accent-amber'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHealthy ? 'bg-surface-container' : 'bg-[#FEF3C7]'}`}>
                  <span className={`material-symbols-outlined ${isHealthy ? 'text-on-surface-variant' : 'text-accent-amber'}`}>
                    build
                  </span>
                </div>
                <div>
                  <h4 className="font-body-lg text-body-lg text-text-main font-medium">Servis Rutin</h4>
                  <p className="font-label-sm text-label-sm text-text-muted">
                    {isHealthy ? `Sisa ${reminderInfo.remainingMileage.toLocaleString('id-ID')} KM lagi` : 'Telah lewat batas aman'}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${isHealthy ? 'bg-tertiary-fixed-dim/20 text-on-tertiary-container' : 'bg-error-container text-on-error-container mb-1'}`}>
                  Rp {estimatedCost.toLocaleString('id-ID')}
                </span>
                {!isHealthy && <span className="text-[10px] font-bold text-error uppercase tracking-wider">Segera Servis</span>}
              </div>
            </div>

            {/* Pajak Tahunan Card (Static Example from Stitch) */}
            <div className="bg-surface-card rounded-lg ambient-shadow p-4 flex items-center justify-between border-l-4 border-error">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-error-container">receipt_long</span>
                </div>
                <div>
                  <h4 className="font-body-lg text-body-lg text-text-main font-medium">Pajak Tahunan</h4>
                  <p className="font-label-sm text-label-sm text-text-muted">Jatuh tempo 12 Des</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-error-container text-on-error-container px-2 py-1 rounded text-xs font-semibold">Segera Bayar</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <Link href={`/add-service?vehicleId=${vehicle.id}`} className="fixed bottom-[80px] right-margin-page md:right-[calc(50%-224px+16px)] w-14 h-14 bg-primary text-on-primary rounded-full fab-shadow flex items-center justify-center hover:bg-on-primary-fixed-variant transition-colors active:scale-95 z-40">
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </>
  )
}
