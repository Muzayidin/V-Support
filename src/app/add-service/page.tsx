'use client'

import { useState, useEffect, FormEvent, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createServiceRecord } from '@/actions/service'
import { getVehicles } from '@/actions/vehicle'
import SmartSuggestionModal from '@/components/SmartSuggestionModal'
import { NeoDatePicker } from '@/components/ui/NeoDatePicker'
import { NeoCombobox } from '@/components/ui/NeoCombobox'
import { formatThousands, parseThousands } from '@/lib/formatters'
import { 
  ArrowLeft, 
  ArrowRight,
  Check, 
  Plus, 
  Wrench, 
  Save, 
  Loader2, 
  Receipt,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Fuel,
  Zap,
  WifiOff
} from 'lucide-react'
import { enqueueOfflineAction, getCachedVehicles, updateCachedVehicleOdometer } from '@/lib/offlineSync'

interface ComponentItem {
  id: string
  name: string
  category: string
}

// Komponen Servis Khusus Motor Bensin (ICE)
const COMPONENTS_ICE: ComponentItem[] = [
  // Rutin & Pelumasan
  { id: 'oli_mesin', name: 'Ganti Oli Mesin', category: 'Rutin & Pelumasan' },
  { id: 'oli_gardan', name: 'Ganti Oli Gardan / Transmisi', category: 'Rutin & Pelumasan' },
  { id: 'filter_oli', name: 'Ganti Filter Oli Mesin', category: 'Rutin & Pelumasan' },

  // Injeksi, Karburator & Mesin Bensin
  { id: 'servis_injeksi', name: 'Servis Injeksi / Throttle Body & Injector', category: 'Injeksi & Mesin' },
  { id: 'servis_karbu', name: 'Servis Karburator (Pembersihan & Setel)', category: 'Injeksi & Mesin' },
  { id: 'ganti_busi', name: 'Ganti Busi (Spark Plug)', category: 'Injeksi & Mesin' },
  { id: 'filter_udara', name: 'Ganti Filter Udara', category: 'Injeksi & Mesin' },
  { id: 'gurah_mesin', name: 'Gurah Mesin (Carbon Cleaner Ruang Bakar)', category: 'Injeksi & Mesin' },
  { id: 'setel_klep', name: 'Setel Celah Klep (Valve Clearance)', category: 'Injeksi & Mesin' },
  { id: 'filter_bensin', name: 'Ganti Filter Bensin', category: 'Injeksi & Mesin' },
  { id: 'kuras_tangki', name: 'Kuras Tangki Bahan Bakar', category: 'Injeksi & Mesin' },

  // CVT & Transmisi
  { id: 'servis_cvt', name: 'Servis CVT Lengkap (Roller & Slider)', category: 'CVT & Transmisi' },
  { id: 'v_belt', name: 'Ganti V-Belt CVT', category: 'CVT & Transmisi' },
  { id: 'kopling_ganda', name: 'Ganti Kampas Kopling Ganda', category: 'CVT & Transmisi' },
  { id: 'kopling_manual', name: 'Ganti Kampas Kopling Manual & Plat', category: 'CVT & Transmisi' },
  { id: 'rantai_gir', name: 'Setel / Ganti Rantai & Gir Set', category: 'CVT & Transmisi' },
  { id: 'minyak_kopling', name: 'Ganti Minyak Kopling Hidrolik', category: 'CVT & Transmisi' },

  // Pengereman & Pendinginan
  { id: 'kampas_depan', name: 'Ganti Kampas Rem Depan', category: 'Pengereman' },
  { id: 'kampas_belakang', name: 'Ganti Kampas Rem Belakang', category: 'Pengereman' },
  { id: 'minyak_rem', name: 'Kuras & Ganti Minyak Rem (DOT 3 / 4)', category: 'Pengereman' },
  { id: 'master_kaliper', name: 'Servis Master Rem & Kaliper', category: 'Pengereman' },
  { id: 'cakram', name: 'Ganti Piringan Cakram', category: 'Pengereman' },
  { id: 'radiator', name: 'Kuras & Ganti Air Radiator (Coolant)', category: 'Pengereman' },

  // Kaki-kaki & Ban
  { id: 'ban_depan', name: 'Ganti Ban Luar Depan', category: 'Kaki-kaki & Ban' },
  { id: 'ban_belakang', name: 'Ganti Ban Luar Belakang', category: 'Kaki-kaki & Ban' },
  { id: 'komstir', name: 'Setel Komstir / Bearing Komstir', category: 'Kaki-kaki & Ban' },
  { id: 'shock_depan', name: 'Servis Shockbreaker Depan', category: 'Kaki-kaki & Ban' },
  { id: 'shock_belakang', name: 'Servis / Ganti Shockbreaker Belakang', category: 'Kaki-kaki & Ban' },
  { id: 'bearing_roda', name: 'Ganti Bearing / Laher Roda', category: 'Kaki-kaki & Ban' },
  { id: 'bosh_arm', name: 'Ganti Bosh Swing Arm', category: 'Kaki-kaki & Ban' },

  // Kelistrikan & Servis Umum
  { id: 'aki', name: 'Ganti Aki / Accu (12V)', category: 'Kelistrikan & Umum' },
  { id: 'scan_ecu', name: 'Scan ECU & Reset Diagnostik', category: 'Kelistrikan & Umum' },
  { id: 'kelistrikan_lampu', name: 'Perbaikan Kelistrikan & Lampu', category: 'Kelistrikan & Umum' },
  { id: 'servis_rutin', name: 'Servis Ringan Berkala Rutin', category: 'Kelistrikan & Umum' },
  { id: 'turun_mesin', name: 'Servis Besar / Overhaul Mesin', category: 'Kelistrikan & Umum' }
]

// Komponen Servis Khusus Motor Listrik (EV)
const COMPONENTS_EV: ComponentItem[] = [
  // Baterai & Motor Listrik EV
  { id: 'cek_baterai_ev', name: 'Pengecekan Kesehatan Baterai (SOH / BMS)', category: 'Baterai & Motor EV' },
  { id: 'hub_motor_ev', name: 'Pengecekan & Servis Hub Motor / BLDC', category: 'Baterai & Motor EV' },
  { id: 'controller_ev', name: 'Pengecekan Controller / Inverter EV', category: 'Baterai & Motor EV' },
  { id: 'kabel_hv', name: 'Pengecekan Kabel Harness & Soket High-Voltage', category: 'Baterai & Motor EV' },
  { id: 'update_fw', name: 'Update Firmware Controller / BMS', category: 'Baterai & Motor EV' },
  { id: 'obc_charger', name: 'Pengecekan Port Charging & On-Board Charger', category: 'Baterai & Motor EV' },
  { id: 'aki_aux_12v', name: 'Pengecekan / Ganti Aki Bantu 12V', category: 'Baterai & Motor EV' },

  // Pelumasan & Pendinginan EV
  { id: 'oli_reduksi', name: 'Ganti Oli Reduksi / Gearbox Motor Listrik', category: 'Pelumasan & Pendingin EV' },
  { id: 'coolant_baterai', name: 'Kuras & Ganti Cairan Cooler Radiator Baterai', category: 'Pelumasan & Pendingin EV' },

  // Pengereman & Regeneratif
  { id: 'kampas_depan_ev', name: 'Ganti Kampas Rem Depan', category: 'Pengereman' },
  { id: 'kampas_belakang_ev', name: 'Ganti Kampas Rem Belakang', category: 'Pengereman' },
  { id: 'minyak_rem_ev', name: 'Kuras & Ganti Minyak Rem (DOT 4)', category: 'Pengereman' },
  { id: 'kalibrasi_regen', name: 'Kalibrasi Sensor Regenerative Braking', category: 'Pengereman' },
  { id: 'cakram_ev', name: 'Ganti Piringan Cakram', category: 'Pengereman' },

  // Kaki-kaki & Ban EV
  { id: 'ban_depan_ev', name: 'Ganti Ban Luar Depan (EV Compound)', category: 'Kaki-kaki & Ban' },
  { id: 'ban_belakang_ev', name: 'Ganti Ban Luar Belakang (EV Compound)', category: 'Kaki-kaki & Ban' },
  { id: 'belt_ev', name: 'Setel / Ganti Belt atau Rantai Penggerak EV', category: 'Kaki-kaki & Ban' },
  { id: 'komstir_ev', name: 'Setel Komstir / Bearing Komstir', category: 'Kaki-kaki & Ban' },
  { id: 'shock_depan_ev', name: 'Servis Shockbreaker Depan', category: 'Kaki-kaki & Ban' },
  { id: 'shock_belakang_ev', name: 'Servis / Ganti Shockbreaker Belakang', category: 'Kaki-kaki & Ban' },
  { id: 'bearing_roda_ev', name: 'Ganti Bearing / Laher Roda & Swingarm', category: 'Kaki-kaki & Ban' },

  // Rutin & Keamanan
  { id: 'sensor_standar', name: 'Pengecekan Sensor Standar & Safety Cut-Off', category: 'Rutin & Keamanan' },
  { id: 'servis_rutin_ev', name: 'Servis Rutin Berkala Motor Listrik', category: 'Rutin & Keamanan' }
]

const CATEGORIES_ICE = [
  'Semua',
  'Rutin & Pelumasan',
  'Injeksi & Mesin',
  'CVT & Transmisi',
  'Pengereman',
  'Kaki-kaki & Ban',
  'Kelistrikan & Umum'
]

const CATEGORIES_EV = [
  'Semua',
  'Baterai & Motor EV',
  'Pelumasan & Pendingin EV',
  'Pengereman',
  'Kaki-kaki & Ban',
  'Rutin & Keamanan'
]

interface VehicleData {
  id: string
  name: string
  engineType: string
}

function AddServiceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialVehicleId = searchParams.get('vehicleId') || ''
  
  // 4 Langkah: 1 = Data Servis, 2 = Pilih Komponen, 3 = Nominal Biaya, 4 = Simpan
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId)
  const [vehiclesData, setVehiclesData] = useState<VehicleData[]>([])

  // Data Servis
  const [odometer, setOdometer] = useState('')
  const [date, setDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })

  // Komponen Servis (Card / Tabel selection)
  const [customComponents, setCustomComponents] = useState<ComponentItem[]>([])
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [customInput, setCustomInput] = useState('')

  // Nominal Biaya
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [laborCost, setLaborCost] = useState('')

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isOfflineSaved, setIsOfflineSaved] = useState(false)

  // Load vehicles (with offline cache fallback)
  useEffect(() => {
    let isMounted = true

    const loadVehicles = async () => {
      try {
        const vList = await getVehicles()
        if (isMounted && vList && vList.length > 0) {
          const mapped = vList.map((v) => ({
            id: v.id,
            name: v.name,
            engineType: v.engineType || 'ICE'
          }))
          setVehiclesData(mapped)
          if (!selectedVehicleId) {
            setSelectedVehicleId(mapped[0].id)
          }
          return
        }
      } catch (err) {
        console.warn('Network error loading vehicles, checking cache:', err)
      }

      // Fallback ke cache lokal jika offline atau gagal koneksi
      const cached = getCachedVehicles()
      if (isMounted && cached && cached.length > 0) {
        const mapped = cached.map((v) => ({
          id: v.id,
          name: v.name,
          engineType: v.engineType || 'ICE'
        }))
        setVehiclesData(mapped)
        if (!selectedVehicleId) {
          setSelectedVehicleId(mapped[0].id)
        }
      }
    }

    loadVehicles()

    return () => {
      isMounted = false
    }
  }, [selectedVehicleId])

  const activeVehicle = vehiclesData.find((v) => v.id === selectedVehicleId)
  const engineType = (activeVehicle?.engineType === 'EV' ? 'EV' : 'ICE') as 'ICE' | 'EV'
  const baseComponents = engineType === 'EV' ? COMPONENTS_EV : COMPONENTS_ICE
  const categories = engineType === 'EV' ? CATEGORIES_EV : CATEGORIES_ICE

  // Reset activeCategory if it does not exist in current categories
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('Semua')
    }
  }, [engineType, categories, activeCategory])

  const toggleComponent = (compName: string) => {
    if (selectedComponents.includes(compName)) {
      setSelectedComponents(selectedComponents.filter((c) => c !== compName))
    } else {
      setSelectedComponents([...selectedComponents, compName])
    }
  }

  const handleAddCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    const exists = [...customComponents, ...baseComponents].some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (!exists) {
      const newItem: ComponentItem = {
        id: `custom_${Date.now()}`,
        name: trimmed,
        category: 'Kustom'
      }
      setCustomComponents([newItem, ...customComponents])
    }
    if (!selectedComponents.includes(trimmed)) {
      setSelectedComponents([trimmed, ...selectedComponents])
    }
    setCustomInput('')
  }

  const allComponents = [...customComponents, ...baseComponents]

  const filteredComponents = allComponents.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = activeCategory === 'Semua' || comp.category === activeCategory
    return matchesSearch && matchesCat
  })

  const componentTotal = selectedComponents.reduce(
    (sum, comp) => sum + parseThousands(prices[comp]),
    0
  )
  const parsedLaborCost = parseThousands(laborCost)
  const totalEstimasi = componentTotal + parsedLaborCost

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    if (!selectedVehicleId) {
      setErrorMessage('Harap pilih kendaraan yang diservis.')
      setStep(1)
      return
    }

    const parsedOdometer = parseThousands(odometer)
    if (!odometer.trim() || parsedOdometer <= 0) {
      setErrorMessage('Harap masukkan angka odometer yang valid.')
      setStep(1)
      return
    }

    if (selectedComponents.length === 0) {
      setErrorMessage('Pilih minimal 1 komponen servis.')
      setStep(2)
      return
    }

    setIsSubmitting(true)

    const details = selectedComponents.map((comp) => ({
      componentName: comp,
      cost: parseThousands(prices[comp])
    }))

    // Cek apakah perangkat sedang offline
    if (typeof window !== 'undefined' && !navigator.onLine) {
      try {
        enqueueOfflineAction(
          'ADD_SERVICE_RECORD',
          {
            vehicleId: selectedVehicleId,
            date: date ? new Date(date).toISOString() : new Date().toISOString(),
            mileage: parsedOdometer,
            totalCost: totalEstimasi,
            laborCost: parsedLaborCost,
            details
          },
          `Tambah Servis ${selectedVehicleName} (${formatThousands(parsedOdometer)} KM)`
        )
        updateCachedVehicleOdometer(selectedVehicleId, parsedOdometer)
        setIsOfflineSaved(true)
        setShowModal(true)
        return
      } catch (err) {
        setErrorMessage('Gagal menyimpan ke antrean offline.')
        return
      } finally {
        setIsSubmitting(false)
      }
    }

    try {
      const result = await createServiceRecord({
        vehicleId: selectedVehicleId,
        date: date ? new Date(date) : undefined,
        mileage: parsedOdometer,
        totalCost: totalEstimasi,
        laborCost: parsedLaborCost,
        details
      })

      if (result.success) {
        setIsOfflineSaved(false)
        setShowModal(true)
      } else {
        setErrorMessage('Terjadi kesalahan saat menyimpan data servis.')
      }
    } catch {
      // Jika fetch gagal (koneksi terputus saat submit), simpan ke antrean offline
      try {
        enqueueOfflineAction(
          'ADD_SERVICE_RECORD',
          {
            vehicleId: selectedVehicleId,
            date: date ? new Date(date).toISOString() : new Date().toISOString(),
            mileage: parsedOdometer,
            totalCost: totalEstimasi,
            laborCost: parsedLaborCost,
            details
          },
          `Tambah Servis ${selectedVehicleName} (${formatThousands(parsedOdometer)} KM)`
        )
        updateCachedVehicleOdometer(selectedVehicleId, parsedOdometer)
        setIsOfflineSaved(true)
        setShowModal(true)
      } catch {
        setErrorMessage('Terjadi kesalahan saat menyimpan data.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedVehicleName = activeVehicle?.name || 'Motor Saya'
  const vehicleOptions = vehiclesData.map((v) => ({
    value: v.id,
    label: `${v.name} (${v.engineType === 'EV' ? 'Listrik' : 'Bensin'})`
  }))

  return (
    <div className="px-3.5 py-3 flex flex-col gap-3 pb-24 md:max-w-md md:mx-auto">
      {/* ========================================================================= */}
      {/* STEPPER HEADER SANGAT RAMPING (COMPACT STEPPER) */}
      {/* ========================================================================= */}
      <div className="bg-secondary-background border-2 border-border p-2 sm:p-2.5 shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px] font-black uppercase tracking-wider bg-main text-foreground px-1.5 py-0.5 border border-border shadow-[1px_1px_0px_0px_var(--border)] rounded-[var(--radius-base)]">
              {step}/4
            </span>
            <span className="text-xs font-black text-foreground uppercase truncate">
              {step === 1 && '1. Data Servis'}
              {step === 2 && '2. Pilih Komponen'}
              {step === 3 && '3. Nominal Biaya'}
              {step === 4 && '4. Simpan Servis'}
            </span>
          </div>
          <span className="text-[10px] font-black text-foreground border border-border px-1.5 py-0.5 bg-background rounded-[var(--radius-base)] shrink-0">
            {step === 1 && '25%'}
            {step === 2 && '50%'}
            {step === 3 && '75%'}
            {step === 4 && '100%'}
          </span>
        </div>

        {/* Slim Progress Bar */}
        <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-main transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-2.5 bg-[#FF4D50] text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] flex items-start gap-2 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-white" />
          <div className="flex-1">
            <span className="font-black uppercase tracking-wider block">Peringatan</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 1: DATA SERVIS (TANGGAL & ODOMETER) */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-3 animate-in fade-in-50 duration-150">
          <div className="bg-secondary-background p-4 rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-border pb-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Informasi Servis
              </h2>
              {activeVehicle && (
                <span className={`px-2 py-0.5 border border-border text-[9px] font-black rounded-[var(--radius-base)] uppercase flex items-center gap-1 ${
                  engineType === 'ICE' ? 'bg-[#FF4D50] text-white' : 'bg-[#0099FF] text-white'
                }`}>
                  {engineType === 'ICE' ? <Fuel className="w-3 h-3 stroke-[2.5]" /> : <Zap className="w-3 h-3 fill-white" />}
                  <span>{engineType === 'ICE' ? 'Bensin (ICE)' : 'Listrik (EV)'}</span>
                </span>
              )}
            </div>

            {/* Kendaraan */}
            {vehicleOptions.length > 1 && (
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-foreground block">
                  Pilih Kendaraan
                </label>
                <NeoCombobox
                  options={vehicleOptions}
                  value={selectedVehicleId}
                  onChange={setSelectedVehicleId}
                  placeholder="Pilih kendaraan..."
                />
              </div>
            )}

            {/* Tanggal Servis */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-foreground block">
                Tanggal Servis
              </label>
              <NeoDatePicker 
                id="service_date"
                value={date}
                onChange={(val) => setDate(val)}
                placeholder="Pilih tanggal..."
              />
            </div>

            {/* Odometer */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-foreground block">
                Odometer Saat Servis (KM) *
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="numeric"
                  id="odometer"
                  value={odometer}
                  onChange={(e) => setOdometer(formatThousands(e.target.value))}
                  placeholder="Contoh: 12.500"
                  required
                  className="w-full px-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white" 
                />
              </div>
            </div>
          </div>

          {/* Action Step 1 */}
          <button
            type="button"
            disabled={!odometer.trim()}
            onClick={() => {
              if (odometer.trim()) {
                setErrorMessage(null)
                setStep(2)
              }
            }}
            className="w-full py-3 px-4 bg-main text-foreground border-2 border-border font-black text-xs sm:text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lanjut ke Pilih Komponen</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 2: PILIH KOMPONEN SERVIS (CARD / TABEL KHUSUS SESUAI ENGINE TYPE) */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-3 animate-in fade-in-50 duration-150">
          <div className="bg-secondary-background p-3.5 rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-border pb-2 gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Pilih Komponen Servis
                  </h2>
                  <span className={`px-2 py-0.5 border border-border text-[9px] font-black rounded-[var(--radius-base)] uppercase flex items-center gap-1 ${
                    engineType === 'ICE' ? 'bg-[#FF4D50] text-white' : 'bg-[#0099FF] text-white'
                  }`}>
                    {engineType === 'ICE' ? <Fuel className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5 fill-white" />}
                    <span>{engineType === 'ICE' ? 'Bensin' : 'Listrik EV'}</span>
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-foreground/60 mt-0.5">
                  Hanya menampilkan komponen untuk <strong>{selectedVehicleName}</strong> ({engineType === 'ICE' ? 'Motor Bensin' : 'Motor Listrik'}).
                </p>
              </div>
              <span className="text-[11px] font-black bg-main px-2 py-0.5 border border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] shrink-0">
                {selectedComponents.length} Dipilih
              </span>
            </div>

            {/* Pencarian Komponen */}
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-foreground/60 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  engineType === 'ICE'
                    ? 'Cari komponen (oli, injeksi, karbu, rem, cvt)...'
                    : 'Cari komponen (baterai, motor, rem, oli reduksi)...'
                }
                className="w-full pl-8 pr-7 py-1.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-foreground/60 hover:text-foreground cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Kategori Chips Sesuai Engine Type */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-1 rounded-[var(--radius-base)] font-black border border-border shrink-0 transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-main text-foreground shadow-[1px_1px_0px_0px_var(--border)] font-black'
                      : 'bg-background text-foreground/70 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Daftar Card / Tabel Komponen */}
            <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
              {filteredComponents.length === 0 ? (
                <div className="p-4 text-center text-xs font-bold text-foreground/60 bg-background border-2 border-border rounded-[var(--radius-base)]">
                  Tidak ada komponen &quot;{searchQuery}&quot; untuk kendaraan {engineType}.
                </div>
              ) : (
                filteredComponents.map((comp) => {
                  const isSelected = selectedComponents.includes(comp.name)
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComponent(comp.name)}
                      className={`px-3 py-2 rounded-[var(--radius-base)] border-2 border-border transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-main text-foreground shadow-[2px_2px_0px_0px_var(--border)] translate-x-[-1px] translate-y-[-1px]'
                          : 'bg-background hover:bg-slate-100 shadow-[1px_1px_0px_0px_var(--border)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-black text-white' : 'bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="truncate flex-1 min-w-0">
                          <span className="text-[11px] sm:text-xs font-black block truncate">
                            {comp.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-foreground/60 block truncate">
                            {comp.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[9px] font-black uppercase bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)] shrink-0">
                          Dipilih
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Tambah Komponen Baru Langsung */}
            <div className="pt-1 border-t-2 border-border">
              <label className="text-[10px] font-black uppercase tracking-wider text-foreground/70 block mb-1">
                Tambah Jenis Servis Kustom
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustom()
                    }
                  }}
                  placeholder="Ketik servis lain jika tidak ada..."
                  className="flex-1 px-2.5 py-1.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="px-3 py-1.5 bg-main text-foreground border-2 border-border font-black text-xs rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] hover:bg-[#FACC00] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Step 2 */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2.5 px-3.5 rounded-[var(--radius-base)] border-2 border-border bg-secondary-background hover:bg-background font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              disabled={selectedComponents.length === 0}
              onClick={() => {
                if (selectedComponents.length > 0) {
                  setErrorMessage(null)
                  setStep(3)
                }
              }}
              className="flex-1 py-2.5 px-4 bg-main text-foreground border-2 border-border font-black text-xs sm:text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Nominal ({selectedComponents.length})</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 3: MEMASUKKAN NOMINAL BIAYA TIAP KOMPONEN */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-3 animate-in fade-in-50 duration-150">
          <div className="bg-secondary-background p-3.5 rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-border pb-2">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Nominal Biaya Servis
                </h2>
                <p className="text-[10px] font-semibold text-foreground/60">
                  Masukkan biaya pengeluaran untuk {selectedComponents.length} komponen.
                </p>
              </div>
              <span className="text-[10px] font-black bg-main px-1.5 py-0.5 border border-border rounded-[var(--radius-base)]">
                Opsional
              </span>
            </div>

            {/* List Input Biaya */}
            <div className="divide-y-2 divide-border border-2 border-border rounded-[var(--radius-base)] overflow-hidden bg-background max-h-[50vh] overflow-y-auto">
              {selectedComponents.map((comp) => (
                <div key={comp} className="flex items-center justify-between p-2 sm:p-2.5 gap-2 bg-secondary-background hover:bg-background/50 transition-colors">
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate flex-1 min-w-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground shrink-0">
                      <Wrench className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-black text-foreground truncate block">
                      {comp}
                    </span>
                  </div>

                  <div className="relative w-24 sm:w-32 shrink-0 flex items-center">
                    <span className="absolute left-2 text-[11px] sm:text-xs font-black text-foreground/60">Rp</span>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={prices[comp] || ''}
                      onChange={(e) => setPrices({ ...prices, [comp]: formatThousands(e.target.value) })}
                      placeholder="0"
                      className="w-full pl-6 sm:pl-7 pr-2 py-1.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-[11px] sm:text-xs font-black text-foreground text-right shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none focus:bg-white" 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Input Biaya Jasa Servis / Mekanik */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-[var(--radius-base)] bg-[#FACC00] border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-foreground shrink-0">
                    <Receipt className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-foreground block truncate">
                      Biaya Jasa Servis / Mekanik
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-foreground/60 block truncate">
                      Ongkos pasang / servis montir bengkel
                    </span>
                  </div>
                </div>

                <div className="relative w-28 sm:w-36 shrink-0 flex items-center">
                  <span className="absolute left-2 text-[11px] sm:text-xs font-black text-foreground/60">Rp</span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={laborCost}
                    onChange={(e) => setLaborCost(formatThousands(e.target.value))}
                    placeholder="0"
                    className="w-full pl-6 sm:pl-7 pr-2 py-1.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-[11px] sm:text-xs font-black text-foreground text-right shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none focus:bg-white" 
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for Labor Cost */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                <span className="text-[9px] font-bold text-foreground/60 uppercase shrink-0">Preset:</span>
                {[20000, 35000, 50000, 75000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLaborCost(amt.toLocaleString('id-ID'))}
                    className="px-2 py-0.5 text-[9px] font-black bg-secondary-background hover:bg-main border border-border rounded-[var(--radius-base)] transition-colors shrink-0 cursor-pointer"
                  >
                    +{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
                {laborCost && (
                  <button
                    type="button"
                    onClick={() => setLaborCost('')}
                    className="px-1.5 py-0.5 text-[9px] font-bold text-red-600 hover:bg-red-50 border border-red-300 rounded-[var(--radius-base)] transition-colors shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Total Box */}
            <div className="space-y-1.5 p-2.5 bg-main/20 border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              {parsedLaborCost > 0 && (
                <div className="flex justify-between items-center text-[10px] font-bold text-foreground/70 pb-1 border-b border-border/40">
                  <span>Komponen: Rp {componentTotal.toLocaleString('id-ID')} + Jasa: Rp {parsedLaborCost.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-foreground">Total Estimasi</span>
                <span className="text-sm font-black text-foreground bg-main border-2 border-border px-2.5 py-0.5 rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]">
                  Rp {totalEstimasi.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Step 3 */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-2.5 px-3.5 rounded-[var(--radius-base)] border-2 border-border bg-secondary-background hover:bg-background font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex-1 py-2.5 px-4 bg-main text-foreground border-2 border-border font-black text-xs sm:text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Simpan</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 4: MENYIMPANKANNYA (RINGKASAN & KONFIRMASI SIMPAN) */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="space-y-3 animate-in fade-in-50 duration-150">
          <div className="bg-secondary-background p-3.5 rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-[11px] font-black shadow-[1px_1px_0px_0px_var(--border)]">
                  ✓
                </span>
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Konfirmasi Riwayat Servis
                </h2>
              </div>
              <span className="text-[10px] font-black bg-[#00D696] text-black px-1.5 py-0.5 border border-border rounded-[var(--radius-base)]">
                Siap Simpan
              </span>
            </div>

            {/* Info Singkat Kendaraan, Tanggal & KM */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="bg-background p-2 border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] space-y-0.5 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-foreground/60 block">Kendaraan</span>
                <span className="font-black text-foreground truncate block">
                  {selectedVehicleName}
                </span>
              </div>
              <div className="bg-background p-2 border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] space-y-0.5 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-foreground/60 block">Odometer</span>
                <span className="font-black text-foreground">{parseThousands(odometer).toLocaleString('id-ID')} KM</span>
              </div>
            </div>

            {/* Tabel Rincian Komponen Terpilih */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-foreground/70">
                <span>Rincian Servis ({selectedComponents.length} Komponen {parsedLaborCost > 0 ? '+ Jasa' : ''})</span>
                <span>Nominal</span>
              </div>
              <div className="border-2 border-border rounded-[var(--radius-base)] divide-y-2 divide-border bg-background max-h-48 overflow-y-auto">
                {selectedComponents.map((comp) => {
                  const cost = parseThousands(prices[comp])
                  return (
                    <div 
                      key={comp} 
                      className="flex items-center justify-between p-2 text-[11px] sm:text-xs font-black gap-2"
                    >
                      <span className="text-foreground truncate pr-2 flex-1 min-w-0">
                        {comp}
                      </span>
                      <span className="text-foreground/80 shrink-0 text-[11px] sm:text-xs">
                        {cost > 0 ? `Rp ${cost.toLocaleString('id-ID')}` : 'Rp 0'}
                      </span>
                    </div>
                  )
                })}

                {/* Baris Biaya Jasa Servis jika ada */}
                {parsedLaborCost > 0 && (
                  <div className="flex items-center justify-between p-2 text-[11px] sm:text-xs font-black gap-2 bg-[#FACC00]/20">
                    <span className="text-foreground truncate pr-2 flex-1 min-w-0 flex items-center gap-1.5">
                      <Receipt className="w-3 h-3 stroke-[2.5] text-foreground shrink-0" />
                      Biaya Jasa Servis / Mekanik
                    </span>
                    <span className="text-foreground shrink-0 text-[11px] sm:text-xs font-black">
                      Rp {parsedLaborCost.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Ringkasan */}
            <div className="flex justify-between items-center p-2.5 bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-foreground block">Total Pengeluaran</span>
                {parsedLaborCost > 0 && (
                  <span className="text-[9px] font-bold text-foreground/70 block">
                    Termasuk Jasa: Rp {parsedLaborCost.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              <span className="text-sm sm:text-base font-black text-foreground">
                Rp {totalEstimasi.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action Step 4 */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(3)}
              className="py-3 px-3.5 rounded-[var(--radius-base)] border-2 border-border bg-secondary-background hover:bg-background font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Ubah Biaya</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className="flex-1 py-3 px-4 bg-main hover:bg-[#8AE500] text-foreground border-2 border-border font-black text-xs sm:text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Riwayat Servis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Smart Suggestion Modal on success */}
      <SmartSuggestionModal 
        isOpen={showModal} 
        onClose={() => router.push('/dashboard')}
        suggestionText={
          isOfflineSaved
            ? `Data servis untuk ${selectedVehicleName} berhasil disimpan di antrean offline perangkat Anda! Data akan disinkronkan otomatis ke server ketika Anda terhubung kembali ke internet.`
            : undefined
        }
      />
    </div>
  )
}

export default function AddService() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] px-4 py-2.5 sm:py-3 flex items-center gap-3 md:max-w-md md:mx-auto">
        <Link 
          href="/dashboard" 
          className="w-7 h-7 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
        <h1 className="font-black text-base text-foreground tracking-tight">Catat Servis Baru</h1>
      </header>
      <Suspense fallback={<div className="p-4 text-center text-foreground font-bold text-xs">Memuat...</div>}>
        <AddServiceForm />
      </Suspense>
    </>
  )
}
