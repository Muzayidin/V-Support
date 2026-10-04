'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Wrench, 
  Gauge, 
  Calendar, 
  Receipt, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Trash2, 
  AlertTriangle, 
  Loader2, 
  Bike, 
  Zap, 
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { deleteServiceRecord } from '@/actions/service'

interface ServiceDetailItem {
  id: string
  componentName: string
  cost: number
}

interface ServiceRecordWithVehicle {
  id: string
  vehicleId: string
  date: Date | string
  mileage: number
  totalCost: number
  laborCost: number
  createdAt: Date | string
  details: ServiceDetailItem[]
  vehicle: {
    id: string
    name: string
    licensePlate: string | null
    engineType: string
    currentMileage: number
  }
}

interface Props {
  record: ServiceRecordWithVehicle
}

export default function ServiceDetailClientView({ record }: Props) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const dateObj = new Date(record.date)
  const dateFormatted = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const timeFormatted = new Date(record.createdAt).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const isEV = record.vehicle.engineType === 'EV'
  const componentTotal = record.details.reduce((sum, d) => sum + d.cost, 0)
  const mileageDiff = record.vehicle.currentMileage - record.mileage

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    const text = `*Catatan Servis - ${record.vehicle.name}*
Tanggal: ${dateFormatted}
Odometer: ${record.mileage.toLocaleString('id-ID')} KM
Komponen: ${record.details.map(d => d.componentName).join(', ')}
${record.laborCost > 0 ? `Biaya Jasa: Rp ${record.laborCost.toLocaleString('id-ID')}\n` : ''}Total Pengeluaran: Rp ${record.totalCost.toLocaleString('id-ID')}
Dicatat via Cruz`

    if (navigator.share) {
      navigator.share({
        title: `Servis ${record.vehicle.name}`,
        text
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    const res = await deleteServiceRecord(record.id)
    if (res.success) {
      router.push(`/history?vehicleId=${record.vehicleId}`)
    } else {
      setIsDeleting(false)
      setDeleteError(res.error || 'Gagal menghapus log servis')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] px-4 h-14 sm:h-16 flex items-center justify-between md:max-w-md md:mx-auto print:hidden">
        <div className="flex items-center gap-2.5">
          <Link 
            href={`/history?vehicleId=${record.vehicleId}`} 
            className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Kembali ke Riwayat Servis"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="font-black text-sm sm:text-base text-foreground tracking-tight">Detail Log Servis</h1>
            <p className="text-[10px] font-bold text-foreground/60 leading-none">Rincian pekerjaan & pengeluaran</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Bagikan Ringkasan"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-8 h-8 rounded-[var(--radius-base)] bg-main text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Cetak Bukti Servis"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4 md:max-w-md md:mx-auto print:px-0 print:py-0 print:max-w-none">
        
        {/* Toast Copied Notice */}
        {copied && (
          <div className="bg-[#8AE500] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] p-2.5 rounded-[var(--radius-base)] text-xs font-black text-black flex items-center justify-between animate-in fade-in duration-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              Ringkasan servis berhasil disalin ke clipboard!
            </span>
          </div>
        )}

        {/* Kartu Ringkasan Servis (Header Kwitansi Digital) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3.5">
          
          {/* Baris Atas: Info Kendaraan & Status Selesai */}
          <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black shrink-0">
                {isEV ? <Zap className="w-5 h-5 fill-current" /> : <Bike className="w-5 h-5 stroke-[2.5]" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-foreground tracking-tight leading-tight">
                  {record.vehicle.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {record.vehicle.licensePlate && (
                    <span className="px-1.5 py-0.2 bg-background border border-border rounded-[var(--radius-base)] text-[9px] font-black uppercase">
                      {record.vehicle.licensePlate}
                    </span>
                  )}
                  <span className="text-[9px] font-bold text-foreground/70 uppercase">
                    {isEV ? 'Motor Listrik (EV)' : 'Motor Bensin (ICE)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="inline-flex items-center gap-1 bg-[#8AE500] text-black border-2 border-border px-2 py-0.5 rounded-[var(--radius-base)] text-[10px] font-black shadow-[1px_1px_0px_0px_var(--border)]">
                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                Selesai
              </span>
              <span className="text-[9px] font-bold text-foreground/50 mt-1 font-mono">
                #SRV-{record.id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Grid Informasi Tanggal & Jarak Tempuh */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background p-2.5 rounded-[var(--radius-base)] border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] space-y-1">
              <div className="flex items-center gap-1.5 text-foreground/60 text-[10px] font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tanggal Servis</span>
              </div>
              <p className="text-xs font-black text-foreground">
                {dateFormatted}
              </p>
              <div className="flex items-center gap-1 text-[9px] font-bold text-foreground/50">
                <Clock className="w-2.5 h-2.5" />
                <span>Tercatat pukul {timeFormatted}</span>
              </div>
            </div>

            <div className="bg-background p-2.5 rounded-[var(--radius-base)] border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] space-y-1">
              <div className="flex items-center gap-1.5 text-foreground/60 text-[10px] font-bold uppercase tracking-wider">
                <Gauge className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Odometer Servis</span>
              </div>
              <p className="text-xs font-black text-foreground font-mono">
                {record.mileage.toLocaleString('id-ID')} KM
              </p>
              <p className="text-[9px] font-bold text-foreground/60">
                {mileageDiff > 0 
                  ? `+${mileageDiff.toLocaleString('id-ID')} KM setelahnya` 
                  : 'Servis paling baru'}
              </p>
            </div>
          </div>
        </section>

        {/* Tabel Rincian Pekerjaan & Suku Cadang */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-xs font-black shadow-[1px_1px_0px_0px_var(--border)]">
                <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
                Rincian Suku Cadang & Servis ({record.details.length})
              </h3>
            </div>
            <span className="text-[10px] font-black bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)]">
              Kwitansi
            </span>
          </div>

          {/* List Item Servis */}
          <div className="border-2 border-border rounded-[var(--radius-base)] divide-y-2 divide-border bg-background overflow-hidden">
            {record.details.length === 0 ? (
              <div className="p-3 text-center text-xs font-bold text-foreground/60">
                Pengecekan rutin umum berkala
              </div>
            ) : (
              record.details.map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  className="p-2.5 flex items-center justify-between gap-2 hover:bg-secondary-background/60 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <span className="w-5 h-5 rounded-[var(--radius-base)] bg-secondary-background border border-border flex items-center justify-center text-[10px] font-black text-foreground/70 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-foreground truncate block">
                      {item.componentName}
                    </span>
                  </div>

                  <span className="text-xs font-black text-foreground shrink-0 font-mono">
                    {item.cost > 0 ? `Rp ${item.cost.toLocaleString('id-ID')}` : 'Rp 0'}
                  </span>
                </div>
              ))
            )}

            {/* Subtotal Komponen jika ada biaya jasa */}
            {record.laborCost > 0 && (
              <div className="p-2.5 flex items-center justify-between gap-2 bg-secondary-background/80 text-[11px] font-bold text-foreground/80">
                <span>Subtotal Suku Cadang:</span>
                <span className="font-black text-foreground font-mono">
                  Rp {componentTotal.toLocaleString('id-ID')}
                </span>
              </div>
            )}

            {/* Biaya Jasa Servis / Mekanik */}
            {record.laborCost > 0 && (
              <div className="p-2.5 flex items-center justify-between gap-2 bg-[#FACC00]/25">
                <span className="flex items-center gap-1.5 text-xs font-black text-foreground truncate">
                  <Receipt className="w-3.5 h-3.5 stroke-[2.5] text-foreground shrink-0" />
                  Ongkos Jasa Servis / Mekanik:
                </span>
                <span className="text-xs font-black text-foreground shrink-0 font-mono">
                  Rp {record.laborCost.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Kotak Total Pengeluaran */}
          <div className="flex justify-between items-center p-3 bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)]">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-foreground block">
                Total Biaya Servis
              </span>
              <span className="text-[9px] font-bold text-foreground/70 block">
                {record.laborCost > 0 
                  ? `Suku cadang (Rp ${componentTotal.toLocaleString('id-ID')}) + Jasa (Rp ${record.laborCost.toLocaleString('id-ID')})`
                  : 'Total pengeluaran tercatat'}
              </span>
            </div>
            <span className="text-base sm:text-lg font-black text-foreground font-mono">
              Rp {record.totalCost.toLocaleString('id-ID')}
            </span>
          </div>
        </section>

        {/* Informasi Pembaruan Komponen */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-3.5 sm:p-4 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 stroke-[2.5] text-[#00A86B]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
              Dampak Servis ke Kendaraan
            </h4>
          </div>
          <p className="text-[11px] font-bold text-foreground/75 leading-relaxed">
            Pencatatan servis ini secara otomatis memperbarui odometer kendaraan menjadi{' '}
            <span className="font-black text-foreground">{record.mileage.toLocaleString('id-ID')} KM</span> dan mereset kondisi kesehatan komponen terkait kembali ke kondisi prima (100%).
          </p>
        </section>

        {/* Action Buttons Section */}
        <section className="space-y-2 pt-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full py-3 px-4 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Cetak / Unduh Bukti Servis PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/history?vehicleId=${record.vehicleId}`}
              className="flex-1 py-2.5 px-3 bg-secondary-background hover:bg-background border-2 border-border rounded-[var(--radius-base)] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)] text-center transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              Kembali ke Riwayat
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="py-2.5 px-3 bg-[#FF4D50] hover:bg-[#FE2C1D] text-white border-2 border-border rounded-[var(--radius-base)] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              title="Hapus Log Ini"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Hapus</span>
            </button>
          </div>
        </section>

      </main>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[6px_6px_0px_0px_var(--border)] p-4 sm:p-5 max-w-sm w-full space-y-3.5">
            <div className="flex items-center gap-2.5 text-[#FF4D50]">
              <div className="w-9 h-9 rounded-[var(--radius-base)] bg-[#FF4D50]/15 border-2 border-[#FF4D50] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground">Hapus Catatan Servis?</h3>
                <p className="text-[10px] font-bold text-foreground/60">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs font-bold text-foreground/80 leading-relaxed bg-background p-3 rounded-[var(--radius-base)] border-2 border-border">
              Catatan servis tanggal <span className="font-black text-foreground">{dateFormatted}</span> sebesar <span className="font-black text-foreground">Rp {record.totalCost.toLocaleString('id-ID')}</span> akan dihapus dari riwayat kendaraan ini.
            </p>

            {deleteError && (
              <div className="p-2 bg-red-100 border border-red-400 rounded-[var(--radius-base)] text-[11px] font-bold text-red-800">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-background hover:bg-slate-100 border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-[#FF4D50] hover:bg-[#FE2C1D] text-white border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
