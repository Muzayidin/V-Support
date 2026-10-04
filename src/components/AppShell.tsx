'use client'

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
  const isLanding = pathname === '/' || pathname === '/landing' || pathname.startsWith('/landing')
  const isAuthOrOnboarding = pathname.startsWith('/login') || pathname.startsWith('/welcome')

  if (isLanding) {
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
