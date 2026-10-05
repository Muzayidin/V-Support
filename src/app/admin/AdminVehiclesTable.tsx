'use client'

import { useState } from 'react'
import { 
  Bike, 
  Car, 
  Zap, 
  Fuel, 
  Search, 
  Gauge, 
  User as UserIcon, 
  Wrench, 
  Calendar,
  Layers
} from 'lucide-react'

export interface AdminVehicleItem {
  id: string
  name: string
  licensePlate: string | null
  vehicleType: string
  engineType: string
  transmission: string
  ccOrKwh: number | null
  currentMileage: number
  serviceCount: number
  taxRecordCount: number
  createdAt: string
  owner: {
    id: string
    name: string | null
    email: string | null
  }
}

export default function AdminVehiclesTable({ vehicles }: { vehicles: AdminVehicleItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'ICE' | 'EV' | 'CAR'>('ALL')

  const filtered = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      v.name.toLowerCase().includes(term) ||
      (v.licensePlate || '').toLowerCase().includes(term) ||
      (v.owner.name || '').toLowerCase().includes(term) ||
      (v.owner.email || '').toLowerCase().includes(term)

    if (filterType === 'ALL') return matchesSearch
    if (filterType === 'ICE') return matchesSearch && v.engineType === 'ICE' && v.vehicleType === 'MOTORCYCLE'
    if (filterType === 'EV') return matchesSearch && v.engineType === 'EV'
    if (filterType === 'CAR') return matchesSearch && v.vehicleType === 'CAR'
    return matchesSearch
  })

  const iceCount = vehicles.filter((v) => v.engineType === 'ICE').length
  const evCount = vehicles.filter((v) => v.engineType === 'EV').length
  const carCount = vehicles.filter((v) => v.vehicleType === 'CAR').length

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-3.5 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <input
            type="text"
            placeholder="Cari motor, plat nomor, atau pemilik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 hover:text-foreground border-2 border-border'
            }`}
          >
            Semua ({vehicles.length})
          </button>
          <button
            onClick={() => setFilterType('ICE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterType === 'ICE'
                ? 'bg-amber-400 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 hover:text-foreground border-2 border-border'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            Bensin ({iceCount})
          </button>
          <button
            onClick={() => setFilterType('EV')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterType === 'EV'
                ? 'bg-emerald-400 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 hover:text-foreground border-2 border-border'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Listrik EV ({evCount})
          </button>
          {carCount > 0 && (
            <button
              onClick={() => setFilterType('CAR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
                filterType === 'CAR'
                  ? 'bg-blue-400 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 hover:text-foreground border-2 border-border'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Mobil ({carCount})
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-background/50 text-[11px] font-black uppercase text-foreground/70 tracking-wider">
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Plat Nomor</th>
                <th className="py-3 px-4">Tipe & Mesin</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Pemilik (User)</th>
                <th className="py-3 px-4">Servis</th>
                <th className="py-3 px-4">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border text-xs font-bold">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-foreground/60">
                    Tidak ada kendaraan yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const isEV = v.engineType === 'EV'
                  return (
                    <tr key={v.id} className="hover:bg-background/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-[var(--radius-base)] border border-border flex items-center justify-center shrink-0 ${
                            isEV ? 'bg-emerald-400 text-black' : 'bg-main text-black'
                          }`}>
                            {v.vehicleType === 'CAR' ? (
                              <Car className="w-4 h-4" />
                            ) : (
                              <Bike className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-black text-foreground block text-sm">
                              {v.name}
                            </span>
                            <span className="text-[10px] text-foreground/60 uppercase font-bold">
                              {v.transmission} {v.ccOrKwh ? `• ${v.ccOrKwh} ${isEV ? 'kWh' : 'cc'}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-black">
                        {v.licensePlate ? (
                          <span className="px-2 py-0.5 bg-background border border-border rounded shadow-[1px_1px_0px_0px_var(--border)] text-foreground">
                            {v.licensePlate}
                          </span>
                        ) : (
                          <span className="text-foreground/40 italic">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black border ${
                            isEV
                              ? 'bg-emerald-300 text-black border-black'
                              : 'bg-amber-300 text-black border-black'
                          }`}
                        >
                          {isEV ? <Zap className="w-3 h-3" /> : <Fuel className="w-3 h-3" />}
                          {isEV ? 'Motor Listrik (EV)' : 'Bensin (ICE)'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-black text-foreground">
                        {v.currentMileage.toLocaleString('id-ID')} km
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-foreground/90">
                          <UserIcon className="w-3.5 h-3.5 text-foreground/50 shrink-0" />
                          <div className="truncate max-w-[140px]">
                            <span className="block font-black text-xs truncate">
                              {v.owner.name || 'Pengguna'}
                            </span>
                            <span className="block text-[10px] text-foreground/60 truncate font-medium">
                              {v.owner.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border border-border rounded text-[11px] font-black">
                          <Wrench className="w-3 h-3" />
                          {v.serviceCount}x
                        </span>
                      </td>

                      <td className="py-3 px-4 text-foreground/60 font-medium text-[11px] whitespace-nowrap">
                        {v.createdAt}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
