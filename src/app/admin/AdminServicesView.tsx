'use client'

import { useState } from 'react'
import { 
  Wrench, 
  Coins, 
  Search, 
  Receipt, 
  Calendar, 
  User, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export interface AdminServiceDetailItem {
  id: string
  componentName: string
  cost: number
}

export interface AdminServiceRecordItem {
  id: string
  date: string
  mileage: number
  totalCost: number
  laborCost: number
  vehicle: {
    name: string
    licensePlate: string | null
    engineType: string
    user: {
      name: string | null
      email: string | null
    }
  }
  details: AdminServiceDetailItem[]
}

export interface TopComponentItem {
  componentName: string
  count: number
  totalSpend: number
}

interface AdminServicesViewProps {
  services: AdminServiceRecordItem[]
  topComponents: TopComponentItem[]
  totalCost: number
  totalLaborCost: number
}

export default function AdminServicesView({
  services,
  topComponents,
  totalCost,
  totalLaborCost
}: AdminServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredServices = services.filter((s) => {
    const term = searchTerm.toLowerCase()
    const matchesVehicle = s.vehicle.name.toLowerCase().includes(term) ||
      (s.vehicle.licensePlate || '').toLowerCase().includes(term)
    const matchesUser = (s.vehicle.user.name || '').toLowerCase().includes(term) ||
      (s.vehicle.user.email || '').toLowerCase().includes(term)
    const matchesComponent = s.details.some((d) => d.componentName.toLowerCase().includes(term))

    return matchesVehicle || matchesUser || matchesComponent
  })

  const partsCost = Math.max(0, totalCost - totalLaborCost)

  return (
    <div className="space-y-6">
      {/* KPI Cards: Biaya Servis & Jasa */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Total Seluruh Servis
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main text-black border border-border flex items-center justify-center font-black">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">
            Rp {totalCost.toLocaleString('id-ID')}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            {services.length} log transaksi servis dicatat
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Biaya Sparepart / Komponen
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-blue-400/20 text-blue-600 border border-border flex items-center justify-center font-black">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">
            Rp {partsCost.toLocaleString('id-ID')}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            {totalCost > 0 ? Math.round((partsCost / totalCost) * 100) : 0}% dari seluruh pengeluaran
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Ongkos Jasa Mekanik
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-emerald-400/20 text-emerald-600 border border-border flex items-center justify-center font-black">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">
            Rp {totalLaborCost.toLocaleString('id-ID')}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            {totalCost > 0 ? Math.round((totalLaborCost / totalCost) * 100) : 0}% dari seluruh pengeluaran
          </p>
        </div>
      </div>

      {/* Top Serviced Components Section */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-foreground/70" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Komponen Paling Sering Diservis
            </h3>
          </div>
          <span className="text-[11px] font-bold text-foreground/60">
            Statistik Frekuensi Komponen
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topComponents.length === 0 ? (
            <p className="text-xs text-foreground/60 italic col-span-4">
              Belum ada riwayat servis untuk menghitung komponen terpopuler.
            </p>
          ) : (
            topComponents.map((item, idx) => (
              <div
                key={item.componentName}
                className="bg-background border-2 border-border rounded-[var(--radius-base)] p-3 shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-foreground/50">
                      #{idx + 1} Terpopuler
                    </span>
                    <span className="text-[11px] font-black bg-main px-1.5 py-0.2 rounded border border-border">
                      {item.count}x
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-foreground line-clamp-1">
                    {item.componentName}
                  </h4>
                </div>
                <div className="mt-2 pt-2 border-t border-border flex justify-between items-center text-[11px]">
                  <span className="text-foreground/60 font-medium">Total:</span>
                  <span className="font-black text-foreground">
                    Rp {item.totalSpend.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Service Records Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input
              type="text"
              placeholder="Cari berdasarkan motor, pemilik, atau nama komponen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 focus:outline-none focus:bg-white"
            />
          </div>
          <span className="text-xs font-black text-foreground/70 self-end sm:self-center">
            Menampilkan {filteredServices.length} dari {services.length} servis
          </span>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-background/50 text-[11px] font-black uppercase text-foreground/70 tracking-wider">
                  <th className="py-3 px-4">Kendaraan</th>
                  <th className="py-3 px-4">Pemilik</th>
                  <th className="py-3 px-4">KM Odometer</th>
                  <th className="py-3 px-4">Komponen</th>
                  <th className="py-3 px-4">Jasa</th>
                  <th className="py-3 px-4">Total Biaya</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-center">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border text-xs font-bold">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-foreground/60">
                      Tidak ada catatan servis yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((record) => {
                    const isExpanded = expandedId === record.id
                    return (
                      <>
                        <tr key={record.id} className="hover:bg-background/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-black text-foreground block">
                              {record.vehicle.name}
                            </span>
                            {record.vehicle.licensePlate && (
                              <span className="text-[10px] font-mono text-foreground/70 bg-background px-1.5 py-0.2 rounded border border-border">
                                {record.vehicle.licensePlate}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="block font-black text-foreground text-xs">
                              {record.vehicle.user.name || 'Pengguna'}
                            </span>
                            <span className="block text-[10px] text-foreground/60 font-medium">
                              {record.vehicle.user.email}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-black text-foreground">
                            {record.mileage.toLocaleString('id-ID')} km
                          </td>
                          <td className="py-3 px-4">
                            <span className="line-clamp-1 max-w-[200px] text-foreground/80 font-medium">
                              {record.details.map((d) => d.componentName).join(', ') || 'Servis Umum'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-foreground/70">
                            Rp {record.laborCost.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 font-black text-foreground">
                            Rp {record.totalCost.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-foreground/60 font-medium text-[11px] whitespace-nowrap">
                            {record.date}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : record.id)}
                              className="p-1 rounded bg-background hover:bg-main border border-border text-foreground transition-all cursor-pointer"
                              title="Lihat rincian komponen"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr key={`${record.id}-details`} className="bg-background/80">
                            <td colSpan={8} className="p-4 border-b-2 border-border">
                              <div className="p-3 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] max-w-xl space-y-2">
                                <h5 className="font-black text-xs uppercase tracking-wider text-foreground">
                                  Rincian Komponen Servis:
                                </h5>
                                <div className="space-y-1 divide-y divide-border/60">
                                  {record.details.map((d) => (
                                    <div key={d.id} className="flex justify-between py-1 text-xs">
                                      <span className="font-medium text-foreground">{d.componentName}</span>
                                      <span className="font-black font-mono text-foreground">
                                        Rp {d.cost.toLocaleString('id-ID')}
                                      </span>
                                    </div>
                                  ))}
                                  {record.laborCost > 0 && (
                                    <div className="flex justify-between py-1 text-xs">
                                      <span className="font-medium text-foreground/80 italic">Ongkos Jasa Mekanik</span>
                                      <span className="font-black font-mono text-foreground/80">
                                        Rp {record.laborCost.toLocaleString('id-ID')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
