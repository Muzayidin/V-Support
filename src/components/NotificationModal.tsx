'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NotificationItem } from '@/lib/notifications'
import { updateVehicle } from '@/actions/vehicle'
import { formatThousands, parseThousands } from '@/lib/formatters'
import { 
  Bell, 
  X, 
  Settings, 
  Gauge, 
  AlertTriangle, 
  Wrench, 
  Receipt, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Save,
  Volume2
} from 'lucide-react'

export default function NotificationModal({
  notifications,
  counts,
  vehicles = []
}: {
  notifications: NotificationItem[]
  counts: {
    total: number
    odometer: number
    components: number
    tax: number
    critical: number
  }
  vehicles?: { id: string; name: string; currentMileage: number }[]
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'ALL' | 'ODOMETER' | 'COMPONENTS' | 'TAX'>('ALL')
  
  // Quick odometer update state within modal
  const [editingOdoVehicleId, setEditingOdoVehicleId] = useState<string | null>(null)
  const [odoInput, setOdoInput] = useState('')
  const [odoError, setOdoError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Browser Web Notification Permission state
  const [hasWebNotification, setHasWebNotification] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted'
    }
    return false
  })

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser Anda tidak mendukung Web Notification API.')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setHasWebNotification(true)
        new Notification('Cruz — Pengingat Aktif', {
          body: 'Notifikasi berhasil diaktifkan! Anda akan menerima pengingat servis dan odometer.',
          icon: '/icon.svg'
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleStartEditOdo = (vehicleId: string) => {
    const v = vehicles.find((item) => item.id === vehicleId)
    setEditingOdoVehicleId(vehicleId)
    setOdoInput(v ? formatThousands(v.currentMileage) : '')
    setOdoError(null)
  }

  const handleSaveOdo = (vehicleId: string) => {
    const v = vehicles.find((item) => item.id === vehicleId)
    const currentKm = v ? v.currentMileage : 0
    const newKm = parseThousands(odoInput)

    if (newKm < currentKm) {
      setOdoError(`Odometer baru tidak boleh lebih kecil dari sebelumnya (${formatThousands(currentKm)} km).`)
      return
    }

    setOdoError(null)
    startTransition(async () => {
      try {
        const res = await updateVehicle(vehicleId, { currentMileage: newKm })
        if (res.success) {
          setEditingOdoVehicleId(null)
          router.refresh()
        }
      } catch (err: any) {
        setOdoError(err.message || 'Gagal memperbarui odometer.')
      }
    })
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'ODOMETER') return n.type === 'ODOMETER'
    if (activeTab === 'COMPONENTS') return n.type.startsWith('COMPONENT')
    if (activeTab === 'TAX') return n.type === 'TAX'
    return true
  })

  return (
    <>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-[var(--radius-base)] border-2 border-border bg-secondary-background hover:bg-background shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        title="Buka Pusat Notifikasi"
        aria-label="Notifikasi"
      >
        <Bell className="w-5 h-5 text-foreground stroke-[2.2]" />
        {counts.total > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white border-2 border-border text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {counts.total > 9 ? '9+' : counts.total}
          </span>
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-background border-2 border-border shadow-[8px_8px_0px_0px_var(--border)] rounded-[var(--radius-base)] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-border bg-secondary-background">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-foreground tracking-tight">
                    Pusat Notifikasi
                  </h2>
                  <p className="text-[11px] font-bold text-foreground/60">
                    {counts.total} peringatan aktif terdeteksi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Link
                  href="/profile/notifications"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-[var(--radius-base)] border-2 border-border bg-background hover:bg-slate-200 text-foreground transition-all shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                  title="Atur Frekuensi & Preferensi Notifikasi"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-[var(--radius-base)] border-2 border-border bg-background hover:bg-red-500 hover:text-white text-foreground transition-all shadow-[1.5px_1.5px_0px_0px_var(--border)] cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Browser Push Permission Banner (if not yet granted) */}
            {!hasWebNotification && typeof window !== 'undefined' && 'Notification' in window && (
              <div className="px-4 py-2.5 bg-amber-400/20 border-b-2 border-border flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-[11px]">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Aktifkan pengingat browser agar tidak lupa servis</span>
                </div>
                <button
                  onClick={requestNotificationPermission}
                  className="px-2.5 py-1 bg-amber-400 text-black border-2 border-border font-black text-[10px] rounded-[var(--radius-base)] shadow-[1.5px_1.5px_0px_0px_var(--border)] shrink-0 cursor-pointer hover:bg-amber-300"
                >
                  Aktifkan
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-3 border-b-2 border-border bg-secondary-background/60 overflow-x-auto text-xs font-black">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1 rounded-[var(--radius-base)] border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)] whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-main text-foreground'
                    : 'bg-background text-foreground/70 hover:bg-slate-200'
                }`}
              >
                Semua ({counts.total})
              </button>
              <button
                onClick={() => setActiveTab('ODOMETER')}
                className={`px-3 py-1 rounded-[var(--radius-base)] border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)] whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'ODOMETER'
                    ? 'bg-main text-foreground'
                    : 'bg-background text-foreground/70 hover:bg-slate-200'
                }`}
              >
                Odometer ({counts.odometer})
              </button>
              <button
                onClick={() => setActiveTab('COMPONENTS')}
                className={`px-3 py-1 rounded-[var(--radius-base)] border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)] whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'COMPONENTS'
                    ? 'bg-main text-foreground'
                    : 'bg-background text-foreground/70 hover:bg-slate-200'
                }`}
              >
                Komponen ({counts.components})
              </button>
              <button
                onClick={() => setActiveTab('TAX')}
                className={`px-3 py-1 rounded-[var(--radius-base)] border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)] whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'TAX'
                    ? 'bg-main text-foreground'
                    : 'bg-background text-foreground/70 hover:bg-slate-200'
                }`}
              >
                Pajak ({counts.tax})
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-[var(--radius-base)] bg-emerald-400/20 text-emerald-600 border-2 border-border mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_var(--border)]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground">Semua Terkendali!</h3>
                    <p className="text-xs font-bold text-foreground/60 max-w-xs mx-auto mt-1">
                      Tidak ada pengingat odometer maupun komponen yang membutuhkan tindakan mendesak saat ini.
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isOdometer = notif.type === 'ODOMETER'
                  const isCritical = notif.type === 'COMPONENT_CRITICAL'
                  const isWarning = notif.type === 'COMPONENT_WARNING'
                  const isTax = notif.type === 'TAX'

                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2.5 transition-all ${
                        isCritical
                          ? 'bg-red-500/10 border-red-500/80'
                          : isOdometer
                          ? 'bg-main/15'
                          : 'bg-secondary-background'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_var(--border)] ${
                              isCritical
                                ? 'bg-red-500 text-white'
                                : isOdometer
                                ? 'bg-main text-black'
                                : isTax
                                ? 'bg-amber-400 text-black'
                                : 'bg-background text-foreground'
                            }`}
                          >
                            {isOdometer && <Gauge className="w-4 h-4 stroke-[2.5]" />}
                            {isCritical && <AlertTriangle className="w-4 h-4 stroke-[2.5]" />}
                            {isWarning && <Wrench className="w-4 h-4 stroke-[2.5]" />}
                            {isTax && <Receipt className="w-4 h-4 stroke-[2.5]" />}
                          </div>

                          <div>
                            <span
                              className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded border border-border inline-block ${
                                isCritical
                                  ? 'bg-red-500 text-white'
                                  : isOdometer
                                  ? 'bg-main text-black'
                                  : 'bg-background text-foreground'
                              }`}
                            >
                              {isCritical
                                ? 'Wajib Ganti'
                                : isWarning
                                ? 'Perlu Dicek'
                                : isOdometer
                                ? 'Update Odometer'
                                : 'Pajak STNK'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-foreground/60">
                          {notif.date}
                        </span>
                      </div>

                      {/* Title & Message */}
                      <div>
                        <h4 className="text-xs font-black text-foreground">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] font-medium text-foreground/80 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>

                      {/* Component Condition Progress Bar (if component) */}
                      {typeof notif.currentCondition === 'number' && (
                        <div className="space-y-1 pt-0.5">
                          <div className="flex justify-between text-[10px] font-black">
                            <span className="text-foreground/70">Kondisi Komponen:</span>
                            <span className={notif.currentCondition <= 20 ? 'text-red-600' : 'text-amber-600'}>
                              {notif.currentCondition}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-background rounded-full border border-border overflow-hidden">
                            <div
                              className={`h-full ${
                                notif.currentCondition <= 20
                                  ? 'bg-red-500'
                                  : notif.currentCondition <= 40
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.max(5, notif.currentCondition)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Area */}
                      <div className="pt-1 flex flex-col gap-2">
                        {isOdometer ? (
                          editingOdoVehicleId === notif.vehicleId ? (
                            <div className="p-2 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-2">
                              {odoError && (
                                <p className="text-[10px] text-red-600 font-bold">{odoError}</p>
                              )}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={odoInput}
                                  onChange={(e) => setOdoInput(formatThousands(e.target.value))}
                                  placeholder="KM saat ini..."
                                  className="flex-1 px-2.5 py-1 text-xs font-black bg-secondary-background border border-border rounded focus:outline-none"
                                />
                                <button
                                  onClick={() => handleSaveOdo(notif.vehicleId)}
                                  disabled={isPending}
                                  className="px-3 py-1 bg-main text-foreground border border-border rounded text-xs font-black flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  {isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Save className="w-3 h-3" />
                                  )}
                                  Simpan
                                </button>
                                <button
                                  onClick={() => setEditingOdoVehicleId(null)}
                                  className="px-2 py-1 bg-background text-foreground/70 border border-border rounded text-xs font-bold cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditOdo(notif.vehicleId)}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                            >
                              <Gauge className="w-3.5 h-3.5" />
                              <span>Perbarui Odometer Sekarang</span>
                            </button>
                          )
                        ) : notif.actionUrl ? (
                          <Link
                            href={notif.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-background hover:bg-slate-200 text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                          >
                            <span>{notif.actionLabel || 'Lihat Detail'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t-2 border-border bg-secondary-background flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-foreground/70">
                Cruz Smart Reminder Engine
              </span>
              <Link
                href="/profile/notifications"
                onClick={() => setIsOpen(false)}
                className="font-black text-foreground hover:underline flex items-center gap-1 text-[11px]"
              >
                Atur Pengingat
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
