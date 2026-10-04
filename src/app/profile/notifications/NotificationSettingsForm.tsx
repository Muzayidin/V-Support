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
  AlertCircle
} from 'lucide-react'

export default function NotificationSettingsForm({
  initialSettings
}: {
  initialSettings: {
    odometerReminderDays: number
    odometerReminderEnabled: boolean
    componentReminderEnabled: boolean
    taxReminderEnabled: boolean
  }
}) {
  const [odoEnabled, setOdoEnabled] = useState(initialSettings.odometerReminderEnabled)
  const [odoDays, setOdoDays] = useState(initialSettings.odometerReminderDays || 7)
  const [compEnabled, setCompEnabled] = useState(initialSettings.componentReminderEnabled)
  const [taxEnabled, setTaxEnabled] = useState(initialSettings.taxReminderEnabled)
  
  const [isPending, startTransition] = useTransition()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePresetDays = (days: number) => {
    setOdoDays(days)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(false)
    setErrorMessage(null)

    startTransition(async () => {
      try {
        await updateNotificationSettings({
          odometerReminderDays: odoDays,
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
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser Anda tidak mendukung Web Notification API.')
      return
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert('Izin notifikasi ditolak oleh browser Anda. Aktifkan izin notifikasi di setelan browser.')
        return
      }
    }

    new Notification('Cruz — Pengingat Odometer & Servis', {
      body: `Pengingat Anda diatur setiap ${odoDays} hari. Kami akan mengingatkan Anda saat komponen perlu diservis!`,
      icon: '/icon.svg'
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Pengaturan notifikasi berhasil disimpan!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border-2 border-red-500 text-red-600 rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bagian 1: Pengingat Update Odometer */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
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
          <div className="pt-3 border-t-2 border-border space-y-3">
            <label className="text-xs font-black text-foreground block">
              Frekuensi Notifikasi Muncul:
            </label>

            {/* Presets */}
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

            {/* Custom Input */}
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
          <span>Simpan Pengaturan Notifikasi</span>
        </button>

        <button
          type="button"
          onClick={handleTestNotification}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-secondary-background hover:bg-background text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Uji Notifikasi Browser</span>
        </button>
      </div>
    </form>
  )
}
