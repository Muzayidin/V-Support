'use client'

import { useEffect } from 'react'
import { NotificationItem } from '@/lib/notifications'

export default function NotificationScheduler({
  scheduledTime = '09:00',
  enabled = true,
  notifications = []
}: {
  scheduledTime?: string
  enabled?: boolean
  notifications?: NotificationItem[]
}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || notifications.length === 0) {
      return
    }

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    const firePhoneNotification = async () => {
      const topNotif = notifications[0]
      if (!topNotif) return

      const todayStr = new Date().toISOString().slice(0, 10)
      const storageKey = `cruz_notif_fired_${todayStr}`
      
      // Cegah notifikasi ganda di hari yang sama
      if (localStorage.getItem(storageKey)) {
        return
      }

      const notifTitle = `Cruz: ${topNotif.title}`
      const notifOptions: any = {
        body: topNotif.message,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: `cruz-${topNotif.id}`,
        renotify: true,
        data: { url: topNotif.actionUrl || '/dashboard' }
      }

      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready
          await reg.showNotification(notifTitle, notifOptions)
          localStorage.setItem(storageKey, 'true')
          return
        } catch (e) {
          console.warn('SW notification failed, falling back:', e)
        }
      }

      try {
        new Notification(notifTitle, notifOptions)
        localStorage.setItem(storageKey, 'true')
      } catch (err) {
        console.warn('Notification error:', err)
      }
    }

    // Hitung waktu jadwal
    const [targetHour, targetMinute] = (scheduledTime || '09:00')
      .split(':')
      .map((n) => parseInt(n, 10) || 0)

    const now = new Date()
    const scheduledToday = new Date()
    scheduledToday.setHours(targetHour, targetMinute, 0, 0)

    // Jika waktu hari ini sudah lewat atau tepat sekarang -> Munculkan notifikasi
    if (now >= scheduledToday) {
      firePhoneNotification()
    } else {
      // Jika jam belum tiba hari ini -> Pasang timer untuk memicu saat jam tiba
      const delayMs = scheduledToday.getTime() - now.getTime()
      const timer = setTimeout(() => {
        firePhoneNotification()
      }, delayMs)

      return () => clearTimeout(timer)
    }
  }, [scheduledTime, enabled, notifications])

  return null
}
