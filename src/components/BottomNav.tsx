'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { label: 'Beranda', href: '/', icon: 'home' },
    { label: 'Riwayat', href: '/history', icon: 'history' },
    { label: 'Kendaraan', href: '/vehicles', icon: 'directions_bike' },
    { label: 'Profil', href: '/profile', icon: 'person' },
  ]

  if (pathname === '/add-service') return null;

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center bg-surface-card h-14 shadow-[0_-2px_8px_0_rgba(0,0,0,0.05)] md:max-w-md md:left-1/2 md:-translate-x-1/2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== '/')
        return (
          <Link 
            key={tab.href} 
            href={tab.href} 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors group ${
              isActive 
                ? 'text-primary' 
                : 'text-text-muted hover:bg-surface-container-low'
            }`}
          >
            <span 
              className={`material-symbols-outlined mb-0.5 ${isActive ? 'scale-90 duration-200' : 'group-hover:scale-110 transition-transform duration-200'}`} 
              data-icon={tab.icon} 
              data-weight={isActive ? "fill" : "outline"}
            >
              {tab.icon}
            </span>
            <span className={isActive ? 'font-label-bold text-label-bold' : 'font-label-sm text-label-sm'}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
