import { ServiceRecord, ServiceDetail, Vehicle, ComponentInspection } from '@/generated/prisma/client'

export type RecordWithDetails = ServiceRecord & { details: ServiceDetail[] }

export type VehicleWithRecords = Vehicle & {
  serviceRecords: RecordWithDetails[]
}

/**
 * REKOMENDASI STANDAR PABRIKAN RESMI
 * Data diverifikasi dari:
 * - Buku Pedoman Pemilik & Standar Servis Berkala AHASS (Astra Honda Motor)
 * - Standar Servis Berkala Bengkel Resmi Yamaha Motor Indonesia
 * - Panduan Perawatan Motor Listrik Resmi (Alva, Gesits, Polytron)
 * - Panduan Pabrikan Ban Resmi (Michelin, FDR, IRC, Maxxis)
 */
export const MANUFACTURER_STANDARDS = {
  ICE: {
    oil: {
      name: 'Oli Mesin',
      defaultKm: 3000,
      minKm: 2000,
      maxKm: 4000,
      isCustomizable: true,
      description: 'Rekomendasi pabrikan (AHASS & Yamaha): Ganti setiap 2.000 – 4.000 KM atau maksimal 2 bulan.',
      source: 'Buku Pedoman Pemilik Astra Honda & Yamaha'
    },
    transmissionOil: {
      name: 'Oli Gardan / Transmisi',
      defaultKm: 8000,
      minKm: 6000,
      maxKm: 12000,
      isCustomizable: true,
      description: 'Rekomendasi pabrikan motor matic: Ganti setiap 8.000 KM (rasio 2x – 3x ganti oli mesin).',
      source: 'Standar Servis CVT & Transmisi Resmi'
    },
    cvtService: {
      name: 'Servis CVT & Roller',
      defaultKm: 8000,
      minKm: 6000,
      maxKm: 10000,
      isCustomizable: false,
      description: 'Pembersihan ruang CVT, pengecekan roller & slider piece, serta pelumasan grease high-temp pulley tiap 8.000 KM.',
      source: 'Standar Servis CVT AHASS & Yamaha Motor Indonesia (8.000–10.000 KM)'
    },
    vBelt: {
      name: 'V-Belt CVT',
      defaultKm: 24000,
      minKm: 20000,
      maxKm: 25000,
      isCustomizable: false,
      description: 'Rekomendasi pabrikan: Cek visual retak tiap 8.000 KM, wajib ganti V-Belt maksimal tiap 24.000 KM.',
      source: 'Pedoman Servis CVT Motor Matic Honda & Yamaha (24.000 KM)'
    },
    injectionService: {
      name: 'Servis Injeksi (Throttle Body & Injector)',
      defaultKm: 10000,
      minKm: 8000,
      maxKm: 15000,
      isCustomizable: false,
      description: 'Pembersihan kerak ruang bakar, throttle body, injector cleaner & reset ECU tiap 10.000 KM.',
      source: 'Standar Servis Injeksi Bengkel Resmi Yamaha & AHASS (10.000 KM)'
    },
    carburetorService: {
      name: 'Servis Karburator (Pembersihan & Setel)',
      defaultKm: 5000,
      minKm: 4000,
      maxKm: 6000,
      isCustomizable: false,
      description: 'Pembersihan mangkok karburator, spuyer pilot/main jet & kalibrasi setelan angin tiap 5.000 KM.',
      source: 'Pedoman Perawatan Karburator Resmi Honda & Suzuki (5.000 KM)'
    },
    sparkPlug: {
      name: 'Busi (Spark Plug)',
      defaultKm: 8000,
      minKm: 6000,
      maxKm: 10000,
      isCustomizable: false,
      description: 'Cek tiap 4.000 KM, ganti tiap 8.000 KM untuk pembakaran optimal dan cegah misfire.',
      source: 'Standar Pabrikan Busi Resmi NGK / Denso & AHASS (8.000 KM)'
    },
    airFilter: {
      name: 'Filter Udara (Air Filter)',
      defaultKm: 16000,
      minKm: 12000,
      maxKm: 16000,
      isCustomizable: false,
      description: 'Rekomendasi pabrikan: Ganti setiap 16.000 KM (tipe viscous element kertas basah tidak boleh disemprot angin).',
      source: 'Pedoman Perawatan Saringan Udara Honda & Yamaha (16.000 KM)'
    },
    coolant: {
      name: 'Cairan Radiator (Coolant)',
      defaultKm: 12000,
      minKm: 10000,
      maxKm: 24000,
      isCustomizable: true,
      description: 'Rekomendasi pabrikan: Cek/kuras berkala tiap 10.000 – 12.000 KM (maksimal penggantian total 24.000 KM / 2 tahun).',
      source: 'Standar Sistem Pendingin Mesin Honda & Yamaha'
    },
    driveChain: {
      name: 'Rantai & Gir Set',
      defaultKm: 15000,
      minKm: 12000,
      maxKm: 20000,
      isCustomizable: false,
      description: 'Pelumasan tiap 1.000–1.500 KM, penggantian gir set dan rantai maksimal tiap 15.000–20.000 KM.',
      source: 'Pedoman Rantai Roda Resmi Honda & Yamaha (15.000 KM)'
    },
    brakeFluid: {
      name: 'Kuras Minyak Rem',
      defaultKm: 20000,
      minKm: 15000,
      maxKm: 24000,
      isCustomizable: false,
      description: 'Kuras dan ganti minyak rem DOT 3/4 tiap 20.000 KM atau 2 tahun untuk cegah rem blong / vapor lock.',
      source: 'Standar Keselamatan Pengereman Astra Honda & Yamaha (20.000–24.000 KM)'
    },
    forkOil: {
      name: 'Servis Oli Shock Depan',
      defaultKm: 15000,
      minKm: 12000,
      maxKm: 20000,
      isCustomizable: false,
      description: 'Ganti oli suspensi depan tiap 15.000–20.000 KM agar bantingan tetap empuk dan seal tidak bocor.',
      source: 'Pedoman Suspensi Depan Bengkel Resmi (15.000–20.000 KM)'
    },
    brakePadFront: {
      name: 'Kampas Rem Depan',
      defaultKm: 15000,
      isCustomizable: false,
      description: 'Rata-rata keausan 12.000 – 15.000 KM (rem depan menahan ~70% beban pengereman).',
      source: 'Standar Pengereman & Keselamatan Pabrikan'
    },
    brakePadRear: {
      name: 'Kampas Rem Belakang',
      defaultKm: 18000,
      isCustomizable: false,
      description: 'Rata-rata keausan 15.000 – 20.000 KM tergantung rute dan intensitas pengereman.',
      source: 'Standar Pengereman Pabrikan'
    },
    tireFront: {
      name: 'Ban Depan',
      defaultKm: 15000,
      isCustomizable: false,
      description: 'Rekomendasi pabrikan ban: 12.000 – 15.000 KM atau segera ganti bila kembangan sejajar batas TWI.',
      source: 'Pedoman Pabrikan Ban (FDR, Michelin, IRC)'
    },
    tireRear: {
      name: 'Ban Belakang',
      defaultKm: 12000,
      isCustomizable: false,
      description: 'Rekomendasi pabrikan ban: 10.000 – 12.000 KM (lebih cepat aus karena menahan bobot mesin dan daya akselerasi).',
      source: 'Pedoman Pabrikan Ban Motor'
    }
  },
  EV: {
    oil: null,
    transmissionOil: {
      name: 'Oli Reduksi / Gearbox EV',
      defaultKm: 10000,
      minKm: 8000,
      maxKm: 15000,
      isCustomizable: true,
      description: 'Rekomendasi pabrikan motor listrik: Ganti pelumas gearbox reduksi setiap 10.000 KM.',
      source: 'Buku Petunjuk Motor Listrik (Alva & Gesits)'
    },
    coolant: {
      name: 'Cairan Pendingin Baterai (Coolant EV)',
      defaultKm: 15000,
      minKm: 12000,
      maxKm: 20000,
      isCustomizable: true,
      description: 'Pemeriksaan berkala sirkulasi cairan pendingin baterai / controller tiap 15.000 KM.',
      source: 'Buku Servis Sistem Pendingin EV'
    },
    routineService: {
      name: 'Servis Berkala & Diagnostik EV',
      defaultKm: 5000,
      isCustomizable: false,
      description: 'Pemeriksaan torsi baut, kabel high-voltage, pengereman regeneratif & SOH baterai tiap 5.000 KM.',
      source: 'Buku Garansi & Servis Resmi Alva / Gesits'
    },
    brakePadFront: {
      name: 'Kampas Rem Depan',
      defaultKm: 15000,
      isCustomizable: false,
      description: 'Masa pakai 12.000 – 15.000 KM. Rem motor EV bekerja ekstra menahan bobot baterai.',
      source: 'Standar Perawatan Motor Listrik'
    },
    brakePadRear: {
      name: 'Kampas Rem Belakang',
      defaultKm: 18000,
      isCustomizable: false,
      description: 'Masa pakai 15.000 – 18.000 KM.',
      source: 'Standar Perawatan Motor Listrik'
    },
    tireFront: {
      name: 'Ban Depan (EV)',
      defaultKm: 15000,
      isCustomizable: false,
      description: '12.000 – 15.000 KM.',
      source: 'Standar Ban Motor Listrik'
    },
    tireRear: {
      name: 'Ban Belakang (EV)',
      defaultKm: 12000,
      isCustomizable: false,
      description: '10.000 – 12.000 KM (torsi instan motor listrik membuat ban belakang lebih cepat tergerus).',
      source: 'Standar Ban Motor Listrik'
    }
  }
}

export interface ComponentStatus {
  id: string
  name: string
  category: string
  currentCondition: number // 0 - 100%
  intervalKm: number // Active interval (custom user atau default pabrikan)
  manufacturerRecommendedKm: number // Default resmi pabrikan
  isCustomInterval: boolean // True jika user mengubah dari default
  remainingKm: number // Estimasi sisa pemakaian dalam KM
  traveledKm: number // KM yang sudah ditempuh sejak servis / baseline
  lastServiceDate?: Date | null
  lastServiceMileage?: number | null
  lastInspectionDate?: Date | null
  lastInspectionMileage?: number | null
  lastInspectionRole?: string | null
  lastInspectionNotes?: string | null
  isConfirmedFit?: boolean
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL'
  statusText: string
  advice: string
}

/**
 * Mendeteksi apakah sistem bahan bakar kendaraan menggunakan Karburator atau Injeksi (FI)
 * Berdasarkan nama/model kendaraan atau kata kunci riwayat servis
 */
export function detectFuelSystem(
  vehicle: Vehicle,
  serviceRecords: RecordWithDetails[] = []
): 'CARBURETOR' | 'INJECTION' {
  const name = (vehicle.name || '').toLowerCase()
  const carbKeywords = [
    'karbu', 'karburator', 'carb', 'w175', 'klx 150', 'd-tracker 150', 
    'rx-king', 'rx king', 'gl pro', 'tiger 2000', 'megapro lama', 'supra fit', 
    'mio sporty', 'mio smile', 'mio soul karbu', 'smash', 'shogun 125',
    'spin 125', 'skywave', 'skydrive', 'nouvo', 'astrea', 'grand', 'prima', 'c70'
  ]
  if (carbKeywords.some(kw => name.includes(kw))) {
    return 'CARBURETOR'
  }
  const hasCarbRecord = serviceRecords.some(r => 
    r.details.some(d => d.componentName.toLowerCase().includes('karbu') || d.componentName.toLowerCase().includes('karburator'))
  )
  if (hasCarbRecord) {
    return 'CARBURETOR'
  }
  return 'INJECTION'
}

/**
 * Menghitung progres siklus kilometer untuk komponen yang belum memiliki catatan servis
 */
function calculateCycleProgress(currentMileage: number, intervalKm: number) {
  if (intervalKm <= 0) return { traveledKm: 0, remainingKm: 0, condition: 100 }
  const traveledKm = currentMileage % intervalKm
  const remainingKm = intervalKm - traveledKm
  const condition = Math.max(0, Math.min(100, Math.round((remainingKm / intervalKm) * 100)))
  return { traveledKm, remainingKm, condition }
}

/**
 * Menghitung pengurangan kondisi komponen berdasarkan penambahan jarak tempuh (KM)
 */
export function calculateWearFromKmDelta(
  currentCondition: number,
  kmDelta: number,
  intervalKm: number
): number {
  if (kmDelta <= 0 || intervalKm <= 0) return currentCondition
  const wearPercent = (kmDelta / intervalKm) * 100
  return Math.max(0, Math.min(100, Math.round(currentCondition - wearPercent)))
}

/**
 * Mencari riwayat servis terakhir untuk komponen spesifik
 */
function findLatestServiceForComponent(
  records: RecordWithDetails[],
  keywords: string[]
): { date: Date; mileage: number } | null {
  for (const record of records) {
    const hasMatch = record.details.some((d) =>
      keywords.some((kw) => d.componentName.toLowerCase().includes(kw.toLowerCase()))
    )
    if (hasMatch) {
      return { date: record.date, mileage: record.mileage }
    }
  }
  return null
}

/**
 * Menghitung status lengkap seluruh komponen kendaraan secara dinamis
 * berdasarkan kilometer yang bertambah dan riwayat servis
 */
export function calculateAllComponentsStatus(
  vehicle: Vehicle,
  serviceRecords: RecordWithDetails[] = [],
  inspections: ComponentInspection[] = []
): ComponentStatus[] {
  const isEV = vehicle.engineType === 'EV'
  const isAutomatic = vehicle.transmission === 'AUTOMATIC'
  const standards = isEV ? MANUFACTURER_STANDARDS.EV : MANUFACTURER_STANDARDS.ICE
  const currentMileage = vehicle.currentMileage || 0
  const fuelSystem = !isEV ? detectFuelSystem(vehicle, serviceRecords) : 'INJECTION'

  const sortedRecords = [...serviceRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const sortedInspections = [...inspections].sort(
    (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
  )

  const components: ComponentStatus[] = []

  // Helper untuk memproses status satu komponen
  const processComponent = (
    id: string,
    spec: { name: string; defaultKm: number; description?: string; isCustomizable?: boolean },
    activeIntervalKm: number,
    isCustom: boolean,
    category: string,
    keywords: string[],
    dbCondition?: number | null,
    dbDate?: Date | null
  ) => {
    const lastService = findLatestServiceForComponent(sortedRecords, keywords)
    const lastInspection = sortedInspections.find((insp) => insp.componentId === id)

    let traveledKm: number
    let remainingKm: number
    let condition: number
    let isConfirmedFit = false

    const inspectionDate = lastInspection ? new Date(lastInspection.checkedAt).getTime() : 0
    const serviceDate = lastService ? new Date(lastService.date).getTime() : 0
    const inspectionMileage = lastInspection ? lastInspection.mileageAtCheck : -1
    const serviceMileage = lastService ? lastService.mileage : -1

    // Pemeriksaan fisik lebih prioritas bila dilakukan setelah servis terakhir
    const isInspectionMoreRecent =
      lastInspection !== undefined &&
      (!lastService || inspectionMileage >= serviceMileage || inspectionDate >= serviceDate)

    if (isInspectionMoreRecent && lastInspection) {
      isConfirmedFit = true
      const kmDelta = Math.max(0, currentMileage - lastInspection.mileageAtCheck)
      const wearPercent = (kmDelta / activeIntervalKm) * 100
      condition = Math.max(0, Math.min(100, Math.round(lastInspection.condition - wearPercent)))
      remainingKm = Math.round((condition / 100) * activeIntervalKm)
      traveledKm = activeIntervalKm - remainingKm
    } else if (lastService) {
      traveledKm = Math.max(0, currentMileage - lastService.mileage)
      remainingKm = activeIntervalKm - traveledKm
      condition = Math.max(0, Math.min(100, Math.round((remainingKm / activeIntervalKm) * 100)))
    } else if (dbCondition !== undefined && dbCondition !== null) {
      condition = dbCondition
      remainingKm = Math.round((condition / 100) * activeIntervalKm)
      traveledKm = activeIntervalKm - remainingKm
    } else {
      const cycle = calculateCycleProgress(currentMileage, activeIntervalKm)
      traveledKm = cycle.traveledKm
      remainingKm = cycle.remainingKm
      condition = cycle.condition
    }

    const { status, statusText, advice } = getStatusDetails(
      remainingKm,
      condition,
      spec.name,
      isConfirmedFit ? lastInspection : undefined
    )

    components.push({
      id,
      name: spec.name,
      category,
      currentCondition: condition,
      intervalKm: activeIntervalKm,
      manufacturerRecommendedKm: spec.defaultKm,
      isCustomInterval: isCustom,
      remainingKm,
      traveledKm,
      lastServiceDate: lastService?.date || dbDate,
      lastServiceMileage: lastService?.mileage,
      lastInspectionDate: lastInspection?.checkedAt,
      lastInspectionMileage: lastInspection?.mileageAtCheck,
      lastInspectionRole: lastInspection?.inspectorRole,
      lastInspectionNotes: lastInspection?.notes,
      isConfirmedFit,
      status,
      statusText,
      advice
    })
  }

  // 1. OLI MESIN (Khusus ICE)
  if (!isEV && 'oil' in standards && standards.oil) {
    const mfgKm = standards.oil.defaultKm
    const activeKm = vehicle.oilIntervalKm && vehicle.oilIntervalKm > 0 ? vehicle.oilIntervalKm : mfgKm
    processComponent(
      'oil',
      standards.oil,
      activeKm,
      activeKm !== mfgKm,
      'Pelumasan',
      ['oli mesin', 'engine oil'],
      vehicle.oilCondition,
      vehicle.lastOilChange
    )
  }

  // 2. OLI GARDAN / TRANSMISI / OLI REDUKSI
  if (standards.transmissionOil) {
    const mfgKm = standards.transmissionOil.defaultKm
    const activeKm = vehicle.transmissionOilIntervalKm && vehicle.transmissionOilIntervalKm > 0 ? vehicle.transmissionOilIntervalKm : mfgKm
    processComponent(
      'transmissionOil',
      standards.transmissionOil,
      activeKm,
      activeKm !== mfgKm,
      'Pelumasan',
      ['oli gardan', 'oli transmisi', 'oli reduksi', 'gearbox']
    )
  }

  // 3. SERVIS CVT & ROLLER (Khusus Matic ICE)
  if (!isEV && isAutomatic && 'cvtService' in standards && standards.cvtService) {
    processComponent(
      'cvtService',
      standards.cvtService,
      standards.cvtService.defaultKm,
      false,
      'CVT & Transmisi',
      ['cvt', 'roller', 'pulley', 'slider', 'servis cvt']
    )
  }

  // 4. V-BELT CVT (Khusus Matic ICE)
  if (!isEV && isAutomatic && 'vBelt' in standards && standards.vBelt) {
    processComponent(
      'vBelt',
      standards.vBelt,
      standards.vBelt.defaultKm,
      false,
      'CVT & Transmisi',
      ['v-belt', 'vbelt', 'fan belt', 'sabuk cvt']
    )
  }

  // 5. SERVIS INJEKSI (Khusus ICE Injeksi)
  if (!isEV && fuelSystem === 'INJECTION' && 'injectionService' in standards && standards.injectionService) {
    processComponent(
      'injectionService',
      standards.injectionService,
      standards.injectionService.defaultKm,
      false,
      'Sistem Bahan Bakar',
      ['injeksi', 'injection', 'throttle body', 'injector', 'tb']
    )
  }

  // 6. SERVIS KARBURATOR (Khusus ICE Karburator)
  if (!isEV && fuelSystem === 'CARBURETOR' && 'carburetorService' in standards && standards.carburetorService) {
    processComponent(
      'carburetorService',
      standards.carburetorService,
      standards.carburetorService.defaultKm,
      false,
      'Sistem Bahan Bakar',
      ['karbu', 'karburator', 'carburetor', 'spuyer', 'pilot jet', 'main jet']
    )
  }

  // 7. BUSI (Khusus ICE)
  if (!isEV && 'sparkPlug' in standards && standards.sparkPlug) {
    processComponent(
      'sparkPlug',
      standards.sparkPlug,
      standards.sparkPlug.defaultKm,
      false,
      'Pengapian & Kelistrikan',
      ['busi', 'spark plug']
    )
  }

  // 8. FILTER UDARA (Khusus ICE)
  if (!isEV && 'airFilter' in standards && standards.airFilter) {
    processComponent(
      'airFilter',
      standards.airFilter,
      standards.airFilter.defaultKm,
      false,
      'Mesin & Pembakaran',
      ['filter udara', 'air filter', 'saringan udara']
    )
  }

  // 9. CAIRAN RADIATOR / COOLANT
  if (standards.coolant) {
    const mfgKm = standards.coolant.defaultKm
    const activeKm = vehicle.coolantIntervalKm && vehicle.coolantIntervalKm > 0 ? vehicle.coolantIntervalKm : mfgKm
    processComponent(
      'coolant',
      standards.coolant,
      activeKm,
      activeKm !== mfgKm,
      'Pendinginan',
      ['radiator', 'coolant', 'air radiator'],
      vehicle.coolantCondition
    )
  }

  // 10. RANTAI & GIR SET (Khusus Manual ICE)
  if (!isEV && !isAutomatic && 'driveChain' in standards && standards.driveChain) {
    processComponent(
      'driveChain',
      standards.driveChain,
      standards.driveChain.defaultKm,
      false,
      'Penyalur Tenaga',
      ['rantai', 'gir', 'chain', 'sprocket', 'gear set']
    )
  }

  // 11. SERVIS OLI SHOCK DEPAN (ICE & EV)
  if ('forkOil' in standards && standards.forkOil) {
    processComponent(
      'forkOil',
      standards.forkOil,
      standards.forkOil.defaultKm,
      false,
      'Kaki-kaki & Suspensi',
      ['shock depan', 'oli shock', 'suspensi depan', 'fork oil']
    )
  }

  // 12. KURAS MINYAK REM (ICE & EV)
  if ('brakeFluid' in standards && standards.brakeFluid) {
    processComponent(
      'brakeFluid',
      standards.brakeFluid,
      standards.brakeFluid.defaultKm,
      false,
      'Pengereman',
      ['minyak rem', 'brake fluid', 'dot 3', 'dot 4']
    )
  }

  // 13. KAMPAS REM DEPAN
  if (standards.brakePadFront) {
    processComponent(
      'brakePadFront',
      standards.brakePadFront,
      standards.brakePadFront.defaultKm,
      false,
      'Pengereman',
      ['kampas rem depan', 'brake pad front'],
      vehicle.brakePadCondition
    )
  }

  // 14. KAMPAS REM BELAKANG
  if (standards.brakePadRear) {
    processComponent(
      'brakePadRear',
      standards.brakePadRear,
      standards.brakePadRear.defaultKm,
      false,
      'Pengereman',
      ['kampas rem belakang', 'brake pad rear', 'tromol'],
      vehicle.brakePadConditionRear
    )
  }

  // 15. BAN DEPAN
  if (standards.tireFront) {
    processComponent(
      'tireFront',
      standards.tireFront,
      standards.tireFront.defaultKm,
      false,
      'Kaki-kaki & Ban',
      ['ban depan', 'tire front'],
      vehicle.tireConditionFront
    )
  }

  // 16. BAN BELAKANG
  if (standards.tireRear) {
    processComponent(
      'tireRear',
      standards.tireRear,
      standards.tireRear.defaultKm,
      false,
      'Kaki-kaki & Ban',
      ['ban belakang', 'tire rear'],
      vehicle.tireConditionRear
    )
  }

  // 17. SERVIS BERKALA EV (Khusus EV)
  if (isEV && 'routineService' in standards && standards.routineService) {
    processComponent(
      'routineService',
      standards.routineService,
      standards.routineService.defaultKm,
      false,
      'Baterai & Diagnostik EV',
      ['servis berkala', 'diagnostik ev', 'baterai', 'soh']
    )
  }

  return components
}

function getStatusDetails(
  remainingKm: number, 
  condition: number, 
  componentName: string,
  inspection?: ComponentInspection
) {
  if (remainingKm <= 0 || condition <= 10) {
    return {
      status: 'CRITICAL' as const,
      statusText: remainingKm < 0 ? `Terlewat ${Math.abs(remainingKm).toLocaleString('id-ID')} KM` : 'Perlu Ganti Segera',
      advice: `${componentName} telah mencapai batas pemakaian aman. Segera lakukan servis atau penggantian.`
    }
  }
  if (remainingKm <= 500 || condition <= 25) {
    return {
      status: 'WARNING' as const,
      statusText: `Sisa ${remainingKm.toLocaleString('id-ID')} KM`,
      advice: inspection
        ? `${componentName} mendekati batas keausan (${condition}%). Pantau ketat dan jadwalkan servis.`
        : `Masa pakai ${componentName} mendekati batas rekomendasi pabrikan. Jadwalkan servis dalam waktu dekat.`
    }
  }
  if (condition >= 70) {
    return {
      status: 'EXCELLENT' as const,
      statusText: inspection ? `Layak Pakai (${condition}%)` : `Sisa ${remainingKm.toLocaleString('id-ID')} KM`,
      advice: inspection
        ? `${componentName} telah dikonfirmasi masih layak pakai oleh ${inspection.inspectorRole === 'MECHANIC' ? 'Mekanik' : 'Pengguna'} (${condition}%).`
        : `Kondisi ${componentName} sangat baik dan berada dalam toleransi prima.`
    }
  }
  return {
    status: 'GOOD' as const,
    statusText: inspection ? `Cukup Layak (${condition}%)` : `Sisa ${remainingKm.toLocaleString('id-ID')} KM`,
    advice: inspection
      ? `${componentName} masih layak pakai dengan pantauan berkala (${condition}%).`
      : `Kondisi ${componentName} dalam batas wajar pemakaian operasional harian.`
  }
}

/**
 * Kalkulasi ringkasan servis utama kendaraan
 */
export function calculateServiceReminder(
  vehicle: Vehicle,
  serviceRecords: RecordWithDetails[] = [],
  inspections: ComponentInspection[] = []
) {
  const components = calculateAllComponentsStatus(vehicle, serviceRecords, inspections)
  
  // Cari komponen yang paling kritis (remainingKm paling sedikit / kondisi paling rendah)
  const sortedByUrgency = [...components].sort((a, b) => a.remainingKm - b.remainingKm)
  const mostUrgent = sortedByUrgency[0]

  if (!mostUrgent) {
    return {
      needsService: false,
      remainingMileage: 3000,
      message: 'Kondisi Prima',
      mostUrgentComponent: null,
      allComponents: []
    }
  }

  const needsService = mostUrgent.status === 'CRITICAL' || mostUrgent.status === 'WARNING'

  let message = 'Kondisi Prima'
  if (mostUrgent.status === 'CRITICAL') {
    message = `${mostUrgent.name} ${mostUrgent.remainingKm < 0 ? `terlewat ${Math.abs(mostUrgent.remainingKm).toLocaleString('id-ID')} KM` : 'perlu segera diservis'}!`
  } else if (mostUrgent.status === 'WARNING') {
    message = `${mostUrgent.name} disarankan servis dalam ${mostUrgent.remainingKm.toLocaleString('id-ID')} KM.`
  }

  return {
    needsService,
    remainingMileage: Math.max(0, mostUrgent.remainingKm),
    message,
    mostUrgentComponent: mostUrgent,
    allComponents: components
  }
}

export interface ScheduledServiceItem {
  id: string
  name: string
  category: string
  intervalKm: number
  targetMileage: number
  remainingKm: number
  isOverdue: boolean
  isUrgent: boolean
  estimatedCost: number
  source: string
  actionDescription: string
}

export interface NextServiceSchedule {
  nextServiceMileage: number
  remainingKm: number
  estimatedDays: number
  estimatedDate: Date
  estimatedTotalCost: number
  dueServices: ScheduledServiceItem[]
  allUpcomingServices: ScheduledServiceItem[]
  fuelSystem: 'INJECTION' | 'CARBURETOR'
  isCVT: boolean
  dailyKmEstimate: number
}

/**
 * LOGIKA ESTIMASI JADWAL SERVIS SELANJUTNYA
 * Menghitung odometer target servis berikutnya, sisa kilometer, estimasi tanggal,
 * rincian item servis (CVT, Injeksi/Karbu, Oli, dll.), serta estimasi biaya resmi.
 */
export function calculateNextServiceSchedule(
  vehicle: Vehicle,
  serviceRecords: RecordWithDetails[] = [],
  inspections: ComponentInspection[] = []
): NextServiceSchedule {
  const currentMileage = vehicle.currentMileage || 0
  const isEV = vehicle.engineType === 'EV'
  const isCVT = vehicle.transmission === 'AUTOMATIC'
  const fuelSystem = !isEV ? detectFuelSystem(vehicle, serviceRecords) : 'INJECTION'

  // Hitung rata-rata jarak tempuh harian pengguna berdasarkan riwayat servis
  let dailyKm = 30 // Default komuter harian Indonesia: 25 - 35 KM/hari
  const sortedRecords = [...serviceRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const sortedInspections = [...inspections].sort(
    (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
  )

  if (sortedRecords.length >= 2) {
    const r1 = sortedRecords[0]
    const r2 = sortedRecords[1]
    const kmDelta = Math.abs(r1.mileage - r2.mileage)
    const daysDelta = Math.max(1, (new Date(r1.date).getTime() - new Date(r2.date).getTime()) / (1000 * 60 * 60 * 24))
    if (kmDelta > 0 && daysDelta > 0) {
      dailyKm = Math.min(80, Math.max(15, Math.round(kmDelta / daysDelta)))
    }
  }

  // Database item servis terjadwal beserta estimasi biaya (AHASS / Yamaha / Bengkel Resmi)
  const scheduledItems: ScheduledServiceItem[] = []

  const checkScheduleItem = (
    id: string,
    name: string,
    category: string,
    intervalKm: number,
    estimatedCost: number,
    source: string,
    actionDescription: string,
    keywords: string[]
  ) => {
    const lastService = findLatestServiceForComponent(sortedRecords, keywords)
    const lastInspection = sortedInspections.find((insp) => insp.componentId === id)
    let targetMileage: number

    const inspectionDate = lastInspection ? new Date(lastInspection.checkedAt).getTime() : 0
    const serviceDate = lastService ? new Date(lastService.date).getTime() : 0
    const inspectionMileage = lastInspection ? lastInspection.mileageAtCheck : -1
    const serviceMileage = lastService ? lastService.mileage : -1

    const isInspectionMoreRecent =
      lastInspection !== undefined &&
      (!lastService || inspectionMileage >= serviceMileage || inspectionDate >= serviceDate)

    if (isInspectionMoreRecent && lastInspection) {
      targetMileage = lastInspection.mileageAtCheck + Math.round((lastInspection.condition / 100) * intervalKm)
    } else if (lastService) {
      targetMileage = lastService.mileage + intervalKm
    } else {
      targetMileage = Math.ceil((currentMileage + 1) / intervalKm) * intervalKm
      if (targetMileage <= currentMileage) {
        targetMileage += intervalKm
      }
    }

    const remainingKm = targetMileage - currentMileage
    const isOverdue = remainingKm <= 0
    const isUrgent = remainingKm <= 500

    scheduledItems.push({
      id,
      name,
      category,
      intervalKm,
      targetMileage,
      remainingKm,
      isOverdue,
      isUrgent,
      estimatedCost,
      source,
      actionDescription
    })
  }

  // 1. Oli Mesin (ICE)
  if (!isEV) {
    const oilInterval = vehicle.oilIntervalKm && vehicle.oilIntervalKm > 0 ? vehicle.oilIntervalKm : 3000
    checkScheduleItem(
      'oil',
      'Ganti Oli Mesin',
      'Pelumasan',
      oilInterval,
      60000,
      'Buku Pedoman Astra Honda & Yamaha (2.000–4.000 KM)',
      'Penggantian oli mesin baru untuk melumasi piston, silinder, dan transmisi.',
      ['oli mesin', 'engine oil']
    )
  }

  // 2. Oli Gardan / Transmisi (Matic ICE & EV)
  if (isCVT || isEV) {
    const transInterval = vehicle.transmissionOilIntervalKm && vehicle.transmissionOilIntervalKm > 0 
      ? vehicle.transmissionOilIntervalKm 
      : (isEV ? 10000 : 8000)
    checkScheduleItem(
      'transmissionOil',
      isEV ? 'Ganti Oli Reduksi EV' : 'Ganti Oli Gardan',
      'Pelumasan',
      transInterval,
      20000,
      'Standar Servis CVT Resmi AHASS & Yamaha (8.000 KM)',
      'Penggantian oli gear transmisi akhir untuk mereduksi gesekan roda gigi gardan.',
      ['oli gardan', 'oli transmisi', 'oli reduksi', 'gearbox']
    )
  }

  // 3. Servis CVT (Khusus Matic ICE)
  if (!isEV && isCVT) {
    checkScheduleItem(
      'cvtService',
      'Servis CVT & Pembersihan Roller',
      'CVT & Transmisi',
      8000,
      50000,
      'Standar Servis CVT AHASS & Yamaha (8.000–10.000 KM)',
      'Bongkar cover CVT, cuci mangkok & kampas ganda dari debu, cek keausan roller & beri grease high-temp.',
      ['cvt', 'roller', 'pulley', 'slider', 'servis cvt']
    )

    checkScheduleItem(
      'vBelt',
      'Ganti Sabuk V-Belt CVT',
      'CVT & Transmisi',
      24000,
      160000,
      'Buku Servis Resmi Honda & Yamaha (24.000 KM)',
      'Penggantian sabuk V-Belt baru untuk mencegah risiko putus sabuk di jalan.',
      ['v-belt', 'vbelt', 'fan belt', 'sabuk cvt']
    )
  }

  // 4. Servis Injeksi vs Karburator (ICE)
  if (!isEV) {
    if (fuelSystem === 'INJECTION') {
      checkScheduleItem(
        'injectionService',
        'Servis Injeksi (Throttle Body & Injector)',
        'Sistem Bahan Bakar',
        10000,
        65000,
        'Standar Servis Injeksi Bengkel Resmi (10.000–12.000 KM)',
        'Pembersihan tumpukan kerak di katup throttle body, cairan injector cleaner, dan reset sudut sensor ECU.',
        ['injeksi', 'injection', 'throttle body', 'injector', 'tb']
      )
    } else {
      checkScheduleItem(
        'carburetorService',
        'Servis & Setel Karburator',
        'Sistem Bahan Bakar',
        5000,
        40000,
        'Pedoman Servis Karburator Honda & Suzuki (5.000 KM)',
        'Bongkar mangkok karburator, semprot lubang pilot jet & main jet dengan karbu cleaner, setel baut angin stasioner.',
        ['karbu', 'karburator', 'carburetor', 'spuyer', 'pilot jet', 'main jet']
      )
    }
  }

  // 5. Busi (ICE)
  if (!isEV) {
    checkScheduleItem(
      'sparkPlug',
      'Ganti Busi (Spark Plug)',
      'Pengapian',
      8000,
      25000,
      'Standar Busi NGK / Denso & AHASS (8.000 KM)',
      'Penggantian busi baru untuk mencegah elektroda aus dan pembakaran tidak tuntas.',
      ['busi', 'spark plug']
    )
  }

  // 6. Filter Udara (ICE)
  if (!isEV) {
    checkScheduleItem(
      'airFilter',
      'Ganti Filter Udara',
      'Mesin & Pembakaran',
      16000,
      55000,
      'Pedoman Saringan Udara Honda (16.000 KM)',
      'Ganti elemen filter viscous basah baru agar suplai udara pembakaran bersih dari debu jalan.',
      ['filter udara', 'air filter', 'saringan udara']
    )
  }

  // 7. Cairan Radiator (Coolant)
  const coolantInterval = vehicle.coolantIntervalKm && vehicle.coolantIntervalKm > 0 ? vehicle.coolantIntervalKm : 12000
  checkScheduleItem(
    'coolant',
    'Kuras Air Radiator (Coolant)',
    'Pendinginan',
    coolantInterval,
    40000,
    'Standar Sistem Pendingin Mesin (10.000–12.000 KM)',
    'Kuras total air radiator lama dan isi coolant baru berformula anti-karat.',
    ['radiator', 'coolant', 'air radiator']
  )

  // 8. Rantai & Gir Set (Khusus Manual ICE)
  if (!isEV && !isCVT) {
    checkScheduleItem(
      'driveChain',
      'Ganti Rantai & Gir Set',
      'Penyalur Tenaga',
      15000,
      180000,
      'Pedoman Rantai Roda Resmi (15.000 KM)',
      'Ganti satu set gir depan, gir belakang, dan rantai roda bila mata gir mulai runcing.',
      ['rantai', 'gir', 'chain', 'sprocket', 'gear set']
    )
  }

  // 9. Kuras Minyak Rem
  checkScheduleItem(
    'brakeFluid',
    'Kuras Minyak Rem',
    'Pengereman',
    20000,
    30000,
    'Standar Keselamatan Pengereman (20.000–24.000 KM / 2 Tahun)',
    'Kuras minyak rem hidrolik DOT 3/4 untuk membuang uap air penyebab vapor lock / rem blong.',
    ['minyak rem', 'brake fluid', 'dot 3', 'dot 4']
  )

  // 10. Servis Oli Shock Depan
  checkScheduleItem(
    'forkOil',
    'Servis Oli Shockbreaker Depan',
    'Kaki-kaki & Suspensi',
    15000,
    80000,
    'Pedoman Suspensi Depan Bengkel Resmi (15.000–20.000 KM)',
    'Ganti oli suspensi depan dan bersihkan tabung shock agar redaman tetap stabil.',
    ['shock depan', 'oli shock', 'suspensi depan', 'fork oil']
  )

  // Urutkan semua item servis berdasarkan target mileage terdekat
  scheduledItems.sort((a, b) => a.remainingKm - b.remainingKm)

  // Tentukan target servis terdekat
  // Jika ada yang overdue (remainingKm <= 0), targetnya adalah sekarang (currentMileage)
  const nextTargetMilestone = scheduledItems[0]?.targetMileage || currentMileage + 3000
  const shortestRemaining = scheduledItems[0]?.remainingKm || 3000

  // Paket servis yang jatuh tempo pada ronde ini (semua yang overdue atau tersisa <= 500 KM dari target terdekat)
  const dueServices = scheduledItems.filter(item => 
    item.isOverdue || item.remainingKm <= Math.max(500, shortestRemaining + 300)
  )

  const estimatedTotalCost = dueServices.reduce((sum, item) => sum + item.estimatedCost, 0)
  const estimatedDays = Math.max(1, Math.round(Math.max(0, shortestRemaining) / dailyKm))
  const estimatedDate = new Date(Date.now() + estimatedDays * 86400000)

  return {
    nextServiceMileage: nextTargetMilestone,
    remainingKm: Math.max(0, shortestRemaining),
    estimatedDays,
    estimatedDate,
    estimatedTotalCost,
    dueServices,
    allUpcomingServices: scheduledItems,
    fuelSystem,
    isCVT,
    dailyKmEstimate: dailyKm
  }
}

/**
 * Estimasi biaya servis berdasarkan riwayat servis sebelumnya
 */
export function estimateNextServiceCost(
  history: RecordWithDetails[]
) {
  const DEFAULT_ESTIMATE = 75000 // Rata-rata biaya servis oli standar jika tidak ada riwayat

  if (!history || history.length === 0) {
    return DEFAULT_ESTIMATE
  }

  const recentServices = history.slice(0, 3)
  const totalCost = recentServices.reduce((sum, record) => sum + record.totalCost, 0)
  
  return Math.round(totalCost / recentServices.length)
}
