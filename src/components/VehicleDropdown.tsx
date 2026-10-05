'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown, Check, Bike, Car } from 'lucide-react'

type Vehicle = {
  id: string
  name: string
  image?: string | null
  vehicleType?: string
}

export default function VehicleDropdown({ 
  vehicles, 
  activeVehicleId 
}: { 
  vehicles: Vehicle[]
  activeVehicleId: string 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-secondary-background hover:bg-main border-2 border-border px-2.5 sm:px-3 py-1.5 rounded-[var(--radius-base)] text-foreground text-xs font-bold transition-all shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer min-w-0"
      >
        {activeVehicle?.image ? (
          <img 
            src={activeVehicle.image} 
            alt={activeVehicle.name} 
            className="w-4 h-4 rounded-full object-cover shrink-0 border border-border" 
            referrerPolicy="no-referrer"
          />
        ) : activeVehicle?.vehicleType === 'CAR' ? (
          <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground shrink-0" />
        ) : (
          <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground shrink-0" />
        )}
        <span className="truncate max-w-[90px] xs:max-w-[110px] sm:max-w-[140px]">{activeVehicle?.name || 'Pilih Kendaraan'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 sm:w-56 max-w-[calc(100vw-2rem)] bg-secondary-background rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] py-1 z-[60] border-2 border-border animate-in fade-in duration-150">
          <div className="px-3.5 py-2 border-b-2 border-border text-[10px] font-black text-foreground uppercase tracking-wider bg-background">
            Kendaraan Anda
          </div>
          {vehicles.map(vehicle => {
            const isSelected = vehicle.id === activeVehicleId
            const isCar = vehicle.vehicleType === 'CAR'
            return (
              <button 
                key={vehicle.id}
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  router.push(pathname + '?' + createQueryString('vehicleId', vehicle.id))
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors font-bold flex items-center justify-between border-b last:border-b-0 border-border/20 cursor-pointer ${
                  isSelected 
                    ? 'bg-main text-main-foreground font-black' 
                    : 'text-foreground hover:bg-background'
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="w-5 h-5 rounded-md object-cover border border-border shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                  ) : isCar ? (
                    <Car className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  ) : (
                    <Bike className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  )}
                  <span className="truncate">{vehicle.name}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-main-foreground stroke-[3] shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
