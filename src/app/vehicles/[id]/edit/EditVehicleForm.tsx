'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateVehicle } from '@/actions/vehicle'
import { NeoCombobox } from '@/components/ui/NeoCombobox'
import { Bike, Gauge, FileText, Zap, Fuel, Save, Loader2, AlertCircle } from 'lucide-react'
import { formatThousands, parseThousands } from '@/lib/formatters'

type Vehicle = {
  id: string
  name: string
  licensePlate?: string | null
  currentMileage: number
  engineType?: string | null
  transmission?: string | null
  ccOrKwh?: number | null
}

export default function EditVehicleForm({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter()
  const [name, setName] = useState(vehicle.name)
  const [licensePlate, setLicensePlate] = useState(vehicle.licensePlate || '')
  const [mileage, setMileage] = useState(formatThousands(vehicle.currentMileage))
  const [transmission, setTransmission] = useState(vehicle.transmission || 'AUTOMATIC')
  const [ccOrKwh, setCcOrKwh] = useState(vehicle.ccOrKwh ? vehicle.ccOrKwh.toString() : '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEV = vehicle.engineType === 'EV'

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
      </div>

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
