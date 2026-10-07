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
  Sparkles,
  Gauge,
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
      // Default rekomendasi kelayakan: jika kondisi sebelumnya rendah, defaultkan ke 80% (layak pakai)
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

  const getConditionColor = (val: number) => {
    if (val >= 70) return 'bg-[#8AE500] text-black'
    if (val >= 40) return 'bg-[#FACC00] text-black'
    return 'bg-[#FF4D50] text-black'
  }

  const getConditionStatusLabel = (val: number) => {
    if (val >= 75) return 'Sangat Layak & Prima'
    if (val >= 60) return 'Layak Pakai'
    if (val >= 40) return 'Cukup Layak (Pantau Berkala)'
    return 'Perlu Perhatian / Mendekati Batas'
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
        setSuccessMsg('Tersimpan offline! Akan disinkronkan otomatis saat ada koneksi.')
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
        setSuccessMsg(`Kelayakan ${component.name} berhasil dikonfirmasi (${condition}%)!`)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-overlay backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-secondary-background rounded-[var(--radius-base)] max-w-md w-full p-4 sm:p-5 shadow-[6px_6px_0px_0px_var(--border)] border-2 border-border flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b-2 border-border pb-3">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black shadow-[2px_2px_0px_0px_var(--border)] shrink-0 mt-0.5">
              <ClipboardCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-foreground tracking-tight leading-snug">
                Konfirmasi Kelayakan Pakai
              </h3>
              <p className="text-[11px] font-bold text-foreground/70 leading-tight">
                Cek fisik komponen & tentukan ulang persentase
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

        {/* Feedback Alert */}
        {error && (
          <div className="p-3 bg-[#FF4D50] text-black border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] text-xs font-black flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 stroke-[3] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] text-xs font-black flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Info Komponen Yang Sedang Diperiksa */}
        <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider block">
                Komponen
              </span>
              <span className="text-xs sm:text-sm font-black text-foreground">
                {component.name}
              </span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-secondary-background border border-border rounded-[var(--radius-base)] text-foreground">
              {component.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50 text-[11px] font-bold">
            <div>
              <span className="text-foreground/60 block text-[10px]">Kondisi Terkalkulasi:</span>
              <span className="font-black text-foreground">
                {component.currentCondition}% ({component.statusText})
              </span>
            </div>
            <div>
              <span className="text-foreground/60 block text-[10px]">Odometer Saat Ini:</span>
              <span className="font-black text-foreground">
                KM {currentMileage.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Form Pengecekan */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Status Hasil Pengecekan Fisik */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-foreground block">
              Hasil Pengecekan Fisik:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsUsable(true)
                  if (condition < 50) setCondition(75)
                }}
                className={`py-2 px-2.5 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isUsable
                    ? 'bg-[#8AE500] text-black shadow-[2px_2px_0px_0px_var(--border)]'
                    : 'bg-background text-foreground/70 hover:bg-main/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>Masih Layak Pakai</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUsable(false)
                  if (condition > 40) setCondition(20)
                }}
                className={`py-2 px-2.5 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !isUsable
                    ? 'bg-[#FF4D50] text-black shadow-[2px_2px_0px_0px_var(--border)]'
                    : 'bg-background text-foreground/70 hover:bg-main/30'
                }`}
              >
                <AlertTriangle className="w-4 h-4 stroke-[3]" />
                <span>Perlu Ganti / Aus</span>
              </button>
            </div>
          </div>

          {/* Pengaturan Slider & Persentase Kelayakan Baru */}
          <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black text-foreground block">
                  Tentukan Ulang Persentase:
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
                  className="w-16 py-1 px-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-center text-sm font-black text-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                />
                <span className="text-xs font-black text-foreground">%</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1">
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
                className="w-full h-2.5 bg-secondary-background rounded-lg appearance-none cursor-pointer accent-black border border-border"
              />
              <div className="flex justify-between text-[9px] font-bold text-foreground/50">
                <span>0% (Kritis)</span>
                <span>50% (Sedang)</span>
                <span>100% (Prima)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-foreground/60">Preset Cepat:</span>
              {[
                { label: '90% (Prima)', val: 90 },
                { label: '80% (Baik)', val: 80 },
                { label: '65% (Layak)', val: 65 },
                { label: '40% (Pantau)', val: 40 },
                { label: '15% (Kritis)', val: 15 }
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => handlePresetClick(preset.val)}
                  className={`px-2 py-0.5 rounded-[var(--radius-base)] border border-border text-[10px] font-black cursor-pointer transition-all ${
                    condition === preset.val
                      ? 'bg-main text-black shadow-[1px_1px_0px_0px_var(--border)] font-black'
                      : 'bg-secondary-background text-foreground hover:bg-main/30'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Live Impact Preview */}
            <div className="p-2 bg-secondary-background border border-border rounded-[var(--radius-base)] flex items-center justify-between text-[11px] font-bold">
              <span className="text-foreground/75">Estimasi Sisa Jarak Tempuh:</span>
              <span className="font-black text-foreground">
                ± {previewRemainingKm.toLocaleString('id-ID')} KM
              </span>
            </div>
          </div>

          {/* Diperiksa Oleh (Pemeriksa) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-foreground block">
              Dikonfirmasi Oleh:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInspectorRole('USER')}
                className={`py-2 px-2.5 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inspectorRole === 'USER'
                    ? 'bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]'
                    : 'bg-background text-foreground/70 hover:bg-main/30'
                }`}
              >
                <User className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Pengguna / Pemilik</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorRole('MECHANIC')}
                className={`py-2 px-2.5 rounded-[var(--radius-base)] border-2 border-border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inspectorRole === 'MECHANIC'
                    ? 'bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]'
                    : 'bg-background text-foreground/70 hover:bg-main/30'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Mekanik Bengkel</span>
              </button>
            </div>
          </div>

          {/* Catatan Pemeriksaan Fisik (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-foreground block">
              Catatan Pengecekan Fisik (Opsional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Ketebalan kampas masih 3.5mm, oli masih jernih, sabuk v-belt lentur tanpa retak..."
              className="w-full p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/45 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-hidden focus:shadow-[3px_3px_0px_0px_var(--border)] resize-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-3 bg-secondary-background hover:bg-main/40 text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-xs font-black active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-2 py-2.5 px-3 bg-main hover:bg-[#8AE500] text-black border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-xs font-black flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan & Tentukan Ulang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
