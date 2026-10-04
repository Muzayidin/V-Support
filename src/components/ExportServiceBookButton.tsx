'use client'

import { useState } from 'react'
import CruzLogo from '@/components/CruzLogo'
import { FileText, Printer, X, ShieldCheck, Bike, History as HistoryIcon } from 'lucide-react'

interface ServiceDetailItem {
  id: string
  componentName: string
  cost: number
}

interface ServiceRecordItem {
  id: string
  date: string | Date
  mileage: number
  totalCost: number
  laborCost?: number
  details: ServiceDetailItem[]
}

interface VehicleInfo {
  id: string
  name: string
  licensePlate?: string | null
  currentMileage: number
}

interface ExportServiceBookButtonProps {
  vehicle: VehicleInfo
  history: ServiceRecordItem[]
}

export default function ExportServiceBookButton({
  vehicle,
  history
}: ExportServiceBookButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const totalExpense = history.reduce((sum, item) => sum + item.totalCost, 0)
  const averageCost = history.length > 0 ? Math.round(totalExpense / history.length) : 0

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        type="button"
        className="px-3 py-1.5 flex items-center gap-1.5 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] text-foreground shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all text-xs font-black cursor-pointer shrink-0"
        title="Ekspor / Cetak Buku Servis Digital"
      >
        <FileText className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Buku Servis PDF</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-overlay backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-secondary-background text-foreground rounded-[var(--radius-base)] max-w-2xl w-full p-6 shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border my-8 print:border-none print:shadow-none print:my-0 print:max-w-none print:w-full">
            
            {/* Action Bar (Hidden during print) */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b-2 border-border print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-black text-foreground text-base">Pratinjau Buku Servis Digital</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-main text-black rounded-[var(--radius-base)] text-xs font-black flex items-center gap-1.5 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-background border-2 border-border rounded-[var(--radius-base)] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body (Printable Area) */}
            <div id="service-book-printable" className="space-y-6">
              {/* Header Certificate */}
              <div className="flex justify-between items-start border-b-2 border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CruzLogo className="w-8 h-8 shrink-0" />
                    <h2 className="text-2xl font-black tracking-tight">CRUZ</h2>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-foreground/70 font-black mt-0.5">
                    Paspor & Buku Servis Digital Kendaraan
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-base)] bg-main text-black text-xs font-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Resale Value Verified</span>
                  </div>
                  <p className="text-[11px] text-foreground/70 font-bold mt-1">
                    Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Vehicle Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Kendaraan</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Polisi / Plat</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.licensePlate || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Odometer Terakhir</span>
                  <span className="font-bold text-primary text-sm">{vehicle.currentMileage.toLocaleString('id-ID')} KM</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Perawatan</span>
                  <span className="font-bold text-emerald-600 text-sm">Terawat Rutin</span>
                </div>
              </div>

              {/* Financial & Maintenance Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Total Servis</span>
                  <span className="text-lg font-black text-slate-800">{history.length} Kali</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Total Investasi Servis</span>
                  <span className="text-lg font-black text-primary">Rp {totalExpense.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Rata-rata Biaya Servis</span>
                  <span className="text-lg font-black text-slate-800">Rp {averageCost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Service History Table */}
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HistoryIcon className="w-4 h-4 text-foreground" />
                  <span>Catatan Riwayat Servis Lengkap</span>
                </h3>

                {history.length === 0 ? (
                  <div className="text-center p-6 border-2 border-dashed border-border rounded-[var(--radius-base)] text-foreground/60 text-xs font-bold">
                    Belum ada riwayat servis yang tercatat untuk kendaraan ini.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-[var(--radius-base)] border-2 border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-background text-foreground font-black uppercase border-b-2 border-border">
                        <tr>
                          <th className="py-2.5 px-3">No</th>
                          <th className="py-2.5 px-3">Tanggal</th>
                          <th className="py-2.5 px-3">Odometer</th>
                          <th className="py-2.5 px-3">Komponen / Suku Cadang</th>
                          <th className="py-2.5 px-3 text-right">Biaya (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-bold">
                        {history.map((record, index) => {
                          const dateObj = new Date(record.date)
                          const formattedDate = dateObj.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                          const components = record.details.map(d => d.componentName).join(', ')

                          return (
                            <tr key={record.id} className="hover:bg-background/50">
                              <td className="py-2.5 px-3 text-foreground/50">{index + 1}</td>
                              <td className="py-2.5 px-3 whitespace-nowrap text-foreground font-bold">{formattedDate}</td>
                              <td className="py-2.5 px-3 whitespace-nowrap font-mono text-foreground font-black">{record.mileage.toLocaleString('id-ID')} KM</td>
                              <td className="py-2.5 px-3 text-foreground/80 max-w-xs">{components || '-'}</td>
                              <td className="py-2.5 px-3 text-right whitespace-nowrap font-black text-foreground">
                                {record.totalCost.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot className="bg-background border-t-2 border-border font-black text-foreground">
                        <tr>
                          <td colSpan={4} className="py-2.5 px-3 text-right uppercase">Total Seluruh Pengeluaran Servis:</td>
                          <td className="py-2.5 px-3 text-right text-foreground font-black">
                            Rp {totalExpense.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Authentic Guarantee Seal */}
              <div className="pt-4 border-t-2 border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-foreground/70 text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black">
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-black text-foreground block">Cruz Verified Digital Passport</span>
                    <span>Dokumen riwayat servis terkomputerisasi independen untuk transparansi jual-beli motor.</span>
                  </div>
                </div>
                <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                  <span className="font-mono text-[10px] text-foreground/70 block">ID: {vehicle.id.slice(-8).toUpperCase()}</span>
                  <span className="font-black text-black bg-main px-2 py-0.5 rounded-[var(--radius-base)] border border-border">STATUS: TERVERIFIKASI</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
