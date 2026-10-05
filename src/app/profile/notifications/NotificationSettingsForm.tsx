'use client'

import { useState, useTransition } from 'react'
import { updateNotificationSettings } from '@/actions/notification'
import { 
  Gauge, 
  Wrench, 
  Receipt, 
  Bell, 
  Check, 
  Loader2, 
  Volume2, 
  Calendar,
  AlertCircle,
  Clock,
  Smartphone
} from 'lucide-react'

export default function NotificationSettingsForm({
  initialSettings
}: {
  initialSettings: {
    odometerReminderDays: number
    odometerReminderTime: string
    odometerReminderEnabled: boolean
    componentReminderEnabled: boolean
    taxReminderEnabled: boolean
  }
}) {
  const [odoEnabled, setOdoEnabled] = useState(initialSettings.odometerReminderEnabled)
  const [odoDays, setOdoDays] = useState(initialSettings.odometerReminderDays || 7)
  const [odoTime, setOdoTime] = useState(initialSettings.odometerReminderTime || '09:00')
  const [compEnabled, setCompEnabled] = useState(initialSettings.componentReminderEnabled)
  const [taxEnabled, setTaxEnabled] = useState(initialSettings.taxReminderEnabled)
  
  const [isPending, startTransition] = useTransition()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePresetDays = (days: number) => {
    setOdoDays(days)
  }

  const handlePresetTime = (time: string) => {
    setOdoTime(time)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(false)
    setErrorMessage(null)

    startTransition(async () => {
      try {
        await updateNotificationSettings({
          odometerReminderDays: odoDays,
          odometerReminderTime: odoTime,
          odometerReminderEnabled: odoEnabled,
          componentReminderEnabled: compEnabled,
          taxReminderEnabled: taxEnabled
        })
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal menyimpan pengaturan notifikasi.')
      }
    })
  }

  const handleTestNotification = async () => {
    if (typeof window === 'undefined') return

    if (!('Notification' in window)) {
      alert('Browser di perangkat ini belum mendukung Notification API. Untuk pengguna iPhone/iOS, tambahkan web Cruz ke Layar Utama (Add to Home Screen) terlebih dahulu.')
      return
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert('Izin notifikasi belum diaktifkan. Silakan izinkan notifikasi pada pengaturan browser / HP Anda.')
        return
      }
    }

    // Tampilkan notifikasi via Service Worker agar muncul di status bar / lock screen HP
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready
        reg.showNotification('Cruz — Pengingat Odometer & Servis', {
          body: `Notifikasi berhasil disetel jam ${odoTime} setiap ${odoDays} hari sekali!`,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: 'cruz-test-notification',
          data: { url: '/dashboard' }
        })
        return
      } catch (e) {
        console.warn('Fallback to standard notification:', e)
      }
    }

    new Notification('Cruz — Pengingat Odometer & Servis', {
      body: `Notifikasi berhasil disetel jam ${odoTime} setiap ${odoDays} hari sekali!`,
      icon: '/icon.svg'
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {saveSuccess && (
        <div className="p-3 bg-[#8AE500] border-2 border-border text-black rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Pengaturan dan jam notifikasi berhasil disimpan!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-[#FF4D50] border-2 border-border text-white rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
          <AlertCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Info Notifikasi HP */}
      <div className="p-3.5 bg-blue-500/10 border-2 border-border rounded-[var(--radius-base)] flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-black text-foreground">
            Notifikasi Langsung di Layar HP
          </p>
          <p className="font-medium text-foreground/80 leading-relaxed text-[11px]">
            Agar notifikasi muncul di bilah notifikasi & lock screen HP, pastikan Anda telah memberikan izin notifikasi browser atau memasang Cruz ke Layar Utama (*Install PWA*).
          </p>
        </div>
      </div>

      {/* Bagian 1: Pengingat Update Odometer & Jam Notifikasi */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] shrink-0">
              <Gauge className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground">Pengingat Update Odometer</h3>
              <p className="text-[11px] font-bold text-foreground/60">
                Peringatan berkala untuk menginput angka kilometer terbaru
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={odoEnabled}
              onChange={(e) => setOdoEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-background peer-focus:outline-none border-2 border-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-foreground after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-main"></div>
          </label>
        </div>

        {odoEnabled && (
          <div className="pt-4 border-t-2 border-border space-y-5">
            {/* 1.A: Frekuensi Hari */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-foreground block">
                1. Frekuensi Notifikasi Muncul:
              </label>

              {/* Presets Hari */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { days: 3, label: 'Tiap 3 Hari' },
                  { days: 7, label: 'Tiap 7 Hari (1 Mgg)' },
                  { days: 14, label: 'Tiap 14 Hari (2 Mgg)' },
                  { days: 30, label: 'Tiap 30 Hari (1 Bln)' }
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handlePresetDays(preset.days)}
                    className={`py-2 px-2 text-xs font-black rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer ${
                      odoDays === preset.days
                        ? 'bg-main text-foreground scale-[1.02]'
                        : 'bg-background text-foreground/70 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Input Hari */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-foreground/70">Atau atur manual:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={odoDays}
                    onChange={(e) => setOdoDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-1.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-center shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                  />
                  <span className="text-xs font-black text-foreground">Hari sekali</span>
                </div>
              </div>
            </div>

            {/* 1.B: Jam Pengingat Muncul */}
            <div className="space-y-2.5 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-main stroke-[3]" />
                  2. Jam Notifikasi Muncul:
                </label>
                <span className="text-[11px] font-mono font-black px-2 py-0.5 bg-background border border-border rounded">
                  Pukul {odoTime} WIB
                </span>
              </div>

              {/* Presets Jam Populer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { time: '08:00', label: '🌅 08:00 Pagi' },
                  { time: '12:00', label: '☀️ 12:00 Siang' },
                  { time: '17:00', label: '🌇 17:00 Sore' },
                  { time: '20:00', label: '🌙 20:00 Malam' }
                ].map((preset) => (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => handlePresetTime(preset.time)}
                    className={`py-2 px-2 text-xs font-black rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer ${
                      odoTime === preset.time
                        ? 'bg-main text-foreground scale-[1.02]'
                        : 'bg-background text-foreground/70 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Time Picker Manual */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-foreground/70">Pilih jam spesifik:</span>
                <input
                  type="time"
                  value={odoTime}
                  onChange={(e) => setOdoTime(e.target.value)}
                  className="px-3 py-1.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bagian 2: Pengingat Komponen Aus / Kritis */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-base)] bg-amber-400 border-2 border-border flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] shrink-0">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Pengingat Komponen & Servis</h3>
            <p className="text-[11px] font-bold text-foreground/60">
              Notifikasi saat oli, kampas rem, ban, atau coolant melewati batas pakai
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={compEnabled}
            onChange={(e) => setCompEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-background peer-focus:outline-none border-2 border-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-foreground after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-main"></div>
        </label>
      </div>

      {/* Bagian 3: Pengingat Pajak STNK */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-base)] bg-blue-400 border-2 border-border flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] shrink-0">
            <Receipt className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Pengingat Pajak STNK</h3>
            <p className="text-[11px] font-bold text-foreground/60">
              Peringatan 30 hari sebelum jatuh tempo pajak 1 tahunan dan 5 tahunan
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={taxEnabled}
            onChange={(e) => setTaxEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-background peer-focus:outline-none border-2 border-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-foreground after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-main"></div>
        </label>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
          <span>Simpan Jadwal & Pengaturan</span>
        </button>

        <button
          type="button"
          onClick={handleTestNotification}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-secondary-background hover:bg-background text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Uji di Layar HP</span>
        </button>
      </div>
    </form>
  )
}
