'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  Wrench, 
  Receipt, 
  Terminal,
  MessageSquareHeart 
} from 'lucide-react'

export type AdminTabType = 'overview' | 'users' | 'vehicles' | 'services' | 'taxes' | 'feedback' | 'system'

interface AdminTabsProps {
  activeTab: AdminTabType
  counts: {
    users: number
    vehicles: number
    services: number
    taxes: number
    feedback?: number
  }
}

export default function AdminTabs({ activeTab, counts }: AdminTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tabs: Array<{
    id: AdminTabType
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
  }> = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'users', label: 'Pengguna', icon: Users, badge: counts.users },
    { id: 'vehicles', label: 'Kendaraan', icon: Bike, badge: counts.vehicles },
    { id: 'services', label: 'Riwayat Servis', icon: Wrench, badge: counts.services },
    { id: 'taxes', label: 'Pajak STNK', icon: Receipt, badge: counts.taxes },
    { id: 'feedback', label: 'Kritik & Saran', icon: MessageSquareHeart, badge: counts.feedback },
    { id: 'system', label: 'Sistem & Tools', icon: Terminal },
  ]

  const handleSelectTab = (tabId: AdminTabType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabId)
    router.push(`/admin?${params.toString()}`)
  }

  return (
    <div className="w-full bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-1.5 shadow-[4px_4px_0px_0px_var(--border)] overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-main text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] -translate-y-0.5'
                  : 'bg-transparent text-foreground/70 hover:text-foreground hover:bg-background/60 border-2 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black border ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-background text-foreground/70 border-border'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
