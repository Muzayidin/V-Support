import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import TaxClientView from './TaxClientView'

export default async function TaxPage({
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
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  if (allVehicles.length === 0) {
    redirect('/welcome')
  }

  const activeVehicleId = vehicleIdParam || allVehicles[0]?.id

  let vehicle = await prisma.vehicle.findFirst({
    where: { 
      userId: user.id,
      id: activeVehicleId
    },
    include: {
      taxRecords: {
        orderBy: { paymentDate: 'desc' }
      }
    }
  })

  if (!vehicle) {
    vehicle = await prisma.vehicle.findFirst({
      where: { userId: user.id },
      include: {
        taxRecords: {
          orderBy: { paymentDate: 'desc' }
        }
      }
    })
  }

  if (!vehicle) {
    redirect('/welcome')
  }

  return <TaxClientView vehicle={vehicle} allVehicles={allVehicles} />
}
