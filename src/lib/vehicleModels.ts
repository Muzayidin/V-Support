export type VehicleType = 'MOTORCYCLE' | 'CAR'
export type EngineType = 'ICE' | 'EV'

// ============================================================================
// 1. MOTORCYCLE PRESETS
// ============================================================================

// Database Merk & Model Khusus Motor Bensin (ICE)
export const MOTORCYCLE_MODELS_ICE: Record<string, string[]> = {
  'Honda': [
    'Beat',
    'Beat Street',
    'Scoopy',
    'Genio',
    'Vario 125',
    'Vario 160',
    'PCX 160',
    'ADV 160',
    'Stylo 160',
    'Forza 250',
    'Revo X',
    'Supra X 125',
    'Supra GTR 150',
    'Sonic 150R',
    'CB150R Streetfire',
    'CBR150R',
    'CB150X',
    'CBR250RR',
    'CRF150L',
    'Monkey 125',
    'Rebel 500'
  ],
  'Yamaha': [
    'NMAX 155',
    'Aerox 155',
    'Lexi LX 155',
    'XMAX 250',
    'Grand Filano',
    'Fazzio',
    'Mio M3 125',
    'Fino 125',
    'Gear 125',
    'FreeGo 125',
    'X-Ride 125',
    'YZF-R15',
    'MT-15',
    'XSR 155',
    'WR 155 R',
    'YZF-R25',
    'MT-25',
    'Jupiter Z1',
    'MX King 150',
    'Vega Force'
  ],
  'Suzuki': [
    'Burgman Street 125 EX',
    'Address FI',
    'Nex II',
    'Nex Crossover',
    'Avenis 125',
    'Satria F150',
    'GSX-R150',
    'GSX-S150',
    'V-Strom 250 SX'
  ],
  'Kawasaki': [
    'Ninja 250',
    'Ninja ZX-25R',
    'Ninja ZX-4RR',
    'W175',
    'W175 Cafe',
    'W175 TR',
    'KLX 150',
    'KLX 230',
    'D-Tracker 150'
  ],
  'Vespa / Piaggio': [
    'Sprint 150',
    'Primavera 150',
    'GTS Super 150',
    'GTS 300',
    'LX 125',
    'S 125',
    'Medley 150'
  ],
  'KTM': [
    'Duke 200',
    'Duke 250',
    'Duke 390',
    'RC 200',
    'RC 250',
    'RC 390',
    '250 Adventure'
  ],
  'Royal Enfield': [
    'Classic 350',
    'Hunter 350',
    'Meteor 350',
    'Bullet 350',
    'Interceptor 650',
    'Himalayan 450'
  ],
  'Lainnya': ['Custom / Model Motor Bensin Lainnya']
}

// Database Merk & Model Khusus Motor Listrik (EV)
export const MOTORCYCLE_MODELS_EV: Record<string, string[]> = {
  'Polytron': [
    'Fox-R',
    'Fox-S',
    'Fox-500',
    'T-Rex'
  ],
  'Alva': [
    'One',
    'One XP',
    'Cervo',
    'Cervo Q',
    'Cervo Boost Charge'
  ],
  'Gesits': [
    'G1',
    'Raya G',
    'Garuda'
  ],
  'United E-Motor': [
    'TX3000',
    'TX1800',
    'T1800',
    'MX1200',
    'MT1500',
    'C2000'
  ],
  'Honda (EV)': [
    'EM1 e:',
    'EM1 e: Plus',
    'ICON e:',
    'CUV e:'
  ],
  'Yamaha (EV)': [
    'E-Vino',
    'Neo\'s',
    'E01'
  ],
  'Viar': [
    'Q1',
    'N1',
    'N2',
    'EV1'
  ],
  'Smoot': [
    'Tempur',
    'Zuzu',
    'De Sultan'
  ],
  'Yadea': [
    'T9',
    'G5',
    'E8S Pro',
    'Kemper'
  ],
  'Davigo': [
    'Space',
    'Dragon',
    'Forza'
  ],
  'Selis': [
    'E-Max',
    'Agats',
    'Go Plus',
    'Bromo'
  ],
  'Kawasaki (EV)': [
    'Ninja e-1',
    'Z e-1'
  ],
  'Vespa (EV)': [
    'Vespa Elettrica'
  ],
  'Lainnya': ['Custom / Model Motor Listrik Lainnya']
}

// ============================================================================
// 2. CAR PRESETS
// ============================================================================

// Database Merk & Model Khusus Mobil Bensin (ICE)
export const CAR_MODELS_ICE: Record<string, string[]> = {
  'Toyota': [
    'Avanza',
    'Veloz',
    'Innova Reborn',
    'Innova Zenix',
    'Calya',
    'Rush',
    'Raize',
    'Agya',
    'Yaris',
    'Fortuner',
    'Corolla Cross',
    'Hilux'
  ],
  'Honda': [
    'Brio',
    'HR-V',
    'BR-V',
    'WR-V',
    'City Hatchback',
    'CR-V',
    'Civic',
    'Mobilio'
  ],
  'Daihatsu': [
    'Sigra',
    'Xenia',
    'Terios',
    'Ayla',
    'Rocky',
    'Gran Max'
  ],
  'Mitsubishi': [
    'Xpander',
    'Xpander Cross',
    'Pajero Sport',
    'Triton'
  ],
  'Suzuki': [
    'Ertiga',
    'XL7',
    'Baleno',
    'Jimny',
    'Grand Vitara',
    'Ignis',
    'Carry'
  ],
  'Hyundai': [
    'Creta',
    'Stargazer',
    'Santa Fe',
    'Palisade'
  ],
  'Wuling': [
    'Confero',
    'Cortez',
    'Alvez',
    'Almaz'
  ],
  'Mazda': [
    'Mazda 2',
    'Mazda 3',
    'CX-3',
    'CX-5',
    'CX-30'
  ],
  'Nissan': [
    'Livina',
    'Magnite',
    'Serena'
  ],
  'Lainnya': ['Custom / Model Mobil Bensin Lainnya']
}

// Database Merk & Model Khusus Mobil Listrik (EV)
export const CAR_MODELS_EV: Record<string, string[]> = {
  'Wuling': [
    'Air EV',
    'Binguo EV',
    'Cloud EV'
  ],
  'Hyundai': [
    'Ioniq 5',
    'Ioniq 6',
    'Kona Electric'
  ],
  'BYD': [
    'Dolphin',
    'Atto 3',
    'Seal',
    'M6'
  ],
  'Chery': [
    'Omoda E5'
  ],
  'MG': [
    'MG 4 EV',
    'MG ZS EV'
  ],
  'BMW': [
    'iX1',
    'i4',
    'iX',
    'i5'
  ],
  'Toyota (EV)': [
    'bZ4X'
  ],
  'Kia': [
    'EV6',
    'EV9'
  ],
  'Neta': [
    'Neta V',
    'Neta V-II',
    'Neta X'
  ],
  'GWM': [
    'Ora 03'
  ],
  'Lainnya': ['Custom / Model Mobil Listrik Lainnya']
}

// Backward compatibility exports
export const MODELS_BY_BRAND_ICE = MOTORCYCLE_MODELS_ICE
export const MODELS_BY_BRAND_EV = MOTORCYCLE_MODELS_EV

export function getBrandsAndModels(vehicleType: VehicleType, engineType: EngineType): Record<string, string[]> {
  if (vehicleType === 'CAR') {
    return engineType === 'ICE' ? CAR_MODELS_ICE : CAR_MODELS_EV
  }
  return engineType === 'ICE' ? MOTORCYCLE_MODELS_ICE : MOTORCYCLE_MODELS_EV
}

export interface VehicleModelSpec {
  ccOrKwh?: number
  transmission?: 'AUTOMATIC' | 'MANUAL'
}

// Database Spesifikasi Default Kendaraan Bensin (ICE)
export const MODEL_SPECS_ICE: Record<string, VehicleModelSpec> = {
  // Motor Honda
  'Beat': { ccOrKwh: 110, transmission: 'AUTOMATIC' },
  'Beat Street': { ccOrKwh: 110, transmission: 'AUTOMATIC' },
  'Scoopy': { ccOrKwh: 110, transmission: 'AUTOMATIC' },
  'Genio': { ccOrKwh: 110, transmission: 'AUTOMATIC' },
  'Vario 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Vario 160': { ccOrKwh: 160, transmission: 'AUTOMATIC' },
  'PCX 160': { ccOrKwh: 160, transmission: 'AUTOMATIC' },
  'ADV 160': { ccOrKwh: 160, transmission: 'AUTOMATIC' },
  'Stylo 160': { ccOrKwh: 160, transmission: 'AUTOMATIC' },
  'Forza 250': { ccOrKwh: 250, transmission: 'AUTOMATIC' },
  'Revo X': { ccOrKwh: 110, transmission: 'MANUAL' },
  'Supra X 125': { ccOrKwh: 125, transmission: 'MANUAL' },
  'Supra GTR 150': { ccOrKwh: 150, transmission: 'MANUAL' },
  'Sonic 150R': { ccOrKwh: 150, transmission: 'MANUAL' },
  'CB150R Streetfire': { ccOrKwh: 150, transmission: 'MANUAL' },
  'CBR150R': { ccOrKwh: 150, transmission: 'MANUAL' },
  'CB150X': { ccOrKwh: 150, transmission: 'MANUAL' },
  'CBR250RR': { ccOrKwh: 250, transmission: 'MANUAL' },
  'CRF150L': { ccOrKwh: 150, transmission: 'MANUAL' },
  'Monkey 125': { ccOrKwh: 125, transmission: 'MANUAL' },
  'Rebel 500': { ccOrKwh: 500, transmission: 'MANUAL' },

  // Motor Yamaha
  'NMAX 155': { ccOrKwh: 155, transmission: 'AUTOMATIC' },
  'Aerox 155': { ccOrKwh: 155, transmission: 'AUTOMATIC' },
  'Lexi LX 155': { ccOrKwh: 155, transmission: 'AUTOMATIC' },
  'XMAX 250': { ccOrKwh: 250, transmission: 'AUTOMATIC' },
  'Grand Filano': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Fazzio': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Mio M3 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Fino 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Gear 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'FreeGo 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'X-Ride 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'YZF-R15': { ccOrKwh: 155, transmission: 'MANUAL' },
  'MT-15': { ccOrKwh: 155, transmission: 'MANUAL' },
  'XSR 155': { ccOrKwh: 155, transmission: 'MANUAL' },
  'WR 155 R': { ccOrKwh: 155, transmission: 'MANUAL' },
  'YZF-R25': { ccOrKwh: 250, transmission: 'MANUAL' },
  'MT-25': { ccOrKwh: 250, transmission: 'MANUAL' },
  'Jupiter Z1': { ccOrKwh: 115, transmission: 'MANUAL' },
  'MX King 150': { ccOrKwh: 150, transmission: 'MANUAL' },
  'Vega Force': { ccOrKwh: 115, transmission: 'MANUAL' },

  // Motor Suzuki
  'Burgman Street 125 EX': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Address FI': { ccOrKwh: 113, transmission: 'AUTOMATIC' },
  'Nex II': { ccOrKwh: 113, transmission: 'AUTOMATIC' },
  'Nex Crossover': { ccOrKwh: 113, transmission: 'AUTOMATIC' },
  'Avenis 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Satria F150': { ccOrKwh: 150, transmission: 'MANUAL' },
  'GSX-R150': { ccOrKwh: 150, transmission: 'MANUAL' },
  'GSX-S150': { ccOrKwh: 150, transmission: 'MANUAL' },
  'V-Strom 250 SX': { ccOrKwh: 250, transmission: 'MANUAL' },

  // Motor Kawasaki
  'Ninja 250': { ccOrKwh: 250, transmission: 'MANUAL' },
  'Ninja ZX-25R': { ccOrKwh: 250, transmission: 'MANUAL' },
  'Ninja ZX-4RR': { ccOrKwh: 400, transmission: 'MANUAL' },
  'W175': { ccOrKwh: 177, transmission: 'MANUAL' },
  'W175 Cafe': { ccOrKwh: 177, transmission: 'MANUAL' },
  'W175 TR': { ccOrKwh: 177, transmission: 'MANUAL' },
  'KLX 150': { ccOrKwh: 150, transmission: 'MANUAL' },
  'KLX 230': { ccOrKwh: 233, transmission: 'MANUAL' },
  'D-Tracker 150': { ccOrKwh: 150, transmission: 'MANUAL' },

  // Motor Vespa
  'Sprint 150': { ccOrKwh: 155, transmission: 'AUTOMATIC' },
  'Primavera 150': { ccOrKwh: 155, transmission: 'AUTOMATIC' },
  'GTS Super 150': { ccOrKwh: 155, transmission: 'AUTOMATIC' },
  'GTS 300': { ccOrKwh: 278, transmission: 'AUTOMATIC' },
  'LX 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'S 125': { ccOrKwh: 125, transmission: 'AUTOMATIC' },
  'Medley 150': { ccOrKwh: 155, transmission: 'AUTOMATIC' },

  // Motor KTM
  'Duke 200': { ccOrKwh: 200, transmission: 'MANUAL' },
  'Duke 250': { ccOrKwh: 250, transmission: 'MANUAL' },
  'Duke 390': { ccOrKwh: 373, transmission: 'MANUAL' },
  'RC 200': { ccOrKwh: 200, transmission: 'MANUAL' },
  'RC 250': { ccOrKwh: 250, transmission: 'MANUAL' },
  'RC 390': { ccOrKwh: 373, transmission: 'MANUAL' },
  '250 Adventure': { ccOrKwh: 249, transmission: 'MANUAL' },

  // Motor Royal Enfield
  'Classic 350': { ccOrKwh: 350, transmission: 'MANUAL' },
  'Hunter 350': { ccOrKwh: 350, transmission: 'MANUAL' },
  'Meteor 350': { ccOrKwh: 350, transmission: 'MANUAL' },
  'Bullet 350': { ccOrKwh: 350, transmission: 'MANUAL' },
  'Interceptor 650': { ccOrKwh: 650, transmission: 'MANUAL' },
  'Himalayan 450': { ccOrKwh: 452, transmission: 'MANUAL' },

  // Mobil Toyota
  'Avanza': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Veloz': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Innova Reborn': { ccOrKwh: 2000, transmission: 'AUTOMATIC' },
  'Innova Zenix': { ccOrKwh: 2000, transmission: 'AUTOMATIC' },
  'Calya': { ccOrKwh: 1200, transmission: 'MANUAL' },
  'Rush': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Raize': { ccOrKwh: 1000, transmission: 'AUTOMATIC' },
  'Agya': { ccOrKwh: 1200, transmission: 'MANUAL' },
  'Yaris': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Fortuner': { ccOrKwh: 2800, transmission: 'AUTOMATIC' },
  'Corolla Cross': { ccOrKwh: 1800, transmission: 'AUTOMATIC' },
  'Hilux': { ccOrKwh: 2400, transmission: 'MANUAL' },

  // Mobil Honda
  'Brio': { ccOrKwh: 1200, transmission: 'AUTOMATIC' },
  'HR-V': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'BR-V': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'WR-V': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'City Hatchback': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'CR-V': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Civic': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Mobilio': { ccOrKwh: 1500, transmission: 'MANUAL' },

  // Mobil Daihatsu
  'Sigra': { ccOrKwh: 1200, transmission: 'MANUAL' },
  'Xenia': { ccOrKwh: 1300, transmission: 'MANUAL' },
  'Terios': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Ayla': { ccOrKwh: 1000, transmission: 'MANUAL' },
  'Rocky': { ccOrKwh: 1000, transmission: 'AUTOMATIC' },
  'Gran Max': { ccOrKwh: 1500, transmission: 'MANUAL' },

  // Mobil Mitsubishi
  'Xpander': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Xpander Cross': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Pajero Sport': { ccOrKwh: 2400, transmission: 'AUTOMATIC' },
  'Triton': { ccOrKwh: 2400, transmission: 'MANUAL' },

  // Mobil Suzuki
  'Ertiga': { ccOrKwh: 1500, transmission: 'MANUAL' },
  'XL7': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Baleno': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Jimny': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Grand Vitara': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Ignis': { ccOrKwh: 1200, transmission: 'MANUAL' },
  'Carry': { ccOrKwh: 1500, transmission: 'MANUAL' },

  // Mobil Hyundai
  'Creta': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Stargazer': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Santa Fe': { ccOrKwh: 2500, transmission: 'AUTOMATIC' },
  'Palisade': { ccOrKwh: 2200, transmission: 'AUTOMATIC' },

  // Mobil Wuling
  'Confero': { ccOrKwh: 1500, transmission: 'MANUAL' },
  'Cortez': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Alvez': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Almaz': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },

  // Mobil Mazda
  'Mazda 2': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Mazda 3': { ccOrKwh: 2000, transmission: 'AUTOMATIC' },
  'CX-3': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'CX-5': { ccOrKwh: 2500, transmission: 'AUTOMATIC' },
  'CX-30': { ccOrKwh: 2000, transmission: 'AUTOMATIC' },

  // Mobil Nissan
  'Livina': { ccOrKwh: 1500, transmission: 'AUTOMATIC' },
  'Magnite': { ccOrKwh: 1000, transmission: 'AUTOMATIC' },
  'Serena': { ccOrKwh: 2000, transmission: 'AUTOMATIC' },
}

// Database Spesifikasi Default Kendaraan Listrik (EV)
export const MODEL_SPECS_EV: Record<string, VehicleModelSpec> = {
  // Motor Polytron
  'Fox-R': { ccOrKwh: 4, transmission: 'AUTOMATIC' },
  'Fox-S': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'Fox-500': { ccOrKwh: 4, transmission: 'AUTOMATIC' },
  'T-Rex': { ccOrKwh: 4, transmission: 'AUTOMATIC' },

  // Motor Alva
  'One': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'One XP': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'Cervo': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'Cervo Q': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'Cervo Boost Charge': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor Gesits
  'G1': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'Raya G': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'Garuda': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor United E-Motor
  'TX3000': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'TX1800': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'T1800': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'MX1200': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'MT1500': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'C2000': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor Honda (EV)
  'EM1 e:': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'EM1 e: Plus': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'ICON e:': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'CUV e:': { ccOrKwh: 3, transmission: 'AUTOMATIC' },

  // Motor Yamaha (EV)
  'E-Vino': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'Neo\'s': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'E01': { ccOrKwh: 5, transmission: 'AUTOMATIC' },

  // Motor Viar
  'Q1': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'N1': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'N2': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'EV1': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor Smoot
  'Tempur': { ccOrKwh: 1, transmission: 'AUTOMATIC' },
  'Zuzu': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'De Sultan': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor Yadea
  'T9': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'G5': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'E8S Pro': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'Kemper': { ccOrKwh: 6, transmission: 'AUTOMATIC' },

  // Motor Davigo
  'Space': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'Dragon': { ccOrKwh: 4, transmission: 'AUTOMATIC' },
  'Forza': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor Selis
  'E-Max': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'Agats': { ccOrKwh: 2, transmission: 'AUTOMATIC' },
  'Go Plus': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'Bromo': { ccOrKwh: 2, transmission: 'AUTOMATIC' },

  // Motor Kawasaki (EV)
  'Ninja e-1': { ccOrKwh: 3, transmission: 'AUTOMATIC' },
  'Z e-1': { ccOrKwh: 3, transmission: 'AUTOMATIC' },

  // Motor Vespa (EV)
  'Vespa Elettrica': { ccOrKwh: 4, transmission: 'AUTOMATIC' },

  // Mobil Wuling
  'Air EV': { ccOrKwh: 27, transmission: 'AUTOMATIC' },
  'Binguo EV': { ccOrKwh: 38, transmission: 'AUTOMATIC' },
  'Cloud EV': { ccOrKwh: 51, transmission: 'AUTOMATIC' },

  // Mobil Hyundai
  'Ioniq 5': { ccOrKwh: 73, transmission: 'AUTOMATIC' },
  'Ioniq 6': { ccOrKwh: 77, transmission: 'AUTOMATIC' },
  'Kona Electric': { ccOrKwh: 65, transmission: 'AUTOMATIC' },

  // Mobil BYD
  'Dolphin': { ccOrKwh: 45, transmission: 'AUTOMATIC' },
  'Atto 3': { ccOrKwh: 60, transmission: 'AUTOMATIC' },
  'Seal': { ccOrKwh: 83, transmission: 'AUTOMATIC' },
  'M6': { ccOrKwh: 72, transmission: 'AUTOMATIC' },

  // Mobil Chery
  'Omoda E5': { ccOrKwh: 61, transmission: 'AUTOMATIC' },

  // Mobil MG
  'MG 4 EV': { ccOrKwh: 51, transmission: 'AUTOMATIC' },
  'MG ZS EV': { ccOrKwh: 50, transmission: 'AUTOMATIC' },

  // Mobil BMW
  'iX1': { ccOrKwh: 65, transmission: 'AUTOMATIC' },
  'i4': { ccOrKwh: 84, transmission: 'AUTOMATIC' },
  'iX': { ccOrKwh: 77, transmission: 'AUTOMATIC' },
  'i5': { ccOrKwh: 81, transmission: 'AUTOMATIC' },

  // Mobil Toyota (EV)
  'bZ4X': { ccOrKwh: 71, transmission: 'AUTOMATIC' },

  // Mobil Kia
  'EV6': { ccOrKwh: 77, transmission: 'AUTOMATIC' },
  'EV9': { ccOrKwh: 100, transmission: 'AUTOMATIC' },

  // Mobil Neta
  'Neta V': { ccOrKwh: 38, transmission: 'AUTOMATIC' },
  'Neta V-II': { ccOrKwh: 36, transmission: 'AUTOMATIC' },
  'Neta X': { ccOrKwh: 64, transmission: 'AUTOMATIC' },

  // Mobil GWM
  'Ora 03': { ccOrKwh: 48, transmission: 'AUTOMATIC' },
}

/**
 * Mencari spesifikasi default (CC/kWh dan tipe transmisi) berdasarkan model dan tipe mesin.
 */
export function getModelSpec(modelName: string, engineType: 'ICE' | 'EV'): VehicleModelSpec | undefined {
  if (!modelName) return undefined
  if (engineType === 'ICE') {
    return MODEL_SPECS_ICE[modelName]
  }
  return MODEL_SPECS_EV[modelName]
}
