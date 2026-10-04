'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateVehicle } from '@/actions/vehicle'
import { formatThousands, parseThousands } from '@/lib/formatters'
import { Gauge, X, Save, AlertCircle, Loader2 } from 'lucide-react'

interface QuickOdometerModalProps {
  vehicleId: string
  vehicleName: string
  currentMileage: number
  buttonClassName?: string
}

export default function QuickOdometerModal({
  vehicleId,
  vehicleName,
  currentMileage,
  buttonClassName = "mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[var(--radius-base)] text-xs font-black bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer"
}: QuickOdometerModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mileage, setMileage] = useState(formatThousands(currentMileage))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => {
    setMileage(formatThousands(currentMileage))
    setError(null)
    setIsOpen(true)
  }

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newMileage = parseThousands(mileage)

    if (newMileage < 0 || (!mileage.trim() && mileage !== '0')) {
      setError('Angka odometer tidak valid.')
      return
    }

    if (newMileage < currentMileage) {
      setError(`Angka Odometer baru tidak boleh lebih kecil dari sebelumnya (${formatThousands(currentMileage)} KM).`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await updateVehicle(vehicleId, { currentMileage: newMileage })
      if (result.success) {
        setIsOpen(false)
        router.refresh()
      } else {
        setError(result.error || 'Gagal memperbarui odometer.')
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className={buttonClassName}
        title="Perbarui angka KM odometer"
      >
        <Gauge className="w-3.5 h-3.5" />
        <span>Perbarui KM</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-secondary-background rounded-[var(--radius-base)] max-w-sm w-full p-6 shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-black text-base text-foreground">
                <div className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black">
                  <Gauge className="w-4 h-4" />
                </div>
                <span>Update Odometer</span>
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

            <p className="text-xs text-foreground font-semibold">
              Perbarui jarak tempuh terakhir untuk <strong className="font-black underline">{vehicleName}</strong> agar perhitungan servis tetap akurat.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1">
                  Odometer Baru (KM)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={mileage}
                    onChange={(e) => setMileage(formatThousands(e.target.value))}
                    required
                    placeholder={formatThousands(currentMileage)}
                    className="w-full px-4 pr-12 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-base font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-foreground">
                    KM
                  </span>
                </div>
                <span className="text-[11px] text-foreground/70 font-bold mt-1.5 block">
                  Angka sebelumnya: {formatThousands(currentMileage)} KM
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-[var(--radius-base)] bg-[#FF4D50] text-black border-2 border-border text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
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
                    <Save className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Menyimpan...' : 'Simpan KM'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
