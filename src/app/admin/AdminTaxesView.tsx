'use client'

import { useState } from 'react'
import { 
  Receipt, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Bike, 
  User, 
  Clock, 
  Coins,
  Search
} from 'lucide-react'

export interface AdminTaxRecordItem {
  id: string
  taxType: string
  paymentDate: string
  amount: number
  note: string | null
  vehicle: {
    name: string
    licensePlate: string | null
    user: {
      name: string | null
      email: string | null
    }
  }
}

export interface AdminTaxVehicleAlert {
  id: string
  name: string
  licensePlate: string | null
  ownerName: string | null
  ownerEmail: string | null
  stnkTaxDueDate: string | null
  stnkFiveYearDueDate: string | null
  taxDaysLeft: number | null
  fiveYearDaysLeft: number | null
}

interface AdminTaxesViewProps {
  taxRecords: AdminTaxRecordItem[]
  taxAlertVehicles: AdminTaxVehicleAlert[]
  totalTaxAmount: number
}

export default function AdminTaxesView({
  taxRecords,
  taxAlertVehicles,
  totalTaxAmount
}: AdminTaxesViewProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const overdueCount = taxAlertVehicles.filter(
    (v) => (v.taxDaysLeft !== null && v.taxDaysLeft < 0) || (v.fiveYearDaysLeft !== null && v.fiveYearDaysLeft < 0)
  ).length

  const upcomingCount = taxAlertVehicles.filter(
    (v) => (v.taxDaysLeft !== null && v.taxDaysLeft >= 0 && v.taxDaysLeft <= 30) ||
           (v.fiveYearDaysLeft !== null && v.fiveYearDaysLeft >= 0 && v.fiveYearDaysLeft <= 30)
  ).length

  const filteredRecords = taxRecords.filter((r) => {
    const term = searchTerm.toLowerCase()
    return (
      r.vehicle.name.toLowerCase().includes(term) ||
      (r.vehicle.licensePlate || '').toLowerCase().includes(term) ||
      (r.vehicle.user.name || '').toLowerCase().includes(term) ||
      (r.vehicle.user.email || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Total Pembayaran Pajak
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main text-black border border-border flex items-center justify-center font-black">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">
            Rp {totalTaxAmount.toLocaleString('id-ID')}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            {taxRecords.length} kali pencatatan pembayaran pajak STNK
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Pajak Lewat Tempo (Overdue)
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-red-400 text-black border border-border flex items-center justify-center font-black">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600">
            {overdueCount} Kendaraan
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            Perlu konfirmasi perpanjangan STNK oleh user
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Mendekati Jatuh Tempo
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-amber-400 text-black border border-border flex items-center justify-center font-black">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {upcomingCount} Kendaraan
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            Jatuh tempo dalam 30 hari ke depan
          </p>
        </div>
      </div>

      {/* Tax Due Dates Alert Fleet List */}
      {taxAlertVehicles.length > 0 && (
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-foreground/70" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                Status Tenggat Pajak STNK Pengguna
              </h3>
            </div>
            <span className="text-[11px] font-bold text-foreground/60">
              Monitoring Tanggal Jatuh Tempo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {taxAlertVehicles.map((v) => {
              const isOverdue = (v.taxDaysLeft !== null && v.taxDaysLeft < 0) || (v.fiveYearDaysLeft !== null && v.fiveYearDaysLeft < 0)
              const isUrgent = (v.taxDaysLeft !== null && v.taxDaysLeft >= 0 && v.taxDaysLeft <= 30)

              return (
                <div
                  key={v.id}
                  className={`p-3 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between ${
                    isOverdue
                      ? 'bg-red-400/10 border-red-500'
                      : isUrgent
                      ? 'bg-amber-400/10 border-amber-500'
                      : 'bg-background'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-xs text-foreground truncate max-w-[150px]">
                        {v.name}
                      </span>
                      {v.licensePlate && (
                        <span className="text-[10px] font-mono font-bold bg-background px-1.5 py-0.2 rounded border border-border">
                          {v.licensePlate}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-foreground/60 block truncate">
                      {v.ownerName || v.ownerEmail}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/60 space-y-1 text-[11px]">
                    {v.stnkTaxDueDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/70">Pajak Tahunan:</span>
                        <span
                          className={`font-black ${
                            v.taxDaysLeft !== null && v.taxDaysLeft < 0
                              ? 'text-red-600'
                              : v.taxDaysLeft !== null && v.taxDaysLeft <= 30
                              ? 'text-amber-600'
                              : 'text-foreground'
                          }`}
                        >
                          {v.taxDaysLeft !== null && v.taxDaysLeft < 0
                            ? `Lewat ${Math.abs(v.taxDaysLeft)} hari`
                            : v.taxDaysLeft !== null
                            ? `${v.taxDaysLeft} hari lagi`
                            : '-'}
                        </span>
                      </div>
                    )}

                    {v.stnkFiveYearDueDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/70">Ganti Plat 5 Thn:</span>
                        <span
                          className={`font-black ${
                            v.fiveYearDaysLeft !== null && v.fiveYearDaysLeft < 0
                              ? 'text-red-600'
                              : 'text-foreground'
                          }`}
                        >
                          {v.fiveYearDaysLeft !== null && v.fiveYearDaysLeft < 0
                            ? `Lewat ${Math.abs(v.fiveYearDaysLeft)} hari`
                            : v.fiveYearDaysLeft !== null
                            ? `${v.fiveYearDaysLeft} hari lagi`
                            : '-'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tax Records Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input
              type="text"
              placeholder="Cari catatan pajak berdasarkan motor atau pemilik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 focus:outline-none focus:bg-white"
            />
          </div>
          <span className="text-xs font-black text-foreground/70">
            {filteredRecords.length} Catatan Pembayaran
          </span>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-background/50 text-[11px] font-black uppercase text-foreground/70 tracking-wider">
                  <th className="py-3 px-4">Kendaraan</th>
                  <th className="py-3 px-4">Pemilik</th>
                  <th className="py-3 px-4">Jenis Pajak</th>
                  <th className="py-3 px-4">Nominal Bayar</th>
                  <th className="py-3 px-4">Tanggal Bayar</th>
                  <th className="py-3 px-4">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border text-xs font-bold">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-foreground/60">
                      Belum ada riwayat pembayaran pajak yang dicatat di sistem.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-background/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-black text-foreground block">
                          {r.vehicle.name}
                        </span>
                        {r.vehicle.licensePlate && (
                          <span className="text-[10px] font-mono text-foreground/70 bg-background px-1.5 py-0.2 rounded border border-border">
                            {r.vehicle.licensePlate}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="block font-black text-foreground text-xs">
                          {r.vehicle.user.name || 'Pengguna'}
                        </span>
                        <span className="block text-[10px] text-foreground/60 font-medium">
                          {r.vehicle.user.email}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black border ${
                            r.taxType === 'FIVE_YEAR'
                              ? 'bg-purple-300 text-black border-black'
                              : 'bg-blue-300 text-black border-black'
                          }`}
                        >
                          {r.taxType === 'FIVE_YEAR' ? '5 Tahunan (Plat)' : '1 Tahunan (PKB)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black font-mono text-foreground">
                        Rp {r.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-foreground/60 font-medium text-[11px]">
                        {r.paymentDate}
                      </td>
                      <td className="py-3 px-4 text-foreground/70 font-medium text-[11px]">
                        {r.note || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
