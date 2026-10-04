'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateVehicleIntervals } from '@/actions/vehicle'
import { formatThousands, parseThousands } from '@/lib/formatters'
import { MANUFACTURER_STANDARDS } from '@/lib/calculations'
import { SlidersHorizontal, X, Save, RotateCcw, AlertCircle, Loader2, Sparkles, Check, Info } from 'lucide-react'

interface CustomIntervalModalProps {
  vehicleId: string
  vehicleName: string
  engineType: string // 'ICE' | 'EV'
  currentOilKm?: number | null
  currentTransKm?: number | null
  currentCoolantKm?: number | null
  buttonClassName?: string
}

export default function CustomIntervalModal({
  vehicleId,
  vehicleName,
  engineType,
  currentOilKm,
  currentTransKm,
  currentCoolantKm,
  buttonClassName = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black bg-secondary-background hover:bg-main text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer"
}: CustomIntervalModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const isEV = engineType === 'EV'

  const mfg = isEV ? MANUFACTURER_STANDARDS.EV : MANUFACTURER_STANDARDS.ICE
  const defaultOilMfg = mfg.oil ? mfg.oil.defaultKm : 3000
  const defaultTransMfg = mfg.transmissionOil.defaultKm
  const defaultCoolantMfg = mfg.coolant.defaultKm

  // State untuk form input
  const [oilKm, setOilKm] = useState(formatThousands(currentOilKm || defaultOilMfg))
  const [transKm, setTransKm] = useState(formatThousands(currentTransKm || defaultTransMfg))
  const [coolantKm, setCoolantKm] = useState(formatThousands(currentCoolantKm || defaultCoolantMfg))

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleOpen = () => {
    setOilKm(formatThousands(currentOilKm || defaultOilMfg))
    setTransKm(formatThousands(currentTransKm || defaultTransMfg))
    setCoolantKm(formatThousands(currentCoolantKm || defaultCoolantMfg))
    setError(null)
    setSuccessMsg(null)
    setIsOpen(true)
  }

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false)
      setError(null)
      setSuccessMsg(null)
    }
  }

  const handleResetToMfg = () => {
    setOilKm(formatThousands(defaultOilMfg))
    setTransKm(formatThousands(defaultTransMfg))
    setCoolantKm(formatThousands(defaultCoolantMfg))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    const parsedOil = parseThousands(oilKm)
    const parsedTrans = parseThousands(transKm)
    const parsedCoolant = parseThousands(coolantKm)

    if (!isEV && (parsedOil < 1000 || parsedOil > 15000)) {
      setError('Interval Oli Mesin disarankan antara 1.000 – 15.000 KM.')
      return
    }

    if (parsedTrans < 2000 || parsedTrans > 30000) {
      setError('Interval Oli Transmisi disarankan antara 2.000 – 30.000 KM.')
      return
    }

    if (parsedCoolant < 3000 || parsedCoolant > 50000) {
      setError('Interval Cairan Cooler disarankan antara 3.000 – 50.000 KM.')
      return
    }

    setLoading(true)

    try {
      const res = await updateVehicleIntervals(vehicleId, {
        oilIntervalKm: isEV ? null : parsedOil,
        transmissionOilIntervalKm: parsedTrans,
        coolantIntervalKm: parsedCoolant
      })

      if (res.success) {
        setSuccessMsg('Interval servis berhasil disimpan!')
        setTimeout(() => {
          setIsOpen(false)
          router.refresh()
        }, 600)
      } else {
        setError(res.error || 'Gagal menyimpan interval.')
      }
    } catch {
      setError('Terjadi kesalahan koneksi saat menyimpan data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={buttonClassName}
        title="Sesuaikan interval jadwal servis rekomendasi pabrikan"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Atur Interval Servis</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-overlay backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-secondary-background rounded-[var(--radius-base)] max-w-md w-full p-5 sm:p-6 shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black shadow-[2px_2px_0px_0px_var(--border)]">
                  <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-foreground uppercase tracking-tight">
                    Pengaturan Interval Servis
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-foreground/70">
                    {vehicleName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                type="button"
                className="w-7 h-7 flex items-center justify-center border-2 border-border rounded-[var(--radius-base)] bg-background hover:bg-main text-foreground transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Note & Info */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-start gap-2.5 text-xs text-foreground">
              <Info className="w-4 h-4 shrink-0 text-foreground mt-0.5" />
              <div className="leading-relaxed font-semibold text-[11px]">
                Anda bebas menentukan interval penggantian oli dan pendingin sesuai kondisi medan jalan Anda, namun tetap mengacu pada patokan resmi pabrikan.
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-[var(--radius-base)] bg-[#FF4D50] text-black border-2 border-border text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-[var(--radius-base)] bg-[#8AE500] text-black border-2 border-border text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Oli Mesin (Khusus ICE) */}
              {!isEV && (
                <div className="bg-background p-3.5 border-2 border-border rounded-[var(--radius-base)] space-y-2 shadow-[2px_2px_0px_0px_var(--border)]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-foreground">
                      Interval Oli Mesin
                    </label>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#FACC00] text-black border border-border rounded-[var(--radius-base)]">
                      Pabrikan: {formatThousands(defaultOilMfg)} KM
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={oilKm}
                      onChange={(e) => setOilKm(formatThousands(e.target.value))}
                      required
                      placeholder={formatThousands(defaultOilMfg)}
                      className="w-full px-3.5 pr-12 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-foreground">
                      KM
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] font-bold text-foreground/70">
                      Standar AHASS / Yamaha: 2.000 – 4.000 KM
                    </span>
                    <button
                      type="button"
                      onClick={() => setOilKm(formatThousands(defaultOilMfg))}
                      className="text-[10px] font-black text-foreground underline hover:text-black cursor-pointer"
                    >
                      Gunakan Default
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Oli Transmisi / Gardan / Reduksi */}
              <div className="bg-background p-3.5 border-2 border-border rounded-[var(--radius-base)] space-y-2 shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-foreground">
                    {isEV ? 'Interval Oli Reduksi EV' : 'Interval Oli Gardan (Matic)'}
                  </label>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-[#FACC00] text-black border border-border rounded-[var(--radius-base)]">
                    Pabrikan: {formatThousands(defaultTransMfg)} KM
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={transKm}
                    onChange={(e) => setTransKm(formatThousands(e.target.value))}
                    required
                    placeholder={formatThousands(defaultTransMfg)}
                    className="w-full px-3.5 pr-12 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-foreground">
                    KM
                  </span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] font-bold text-foreground/70">
                    {isEV ? 'Standar EV Gearbox: 10.000 KM' : 'Standar Matic Resmi: 8.000 KM'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTransKm(formatThousands(defaultTransMfg))}
                    className="text-[10px] font-black text-foreground underline hover:text-black cursor-pointer"
                  >
                    Gunakan Default
                  </button>
                </div>
              </div>

              {/* 3. Cairan Radiator (Coolant) */}
              <div className="bg-background p-3.5 border-2 border-border rounded-[var(--radius-base)] space-y-2 shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-foreground">
                    Interval Cairan Cooler (Radiator)
                  </label>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-[#FACC00] text-black border border-border rounded-[var(--radius-base)]">
                    Pabrikan: {formatThousands(defaultCoolantMfg)} KM
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={coolantKm}
                    onChange={(e) => setCoolantKm(formatThousands(e.target.value))}
                    required
                    placeholder={formatThousands(defaultCoolantMfg)}
                    className="w-full px-3.5 pr-12 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-foreground">
                    KM
                  </span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] font-bold text-foreground/70">
                    Pemeriksaan/Pengurasan tiap 10.000 – 12.000 KM
                  </span>
                  <button
                    type="button"
                    onClick={() => setCoolantKm(formatThousands(defaultCoolantMfg))}
                    className="text-[10px] font-black text-foreground underline hover:text-black cursor-pointer"
                  >
                    Gunakan Default
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResetToMfg}
                  className="w-full py-2 px-3 rounded-[var(--radius-base)] border-2 border-border bg-background hover:bg-slate-200 text-foreground font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reset Semua ke Rekomendasi Pabrikan</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-[var(--radius-base)] border-2 border-border bg-background text-foreground font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-[var(--radius-base)] bg-main text-black font-black text-xs border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 stroke-[2.5]" />
                    )}
                    <span>{loading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
