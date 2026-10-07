import prisma from '@/lib/prisma'
import { calculateAllComponentsStatus } from '@/lib/calculations'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bike } from 'lucide-react'
import VehicleDropdown from '@/components/VehicleDropdown'
import CustomIntervalModal from '@/components/CustomIntervalModal'
import ComponentsClientView from './ComponentsClientView'
import { Suspense } from 'react'

export default async function VehicleComponentsPage({
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

  const inspections = await prisma.componentInspection.findMany({
    where: { vehicleId: vehicle.id },
    orderBy: { checkedAt: 'desc' }
  })

  const componentsStatus = calculateAllComponentsStatus(vehicle, serviceRecords, inspections)

  return (
    <>
      {/* Header */}
      <header className="w-full top-0 sticky z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] flex justify-between items-center px-3.5 sm:px-4 h-14 sm:h-16 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/vehicles?vehicleId=${vehicle.id}`}
            className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            title="Kembali ke Detail"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="font-black text-sm sm:text-base text-foreground tracking-tight leading-none">
              Detail Komponen
            </h1>
            <span className="text-[10px] font-bold text-foreground/70 leading-none mt-0.5 block">
              {vehicle.name} {vehicle.licensePlate ? `• ${vehicle.licensePlate}` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Suspense fallback={<div className="w-24 sm:w-28 h-7 sm:h-8 bg-secondary-background border-2 border-border animate-pulse rounded-[var(--radius-base)]" />}>
            <VehicleDropdown vehicles={allVehicles} activeVehicleId={vehicle.id} />
          </Suspense>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3.5 sm:px-4 py-3.5 sm:py-5 space-y-4 pb-24 sm:pb-28 md:max-w-md md:mx-auto">
        {/* Top Action & Modal */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-foreground uppercase tracking-wider">
            Total {componentsStatus.length} Komponen Terpantau
          </span>
          <CustomIntervalModal
            vehicleId={vehicle.id}
            vehicleName={vehicle.name}
            engineType={vehicle.engineType}
            currentOilKm={vehicle.oilIntervalKm}
            currentTransKm={vehicle.transmissionOilIntervalKm}
            currentCoolantKm={vehicle.coolantIntervalKm}
          />
        </div>

        {/* Client View with Filter & Search */}
        <ComponentsClientView 
          components={componentsStatus} 
          currentMileage={vehicle.currentMileage}
          vehicleId={vehicle.id}
        />
      </main>
    </>
  )
}
