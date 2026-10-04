import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EditVehicleForm from './EditVehicleForm'
import { ArrowLeft } from 'lucide-react'

export default async function EditVehicle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vehicle = await prisma.vehicle.findUnique({
    where: { id }
  })

  if (!vehicle) {
    notFound()
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] px-4 h-16 flex items-center gap-3 md:max-w-md md:mx-auto">
        <Link 
          href={`/vehicles?vehicleId=${vehicle.id}`} 
          className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </Link>
        <h1 className="font-black text-lg text-foreground tracking-tight">Ubah Detail Kendaraan</h1>
      </header>
      
      <main className="px-4 py-5 md:max-w-md md:mx-auto pb-28">
        <EditVehicleForm vehicle={vehicle} />
      </main>
    </>
  )
}
