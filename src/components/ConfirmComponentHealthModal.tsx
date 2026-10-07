'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ComponentStatus } from '@/lib/calculations'
import { confirmComponentHealth } from '@/actions/vehicle'
import { enqueueOfflineAction } from '@/lib/offlineSync'
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  User, 
  ShieldCheck, 
  Loader2, 
  ClipboardCheck,
  Check
} from 'lucide-react'

interface ConfirmComponentHealthModalProps {
  vehicleId: string
  currentMileage: number
  component: ComponentStatus | null
  isOpen: boolean
  onClose: () => void
}

export default function ConfirmComponentHealthModal({
  vehicleId,
  currentMileage,
  component,
  isOpen,
  onClose
}: ConfirmComponentHealthModalProps) {
  const router = useRouter()
  
  // State form
  const [condition, setCondition] = useState<number>(80)
  const [inspectorRole, setInspectorRole] = useState<'USER' | 'MECHANIC'>('USER')
  const [notes, setNotes] = useState<string>('')
  const [isUsable, setIsUsable] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Inisialisasi saat modal dibuka untuk komponen tertentu
  useEffect(() => {
    if (component) {
      const initialVal = component.currentCondition >= 60 
        ? component.currentCondition 
        : 80
      setCondition(initialVal)
      setIsUsable(initialVal >= 40)
      setInspectorRole('USER')
      setNotes(component.lastInspectionNotes || '')
      setError(null)
      setSuccessMsg(null)
    }
  }, [component, isOpen])

  if (!isOpen || !component) return null

  // Perhitungan estimasi sisa KM secara live sesuai persentase yang dipilih
  const previewRemainingKm = Math.round((condition / 100) * component.intervalKm)

  const getConditionStatusLabel = (val: number) => {
    if (val >= 75) return 'Sangat Layak & Prima'
    if (val >= 60) return 'Layak Pakai'
    if (val >= 40) return 'Cukup Layak (Pantau)'
    return 'Aus / Mendekati Batas'
  }

  const handlePresetClick = (presetValue: number) => {
    setCondition(presetValue)
    setIsUsable(presetValue >= 40)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (condition < 0 || condition > 100) {
      setError('Persentase kondisi harus di antara 0% dan 100%.')
      return
    }

    setLoading(true)

    // Deteksi jika perangkat sedang offline
    if (typeof window !== 'undefined' && !navigator.onLine) {
      try {
        enqueueOfflineAction(
          'CONFIRM_COMPONENT_HEALTH',
          {
            vehicleId,
            componentId: component.id,
            componentName: component.name,
            condition,
            inspectorRole,
            notes: notes.trim() || null
          },
          `Konfirmasi Kelayakan: ${component.name} (${condition}%)`
        )
        setSuccessMsg('Tersimpan offline! Otomatis disinkronkan saat online.')
        setTimeout(() => {
          onClose()
          router.refresh()
        }, 1000)
      } catch {
        setError('Gagal menyimpan ke penyimpanan lokal.')
      } finally {
        setLoading(false)
      }
      return
    }

    // Eksekusi Server Action Online
    try {
      const res = await confirmComponentHealth({
        vehicleId,
        componentId: component.id,
        componentName: component.name,
        condition,
        inspectorRole,
        notes: notes.trim() || undefined
      })

      if (res.success) {
        setSuccessMsg(`Kelayakan ${component.name} berhasil disimpan (${condition}%)!`)
        setTimeout(() => {
          onClose()
          router.refresh()
        }, 700)
      } else {
        setError(res.error || 'Gagal menyimpan konfirmasi kelayakan.')
      }
    } catch {
      setError('Terjadi kendala jaringan saat menyimpan konfirmasi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-3.5 sm:p-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] bg-overlay backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div className="bg-secondary-background w-full max-w-sm sm:max-w-md rounded-[var(--radius-base)] shadow-[5px_5px_0px_0px_var(--border)] sm:shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border flex flex-col max-h-[min(72dvh,540px)] overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header (Fixed at top) */}
        <div className="flex justify-between items-center p-3 sm:p-3.5 border-b-2 border-border shrink-0 bg-secondary-background">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] shrink-0">
              <ClipboardCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-foreground tracking-tight leading-tight">
                Cek Kelayakan Fisik
              </h3>
              <p className="text-[10px] font-bold text-foreground/60 leading-none mt-0.5">
                {component.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-7 h-7 rounded-[var(--radius-base)] bg-background hover:bg-main border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            title="Tutup Modal"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-3.5 sm:p-4 space-y-3 overscroll-contain">
          {/* Feedback Alert */}
          {error && (
            <div className="p-2.5 bg-[#FF4D50] text-black border-2 border-border rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 stroke-[3] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Info Komponen Singkat */}
          <div className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-black text-foreground block truncate">
                {component.name}
              </span>
              <span className="text-[10px] font-bold text-foreground/65 block">
                KM {currentMileage.toLocaleString('id-ID')} • Interval {component.intervalKm.toLocaleString('id-ID')} KM
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-black text-foreground block">
                {component.currentCondition}%
              </span>
              <span className="text-[9px] font-bold text-foreground/60 block">
                {component.statusText}
              </span>
            </div>
          </div>

          {/* Form Content */}
          <form id="confirm-health-form" onSubmit={handleSubmit} className="space-y-3">
            {/* Status Hasil Pengecekan Fisik */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-foreground block">
                Status Kelayakan Fisik:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUsable(true)
                    if (condition < 50) setCondition(75)
                  }}
                  className={`py-1.5 px-2 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isUsable
                      ? 'bg-[#8AE500] text-black shadow-[2px_2px_0px_0px_var(--border)]'
                      : 'bg-background text-foreground/70 hover:bg-main/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Masih Layak</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUsable(false)
                    if (condition > 40) setCondition(20)
                  }}
                  className={`py-1.5 px-2 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !isUsable
                      ? 'bg-[#FF4D50] text-black shadow-[2px_2px_0px_0px_var(--border)]'
                      : 'bg-background text-foreground/70 hover:bg-main/30'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Perlu Ganti</span>
                </button>
              </div>
            </div>

            {/* Slider & Angka Persentase */}
            <div className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[11px] font-black text-foreground block">
                    Persentase Kondisi:
                  </label>
                  <span className="text-[10px] font-bold text-foreground/60">
                    {getConditionStatusLabel(condition)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={condition}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value) || 0))
                      setCondition(val)
                      setIsUsable(val >= 40)
                    }}
                    className="w-14 py-0.5 px-1.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-center text-xs font-black text-foreground"
                  />
                  <span className="text-xs font-black text-foreground">%</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={condition}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setCondition(val)
                  setIsUsable(val >= 40)
                }}
                className="w-full h-2 bg-secondary-background rounded-lg appearance-none cursor-pointer accent-black border border-border"
              />

              {/* Presets */}
              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                {[
                  { label: '90%', val: 90 },
                  { label: '80%', val: 80 },
                  { label: '65%', val: 65 },
                  { label: '40%', val: 40 },
                  { label: '15%', val: 15 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => handlePresetClick(preset.val)}
                    className={`px-2 py-0.5 rounded-[var(--radius-base)] border border-border text-[10px] font-black cursor-pointer transition-all ${
                      condition === preset.val
                        ? 'bg-main text-black shadow-[1px_1px_0px_0px_var(--border)]'
                        : 'bg-secondary-background text-foreground hover:bg-main/30'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <span className="text-[10px] font-bold text-foreground/70 ml-auto">
                  Est. Sisa: <strong>± {previewRemainingKm.toLocaleString('id-ID')} KM</strong>
                </span>
              </div>
            </div>

            {/* Pemeriksa */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-foreground block">
                Dikonfirmasi Oleh:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInspectorRole('USER')}
                  className={`py-1.5 px-2 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    inspectorRole === 'USER'
                      ? 'bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]'
                      : 'bg-background text-foreground/70 hover:bg-main/30'
                  }`}
                >
                  <User className="w-3 h-3 stroke-[2.5]" />
                  <span>Pengguna</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorRole('MECHANIC')}
                  className={`py-1.5 px-2 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    inspectorRole === 'MECHANIC'
                      ? 'bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]'
                      : 'bg-background text-foreground/70 hover:bg-main/30'
                  }`}
                >
                  <Wrench className="w-3 h-3 stroke-[2.5]" />
                  <span>Mekanik Bengkel</span>
                </button>
              </div>
            </div>

            {/* Catatan Ringkas */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-foreground block">
                Catatan Fisik (Opsional):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Ketebalan kampas 3.5mm, oli masih jernih..."
                className="w-full py-1.5 px-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/45 shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
            </div>
          </form>
        </div>

        {/* Modal Sticky Footer (Always visible above bottom nav menu) */}
        <div className="p-3 sm:p-3.5 border-t-2 border-border bg-secondary-background shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 px-3 bg-secondary-background hover:bg-main/40 text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-xs font-black active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            form="confirm-health-form"
            disabled={loading}
            className="flex-2 py-2 px-3 bg-main hover:bg-[#8AE500] text-black border-2 border-border shadow-[2.5px_2.5px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-xs font-black flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Simpan Kelayakan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
