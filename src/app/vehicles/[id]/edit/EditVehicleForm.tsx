'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateVehicle, deleteVehicle } from '@/actions/vehicle'
import { NeoCombobox } from '@/components/ui/NeoCombobox'
import { Bike, Car, Gauge, FileText, Zap, Fuel, Save, Loader2, AlertCircle, Camera, X, Trash2 } from 'lucide-react'
import { formatThousands, parseThousands } from '@/lib/formatters'

type Vehicle = {
  id: string
  name: string
  image?: string | null
  licensePlate?: string | null
  currentMileage: number
  engineType?: string | null
  transmission?: string | null
  ccOrKwh?: number | null
}

export default function EditVehicleForm({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter()
  const [name, setName] = useState(vehicle.name)
  const [image, setImage] = useState<string | null>(vehicle.image || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [licensePlate, setLicensePlate] = useState(vehicle.licensePlate || '')
  const [mileage, setMileage] = useState(formatThousands(vehicle.currentMileage))
  const [transmission, setTransmission] = useState(vehicle.transmission || 'AUTOMATIC')
  const [ccOrKwh, setCcOrKwh] = useState(vehicle.ccOrKwh ? vehicle.ccOrKwh.toString() : '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const isEV = vehicle.engineType === 'EV'

  const handleDeleteVehicle = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const res = await deleteVehicle(vehicle.id)
      if (res.success) {
        router.push('/vehicles')
        router.refresh()
      } else {
        setDeleteError(res.error || 'Gagal menghapus kendaraan.')
      }
    } catch {
      setDeleteError('Terjadi kesalahan saat menghapus kendaraan.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Harap pilih berkas foto (JPG, PNG, WebP).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran foto maksimal 10MB.')
      return
    }

    setIsUploadingImage(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'vehicles')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setImage(data.url)
      } else {
        setError(data.error || 'Gagal mengunggah foto kendaraan.')
      }
    } catch {
      setError('Terjadi gangguan saat mengunggah foto kendaraan.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const parsedMileage = parseThousands(mileage)
    if (parsedMileage < 0 || !mileage.trim()) {
      setError('Odometer tidak valid')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await updateVehicle(vehicle.id, {
        name,
        image,
        licensePlate: licensePlate.trim() ? licensePlate.trim() : undefined,
        currentMileage: parsedMileage,
        transmission,
        ccOrKwh: ccOrKwh ? parseInt(ccOrKwh, 10) : null
      })

      if (res.success) {
        router.push(`/vehicles?vehicleId=${vehicle.id}`)
        router.refresh()
      } else {
        setError(res.error || 'Gagal memperbarui kendaraan')
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-[#FF4D50] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-black text-xs font-black flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Info Box */}
      <div className="bg-secondary-background p-5 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
        {/* Foto Kendaraan */}
        <div className="flex flex-col gap-2 pb-3 border-b-2 border-border/40">
          <label className="text-[11px] font-black uppercase tracking-wider text-foreground">
            Foto Kendaraan
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-base)] border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--border)] overflow-hidden flex items-center justify-center shrink-0 relative">
              {image ? (
                <img src={image} alt="Foto Kendaraan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-main/30 flex flex-col items-center justify-center text-foreground/70 p-2 text-center">
                  <Bike className="w-7 h-7 stroke-[2]" />
                  <span className="text-[9px] font-black mt-1">Belum Ada Foto</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-main hover:bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5">
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 stroke-[2.5]" />
                    <span>{image ? 'Ganti Foto' : 'Unggah Foto Kendaraan'}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="block text-[11px] font-black text-red-600 hover:underline cursor-pointer"
                >
                  Hapus Foto
                </button>
              )}
              <p className="text-[10px] font-bold text-foreground/60 leading-tight">
                Format JPG, PNG, atau WebP. Foto akan tampil di dashboard & halaman kendaraan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-foreground">
            Nama Kendaraan / Motor
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: Honda PCX 160"
              className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-foreground">
              Nomor Plat (Opsional)
            </label>
            <input 
              type="text" 
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="B 1234 XYZ"
              className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] uppercase focus:outline-none focus:bg-white" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-foreground">
              Odometer (KM)
            </label>
            <input 
              type="text"
              inputMode="numeric"
              value={mileage}
              onChange={(e) => setMileage(formatThousands(e.target.value))}
              required
              placeholder="Contoh: 12.000"
              className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-foreground">
              Transmisi
            </label>
            <NeoCombobox
              value={transmission}
              onChange={(val) => setTransmission(val)}
              options={[
                { value: 'AUTOMATIC', label: 'Matic / Otomatis' },
                { value: 'MANUAL', label: 'Manual / Kopling' }
              ]}
              placeholder="Pilih Transmisi"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-foreground">
              {isEV ? 'Baterai (kWh)' : 'Mesin (CC)'}
            </label>
            <input 
              type="number" 
              value={ccOrKwh}
              onChange={(e) => setCcOrKwh(e.target.value)}
              placeholder={isEV ? "Contoh: 3.5" : "Contoh: 160"}
              className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white" 
            />
          </div>
        </div>

        {/* Zona Bahaya / Danger Zone */}
        <div className="bg-secondary-background rounded-[var(--radius-base)] p-4 sm:p-5 border-2 border-red-500 shadow-[4px_4px_0px_0px_#ef4444] space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <h3 className="text-xs font-black uppercase tracking-wider">Hapus Kendaraan</h3>
          </div>
          <p className="text-xs text-foreground/75 font-bold leading-relaxed">
            Menghapus kendaraan ini akan menghapus semua riwayat servis, estimasi keausan, dan catatan pajak terkait secara permanen.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-500 rounded-[var(--radius-base)] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#ef4444] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Kendaraan Ini</span>
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Kendaraan */}
      {showDeleteModal && (
        <div 
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-secondary-background border-3 border-border rounded-[var(--radius-base)] p-5 shadow-[6px_6px_0px_0px_var(--border)] space-y-4"
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-[var(--radius-base)] bg-red-100 border-2 border-red-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-foreground">Hapus Kendaraan?</h3>
                <p className="text-[11px] text-foreground/70 font-bold truncate">{vehicle.name}</p>
              </div>
            </div>

            <p className="text-xs text-foreground/85 font-bold leading-relaxed bg-background p-3 rounded-[var(--radius-base)] border border-border">
              Apakah Anda yakin ingin menghapus <strong>{vehicle.name}</strong>? Seluruh data riwayat servis dan catatan pajaknya akan dihapus secara permanen.
            </p>

            {deleteError && (
              <p className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded border border-red-300">
                {deleteError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-3 bg-secondary-background hover:bg-background text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteVehicle}
                className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white border-2 border-border rounded-[var(--radius-base)] font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full bg-background p-4 border-t-2 border-border shadow-[0_-2px_0px_0px_var(--border)] z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-main hover:bg-[#8AE500] text-black font-black text-xs uppercase tracking-wider rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </form>
  )
}
