"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitVehicleOnboarding, OnboardingData } from "./actions"
import { NeoCombobox } from "@/components/ui/NeoCombobox"
import { NeoDatePicker } from "@/components/ui/NeoDatePicker"
import { NeoMultiSelectCombobox } from "@/components/ui/NeoMultiSelectCombobox"
import { 
  getModelSpec, 
  getBrandsAndModels, 
  VehicleType, 
  EngineType 
} from "@/lib/vehicleModels"
import { formatThousands, parseThousands } from "@/lib/formatters"
import { 
  Fuel, 
  Zap, 
  Gauge, 
  Calendar, 
  Disc, 
  CircleDot, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Check, 
  Info,
  Car,
  Bike,
  Wrench,
  Droplets,
  Plus,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

const COMMON_SERVICE_ITEMS_MOTORCYCLE_ICE = [
  // Sistem Rutin & Pelumasan
  "Ganti Oli Mesin",
  "Ganti Oli Gardan / Transmisi",
  "Ganti Filter Oli Mesin",
  
  // Sistem Bahan Bakar, Injeksi & Pembakaran
  "Servis Injeksi / Throttle Body & Injector",
  "Servis Karburator (Pembersihan & Setel)",
  "Ganti Busi (Spark Plug)",
  "Ganti Filter Udara (Air Filter)",
  "Gurah Mesin (Carbon Cleaner Ruang Bakar)",
  "Setel Celah Klep (Valve Clearance)",
  "Ganti Filter Bensin / Fuel Suction Filter",
  "Kuras Tangki Bahan Bakar",

  // Sistem Transmisi & Penggerak
  "Servis CVT Lengkap (Roller, Slider, Pembersihan)",
  "Ganti V-Belt CVT",
  "Ganti Kampas Kopling Ganda (Centrifugal Clutch)",
  "Ganti Kampas Kopling Manual & Plat Gesek",
  "Setel / Ganti Rantai Roda & Gir Set (Sprocket)",
  "Ganti Minyak Kopling Hidrolik",

  // Sistem Pengereman & Pendinginan
  "Ganti Kampas Rem Depan",
  "Ganti Kampas Rem Belakang",
  "Kuras & Ganti Minyak Rem (DOT 3 / DOT 4)",
  "Servis Master Rem & Kaliper Piston",
  "Ganti Piringan Cakram (Disc Rotor)",
  "Kuras & Ganti Air Radiator (Coolant)",

  // Kaki-kaki, Kemudi & Suspensi
  "Ganti Ban Luar Depan",
  "Ganti Ban Luar Belakang",
  "Setel Komstir / Ganti Bearing Komstir",
  "Servis Shockbreaker Depan (Ganti Seal & Oli)",
  "Servis / Ganti Shockbreaker Belakang",
  "Ganti Bearing / Laher Roda",
  "Ganti Bosh Swing Arm",
  "Press / Kalibrasi Velg & Segitiga",

  // Kelistrikan, Sensor & Servis Umum
  "Ganti Aki / Accu (Battery 12V)",
  "Scan ECU & Reset DTC (Diagnostic Tool)",
  "Perbaikan Sistem Kelistrikan & Lampu",
  "Servis Ringan Berkala Rutin",
  "Servis Besar / Overhaul Mesin (Turun Mesin)"
]

const COMMON_SERVICE_ITEMS_MOTORCYCLE_EV = [
  // Sistem Daya & Baterai
  "Pengecekan Kesehatan Baterai (SOH / BMS Check)",
  "Pengecekan & Servis Hub Motor / BLDC Drive",
  "Pengecekan Controller / Inverter Motor Listrik",
  "Pengecekan Kabel Harness & Soket High-Voltage",
  "Update Firmware Controller / BMS",
  "Pengecekan / Ganti Aki Bantu 12V (Auxiliary)",
  "Pengecekan On-Board Charger (OBC) & Port Charging",

  // Sistem Pelumasan & Pendinginan EV
  "Ganti Oli Reduksi / Gearbox Motor Listrik",
  "Kuras & Ganti Cairan Radiator Cooler Baterai",

  // Sistem Pengereman & Regeneratif
  "Ganti Kampas Rem Depan",
  "Ganti Kampas Rem Belakang",
  "Kuras & Ganti Minyak Rem (DOT 4)",
  "Kalibrasi Sensor Regenerative Braking",
  "Ganti Piringan Cakram (Disc Rotor)",

  // Kaki-kaki, Kemudi & Ban
  "Ganti Ban Luar Depan (EV Compound)",
  "Ganti Ban Luar Belakang (EV Compound)",
  "Setel / Ganti Belt / Rantai Penggerak EV",
  "Setel Komstir & Ganti Bearing Komstir",
  "Servis Shockbreaker Depan & Belakang",
  "Ganti Bearing / Laher Roda & Swingarm",

  // Servis Rutin & Keamanan
  "Pengecekan Sensor Standar Samping & Safety Cut-Off",
  "Servis Rutin Berkala Motor Listrik"
]

const COMMON_SERVICE_ITEMS_CAR_ICE = [
  // Sistem Rutin & Pelumasan
  "Ganti Oli Mesin",
  "Ganti Filter Oli Mesin",
  "Ganti Oli Transmisi (Manual / Matic ATF/CVTF)",
  "Ganti Oli Gardan / Differential",

  // Sistem Bahan Bakar & Pembakaran
  "Ganti Filter Udara (Air Filter)",
  "Ganti Busi (Spark Plug)",
  "Tune Up Mesin & Bersihkan Throttle Body",
  "Ganti Filter Bensin / Fuel Filter",
  "Kuras Tangki Bahan Bakar",

  // Sistem Pendinginan & AC
  "Kuras & Ganti Air Radiator (Coolant)",
  "Ganti Filter AC / Kabin",
  "Servis AC Mobil (Kuras Freon & Oli Kompresor)",

  // Sistem Pengereman
  "Ganti Kampas Rem Depan (Brake Pads)",
  "Ganti Kampas Rem Belakang (Brake Shoes/Pads)",
  "Kuras & Ganti Minyak Rem (DOT 3 / DOT 4)",
  "Bubut / Ganti Piringan Cakram (Disc Rotor)",

  // Kaki-kaki, Roda & Suspensi
  "Spooring & Balancing 4 Roda",
  "Rotasi Ban (4 Roda)",
  "Ganti Ban Luar Baru",
  "Ganti Shockbreaker (Depan / Belakang)",
  "Ganti Link Stabilizer & Bushing Arm",
  "Ganti Tie Rod & Rack End",
  "Ganti Bearing / Laher Roda",

  // Kelistrikan & Umum
  "Ganti Aki / Accu (12V)",
  "Ganti Karet Wiper Kaca Depan & Belakang",
  "Scan Diagnostic OBD-II / Reset DTC",
  "Servis Berkala Rutin (10.000 KM / 20.000 KM)",
  "Overhaul Mesin / Turun Mesin"
]

const COMMON_SERVICE_ITEMS_CAR_EV = [
  // Sistem Daya & Baterai EV
  "Pengecekan Kesehatan Baterai (SOH / BMS Check)",
  "Pengecekan Motor Traksi / Inverter",
  "Pengecekan Kabel High-Voltage & Port Charging",
  "Pengecekan / Ganti Aki Bantu 12V (Auxiliary)",
  "Update Firmware / Software Unit ECU & BMS",

  // Sistem Pelumasan & Pendinginan
  "Ganti Cairan Pendingin Baterai (Battery Coolant)",
  "Ganti Oli Reduksi / Gearbox EV",
  "Ganti Filter AC / Kabin",
  "Servis Sistem AC & Kompresor Elektrik",

  // Sistem Pengereman
  "Ganti Kampas Rem Depan",
  "Ganti Kampas Rem Belakang",
  "Kuras & Ganti Minyak Rem (DOT 4)",
  "Kalibrasi Sensor Rem Regeneratif",

  // Kaki-kaki & Roda
  "Spooring & Balancing 4 Roda",
  "Rotasi Ban (EV Compound)",
  "Ganti Ban Luar EV",
  "Ganti Karet Wiper Kaca Depan & Belakang",
  "Servis Suspensi & Kaki-kaki",
  "Servis Rutin Berkala Mobil Listrik"
]

export interface WelcomeFormProps {
  onSuccess?: (vehicleId: string) => void
  submitButtonLabel?: string
}

export default function WelcomeForm({ onSuccess, submitButtonLabel }: WelcomeFormProps = {}) {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Kategori Kendaraan & Tipe Penggerak
  const [vehicleType, setVehicleType] = useState<VehicleType>("MOTORCYCLE")
  const [engineType, setEngineType] = useState<EngineType>("ICE")

  // Step 2: Identitas & Spesifikasi
  const [selectedBrand, setSelectedBrand] = useState("Honda")
  const [selectedModel, setSelectedModel] = useState("")
  const [customName, setCustomName] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [transmission, setTransmission] = useState<"AUTOMATIC" | "MANUAL">("AUTOMATIC")
  const [ccOrKwh, setCcOrKwh] = useState<string>("")
  const [currentMileage, setCurrentMileage] = useState<string>("")

  // Ganti kategori kendaraan (Motor vs Mobil)
  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicleType(type)
    const modelsMap = getBrandsAndModels(type, engineType)
    const brandList = Object.keys(modelsMap)
    setSelectedBrand(brandList[0] || "")
    setSelectedModel("")
    setCustomName("")
    setCcOrKwh("")
    if (engineType === "EV") {
      setTransmission("AUTOMATIC")
    }
  }

  // Ganti tipe penggerak (ICE vs EV) dan sesuaikan merk/model
  const handleEngineTypeChange = (type: EngineType) => {
    setEngineType(type)
    const modelsMap = getBrandsAndModels(vehicleType, type)
    const brandList = Object.keys(modelsMap)
    setSelectedBrand(brandList[0] || "")
    setSelectedModel("")
    setCustomName("")
    setCcOrKwh("")
    if (type === "EV") {
      setTransmission("AUTOMATIC")
    }
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedModel("")
    setCustomName("")
    setCcOrKwh("")
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    // Otomatis isi CC/kWh dan jenis transmisi sesuai database spesifikasi
    const spec = getModelSpec(model, engineType)
    if (spec) {
      if (spec.ccOrKwh !== undefined) {
        setCcOrKwh(spec.ccOrKwh.toString())
      }
      if (spec.transmission) {
        setTransmission(spec.transmission)
      }
    }
  }

  const currentModelsMap = getBrandsAndModels(vehicleType, engineType)
  const brandOptions = Object.keys(currentModelsMap).map((b) => ({ value: b, label: b }))
  const modelOptions = (currentModelsMap[selectedBrand] || []).map((m) => ({ value: m, label: m }))

  const getVehicleName = () => {
    const cleanBrand = selectedBrand.replace(" (EV)", "")
    if (selectedBrand === "Lainnya") {
      return customName.trim()
    }
    if (customName.trim()) {
      return `${cleanBrand} ${customName.trim()}`
    }
    if (selectedModel) {
      return `${cleanBrand} ${selectedModel}`
    }
    return ""
  }

  // Step 3: Riwayat Servis (bisa memasukkan jenis servis atau dilewati)
  const [hasServiceHistory, setHasServiceHistory] = useState<boolean>(false)
  const [lastServiceDate, setLastServiceDate] = useState<string>("")
  const [lastServiceMileage, setLastServiceMileage] = useState<string>("")
  const [lastServiceCost, setLastServiceCost] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [customServiceInput, setCustomServiceInput] = useState<string>("")
  const [customServiceList, setCustomServiceList] = useState<string[]>([])

  // Step 4: Estimasi Kondisi Komponen (Semua default 50%)
  const [tireFront, setTireFront] = useState<number>(50)
  const [tireRear, setTireRear] = useState<number>(50)
  const [brakePadFront, setBrakePadFront] = useState<number>(50)
  const [brakePadRear, setBrakePadRear] = useState<number>(50)
  const [coolant, setCoolant] = useState<number>(50)
  const [oil, setOil] = useState<number>(50)

  // Status submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isStep2Valid = () => {
    return getVehicleName().length > 0 && (currentMileage.trim() === "" || parseThousands(currentMileage) >= 0)
  }

  const baseServiceItems = vehicleType === "CAR"
    ? (engineType === "ICE" ? COMMON_SERVICE_ITEMS_CAR_ICE : COMMON_SERVICE_ITEMS_CAR_EV)
    : (engineType === "ICE" ? COMMON_SERVICE_ITEMS_MOTORCYCLE_ICE : COMMON_SERVICE_ITEMS_MOTORCYCLE_EV)

  const allServiceOptions = [
    ...baseServiceItems,
    ...customServiceList.filter((item) => !baseServiceItems.includes(item))
  ].map((item) => ({ value: item, label: item }))

  const handleAddNewService = (newService: string) => {
    const trimmed = newService.trim()
    if (!trimmed) return
    if (!customServiceList.includes(trimmed)) {
      setCustomServiceList((prev) => [...prev, trimmed])
    }
    if (!selectedServices.includes(trimmed)) {
      setSelectedServices((prev) => [...prev, trimmed])
    }
  }

  const toggleServiceItem = (item: string) => {
    if (selectedServices.includes(item)) {
      setSelectedServices(selectedServices.filter(s => s !== item))
    } else {
      setSelectedServices([...selectedServices, item])
    }
  }

  const addCustomService = () => {
    const trimmed = customServiceInput.trim()
    if (trimmed) {
      handleAddNewService(trimmed)
      setCustomServiceInput("")
    }
  }

  const resetAllToDefault = () => {
    setTireFront(50)
    setTireRear(50)
    setBrakePadFront(50)
    setBrakePadRear(50)
    setCoolant(50)
    setOil(50)
  }

  const setAllToMax = () => {
    setTireFront(100)
    setTireRear(100)
    setBrakePadFront(100)
    setBrakePadRear(100)
    setCoolant(100)
    setOil(100)
  }

  // Condition badge styling
  const getConditionBadgeStyle = (val: number) => {
    if (val >= 70) return "bg-[#8AE500] text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
    if (val >= 40) return "bg-[#FACC00] text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
    return "bg-[#FF4D50] text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
  }

  const getConditionLabel = (val: number) => {
    if (val >= 70) return "Sangat Baik"
    if (val >= 40) return "Wajar (50%)"
    return "Perlu Diganti"
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    const payload: OnboardingData = {
      vehicleType,
      engineType,
      name: getVehicleName(),
      licensePlate: licensePlate.trim().toUpperCase(),
      transmission: engineType === "EV" ? "AUTOMATIC" : transmission,
      ccOrKwh: ccOrKwh ? Math.round(Number(ccOrKwh)) : null,
      currentMileage: parseThousands(currentMileage),
      
      hasServiceHistory,
      lastServiceDate: hasServiceHistory && lastServiceDate ? lastServiceDate : null,
      lastServiceMileage: hasServiceHistory && lastServiceMileage ? parseThousands(lastServiceMileage) : null,
      lastServiceCost: hasServiceHistory && lastServiceCost ? parseThousands(lastServiceCost) : null,
      serviceComponents: hasServiceHistory ? selectedServices : [],

      tireConditionFront: tireFront,
      tireConditionRear: tireRear,
      brakePadCondition: brakePadFront,
      brakePadConditionRear: brakePadRear,
      coolantCondition: coolant,
      oilCondition: engineType === "EV" ? 50 : oil,
    }

    try {
      const res = await submitVehicleOnboarding(payload)
      if (res.success && res.vehicleId) {
        if (onSuccess) {
          onSuccess(res.vehicleId)
        } else {
          router.push(`/dashboard?vehicleId=${res.vehicleId}`)
          router.refresh()
        }
      } else {
        setErrorMessage(res.error || "Gagal menyimpan kendaraan. Periksa data Anda.")
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Indicator Card */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_var(--border)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] uppercase">
              Langkah {currentStep} dari 4
            </span>
            <span className="text-xs font-black text-foreground uppercase hidden sm:inline">
              {currentStep === 1 && "Pilih Jenis Kendaraan"}
              {currentStep === 2 && "Identitas & Spesifikasi"}
              {currentStep === 3 && "Riwayat Servis"}
              {currentStep === 4 && "Estimasi Kondisi Komponen"}
            </span>
          </div>
          <span className="text-xs font-black text-foreground border-2 border-border px-2 py-0.5 bg-background rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
            {currentStep === 1 && "25%"}
            {currentStep === 2 && "50%"}
            {currentStep === 3 && "75%"}
            {currentStep === 4 && "100%"}
          </span>
        </div>

        {/* Solid Progress Bar */}
        <div className="w-full h-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] overflow-hidden">
          <div 
            className="h-full bg-main border-r-2 border-border transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center">
          {[
            { num: 1, label: "JENIS" },
            { num: 2, label: "SPESIFIKASI" },
            { num: 3, label: "RIWAYAT" },
            { num: 4, label: "KONDISI" }
          ].map((s) => {
            const isCompleted = currentStep > s.num
            const isCurrent = currentStep === s.num
            return (
              <div key={s.num} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-7 h-7 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted 
                      ? "bg-main text-foreground shadow-[2px_2px_0px_0px_var(--border)]" 
                      : isCurrent 
                        ? "bg-[#FACC00] text-foreground shadow-[2px_2px_0px_0px_var(--border)] scale-105" 
                        : "bg-background text-foreground/40 border-border/40"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span className={`text-[10px] font-black tracking-tight ${isCurrent ? "text-foreground" : "text-foreground/60"}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 bg-[#FF4D50] text-white border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] rounded-[var(--radius-base)] flex items-start gap-2.5 text-sm font-bold">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black uppercase tracking-wider text-xs">Peringatan</p>
            <p className="text-xs font-semibold mt-0.5">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage(null)} className="cursor-pointer text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 1: PILIH JENIS KENDARAAN (MOTOR / MOBIL DULU, LALU BENSIN / EV) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center text-xs font-black">
              1
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
              Pilih Jenis Kendaraan
            </h2>
          </div>

          {/* Bagian 1: Kategori Kendaraan (Motor vs Mobil) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center justify-between">
              <span>1. Kategori Kendaraan</span>
              <span className="text-[10px] font-bold text-foreground/70">Wajib dipilih</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opsi: Sepeda Motor */}
              <div 
                onClick={() => handleVehicleTypeChange("MOTORCYCLE")}
                className={`cursor-pointer rounded-[var(--radius-base)] p-3.5 sm:p-4 border-2 border-border transition-all relative flex flex-col items-center text-center justify-center gap-2 select-none ${
                  vehicleType === "MOTORCYCLE" 
                    ? "bg-main text-foreground shadow-[4px_4px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5 font-bold" 
                    : "bg-background text-foreground shadow-[3px_3px_0px_0px_var(--border)] hover:bg-main/20"
                }`}
              >
                {vehicleType === "MOTORCYCLE" && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-[var(--radius-base)] bg-black text-white flex items-center justify-center border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                <div className={`w-11 h-11 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--border)] ${
                  vehicleType === "MOTORCYCLE" ? "bg-black text-white" : "bg-secondary-background text-foreground"
                }`}>
                  <Bike className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-black text-sm uppercase leading-tight">Sepeda Motor</h3>
                  <span className={`text-[11px] font-bold block mt-0.5 ${vehicleType === "MOTORCYCLE" ? "text-foreground/90" : "text-foreground/70"}`}>
                    Roda Dua
                  </span>
                </div>
              </div>

              {/* Opsi: Mobil */}
              <div 
                onClick={() => handleVehicleTypeChange("CAR")}
                className={`cursor-pointer rounded-[var(--radius-base)] p-3.5 sm:p-4 border-2 border-border transition-all relative flex flex-col items-center text-center justify-center gap-2 select-none ${
                  vehicleType === "CAR" 
                    ? "bg-main text-foreground shadow-[4px_4px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5 font-bold" 
                    : "bg-background text-foreground shadow-[3px_3px_0px_0px_var(--border)] hover:bg-main/20"
                }`}
              >
                {vehicleType === "CAR" && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-[var(--radius-base)] bg-black text-white flex items-center justify-center border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                <div className={`w-11 h-11 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--border)] ${
                  vehicleType === "CAR" ? "bg-black text-white" : "bg-secondary-background text-foreground"
                }`}>
                  <Car className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-black text-sm uppercase leading-tight">Mobil</h3>
                  <span className={`text-[11px] font-bold block mt-0.5 ${vehicleType === "CAR" ? "text-foreground/90" : "text-foreground/70"}`}>
                    Roda Empat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 2: Tipe Penggerak (Bensin vs Listrik) */}
          <div className="space-y-2 pt-2 border-t-2 border-border/20">
            <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center justify-between">
              <span>2. Tipe Penggerak ({vehicleType === "CAR" ? "Mobil" : "Motor"})</span>
              <span className="text-[10px] font-bold text-foreground/70">Pilih bahan bakar / energi</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opsi 1: Mesin Bensin */}
              <div 
                onClick={() => handleEngineTypeChange("ICE")}
                className={`cursor-pointer rounded-[var(--radius-base)] p-3.5 sm:p-4 border-2 border-border transition-all relative flex flex-col items-center text-center justify-center gap-2 select-none ${
                  engineType === "ICE" 
                    ? "bg-[#FF4D50] text-white shadow-[4px_4px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5 font-bold" 
                    : "bg-background text-foreground shadow-[3px_3px_0px_0px_var(--border)] hover:bg-[#FF4D50]/10"
                }`}
              >
                {engineType === "ICE" && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-[var(--radius-base)] bg-black text-white flex items-center justify-center border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                <div className={`w-11 h-11 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--border)] ${
                  engineType === "ICE" ? "bg-black text-white" : "bg-main text-foreground"
                }`}>
                  <Fuel className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-black text-sm uppercase leading-tight">Mesin Bensin</h3>
                  <span className={`text-[11px] font-bold block mt-0.5 ${engineType === "ICE" ? "text-white/90" : "text-foreground/70"}`}>
                    Bensin (ICE)
                  </span>
                </div>
              </div>

              {/* Opsi 2: Listrik EV */}
              <div 
                onClick={() => handleEngineTypeChange("EV")}
                className={`cursor-pointer rounded-[var(--radius-base)] p-3.5 sm:p-4 border-2 border-border transition-all relative flex flex-col items-center text-center justify-center gap-2 select-none ${
                  engineType === "EV" 
                    ? "bg-[#0099FF] text-white shadow-[4px_4px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5 font-bold" 
                    : "bg-background text-foreground shadow-[3px_3px_0px_0px_var(--border)] hover:bg-[#0099FF]/10"
                }`}
              >
                {engineType === "EV" && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-[var(--radius-base)] bg-black text-white flex items-center justify-center border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                <div className={`w-11 h-11 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--border)] ${
                  engineType === "EV" ? "bg-black text-white" : "bg-main text-foreground"
                }`}>
                  <Zap className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-black text-sm uppercase leading-tight">
                    {vehicleType === "CAR" ? "Mobil Listrik" : "Motor Listrik"}
                  </h3>
                  <span className={`text-[11px] font-bold block mt-0.5 ${engineType === "EV" ? "text-white/90" : "text-foreground/70"}`}>
                    Listrik (EV)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="w-full py-3 px-5 bg-main text-foreground border-2 border-border font-black text-sm sm:text-base uppercase tracking-wider rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Lanjutkan</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 2: IDENTITAS & SPESIFIKASI KENDARAAN */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center text-xs font-black">
                2
              </span>
              <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                Spesifikasi {vehicleType === "CAR" ? "Mobil" : "Motor"}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 border-2 border-border text-[10px] sm:text-xs font-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] uppercase bg-background text-foreground">
                {vehicleType === "CAR" ? "Mobil" : "Motor"}
              </span>
              <span className={`px-2.5 py-0.5 border-2 border-border text-[10px] sm:text-xs font-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] uppercase ${
                engineType === "ICE" ? "bg-[#FF4D50] text-white" : "bg-[#0099FF] text-white"
              }`}>
                {engineType === "ICE" ? "Bensin" : "Listrik"}
              </span>
            </div>
          </div>

          {/* Merk Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
                Pilih Merk ({vehicleType === "CAR" ? "Mobil" : "Motor"} {engineType === "ICE" ? "Bensin" : "Listrik"})
              </label>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-[var(--radius-base)] border border-border bg-main text-black">
                {engineType}
              </span>
            </div>
            <NeoCombobox
              value={selectedBrand}
              onChange={(val) => handleBrandChange(val)}
              options={brandOptions}
              placeholder="Pilih Merk"
              searchable
              searchPlaceholder="Cari merk..."
            />
          </div>

          {/* Model Selector or Custom Name */}
          {selectedBrand !== "Lainnya" ? (
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
                Pilih Model {selectedBrand}
              </label>
              <NeoCombobox
                value={selectedModel}
                onChange={(val) => handleModelChange(val)}
                options={modelOptions}
                placeholder={`-- Pilih Model ${selectedBrand} --`}
                searchable
                searchPlaceholder={`Cari model ${vehicleType === "CAR" ? "mobil" : "motor"}...`}
              />
              <div className="pt-1">
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Atau ketik model jika tidak ada di list..."
                  className="w-full px-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/50 shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
                Nama Kendaraan Kustom *
              </label>
              <input 
                type="text" 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={
                  vehicleType === "CAR"
                    ? (engineType === "ICE" ? "Contoh: Toyota Corolla 1996 Custom" : "Contoh: Mobil Listrik Konversi")
                    : (engineType === "ICE" ? "Contoh: Honda CB 150R Custom" : "Contoh: Motor Listrik Kustom / Konversi")
                }
                className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none"
              />
            </div>
          )}

          {/* Plat Nomor */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
              Nomor Polisi (Opsional)
            </label>
            <input 
              type="text" 
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              placeholder="Contoh: B 1234 ABC" 
              className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground uppercase placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none" 
            />
          </div>

          {/* Specs Grid: Transmisi & Kapasitas */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
                Transmisi
              </label>
              <NeoCombobox
                value={transmission}
                onChange={(val) => setTransmission(val as "AUTOMATIC" | "MANUAL")}
                options={
                  engineType === "EV"
                    ? [{ value: "AUTOMATIC", label: "Matic / Direct Drive" }]
                    : [
                        { value: "AUTOMATIC", label: "Matic / Otomatis" },
                        { value: "MANUAL", label: "Manual / Kopling" }
                      ]
                }
                placeholder="Pilih Transmisi"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
                  {engineType === "ICE" ? "Kapasitas Mesin (CC)" : "Kapasitas Baterai (kWh)"}
                </label>
                {ccOrKwh && (
                  <span className="text-[9px] font-bold text-foreground/60 italic">
                    Bisa diubah
                  </span>
                )}
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={ccOrKwh}
                  onChange={(e) => setCcOrKwh(e.target.value)}
                  placeholder={
                    vehicleType === "CAR"
                      ? (engineType === "ICE" ? "1500" : "50")
                      : (engineType === "ICE" ? "150" : "4")
                  } 
                  className="w-full pl-3.5 pr-14 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none" 
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-black text-foreground pointer-events-none">
                  {engineType === "ICE" ? "CC" : "kWh"}
                </span>
              </div>
            </div>
          </div>

          {/* Odometer Saat Ini */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-foreground block">
                Odometer Saat Ini (KM)
              </label>
              <span className="text-[10px] font-bold text-foreground/60 bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)]">
                Opsional
              </span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                inputMode="numeric"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(formatThousands(e.target.value))}
                placeholder="Mis. 12.500 (Boleh dikosongkan)" 
                className="w-full pl-3.5 pr-14 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none" 
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-black text-foreground pointer-events-none">
                KM
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="py-2.5 px-4 rounded-[var(--radius-base)] border-2 border-border bg-background hover:bg-secondary-background font-black text-xs uppercase shadow-[3px_3px_0px_0px_var(--border)] transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              disabled={!isStep2Valid()}
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3 px-5 bg-main text-foreground border-2 border-border font-black text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 3: RIWAYAT SERVIS */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center text-xs font-black">
              3
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
              Riwayat Servis
            </h2>
          </div>

          {/* Opsi Mode: Masukkan Data atau Lewati */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setHasServiceHistory(true)}
              className={`cursor-pointer rounded-[var(--radius-base)] p-3.5 border-2 border-border transition-all flex items-start gap-2.5 select-none ${
                hasServiceHistory 
                  ? "bg-[#0099FF]/20 shadow-[4px_4px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5 font-bold" 
                  : "bg-background shadow-[3px_3px_0px_0px_var(--border)] hover:bg-[#0099FF]/10"
              }`}
            >
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--border)] font-bold">
                <Wrench className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <span className="font-black text-xs uppercase block text-foreground">Catat Riwayat Servis</span>
                <span className="text-[11px] font-semibold text-foreground/70 block mt-0.5">
                  Isi tanggal & komponen yang diservis.
                </span>
              </div>
            </div>

            <div
              onClick={() => setHasServiceHistory(false)}
              className={`cursor-pointer rounded-[var(--radius-base)] p-3.5 border-2 border-border transition-all flex items-start gap-2.5 select-none ${
                !hasServiceHistory 
                  ? "bg-[#FACC00] shadow-[4px_4px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5 font-bold" 
                  : "bg-background shadow-[3px_3px_0px_0px_var(--border)] hover:bg-[#FACC00]/30"
              }`}
            >
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--border)] font-bold">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <span className="font-black text-xs uppercase block text-foreground">Lewati Langkah Ini</span>
                <span className="text-[11px] font-semibold text-foreground/70 block mt-0.5">
                  {vehicleType === "CAR" ? "Mobil" : "Motor"} baru / belum pernah servis.
                </span>
              </div>
            </div>
          </div>

          {/* Form Input Riwayat Servis */}
          {hasServiceHistory ? (
            <div className="bg-background border-2 border-border rounded-[var(--radius-base)] p-4 space-y-3.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-foreground mb-1">
                    Tanggal Servis Terakhir
                  </label>
                  <NeoDatePicker 
                    value={lastServiceDate}
                    onChange={(val) => setLastServiceDate(val)}
                    placeholder="Pilih tanggal servis..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-foreground mb-1">
                    Odometer Saat Servis (KM)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={lastServiceMileage}
                      onChange={(e) => setLastServiceMileage(formatThousands(e.target.value))}
                      placeholder={`Mis. ${Number(currentMileage) > 500 ? (Number(currentMileage) - 500).toLocaleString('id-ID') : Number(currentMileage || 0).toLocaleString('id-ID')}`} 
                      className="w-full pl-3 pr-10 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-foreground font-bold text-xs shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none" 
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-black text-foreground pointer-events-none">
                      KM
                    </span>
                  </div>
                </div>
              </div>

              {/* Jenis Servis (Combobox Multiselect + Tambah Jenis Servis) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-foreground">
                    Jenis Servis Yang Dilakukan:
                  </label>
                  <span className="text-[11px] font-black bg-main px-2 py-0.5 border border-border rounded-[var(--radius-base)]">
                    {selectedServices.length} dipilih
                  </span>
                </div>

                {/* Multiselect Dropdown */}
                <NeoMultiSelectCombobox
                  selectedValues={selectedServices}
                  onChange={(vals) => setSelectedServices(vals)}
                  options={allServiceOptions}
                  placeholder="-- Pilih Item Servis --"
                  searchPlaceholder="Ketik untuk mencari komponen..."
                  onAddNewOption={handleAddNewService}
                />

                {/* Input Kustom Servis Cepat */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customServiceInput}
                    onChange={(e) => setCustomServiceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomService()
                      }
                    }}
                    placeholder="Tambah jenis servis kustom manual..."
                    className="flex-1 px-3 py-1.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomService}
                    className="px-3 py-1.5 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Tag Cloud Item Servis Terpilih */}
                {selectedServices.length > 0 && (
                  <div className="space-y-1 pt-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 block">
                      Daftar Komponen Terpilih:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-secondary-background/60 border border-border rounded-[var(--radius-base)]">
                      {selectedServices.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-background border-2 border-border text-[11px] font-black rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] text-foreground"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => toggleServiceItem(item)}
                            className="hover:text-[#FF4D50] ml-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3 stroke-[3]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Estimasi Biaya Servis */}
              <div className="pt-1">
                <label className="block text-xs font-black uppercase tracking-wider text-foreground mb-1">
                  Estimasi Total Biaya Servis Terakhir (Rp)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-black text-foreground pointer-events-none">
                    Rp
                  </span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={lastServiceCost}
                    onChange={(e) => setLastServiceCost(formatThousands(e.target.value))}
                    placeholder="150.000 (Opsional)" 
                    className="w-full pl-9 pr-3 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-foreground font-bold text-xs shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none" 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-background border-2 border-dashed border-border rounded-[var(--radius-base)] text-center space-y-1 text-foreground/70">
              <p className="text-xs font-black text-foreground uppercase">Riwayat Servis Dilewati</p>
              <p className="text-[11px] font-semibold">
                Sistem akan mengasumsikan kondisi komponen berada pada tingkat wajar (50%) di langkah berikutnya.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="py-2.5 px-4 rounded-[var(--radius-base)] border-2 border-border bg-background hover:bg-secondary-background font-black text-xs uppercase shadow-[3px_3px_0px_0px_var(--border)] transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex-1 py-3 px-5 bg-main text-foreground border-2 border-border font-black text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan ke Kondisi Komponen</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 4: ESTIMASI KONDISI KOMPONEN (DEFAULT 50%) */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-foreground flex items-center justify-center text-xs font-black">
                4
              </span>
              <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                Kondisi Komponen
              </h2>
            </div>
            <span className="px-2 py-0.5 border-2 border-border text-[10px] font-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] bg-[#FACC00] text-foreground uppercase">
              DEFAULT 50%
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-black uppercase text-foreground">Preset:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAllToDefault}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-base)] bg-[#FACC00] text-foreground border-2 border-border text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
                <span>Reset 50%</span>
              </button>
              <button
                type="button"
                onClick={setAllToMax}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-base)] bg-main text-foreground border-2 border-border text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[3]" />
                <span>100% Baru</span>
              </button>
            </div>
          </div>

          {/* 6 Slider Cards */}
          <div className="space-y-3">
            {/* 1. Ban Depan */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                  Ban Depan
                </span>
                <span className={`text-[11px] px-2 py-0.5 font-black uppercase ${getConditionBadgeStyle(tireFront)}`}>
                  {tireFront}% • {getConditionLabel(tireFront)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={tireFront} 
                onChange={(e) => setTireFront(Number(e.target.value))} 
                className="w-full h-3 accent-black cursor-pointer bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" 
              />
            </div>

            {/* 2. Ban Belakang */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                  Ban Belakang
                </span>
                <span className={`text-[11px] px-2 py-0.5 font-black uppercase ${getConditionBadgeStyle(tireRear)}`}>
                  {tireRear}% • {getConditionLabel(tireRear)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={tireRear} 
                onChange={(e) => setTireRear(Number(e.target.value))} 
                className="w-full h-3 accent-black cursor-pointer bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" 
              />
            </div>

            {/* 3. Kampas Rem Depan */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                  Kampas Rem Depan
                </span>
                <span className={`text-[11px] px-2 py-0.5 font-black uppercase ${getConditionBadgeStyle(brakePadFront)}`}>
                  {brakePadFront}% • {getConditionLabel(brakePadFront)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={brakePadFront} 
                onChange={(e) => setBrakePadFront(Number(e.target.value))} 
                className="w-full h-3 accent-black cursor-pointer bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" 
              />
            </div>

            {/* 4. Kampas Rem Belakang */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                  Kampas Rem Belakang
                </span>
                <span className={`text-[11px] px-2 py-0.5 font-black uppercase ${getConditionBadgeStyle(brakePadRear)}`}>
                  {brakePadRear}% • {getConditionLabel(brakePadRear)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={brakePadRear} 
                onChange={(e) => setBrakePadRear(Number(e.target.value))} 
                className="w-full h-3 accent-black cursor-pointer bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" 
              />
            </div>

            {/* 5. Cairan Radiator (Coolant) */}
            <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                  Cairan Radiator (Coolant)
                </span>
                <span className={`text-[11px] px-2 py-0.5 font-black uppercase ${getConditionBadgeStyle(coolant)}`}>
                  {coolant}% • {getConditionLabel(coolant)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={coolant} 
                onChange={(e) => setCoolant(Number(e.target.value))} 
                className="w-full h-3 accent-black cursor-pointer bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" 
              />
            </div>

            {/* 6. Oli Mesin (ICE) atau EV Info */}
            {engineType === "ICE" ? (
              <div className="p-3 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[3px_3px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                    Kualitas Oli Mesin
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 font-black uppercase ${getConditionBadgeStyle(oil)}`}>
                    {oil}% • {getConditionLabel(oil)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={oil} 
                  onChange={(e) => setOil(Number(e.target.value))} 
                  className="w-full h-3 accent-black cursor-pointer bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" 
                />
              </div>
            ) : (
              <div className="p-3 bg-[#0099FF]/20 border-2 border-border rounded-[var(--radius-base)] flex items-center justify-between shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Zap className="w-4 h-4 text-foreground stroke-[3]" />
                  <span>Kendaraan listrik bebas dari oli mesin pembakaran.</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-black text-white rounded-[var(--radius-base)]">
                  BEBAS OLI
                </span>
              </div>
            )}
          </div>

          {/* Navigation & Submit */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(3)}
              className="py-2.5 px-4 rounded-[var(--radius-base)] border-2 border-border bg-background hover:bg-secondary-background font-black text-xs uppercase shadow-[3px_3px_0px_0px_var(--border)] transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="flex-1 py-3.5 px-5 bg-main text-foreground border-2 border-border font-black text-sm uppercase tracking-wider rounded-[var(--radius-base)] shadow-[5px_5px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[3]" />
                  <span>{submitButtonLabel || "Simpan & Buka Dashboard"}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
