'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'
import CookieConsent from './CookieConsent'
import SplashScreen from './SplashScreen'
import OfflineSyncBar from './OfflineSyncBar'

export default function AppShell({ 
  children,
  isAuthenticated = false
}: { 
  children: React.ReactNode
  isAuthenticated?: boolean
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
          console.warn('SW registration failed:', err)
        })
      }
      if (document.readyState === 'complete') {
        registerSW()
      } else {
        window.addEventListener('load', registerSW)
      }
    }
  }, [])
  const isLanding = pathname === '/' || pathname === '/landing' || pathname.startsWith('/landing')
  const isAuthOrOnboarding = pathname.startsWith('/login') || pathname.startsWith('/welcome')
  const isAdmin = pathname.startsWith('/admin')

  if (isLanding || isAdmin) {
    return (
      <div suppressHydrationWarning className="min-h-screen w-full relative flex flex-col bg-background text-foreground">
        <SplashScreen />
        {children}
        <OfflineSyncBar />
        <CookieConsent />
      </div>
    )
  }

  if (isAuthOrOnboarding) {
    return (
      <div suppressHydrationWarning className="min-h-screen w-full relative flex flex-col">
        <SplashScreen />
        {children}
        <OfflineSyncBar />
        <CookieConsent />
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="min-h-[100dvh] w-full max-w-full overflow-x-hidden pb-safe md:max-w-md md:mx-auto md:shadow-2xl relative bg-background text-foreground">
      <SplashScreen />
      {children}
      <OfflineSyncBar />
      <BottomNav />
      <CookieConsent />
    </div>
  )
}
