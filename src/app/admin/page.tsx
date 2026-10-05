import prisma from '@/lib/prisma'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import { getVerifiedDeveloper } from '@/lib/admin'
import AccessDenied from './AccessDenied'
import AdminTabs, { AdminTabType } from './AdminTabs'
import UserTable, { AdminUserRow } from './UserTable'
import AdminVehiclesTable, { AdminVehicleItem } from './AdminVehiclesTable'
import AdminServicesView, { AdminServiceRecordItem, TopComponentItem } from './AdminServicesView'
import AdminTaxesView, { AdminTaxRecordItem, AdminTaxVehicleAlert } from './AdminTaxesView'
import AdminFeedbackView, { AdminFeedbackItem } from './AdminFeedbackView'
import AdminSystemView, { DbTableStat } from './AdminSystemView'
import { 
  Users, 
  Bike, 
  Car, 
  Wrench, 
  Coins, 
  Receipt, 
  Zap, 
  Fuel, 
  ArrowLeft, 
  LogOut, 
  ShieldCheck, 
  Server, 
  Globe, 
  Database,
  Activity,
  Layers,
  Sparkles,
  MessageSquareHeart
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  const developer = await getVerifiedDeveloper()

  if (!developer) {
    return <AccessDenied userEmail={session.user.email} />
  }

  const resolvedSearchParams = await searchParams
  const rawTab = typeof resolvedSearchParams.tab === 'string' ? resolvedSearchParams.tab : 'overview'
  const validTabs: AdminTabType[] = ['overview', 'users', 'vehicles', 'services', 'taxes', 'feedback', 'system']
  const activeTab: AdminTabType = validTabs.includes(rawTab as AdminTabType)
    ? (rawTab as AdminTabType)
    : 'overview'

  // Fetch Comprehensive Data
  const [
    totalUsers,
    totalVehicles,
    totalServices,
    serviceCostAgg,
    totalTaxes,
    taxAmountAgg,
    motorcycleCount,
    carCount,
    iceCount,
    evCount,
    maticCount,
    manualCount,
    totalAccounts,
    totalSessions,
    totalServiceDetails,
    allUsersRaw,
    allVehiclesRaw,
    allServicesRaw,
    topComponentsRaw,
    allTaxRecordsRaw,
    taxVehiclesRaw,
    totalFeedbacks,
    allFeedbacksRaw
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vehicle.count(),
    prisma.serviceRecord.count(),
    prisma.serviceRecord.aggregate({ _sum: { totalCost: true, laborCost: true } }),
    prisma.taxRecord.count(),
    prisma.taxRecord.aggregate({ _sum: { amount: true } }),
    prisma.vehicle.count({ where: { vehicleType: 'MOTORCYCLE' } }),
    prisma.vehicle.count({ where: { vehicleType: 'CAR' } }),
    prisma.vehicle.count({ where: { engineType: 'ICE' } }),
    prisma.vehicle.count({ where: { engineType: 'EV' } }),
    prisma.vehicle.count({ where: { transmission: 'AUTOMATIC' } }),
    prisma.vehicle.count({ where: { transmission: 'MANUAL' } }),
    prisma.account.count(),
    prisma.session.count(),
    prisma.serviceDetail.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        vehicles: {
          select: {
            id: true,
            _count: { select: { serviceRecords: true } }
          }
        }
      }
    }),
    prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { serviceRecords: true, taxRecords: true } }
      }
    }),
    prisma.serviceRecord.findMany({
      orderBy: { date: 'desc' },
      take: 100,
      include: {
        vehicle: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        details: true
      }
    }),
    prisma.serviceDetail.groupBy({
      by: ['componentName'],
      _count: { componentName: true },
      _sum: { cost: true },
      orderBy: { _count: { componentName: 'desc' } },
      take: 8
    }),
    prisma.taxRecord.findMany({
      orderBy: { paymentDate: 'desc' },
      take: 100,
      include: {
        vehicle: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      }
    }),
    prisma.vehicle.findMany({
      where: {
        OR: [
          { stnkTaxDueDate: { not: null } },
          { stnkFiveYearDueDate: { not: null } }
        ]
      },
      include: {
        user: { select: { name: true, email: true } }
      }
    }),
    prisma.feedback.count(),
    prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })
  ])

  const totalCost = serviceCostAgg._sum.totalCost || 0
  const totalLaborCost = serviceCostAgg._sum.laborCost || 0
  const totalTaxAmount = taxAmountAgg._sum.amount || 0

  // 1. Format Users
  const formattedUsers: AdminUserRow[] = allUsersRaw.map((u) => {
    const serviceCount = u.vehicles.reduce((acc, v) => acc + (v._count?.serviceRecords || 0), 0)
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'USER',
      createdAt: new Date(u.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      vehicleCount: u.vehicles.length,
      serviceCount,
      image: u.image
    }
  })

  // 2. Format Vehicles
  const formattedVehicles: AdminVehicleItem[] = allVehiclesRaw.map((v) => ({
    id: v.id,
    name: v.name,
    licensePlate: v.licensePlate,
    vehicleType: v.vehicleType,
    engineType: v.engineType,
    transmission: v.transmission,
    ccOrKwh: v.ccOrKwh,
    currentMileage: v.currentMileage,
    serviceCount: v._count.serviceRecords,
    taxRecordCount: v._count.taxRecords,
    createdAt: new Date(v.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    owner: {
      id: v.user.id,
      name: v.user.name,
      email: v.user.email
    }
  }))

  // 3. Format Services
  const formattedServices: AdminServiceRecordItem[] = allServicesRaw.map((s) => ({
    id: s.id,
    date: new Date(s.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    mileage: s.mileage,
    totalCost: s.totalCost,
    laborCost: s.laborCost,
    vehicle: {
      name: s.vehicle.name,
      licensePlate: s.vehicle.licensePlate,
      engineType: s.vehicle.engineType,
      user: {
        name: s.vehicle.user.name,
        email: s.vehicle.user.email
      }
    },
    details: s.details.map((d) => ({
      id: d.id,
      componentName: d.componentName,
      cost: d.cost
    }))
  }))

  // 4. Format Top Components
  const formattedTopComponents: TopComponentItem[] = topComponentsRaw.map((t) => ({
    componentName: t.componentName,
    count: t._count.componentName,
    totalSpend: t._sum.cost || 0
  }))

  // 5. Format Taxes
  const formattedTaxRecords: AdminTaxRecordItem[] = allTaxRecordsRaw.map((t) => ({
    id: t.id,
    taxType: t.taxType,
    paymentDate: new Date(t.paymentDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    amount: t.amount,
    note: t.note,
    vehicle: {
      name: t.vehicle.name,
      licensePlate: t.vehicle.licensePlate,
      user: {
        name: t.vehicle.user.name,
        email: t.vehicle.user.email
      }
    }
  }))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const formattedTaxAlerts: AdminTaxVehicleAlert[] = taxVehiclesRaw.map((v) => {
    const taxDaysLeft = v.stnkTaxDueDate
      ? Math.ceil((new Date(v.stnkTaxDueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : null
    const fiveYearDaysLeft = v.stnkFiveYearDueDate
      ? Math.ceil((new Date(v.stnkFiveYearDueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return {
      id: v.id,
      name: v.name,
      licensePlate: v.licensePlate,
      ownerName: v.user.name,
      ownerEmail: v.user.email,
      stnkTaxDueDate: v.stnkTaxDueDate ? new Date(v.stnkTaxDueDate).toLocaleDateString('id-ID') : null,
      stnkFiveYearDueDate: v.stnkFiveYearDueDate ? new Date(v.stnkFiveYearDueDate).toLocaleDateString('id-ID') : null,
      taxDaysLeft,
      fiveYearDaysLeft
    }
  })

  // 6. Format Feedbacks
  const formattedFeedbacks: AdminFeedbackItem[] = allFeedbacksRaw.map((f) => ({
    id: f.id,
    name: f.name,
    email: f.email,
    category: f.category,
    message: f.message,
    imageUrl: f.imageUrl,
    rating: f.rating,
    createdAt: new Date(f.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }))

  // 7. Database Table Statistics
  const dbStats: DbTableStat[] = [
    { table: 'User', count: totalUsers, description: 'Akun terdaftar dan pengaturan notifikasi' },
    { table: 'Vehicle', count: totalVehicles, description: 'Motor & mobil pengguna (ICE & EV)' },
    { table: 'ServiceRecord', count: totalServices, description: 'Log transaksi servis & odometer' },
    { table: 'ServiceDetail', count: totalServiceDetails, description: 'Rincian komponen servis & biaya' },
    { table: 'TaxRecord', count: totalTaxes, description: 'Riwayat pembayaran pajak STNK' },
    { table: 'Feedback', count: totalFeedbacks, description: 'Kritik & saran dari pengunjung landing page' },
    { table: 'Account', count: totalAccounts, description: 'Koneksi OAuth Google akun' },
    { table: 'Session', count: totalSessions, description: 'Sesi login aktif' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-secondary-background border-b-2 border-border shadow-[0_3px_0px_0px_var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CruzLogo className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-foreground">Cruz Admin</span>
                <span className="px-2 py-0.5 bg-amber-400 text-black border-2 border-border text-[10px] font-black rounded-[var(--radius-base)] shadow-[1.5px_1.5px_0px_0px_var(--border)] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  DEV CONSOLE
                </span>
              </div>
              <p className="text-[11px] font-bold text-foreground/60 hidden sm:block">
                Pusat Kendali Developer & Manajemen Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 py-1.5 px-3 bg-background hover:bg-slate-200 border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ke Aplikasi Pengguna</span>
              <span className="sm:hidden">App</span>
            </Link>

            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1.5 py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Production Domain Banner */}
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-base)] bg-main border-2 border-border flex items-center justify-center font-black text-black shrink-0 shadow-[2px_2px_0px_0px_var(--border)]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
                Target Domain Production
              </div>
              <div className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                cruz.web.id
                <span className="px-2 py-0.5 bg-emerald-400 text-black border border-border text-[10px] font-black rounded">
                  ONLINE TARGET
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-foreground/80">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              MySQL Engine Ready
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              <Server className="w-3.5 h-3.5 text-green-500" />
              Next.js 16 (App Router)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Dev: {developer.email}
            </span>
          </div>
        </div>

        {/* Multi-Menu Admin Tabs */}
        <AdminTabs
          activeTab={activeTab}
          counts={{
            users: totalUsers,
            vehicles: totalVehicles,
            services: totalServices,
            taxes: totalTaxes,
            feedback: totalFeedbacks
          }}
        />

        {/* Tab 1: Ringkasan (Overview) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                    Total Pengguna
                  </span>
                  <div className="w-8 h-8 rounded-[var(--radius-base)] bg-blue-400/20 text-blue-600 border border-border flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {totalUsers.toLocaleString('id-ID')}
                </div>
                <p className="mt-1 text-[11px] font-medium text-foreground/60">
                  Akun terdaftar dalam database
                </p>
              </div>

              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                    Total Kendaraan
                  </span>
                  <div className="w-8 h-8 rounded-[var(--radius-base)] bg-emerald-400/20 text-emerald-600 border border-border flex items-center justify-center">
                    <Bike className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {totalVehicles.toLocaleString('id-ID')}
                </div>
                <p className="mt-1 text-[11px] font-medium text-foreground/60">
                  {motorcycleCount} Motor • {carCount} Mobil
                </p>
              </div>

              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                    Catatan Servis
                  </span>
                  <div className="w-8 h-8 rounded-[var(--radius-base)] bg-amber-400/20 text-amber-600 border border-border flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {totalServices.toLocaleString('id-ID')}
                </div>
                <p className="mt-1 text-[11px] font-medium text-foreground/60">
                  Riwayat servis tersimpan
                </p>
              </div>

              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                    Estimasi Biaya Servis
                  </span>
                  <div className="w-8 h-8 rounded-[var(--radius-base)] bg-purple-400/20 text-purple-600 border border-border flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-foreground truncate">
                  Rp {totalCost >= 1000000 ? `${(totalCost / 1000000).toFixed(1)} Jt` : totalCost.toLocaleString('id-ID')}
                </div>
                <p className="mt-1 text-[11px] font-medium text-foreground/60">
                  Akumulasi pengeluaran user
                </p>
              </div>
            </section>

            {/* Fleet Breakdown */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-foreground/70" />
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    Jenis Kendaraan
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Bike className="w-3.5 h-3.5" /> Motor</span>
                      <span>{motorcycleCount} ({totalVehicles > 0 ? Math.round((motorcycleCount / totalVehicles) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 bg-background rounded-full border border-border overflow-hidden">
                      <div
                        className="h-full bg-main"
                        style={{ width: `${totalVehicles > 0 ? (motorcycleCount / totalVehicles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Mobil</span>
                      <span>{carCount} ({totalVehicles > 0 ? Math.round((carCount / totalVehicles) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 bg-background rounded-full border border-border overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${totalVehicles > 0 ? (carCount / totalVehicles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-foreground/70" />
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    Tipe Penggerak
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" /> Bensin (ICE)</span>
                      <span>{iceCount} ({totalVehicles > 0 ? Math.round((iceCount / totalVehicles) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 bg-background rounded-full border border-border overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${totalVehicles > 0 ? (iceCount / totalVehicles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Listrik (EV)</span>
                      <span>{evCount} ({totalVehicles > 0 ? Math.round((evCount / totalVehicles) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 bg-background rounded-full border border-border overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${totalVehicles > 0 ? (evCount / totalVehicles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-4 h-4 text-foreground/70" />
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    Transmisi & Pajak STNK
                  </h3>
                </div>
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-foreground/70">Matic (Automatic):</span>
                    <span>{maticCount} Unit</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-foreground/70">Manual / Kopling:</span>
                    <span>{manualCount} Unit</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-foreground/70">Catatan Pajak STNK:</span>
                    <span>{totalTaxes} Record</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-foreground/70">Akumulasi Pajak:</span>
                    <span>Rp {totalTaxAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Preview: Recent Users & Services */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Pengguna Terbaru
                  </h3>
                  <Link
                    href="/admin?tab=users"
                    className="text-xs font-bold text-foreground/70 hover:text-foreground underline"
                  >
                    Lihat Semua ({totalUsers})
                  </Link>
                </div>
                <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-3 shadow-[4px_4px_0px_0px_var(--border)] divide-y divide-border/60">
                  {formattedUsers.slice(0, 5).map((u) => (
                    <div key={u.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-black text-foreground block">{u.name || 'Pengguna'}</span>
                        <span className="text-[10px] text-foreground/60">{u.email}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black border border-border bg-background">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Catatan Servis Terkini
                  </h3>
                  <Link
                    href="/admin?tab=services"
                    className="text-xs font-bold text-foreground/70 hover:text-foreground underline"
                  >
                    Lihat Semua ({totalServices})
                  </Link>
                </div>
                <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-3 shadow-[4px_4px_0px_0px_var(--border)] divide-y divide-border/60">
                  {formattedServices.slice(0, 5).map((s) => (
                    <div key={s.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-black text-foreground block">
                          {s.vehicle.name} • {s.mileage.toLocaleString('id-ID')} km
                        </span>
                        <span className="text-[10px] text-foreground/60">
                          {s.vehicle.user.name || s.vehicle.user.email} • {s.date}
                        </span>
                      </div>
                      <span className="font-black font-mono text-foreground">
                        Rp {s.totalCost.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Pengguna (Users) */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Manajemen Pengguna
                </h2>
                <p className="text-xs font-bold text-foreground/60">
                  Kelola hak akses role (User / Admin) dan pantau aktivitas akun
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
                {totalUsers} Akun Terdaftar
              </span>
            </div>
            <UserTable users={formattedUsers} currentDevId={developer.id} />
          </div>
        )}

        {/* Tab 3: Kendaraan (Vehicles) */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Bike className="w-5 h-5" />
                  Armada Kendaraan Pengguna
                </h2>
                <p className="text-xs font-bold text-foreground/60">
                  Daftar seluruh motor bensin, motor listrik (EV), dan mobil terdaftar
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
                {totalVehicles} Kendaraan
              </span>
            </div>
            <AdminVehiclesTable vehicles={formattedVehicles} />
          </div>
        )}

        {/* Tab 4: Riwayat Servis (Services) */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Riwayat & Analitik Servis Lintas Pengguna
                </h2>
                <p className="text-xs font-bold text-foreground/60">
                  Pantau komponen terpopuler, alokasi biaya sparepart vs jasa mekanik
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
                {totalServices} Log Servis
              </span>
            </div>
            <AdminServicesView
              services={formattedServices}
              topComponents={formattedTopComponents}
              totalCost={totalCost}
              totalLaborCost={totalLaborCost}
            />
          </div>
        )}

        {/* Tab 5: Pajak & STNK (Taxes) */}
        {activeTab === 'taxes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Manajemen Pajak STNK & Kepatuhan
                </h2>
                <p className="text-xs font-bold text-foreground/60">
                  Monitoring jatuh tempo pajak tahunan (PKB) dan 5 tahunan (ganti plat nomor)
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
                Rp {totalTaxAmount.toLocaleString('id-ID')} Total Tercatat
              </span>
            </div>
            <AdminTaxesView
              taxRecords={formattedTaxRecords}
              taxAlertVehicles={formattedTaxAlerts}
              totalTaxAmount={totalTaxAmount}
            />
          </div>
        )}

        {/* Tab 6: Kritik & Saran (Feedback) */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-red-500" />
                  Kritik & Saran Pengunjung
                </h2>
                <p className="text-xs font-bold text-foreground/60">
                  Aspirasi, permintaan fitur, kendala, dan evaluasi pengguna dari landing page
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
                {totalFeedbacks} Masukan Diterima
              </span>
            </div>
            <AdminFeedbackView feedbacks={formattedFeedbacks} />
          </div>
        )}

        {/* Tab 7: Sistem & Tools (System) */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Diagnostik Database, Server & Ekspor Data
                </h2>
                <p className="text-xs font-bold text-foreground/60">
                  Informasi teknis database Prisma, spesifikasi lingkungan server, dan unduhan backup CSV
                </p>
              </div>
            </div>
            <AdminSystemView
              dbStats={dbStats}
              devEmail={developer.email || 'developer'}
              usersData={formattedUsers}
              vehiclesData={formattedVehicles}
              servicesData={formattedServices}
            />
          </div>
        )}
      </main>
    </div>
  )
}
