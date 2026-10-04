'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

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
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed:', err)
        })
      })
    }
  }, [])
  const isLanding = pathname === '/' || pathname === '/landing' || pathname.startsWith('/landing')
  const isAuthOrOnboarding = pathname.startsWith('/login') || pathname.startsWith('/welcome')
  const isAdmin = pathname.startsWith('/admin')

  if (isLanding || isAdmin) {
    return (
      <div suppressHydrationWarning className="min-h-screen w-full relative flex flex-col bg-background text-foreground">
        {children}
      </div>
    )
  }

  if (isAuthOrOnboarding) {
    return (
      <div suppressHydrationWarning className="min-h-screen w-full relative flex flex-col">
        {children}
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="min-h-[100dvh] w-full max-w-full overflow-x-hidden pb-safe md:max-w-md md:mx-auto md:shadow-2xl relative bg-background text-foreground">
      {children}
      <BottomNav />
    </div>
  )
}
