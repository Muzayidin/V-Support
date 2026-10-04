'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Home, History, Bike, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicleId')

  const createHref = (baseHref: string) => {
    if (!vehicleId) return baseHref
    return `${baseHref}?vehicleId=${vehicleId}`
  }

  // Sembunyikan navbar pada halaman login, welcome / onboarding, add-service, dan landing page
  if (
    pathname === '/' ||
    pathname.startsWith('/login') || 
    pathname.startsWith('/welcome') || 
    pathname.startsWith('/add-service') ||
    pathname.startsWith('/landing')
  ) {
    return null;
  }

  const tabs = [
    { label: 'Beranda', href: '/dashboard', icon: Home },
    { label: 'Riwayat', href: '/history', icon: History },
    { label: 'Kendaraan', href: '/vehicles', icon: Bike },
    { label: 'Profil', href: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-3 bg-secondary-background border-t-2 border-border shadow-[0px_-4px_0px_0px_var(--border)] z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2 bottom-nav-safe">
      {tabs.map((tab) => {
        const IconComponent = tab.icon
        const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== '/dashboard')
        return (
          <Link 
            key={tab.href} 
            href={createHref(tab.href)} 
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-[var(--radius-base)] transition-all ${
              isActive 
                ? 'text-foreground bg-main border-2 border-border font-black shadow-[2px_2px_0px_0px_var(--border)] -translate-y-0.5' 
                : 'text-foreground/70 hover:text-foreground font-bold'
            }`}
          >
            <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] uppercase mt-0.5 font-black tracking-tight">
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
