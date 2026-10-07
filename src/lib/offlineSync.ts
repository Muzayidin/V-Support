/**
 * Cruz Offline Queue & Data Synchronization Engine
 * Menyimpan mutasi data saat tidak ada internet dan menyinkronkannya kembali ke server.
 */

export type OfflineActionType = 'UPDATE_ODOMETER' | 'ADD_SERVICE_RECORD' | 'CONFIRM_COMPONENT_HEALTH'

export interface OfflineQueueItem {
  id: string
  type: OfflineActionType
  timestamp: number
  description: string
  payload: any
}

const QUEUE_STORAGE_KEY = 'cruz_offline_queue'
const VEHICLES_CACHE_KEY = 'cruz_cached_vehicles'

/**
 * Mengambil antrean aksi offline
 */
export function getOfflineQueue(): OfflineQueueItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Menyimpan antrean ke localStorage dan memancarkan event pembaruan
 */
function setOfflineQueue(queue: OfflineQueueItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
    window.dispatchEvent(new CustomEvent('cruz_offline_queue_updated', { detail: { count: queue.length } }))
  } catch (err) {
    console.error('Failed to save offline queue:', err)
  }
}

/**
 * Menambahkan aksi ke antrean offline
 */
export function enqueueOfflineAction(
  type: OfflineActionType,
  payload: any,
  description: string
): OfflineQueueItem {
  const item: OfflineQueueItem = {
    id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    timestamp: Date.now(),
    description,
    payload
  }

  const currentQueue = getOfflineQueue()
  if (type === 'UPDATE_ODOMETER') {
    const filtered = currentQueue.filter(
      (q) => !(q.type === 'UPDATE_ODOMETER' && q.payload?.vehicleId === payload.vehicleId)
    )
    setOfflineQueue([...filtered, item])
  } else if (type === 'CONFIRM_COMPONENT_HEALTH') {
    const filtered = currentQueue.filter(
      (q) => !(q.type === 'CONFIRM_COMPONENT_HEALTH' && q.payload?.vehicleId === payload.vehicleId && q.payload?.componentId === payload.componentId)
    )
    setOfflineQueue([...filtered, item])
  } else {
    setOfflineQueue([...currentQueue, item])
  }

  return item
}

/**
 * Cache daftar kendaraan lokal untuk fallback saat offline
 */
export function cacheVehiclesLocally(vehicles: any[]) {
  if (typeof window === 'undefined' || !Array.isArray(vehicles) || vehicles.length === 0) return
  try {
    localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(vehicles))
  } catch (err) {
    console.warn('Failed to cache vehicles locally:', err)
  }
}

/**
 * Mengambil daftar kendaraan lokal saat offline
 */
export function getCachedVehicles(): any[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(VEHICLES_CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Memperbarui angka odometer di cache lokal secara optimistik saat offline
 */
export function updateCachedVehicleOdometer(vehicleId: string, newMileage: number) {
  if (typeof window === 'undefined') return
  try {
    const vehicles = getCachedVehicles()
    const updated = vehicles.map((v) => {
      if (v.id === vehicleId) {
        return { ...v, currentMileage: newMileage }
      }
      return v
    })
    cacheVehiclesLocally(updated)
  } catch (err) {
    console.warn('Failed to update local vehicle cache:', err)
  }
}

/**
 * Menyinkronkan seluruh antrean offline ke server
 */
export async function syncOfflineQueue(): Promise<{
  success: boolean
  syncedCount: number
  errorCount: number
}> {
  const queue = getOfflineQueue()
  if (queue.length === 0) {
    return { success: true, syncedCount: 0, errorCount: 0 }
  }

  // Beritahu UI bahwa sinkronisasi sedang berjalan
  window.dispatchEvent(new CustomEvent('cruz_sync_status', { detail: { status: 'syncing', count: queue.length } }))

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: queue })
    })

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`)
    }

    const data = await res.json()
    const syncedCount = data.processedCount || 0
    const errors = data.errors || []

    if (errors.length > 0) {
      // Pertahankan item yang gagal dalam antrean
      const failedIds = new Set(errors.map((e: any) => e.id))
      const remainingQueue = queue.filter((item) => failedIds.has(item.id))
      setOfflineQueue(remainingQueue)
    } else {
      // Semua item berhasil disinkronkan, kosongkan antrean
      setOfflineQueue([])
    }

    window.dispatchEvent(
      new CustomEvent('cruz_sync_status', {
        detail: {
          status: 'synced',
          count: syncedCount
        }
      })
    )

    return {
      success: errors.length === 0,
      syncedCount,
      errorCount: errors.length
    }
  } catch (err) {
    console.error('Failed to sync offline queue:', err)
    window.dispatchEvent(new CustomEvent('cruz_sync_status', { detail: { status: 'error', count: queue.length } }))
    return {
      success: false,
      syncedCount: 0,
      errorCount: queue.length
    }
  }
}
