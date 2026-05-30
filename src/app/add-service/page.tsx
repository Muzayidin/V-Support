'use client'

import { useState, FormEvent, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createServiceRecord } from '@/actions/service'
import SmartSuggestionModal from '@/components/SmartSuggestionModal'

const AVAILABLE_COMPONENTS = [
  'Oli Mesin',
  'Oli Gardan',
  'Kampas Rem Depan',
  'Kampas Rem Belakang',
  'Busi',
  'V-Belt'
]

function AddServiceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') || ''
  
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [odometer, setOdometer] = useState('')
  const [date, setDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const toggleComponent = (comp: string) => {
    setSelectedComponents(prev => 
      prev.includes(comp) 
        ? prev.filter(c => c !== comp)
        : [...prev, comp]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!vehicleId || !odometer || selectedComponents.length === 0) {
      alert("Harap lengkapi data Odometer dan pilih komponen servis.")
      return
    }

    setIsSubmitting(true)
    
    const details = selectedComponents.map(comp => ({
      componentName: comp,
      cost: parseInt(prices[comp] || '0')
    }))
    const totalCost = details.reduce((sum, item) => sum + item.cost, 0)

    const result = await createServiceRecord({
      vehicleId,
      date: date ? new Date(date) : undefined,
      mileage: parseInt(odometer),
      totalCost,
      details
    })

    setIsSubmitting(false)

    if (result.success) {
      setShowModal(true)
    } else {
      alert("Terjadi kesalahan saat menyimpan data.")
    }
  }

  const totalEstimasi = selectedComponents.reduce((sum, comp) => sum + parseInt(prices[comp] || '0'), 0)

  return (
    <>
      <form onSubmit={handleSubmit} className="p-margin-page flex flex-col gap-6">
        {/* Form Section 1: Core Details */}
        <section className="flex flex-col gap-4 bg-surface-card p-padding-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-surface-container-low">
          {/* Vehicle Dropdown (Readonly/Hidden for now since vehicleId comes from query) */}
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="vehicle">Kendaraan ID</label>
            <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow opacity-50">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none">motorcycle</span>
              <input 
                type="text"
                readOnly
                value={vehicleId}
                className="w-full h-full pl-10 pr-3 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="service_date">Tanggal Servis</label>
              <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
                <span className="material-symbols-outlined absolute left-3 text-primary pointer-events-none">calendar_today</span>
                <input 
                  type="date" 
                  id="service_date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-full pl-10 pr-1 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg focus:ring-0" 
                />
              </div>
            </div>

            {/* Odometer */}
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="odometer">Odometer (km)</label>
              <div className="relative w-full min-h-touch-target-min flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-shadow">
                <input 
                  type="number" 
                  id="odometer"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="0"
                  pattern="\d*"
                  className="w-full h-full pl-3 pr-10 py-2.5 bg-transparent border-none text-on-surface font-body-lg text-body-lg text-right focus:ring-0 font-odometer-display tracking-tight" 
                />
                <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none opacity-50 text-sm">speed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section 2: Components */}
        <section className="flex flex-col gap-4">
          <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider pl-1">Pilih Komponen yang Diganti/Diservis</h2>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COMPONENTS.map(comp => {
              const isSelected = selectedComponents.includes(comp)
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => toggleComponent(comp)}
                  className={`flex items-center gap-1.5 px-4 py-2 min-h-touch-target-min rounded-full font-label-bold text-label-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container border border-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-[18px]">check</span>}
                  {comp}
                </button>
              )
            })}
          </div>
          <button type="button" className="self-start mt-2 px-4 py-2 text-primary font-label-bold text-label-bold flex items-center gap-2 hover:bg-primary/5 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Komponen Kustom
          </button>
        </section>

        {/* Form Section 3: Dynamic Price List */}
        {selectedComponents.length > 0 && (
          <section className="flex flex-col gap-3 pb-24">
            <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider pl-1">Rincian Biaya</h2>
            <div className="bg-surface-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-surface-container-low divide-y divide-surface-container-highest">
              {selectedComponents.map(comp => (
                <div key={comp} className="flex items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                      <span className="material-symbols-outlined text-[18px]">build</span>
                    </div>
                    <span className="font-body-md text-body-md text-on-surface font-medium line-clamp-2">{comp}</span>
                  </div>
                  <div className="relative w-32 h-10 shrink-0 flex items-center bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden focus-within:border-primary">
                    <span className="absolute left-2 text-on-surface-variant font-label-sm text-label-sm">Rp</span>
                    <input 
                      type="number" 
                      value={prices[comp] || ''}
                      onChange={(e) => setPrices({...prices, [comp]: e.target.value})}
                      placeholder="0"
                      pattern="\d*"
                      className="w-full h-full pl-8 pr-2 bg-transparent border-none text-on-surface font-body-md text-body-md text-right focus:ring-0" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center px-2 pt-2">
              <span className="font-body-md text-body-md text-on-surface-variant">Total Estimasi</span>
              <span className="font-headline-md text-headline-md text-primary">Rp {totalEstimasi.toLocaleString('id-ID')}</span>
            </div>
          </section>
        )}

        {/* Fixed Bottom Action */}
        <div className="fixed bottom-0 left-0 w-full bg-surface p-margin-page shadow-[0_-4px_16px_rgba(0,0,0,0.05)] border-t border-surface-container z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-touch-target-min bg-primary text-on-primary font-label-bold text-label-bold rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-200 shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Riwayat Servis'}
          </button>
        </div>
      </form>

      <SmartSuggestionModal 
        isOpen={showModal} 
        onClose={() => router.push('/')} 
      />
    </>
  )
}

export default function AddService() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
        input[type="number"] { -moz-appearance: textfield; }
      `}} />
      <header className="sticky top-0 z-40 bg-surface shadow-sm px-margin-page h-14 flex items-center gap-4 md:max-w-md md:mx-auto">
        <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-surface-container-high">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-surface">Catat Servis Baru</h1>
      </header>
      <Suspense fallback={<div className="p-margin-page text-center text-text-muted text-sm">Memuat...</div>}>
        <AddServiceForm />
      </Suspense>
    </>
  )
}
