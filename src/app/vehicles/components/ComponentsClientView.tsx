'use client'

import { useState, useMemo } from 'react'
import { ComponentStatus } from '@/lib/calculations'
import Link from 'next/link'
import ConfirmComponentHealthModal from '@/components/ConfirmComponentHealthModal'
import { 
  Fuel, 
  Gauge, 
  Zap, 
  Wrench, 
  Droplets, 
  Disc, 
  CircleDot, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Plus,
  ClipboardCheck,
  ShieldCheck
} from 'lucide-react'

interface Props {
  components: ComponentStatus[]
  currentMileage: number
  vehicleId: string
}

export default function ComponentsClientView({ components, currentMileage, vehicleId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCompForCheck, setSelectedCompForCheck] = useState<ComponentStatus | null>(null)

  // Kategori unik
  const categories = useMemo(() => {
    const cats = Array.from(new Set(components.map(c => c.category)))
    return ['Semua', 'Perlu Cek', ...cats]
  }, [components])

  // Filter komponen
  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      // Filter kategori
      if (selectedCategory === 'Perlu Cek') {
        if (comp.status !== 'CRITICAL' && comp.status !== 'WARNING') return false
      } else if (selectedCategory !== 'Semua') {
        if (comp.category !== selectedCategory) return false
      }

      // Filter search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = comp.name.toLowerCase().includes(q)
        const matchCategory = comp.category.toLowerCase().includes(q)
        const matchAdvice = comp.advice.toLowerCase().includes(q)
        return matchName || matchCategory || matchAdvice
      }

      return true
    })
  }, [components, selectedCategory, searchQuery])

  const getConditionBadge = (val: number) => {
    if (val >= 70) return "text-black bg-[#8AE500] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
    if (val >= 40) return "text-black bg-[#FACC00] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
    return "text-black bg-[#FF4D50] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
  }

  const getConditionBarColor = (val: number) => {
    if (val >= 70) return "bg-[#8AE500]"
    if (val >= 40) return "bg-[#FACC00]"
    return "bg-[#FF4D50]"
  }

  const getCategoryIcon = (category: string) => {
    if (category === 'Pelumasan') return <Fuel className="w-4 h-4 stroke-[2.5]" />
    if (category === 'CVT & Transmisi') return <Gauge className="w-4 h-4 stroke-[2.5]" />
    if (category === 'Sistem Bahan Bakar') return <Fuel className="w-4 h-4 stroke-[2.5]" />
    if (category === 'Pengapian & Kelistrikan') return <Zap className="w-4 h-4 stroke-[2.5]" />
    if (category === 'Mesin & Pembakaran') return <Wrench className="w-4 h-4 stroke-[2.5]" />
    if (category === 'Pendinginan') return <Droplets className="w-4 h-4 stroke-[2.5]" />
    if (category === 'Pengereman') return <Disc className="w-4 h-4 stroke-[2.5]" />
    if (category === 'Penyalur Tenaga') return <CircleDot className="w-4 h-4 stroke-[2.5]" />
    if (category.includes('Kaki-kaki') || category.includes('Ban')) return <CircleDot className="w-4 h-4 stroke-[2.5]" />
    if (category.includes('EV')) return <Zap className="w-4 h-4 stroke-[2.5]" />
    return <Wrench className="w-4 h-4 stroke-[2.5]" />
  }

  const criticalCount = components.filter(c => c.status === 'CRITICAL' || c.status === 'WARNING').length

  return (
    <div className="space-y-3.5">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari komponen (contoh: CVT, Oli, Injeksi, Busi)..."
          className="w-full pl-9 pr-3.5 py-2.5 bg-secondary-background border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/50 focus:outline-hidden focus:shadow-[3px_3px_0px_0px_var(--border)]"
        />
        <Search className="w-4 h-4 stroke-[2.5] text-foreground/50 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-[11px] font-black">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat
          const isUrgentTab = cat === 'Perlu Cek'
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[var(--radius-base)] border-2 border-border whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]'
                  : isUrgentTab && criticalCount > 0
                    ? 'bg-[#FF4D50] text-black shadow-[1px_1px_0px_0px_var(--border)]'
                    : 'bg-secondary-background text-foreground/80 hover:bg-main/30'
              }`}
            >
              <span>{cat}</span>
              {isUrgentTab && criticalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-black text-white text-[9px] rounded-full">
                  {criticalCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* List Komponen */}
      <div className="space-y-3 pt-1">
        {filteredComponents.length === 0 ? (
          <div className="p-8 text-center bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#8AE500]" />
            <h3 className="text-sm font-black text-foreground">Tidak Ada Komponen Ditemukan</h3>
            <p className="text-xs text-foreground/70">
              {searchQuery ? 'Coba gunakan kata kunci pencarian yang lain.' : 'Semua komponen dalam kategori ini dalam kondisi prima!'}
            </p>
          </div>
        ) : (
          filteredComponents.map((comp) => {
            const isOverdue = comp.remainingKm < 0
            return (
              <div 
                key={comp.id} 
                className="p-3.5 sm:p-4 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] sm:shadow-[4px_4px_0px_0px_var(--border)] space-y-2.5 text-foreground"
              >
                {/* Header Komponen */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-[var(--radius-base)] bg-background border border-border flex items-center justify-center text-foreground shrink-0 shadow-[1px_1px_0px_0px_var(--border)]">
                        {getCategoryIcon(comp.category)}
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-foreground">{comp.name}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-foreground/75 bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)]">
                        Kategori: {comp.category}
                      </span>
                      <span className="text-[10px] font-bold text-foreground/75 bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)]">
                        Interval: {comp.intervalKm.toLocaleString('id-ID')} KM
                      </span>
                      {comp.isCustomInterval ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-[#0099FF] text-white border border-border rounded-[var(--radius-base)]">
                          Kustom
                        </span>
                      ) : (
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-[#FACC00] text-black border border-border rounded-[var(--radius-base)]">
                          Pabrikan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-[var(--radius-base)] text-xs font-black ${getConditionBadge(comp.currentCondition)}`}>
                      {comp.currentCondition}%
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-[var(--radius-base)] border border-border ${
                      isOverdue 
                        ? 'bg-[#FF4D50] text-black font-black' 
                        : comp.remainingKm <= 500 
                          ? 'bg-[#FACC00] text-black font-black' 
                          : 'bg-background text-foreground'
                    }`}>
                      {isOverdue 
                        ? `Terlewat ${Math.abs(comp.remainingKm).toLocaleString('id-ID')} KM` 
                        : `Sisa ${comp.remainingKm.toLocaleString('id-ID')} KM`
                      }
                    </span>
                  </div>
                </div>

                {/* Progress Bar Kondisi */}
                <div className="w-full h-3 bg-background border-2 border-border rounded-[var(--radius-base)] overflow-hidden">
                  <div 
                    className={`h-full ${getConditionBarColor(comp.currentCondition)} border-r-2 border-border transition-all duration-500`} 
                    style={{ width: `${comp.currentCondition}%` }}
                  />
                </div>

                {/* Deskripsi & Saran */}
                <div className="p-2.5 bg-background border border-border rounded-[var(--radius-base)] text-[11px] leading-relaxed font-bold text-foreground/85">
                  <p>{comp.advice}</p>
                  {comp.lastServiceDate && (
                    <span className="text-[10px] text-foreground/60 block mt-1 pt-1 border-t border-border/50">
                      Terakhir servis: {new Date(comp.lastServiceDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} 
                      {comp.lastServiceMileage ? ` (di KM ${comp.lastServiceMileage.toLocaleString('id-ID')})` : ''}
                    </span>
                  )}
                </div>

                {/* Riwayat Pengecekan Fisik Terakhir (Jika ada) */}
                {comp.lastInspectionDate && (
                  <div className="p-2.5 bg-main/20 border-2 border-border rounded-[var(--radius-base)] text-[10px] font-bold flex items-start gap-2 shadow-[1px_1px_0px_0px_var(--border)]">
                    <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[2.5]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-[9px] uppercase tracking-wider bg-black text-white px-1.5 py-0.2 rounded-[var(--radius-base)]">
                          Terverifikasi Fisik
                        </span>
                        <span className="font-black text-foreground">
                          {comp.lastInspectionRole === 'MECHANIC' ? 'Mekanik Bengkel' : 'Pengguna'}
                        </span>
                        <span className="text-foreground/70">
                          • {new Date(comp.lastInspectionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {comp.lastInspectionMileage ? ` (KM ${comp.lastInspectionMileage.toLocaleString('id-ID')})` : ''}
                        </span>
                      </div>
                      {comp.lastInspectionNotes && (
                        <p className="text-[10px] font-bold text-foreground/90 mt-1 pl-1.5 border-l-2 border-border italic">
                          "{comp.lastInspectionNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Aksi Tombol Komponen: Cek Kelayakan & Catat Servis */}
                <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setSelectedCompForCheck(comp)}
                    className="flex-1 py-2 px-2.5 bg-main hover:bg-[#8AE500] text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-[11px] font-black flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Konfirmasi kelayakan fisik komponen dan sesuaikan persentase kondisi"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Cek Kelayakan (Atur %)</span>
                  </button>

                  <Link
                    href={`/add-service?vehicleId=${vehicleId}`}
                    className="py-2 px-3 bg-background hover:bg-main/30 text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] rounded-[var(--radius-base)] text-[11px] font-black flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                    title="Catat servis penggantian komponen ini"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Servis</span>
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Action: Catat Servis Umum */}
      <div className="pt-2">
        <Link
          href={`/add-service?vehicleId=${vehicleId}`}
          className="w-full py-3 bg-secondary-background hover:bg-main text-foreground hover:text-black rounded-[var(--radius-base)] font-black text-xs uppercase tracking-wider border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Catat Servis Berkala Baru</span>
        </Link>
      </div>

      {/* Modal Konfirmasi Kelayakan Komponen */}
      <ConfirmComponentHealthModal
        isOpen={selectedCompForCheck !== null}
        onClose={() => setSelectedCompForCheck(null)}
        vehicleId={vehicleId}
        currentMileage={currentMileage}
        component={selectedCompForCheck}
      />
    </div>
  )
}

