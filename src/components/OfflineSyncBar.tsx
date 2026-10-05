'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { WifiOff, CheckCircle2, RefreshCw, CloudAlert } from 'lucide-react'
import { getOfflineQueue, syncOfflineQueue } from '@/lib/offlineSync'

export default function OfflineSyncBar() {
  const pathname = usePathname()
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [queueCount, setQueueCount] = useState(0)
  const [showSyncedSuccess, setShowSyncedSuccess] = useState(false)

  // Apakah BottomNav aktif di route saat ini?
  const isBottomNavVisible = !(
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/welcome') ||
    pathname.startsWith('/add-service') ||
    pathname.startsWith('/landing')
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Init online status & pending queue
    setIsOnline(navigator.onLine)
    setQueueCount(getOfflineQueue().length)

    const handleOnline = () => {
      setIsOnline(true)
      // Otomatis sinkronkan data offline ketika terhubung kembali ke internet
      const currentQueue = getOfflineQueue()
      if (currentQueue.length > 0) {
        setSyncStatus('syncing')
        syncOfflineQueue().then((res) => {
          if (res.success) {
            setSyncStatus('synced')
            setShowSyncedSuccess(true)
            setTimeout(() => {
              setShowSyncedSuccess(false)
              setSyncStatus('idle')
            }, 3500)
          } else {
            setSyncStatus('error')
          }
        })
      } else {
        // Jika tidak ada data yang perlu disinkronkan, tampilkan status terhubung sejenak lalu sembunyikan
        setShowSyncedSuccess(true)
        setTimeout(() => {
          setShowSyncedSuccess(false)
        }, 3000)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowSyncedSuccess(false)
      setSyncStatus('idle')
      setQueueCount(getOfflineQueue().length)
    }

    const handleQueueUpdate = (e: any) => {
      const count = e?.detail?.count ?? getOfflineQueue().length
      setQueueCount(count)
    }

    const handleCustomSyncStatus = (e: any) => {
      const status = e?.detail?.status
      if (status === 'syncing') {
        setSyncStatus('syncing')
      } else if (status === 'synced') {
        setSyncStatus('synced')
        setQueueCount(0)
        setShowSyncedSuccess(true)
        setTimeout(() => {
          setShowSyncedSuccess(false)
          setSyncStatus('idle')
        }, 3500)
      } else if (status === 'error') {
        setSyncStatus('error')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('cruz_offline_queue_updated', handleQueueUpdate)
    window.addEventListener('cruz_sync_status', handleCustomSyncStatus)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('cruz_offline_queue_updated', handleQueueUpdate)
      window.removeEventListener('cruz_sync_status', handleCustomSyncStatus)
    }
  }, [])

  // Jika online dan tidak sedang menampilkan sukses/syncing/error, sembunyikan bar
  if (isOnline && !showSyncedSuccess && syncStatus !== 'syncing' && syncStatus !== 'error') {
    return null
  }

  // Tentukan posisi vertikal tepat di atas menu navigasi dengan memperhitungkan safe-area-bottom iPhone
  const bottomPositionClass = isBottomNavVisible 
    ? 'bottom-[calc(4.5rem+var(--safe-area-bottom,0px))]' 
    : 'bottom-[calc(1rem+var(--safe-area-bottom,0px))]'

  return (
    <aside
      aria-label="Status Koneksi dan Sinkronisasi"
      className={`fixed ${bottomPositionClass} left-0 w-full z-50 px-3 pointer-events-none md:max-w-md md:left-1/2 md:-translate-x-1/2 transition-all duration-300 animate-in slide-in-from-bottom-2`}
    >
      <div className="pointer-events-auto">
        {!isOnline ? (
          // Status: Offline
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-amber-400 text-black border-2 border-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2 min-w-0">
              <WifiOff className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <div className="truncate">
                <p className="text-[11px] font-black tracking-tight leading-tight">
                  Tidak terhubung internet
                </p>
                <p className="text-[10px] font-bold text-black/75 leading-tight">
                  {queueCount > 0
                    ? `${queueCount} data tersimpan lokal, akan disinkron saat online`
                    : 'Aplikasi berjalan dalam mode offline'}
                </p>
              </div>
            </div>
            {queueCount > 0 && (
              <span className="shrink-0 text-[10px] font-black bg-black text-amber-300 px-1.5 py-0.5 rounded border border-black">
                {queueCount} Antrean
              </span>
            )}
          </div>
        ) : syncStatus === 'syncing' ? (
          // Status: Sedang Menyinkronkan
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-blue-400 text-black border-2 border-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2 min-w-0">
              <RefreshCw className="w-4 h-4 shrink-0 stroke-[2.5] animate-spin" />
              <div className="truncate">
                <p className="text-[11px] font-black tracking-tight leading-tight">
                  Menyinkronkan data terbaru...
                </p>
                <p className="text-[10px] font-bold text-black/75 leading-tight">
                  Mengirimkan data tersimpan ke server
                </p>
              </div>
            </div>
          </div>
        ) : syncStatus === 'error' ? (
          // Status: Sinkronisasi Gagal / Retry
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-red-400 text-black border-2 border-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2 min-w-0">
              <CloudAlert className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <div className="truncate">
                <p className="text-[11px] font-black tracking-tight leading-tight">
                  Gagal sinkronisasi data
                </p>
                <p className="text-[10px] font-bold text-black/75 leading-tight">
                  Akan dicoba kembali secara otomatis
                </p>
              </div>
            </div>
            <button
              onClick={() => syncOfflineQueue()}
              className="shrink-0 text-[10px] font-black bg-white hover:bg-neutral-100 px-2 py-1 rounded border-2 border-black shadow-[1px_1px_0px_0px_#000]"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          // Status: Terhubung kembali & Selesai Sinkronisasi (akan hilang otomatis)
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-emerald-400 text-black border-2 border-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_#000] animate-in fade-in duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <div className="truncate">
                <p className="text-[11px] font-black tracking-tight leading-tight">
                  Terhubung kembali ke internet
                </p>
                <p className="text-[10px] font-bold text-black/75 leading-tight">
                  Semua data telah disinkronkan ke server
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
