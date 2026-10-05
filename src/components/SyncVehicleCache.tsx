'use client'

import { useEffect } from 'react'
import { cacheVehiclesLocally } from '@/lib/offlineSync'

interface SyncVehicleCacheProps {
  vehicles: Array<{
    id: string
    name: string
    licensePlate?: string | null
    currentMileage: number
    engineType: string
  }>
}

export default function SyncVehicleCache({ vehicles }: SyncVehicleCacheProps) {
  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      cacheVehiclesLocally(vehicles)
    }
  }, [vehicles])

  return null
}
