'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Vehicle, TaxRecord } from '@/generated/prisma/client'
import { updateTaxSettings, recordTaxPayment, deleteTaxRecord } from '@/actions/tax'
import { formatThousands, parseThousands } from '@/lib/formatters'
import { NeoDatePicker } from '@/components/ui/NeoDatePicker'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  CreditCard, 
  Info, 
  ExternalLink, 
  ShieldCheck, 
  Save, 
  Loader2, 
  X, 
  Trash2,
  Bike,
  Sparkles,
  Zap,
  Fuel
} from 'lucide-react'

interface VehicleWithTax extends Vehicle {
  taxRecords: TaxRecord[]
}

interface TaxClientViewProps {
  vehicle: VehicleWithTax
  allVehicles: Vehicle[]
}

export default function TaxClientView({ vehicle, allVehicles }: TaxClientViewProps) {
  const router = useRouter()
  const isEV = vehicle.engineType === 'EV'

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Edit Settings Form State
  const [annualDue, setAnnualDue] = useState(
    vehicle.stnkTaxDueDate ? new Date(vehicle.stnkTaxDueDate).toISOString().split('T')[0] : ''
  )
  const [fiveYearDue, setFiveYearDue] = useState(
    vehicle.stnkFiveYearDueDate ? new Date(vehicle.stnkFiveYearDueDate).toISOString().split('T')[0] : ''
  )
  const [pkbAmount, setPkbAmount] = useState(
    vehicle.annualTaxAmount ? formatThousands(vehicle.annualTaxAmount) : ''
  )
  const [swdkllj, setSwdkllj] = useState(
    formatThousands(vehicle.swdklljAmount ?? 35000)
  )

  // Record Payment Form State
  const [payType, setPayType] = useState<'ANNUAL' | 'FIVE_YEAR'>('ANNUAL')
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0])
  const [payAmount, setPayAmount] = useState(() => {
    const pkb = vehicle.annualTaxAmount || 0
    const swd = vehicle.swdklljAmount ?? 35000
    return formatThousands(pkb + swd)
  })
  const [payNote, setPayNote] = useState('')
  const [advanceDue, setAdvanceDue] = useState(true)

  // Hitung status jatuh tempo tahunan
  const calculateDaysLeft = (dueDateStr?: Date | null) => {
    if (!dueDateStr) return null
    const due = new Date(dueDateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const annualDaysLeft = calculateDaysLeft(vehicle.stnkTaxDueDate)
  const fiveYearDaysLeft = calculateDaysLeft(vehicle.stnkFiveYearDueDate)

  const getTaxStatus = (days: number | null) => {
    if (days === null) {
      return {
        label: 'Belum Diatur',
        badgeClass: 'bg-background text-foreground/70 border-border',
        isOverdue: false,
        isWarning: false
      }
    }
    if (days < 0) {
      return {
        label: `Terlambat ${Math.abs(days)} Hari`,
        badgeClass: 'bg-[#FF4D50] text-white border-border shadow-[2px_2px_0px_0px_var(--border)]',
        isOverdue: true,
        isWarning: true
      }
    }
    if (days <= 30) {
      return {
        label: `Jatuh Tempo ${days} Hari Lagi`,
        badgeClass: 'bg-[#FACC00] text-black border-border shadow-[2px_2px_0px_0px_var(--border)]',
        isOverdue: false,
        isWarning: true
      }
    }
    return {
      label: `Berlaku (Sisa ${days} Hari)`,
      badgeClass: 'bg-[#8AE500] text-black border-border shadow-[2px_2px_0px_0px_var(--border)]',
      isOverdue: false,
      isWarning: false
    }
  }

  const annualStatus = getTaxStatus(annualDaysLeft)
  const fiveYearStatus = getTaxStatus(fiveYearDaysLeft)

  const formatLocalDate = (date?: Date | null) => {
    if (!date) return 'Belum Diatur'
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await updateTaxSettings(vehicle.id, {
        stnkTaxDueDate: annualDue ? annualDue : null,
        stnkFiveYearDueDate: fiveYearDue ? fiveYearDue : null,
        annualTaxAmount: pkbAmount ? parseThousands(pkbAmount) : null,
        swdklljAmount: swdkllj ? parseThousands(swdkllj) : 35000
      })

      if (res.success) {
        setIsEditModalOpen(false)
        router.refresh()
      } else {
        setErrorMessage(res.error || 'Gagal menyimpan pengaturan pajak.')
      }
    } catch {
      setErrorMessage('Terjadi kesalahan koneksi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const parsedAmount = parseThousands(payAmount)
    if (parsedAmount <= 0) {
      setErrorMessage('Nominal pembayaran wajib diisi.')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await recordTaxPayment(vehicle.id, {
        taxType: payType,
        paymentDate: payDate,
        amount: parsedAmount,
        note: payNote,
        advanceDueDate: advanceDue
      })

      if (res.success) {
        setIsPayModalOpen(false)
        setPayNote('')
        router.refresh()
      } else {
        setErrorMessage(res.error || 'Gagal mencatat pembayaran.')
      }
    } catch {
      setErrorMessage('Terjadi kesalahan koneksi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan pembayaran pajak ini?')) return
    try {
      await deleteTaxRecord(recordId)
      router.refresh()
    } catch {
      alert('Gagal menghapus catatan.')
    }
  }

  const totalAnnualEstimate = (vehicle.annualTaxAmount || 0) + (vehicle.swdklljAmount ?? 35000)

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header Sticky */}
      <header className="w-full top-0 sticky bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] flex justify-between items-center px-3.5 sm:px-4 h-14 sm:h-16 z-40 md:max-w-md md:mx-auto">
        <div className="flex items-center gap-2.5">
          <Link 
            href="/dashboard"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="font-black text-base sm:text-lg text-foreground tracking-tight uppercase">Pajak STNK & Plat</h1>
            <p className="text-[10px] font-bold text-foreground/70">
              {vehicle.name} • {vehicle.licensePlate || 'Tanpa Plat'}
            </p>
          </div>
        </div>
        <div className="text-[11px] font-black bg-main border-2 border-border px-2 py-0.5 rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
          Cruz
        </div>
      </header>

      <main className="px-3.5 sm:px-4 py-3.5 sm:py-5 space-y-4 sm:space-y-5 md:max-w-md md:mx-auto">
        {/* Hero Card: Pajak Tahunan STNK (PKB + SWDKLLJ) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[5px_5px_0px_0px_var(--border)] space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground/70 block">
                Pajak Tahunan STNK
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {vehicle.licensePlate || vehicle.name}
              </h2>
            </div>
            <span className={`px-2.5 py-1 text-[11px] font-black rounded-[var(--radius-base)] border-2 ${annualStatus.badgeClass}`}>
              {annualStatus.label}
            </span>
          </div>

          {/* Tanggal Jatuh Tempo */}
          <div className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground/70 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Jatuh Tempo Berikutnya:
              </span>
              <strong className="font-black text-foreground">
                {formatLocalDate(vehicle.stnkTaxDueDate)}
              </strong>
            </div>

            {annualDaysLeft !== null && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                <span className="font-bold text-foreground/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Status Waktu:
                </span>
                <span className={`font-black ${annualDaysLeft < 0 ? 'text-[#FF4D50]' : annualDaysLeft <= 30 ? 'text-[#D97706]' : 'text-[#8AE500]'}`}>
                  {annualDaysLeft < 0 ? `Terlambat ${Math.abs(annualDaysLeft)} Hari` : `Sisa ${annualDaysLeft} Hari lagi`}
                </span>
              </div>
            )}
          </div>

          {/* Rincian Estimasi Biaya */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-foreground/70 tracking-wider block">
              Estimasi Biaya Pajak Tahunan
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]">
                <span className="text-[10px] font-bold text-foreground/60 block">PKB (Pajak Pokok)</span>
                <span className="text-xs sm:text-sm font-black text-foreground mt-0.5 block">
                  {vehicle.annualTaxAmount ? `Rp ${vehicle.annualTaxAmount.toLocaleString('id-ID')}` : 'Belum disetel'}
                </span>
              </div>
              <div className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]">
                <span className="text-[10px] font-bold text-foreground/60 block">SWDKLLJ</span>
                <span className="text-xs sm:text-sm font-black text-foreground mt-0.5 block">
                  Rp {(vehicle.swdklljAmount ?? 35000).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-main text-black border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block">Total Estimasi Tahunan</span>
                <span className="text-base sm:text-lg font-black">
                  {totalAnnualEstimate > 0 ? `Rp ${totalAnnualEstimate.toLocaleString('id-ID')}` : 'Atur Biaya Pajak'}
                </span>
              </div>
              <span className="text-[9px] font-bold bg-black text-white px-2 py-0.5 rounded-[var(--radius-base)] uppercase">
                Per Tahun
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setPayType('ANNUAL')
                setPayAmount(formatThousands(totalAnnualEstimate || 250000))
                setIsPayModalOpen(true)
              }}
              type="button"
              className="py-2.5 px-3 bg-main hover:bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] font-black text-xs uppercase shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Sudah Bayar</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              type="button"
              className="py-2.5 px-3 bg-background hover:bg-slate-200 text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 stroke-[2.5]" />
              <span>Atur Tanggal</span>
            </button>
          </div>
        </section>

        {/* Card 2: Pajak 5 Tahunan & Ganti Plat Nomor (TNKB) */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[#0099FF] text-white border-2 border-border flex items-center justify-center shadow-[2px_2px_0px_0px_var(--border)]">
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight">
                  Pajak 5 Tahunan (Ganti Plat)
                </h3>
                <p className="text-[10px] font-bold text-foreground/70">
                  Cek fisik motor di Samsat & cetak TNKB baru
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-black rounded-[var(--radius-base)] border ${fiveYearStatus.badgeClass}`}>
              {fiveYearStatus.label}
            </span>
          </div>

          <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] flex justify-between items-center text-xs">
            <span className="font-bold text-foreground/70">Masa Berlaku Plat Sampai:</span>
            <strong className="font-black text-foreground">
              {formatLocalDate(vehicle.stnkFiveYearDueDate)}
            </strong>
          </div>

          <div className="p-3 bg-[#0099FF]/10 border-2 border-border rounded-[var(--radius-base)] text-[11px] font-semibold text-foreground/90 space-y-1">
            <p className="font-black text-xs text-foreground uppercase flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-foreground" />
              Biaya PNBP Resmi 5 Tahunan Roda 2:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
              <li>Cetak STNK Baru: Rp 100.000 (PP No. 76 Th 2020)</li>
              <li>Cetak Plat Nomor TNKB Baru: Rp 60.000</li>
              <li>Ditambah PKB & SWDKLLJ tahun berjalan</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setPayType('FIVE_YEAR')
              setPayAmount(formatThousands(totalAnnualEstimate + 160000))
              setIsPayModalOpen(true)
            }}
            type="button"
            className="w-full py-2.5 px-3 bg-background hover:bg-main text-foreground font-black text-xs uppercase border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catat Bayar Pajak 5 Tahunan</span>
          </button>
        </section>

        {/* Card 3: Riwayat Pembayaran Pajak */}
        <section className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
            <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-tight flex items-center gap-1.5">
              <FileText className="w-4 h-4 stroke-[2.5]" />
              Riwayat Pembayaran Pajak
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 bg-main text-black border border-border rounded-[var(--radius-base)]">
              {vehicle.taxRecords.length}x Tercatat
            </span>
          </div>

          {vehicle.taxRecords.length === 0 ? (
            <div className="p-4 bg-background border-2 border-dashed border-border rounded-[var(--radius-base)] text-center space-y-1">
              <p className="text-xs font-black text-foreground">Belum ada riwayat pembayaran pajak.</p>
              <p className="text-[11px] font-medium text-foreground/60">
                Klik tombol "Sudah Bayar" setelah membayar pajak untuk mencatatnya di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {vehicle.taxRecords.map((rec) => (
                <div 
                  key={rec.id}
                  className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-[var(--radius-base)] border border-border uppercase ${
                        rec.taxType === 'FIVE_YEAR' ? 'bg-[#0099FF] text-white' : 'bg-main text-black'
                      }`}>
                        {rec.taxType === 'FIVE_YEAR' ? '5 Tahunan (Plat)' : '1 Tahunan'}
                      </span>
                      <strong className="text-xs font-black text-foreground">
                        Rp {rec.amount.toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <p className="text-[10px] font-bold text-foreground/70">
                      Dibayar: {new Date(rec.paymentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {rec.note && (
                      <p className="text-[10px] font-medium text-foreground/60 italic">
                        "{rec.note}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(rec.id)}
                    type="button"
                    title="Hapus riwayat"
                    className="p-1.5 text-foreground/60 hover:text-[#FF4D50] hover:bg-slate-100 rounded-[var(--radius-base)] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Card 4: Panduan & Info Pembayaran Samsat */}
        <section className="bg-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[3px_3px_0px_0px_var(--border)] space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-base)] bg-[#FACC00] border-2 border-border flex items-center justify-center text-black shadow-[1px_1px_0px_0px_var(--border)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black uppercase text-foreground">
              Layanan Pembayaran Pajak Resmi
            </h4>
          </div>

          <p className="text-[11px] font-semibold text-foreground/80 leading-relaxed">
            Pembayaran pajak tahunan dapat dilakukan secara online tanpa antre melalui aplikasi <strong>SIGNAL (Samsat Digital Nasional)</strong> atau e-Samsat provinsi Anda.
          </p>

          <div className="pt-1 flex flex-col gap-1.5 text-[10px] font-bold text-foreground/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-main border border-border" />
              <span>Syarat Pajak 1 Tahun: STNK Asli + KTP Asli Pemilik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0099FF] border border-border" />
              <span>Syarat Pajak 5 Tahun: STNK + KTP + BPKB + Cek Fisik di Samsat</span>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL 1: PENGATURAN TANGGAL & BIAYA PAJAK */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-overlay backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-secondary-background rounded-[var(--radius-base)] max-w-md w-full p-5 sm:p-6 shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black">
                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-foreground uppercase tracking-tight">
                    Pengaturan Pajak STNK
                  </h3>
                  <p className="text-[10px] font-bold text-foreground/70">
                    {vehicle.name} ({vehicle.licensePlate || 'Tanpa Plat'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                type="button"
                className="w-7 h-7 flex items-center justify-center border-2 border-border rounded-[var(--radius-base)] bg-background hover:bg-main text-foreground transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#FF4D50] text-white border-2 border-border rounded-[var(--radius-base)] text-xs font-black">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-3.5">
              {/* Tanggal Pajak Tahunan */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Jatuh Tempo Pajak Tahunan STNK
                </label>
                <NeoDatePicker
                  value={annualDue}
                  onChange={(d) => setAnnualDue(d)}
                  placeholder="Pilih tanggal jatuh tempo tahunan"
                />
              </div>

              {/* Tanggal Pajak 5 Tahunan */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Jatuh Tempo Pajak 5 Tahunan (Ganti Plat)
                </label>
                <NeoDatePicker
                  value={fiveYearDue}
                  onChange={(d) => setFiveYearDue(d)}
                  placeholder="Pilih tanggal jatuh tempo 5 tahunan"
                />
              </div>

              {/* Estimasi Nominal PKB */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Estimasi Pokok Pajak (PKB)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-foreground">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={pkbAmount}
                    onChange={(e) => setPkbAmount(formatThousands(e.target.value))}
                    placeholder="Contoh: 245.000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none"
                  />
                </div>
                <span className="text-[10px] font-semibold text-foreground/60">
                  Lihat angka PKB pada lembar ketetapan pajak STNK Anda.
                </span>
              </div>

              {/* SWDKLLJ */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  SWDKLLJ (Sumbangan Wajib Jasa Raharja)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-foreground">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={swdkllj}
                    onChange={(e) => setSwdkllj(formatThousands(e.target.value))}
                    placeholder="35.000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none"
                  />
                </div>
                <span className="text-[10px] font-semibold text-foreground/60">
                  Standar sepeda motor adalah Rp 35.000.
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-[var(--radius-base)] border-2 border-border bg-background text-foreground font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-[var(--radius-base)] bg-main text-black font-black text-xs border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATAT PEMBAYARAN PAJAK */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-overlay backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-secondary-background rounded-[var(--radius-base)] max-w-md w-full p-5 sm:p-6 shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[#8AE500] border-2 border-border flex items-center justify-center text-black font-black">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-foreground uppercase tracking-tight">
                    Catat Pembayaran Pajak
                  </h3>
                  <p className="text-[10px] font-bold text-foreground/70">
                    {vehicle.name} ({vehicle.licensePlate || 'Tanpa Plat'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                type="button"
                className="w-7 h-7 flex items-center justify-center border-2 border-border rounded-[var(--radius-base)] bg-background hover:bg-main text-foreground transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#FF4D50] text-white border-2 border-border rounded-[var(--radius-base)] text-xs font-black">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-3.5">
              {/* Pilihan Jenis Pajak */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Jenis Pembayaran Pajak
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPayType('ANNUAL')
                      setPayAmount(formatThousands(totalAnnualEstimate || 250000))
                    }}
                    className={`py-2 px-3 rounded-[var(--radius-base)] border-2 border-border text-xs font-black transition-all cursor-pointer ${
                      payType === 'ANNUAL' ? 'bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]' : 'bg-background text-foreground'
                    }`}
                  >
                    1 Tahunan (STNK)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayType('FIVE_YEAR')
                      setPayAmount(formatThousands(totalAnnualEstimate + 160000))
                    }}
                    className={`py-2 px-3 rounded-[var(--radius-base)] border-2 border-border text-xs font-black transition-all cursor-pointer ${
                      payType === 'FIVE_YEAR' ? 'bg-[#0099FF] text-white shadow-[2px_2px_0px_0px_var(--border)]' : 'bg-background text-foreground'
                    }`}
                  >
                    5 Tahunan (Plat TNKB)
                  </button>
                </div>
              </div>

              {/* Tanggal Bayar */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Tanggal Pembayaran
                </label>
                <NeoDatePicker
                  value={payDate}
                  onChange={(d) => setPayDate(d)}
                  placeholder="Pilih tanggal bayar"
                />
              </div>

              {/* Nominal Dibayar */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Nominal Pembayaran Lunas
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-foreground">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={payAmount}
                    onChange={(e) => setPayAmount(formatThousands(e.target.value))}
                    required
                    placeholder="Contoh: 280.000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Catatan / Keterangan */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-foreground block">
                  Catatan / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="Contoh: Bayar via SIGNAL / Samsat Keliling"
                  className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none"
                />
              </div>

              {/* Checkbox Majukan Tanggal Jatuh Tempo */}
              <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] flex items-start gap-2.5 shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer" onClick={() => setAdvanceDue(!advanceDue)}>
                <input
                  type="checkbox"
                  checked={advanceDue}
                  onChange={(e) => setAdvanceDue(e.target.checked)}
                  className="w-4 h-4 accent-black mt-0.5 cursor-pointer"
                />
                <div className="text-xs font-bold text-foreground leading-tight select-none">
                  <span>Majukan tanggal jatuh tempo secara otomatis</span>
                  <p className="text-[10px] text-foreground/60 font-semibold mt-0.5">
                    {payType === 'ANNUAL' ? 'Menambah 1 tahun ke jadwal tahunan berikutnya' : 'Menambah 5 tahun ke jadwal ganti plat berikutnya'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-[var(--radius-base)] border-2 border-border bg-background text-foreground font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-[var(--radius-base)] bg-main text-black font-black text-xs border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pembayaran'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
