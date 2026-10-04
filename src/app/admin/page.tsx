import prisma from '@/lib/prisma'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import { getVerifiedDeveloper } from '@/lib/admin'
import AccessDenied from './AccessDenied'
import UserTable, { AdminUserRow } from './UserTable'
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
  Gauge,
  Activity,
  Calendar,
  Layers
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  const developer = await getVerifiedDeveloper()

  if (!developer) {
    return <AccessDenied userEmail={session.user.email} />
  }

  // 1. Fetch Key Metrics
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
    recentUsersRaw,
    recentServicesRaw
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
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: {
        vehicles: {
          select: {
            id: true,
            _count: { select: { serviceRecords: true } }
          }
        }
      }
    }),
    prisma.serviceRecord.findMany({
      orderBy: { date: 'desc' },
      take: 8,
      include: {
        vehicle: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        details: true
      }
    })
  ])

  const totalCost = serviceCostAgg._sum.totalCost || 0
  const totalTaxAmount = taxAmountAgg._sum.amount || 0

  // Format users for table
  const formattedUsers: AdminUserRow[] = recentUsersRaw.map((u) => {
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
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
                Statistik Sistem & Manajemen Pengguna
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System & Target Domain Banner */}
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
                cruz.my.id
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

        {/* Primary KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Users */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                Total Pengguna
              </span>
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-blue-400/20 text-blue-600 border border-border flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {totalUsers.toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-[11px] font-medium text-foreground/60">
              Akun terdaftar dalam database
            </p>
          </div>

          {/* Total Vehicles */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                Total Kendaraan
              </span>
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-emerald-400/20 text-emerald-600 border border-border flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {totalVehicles.toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-[11px] font-medium text-foreground/60">
              {motorcycleCount} Motor • {carCount} Mobil
            </p>
          </div>

          {/* Total Service Logs */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                Catatan Servis
              </span>
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-amber-400/20 text-amber-600 border border-border flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {totalServices.toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-[11px] font-medium text-foreground/60">
              Riwayat servis tersimpan
            </p>
          </div>

          {/* Total Service Expenses */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                Estimasi Total Servis
              </span>
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-purple-400/20 text-purple-600 border border-border flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight truncate" title={`Rp ${totalCost.toLocaleString('id-ID')}`}>
              Rp {totalCost >= 1000000 ? `${(totalCost / 1000000).toFixed(1)} Jt` : totalCost.toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-[11px] font-medium text-foreground/60">
              Akumulasi biaya servis dicatat user
            </p>
          </div>
        </section>

        {/* Vehicle Fleet Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jenis Kendaraan */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-foreground/70" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
                Jenis Kendaraan
              </h2>
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

          {/* Tipe Penggerak */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-foreground/70" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
                Tipe Penggerak
              </h2>
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

          {/* Transmisi & Pajak */}
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-foreground/70" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
                Transmisi & Pajak STNK
              </h2>
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

        {/* User Management Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manajemen Pengguna
              </h2>
              <p className="text-xs font-bold text-foreground/60">
                Kelola hak akses role (User / Admin) dan lihat aktivitas pendaftaran pengguna
              </p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
              {totalUsers} Akun
            </span>
          </div>

          <UserTable users={formattedUsers} currentDevId={developer.id} />
        </section>

        {/* Recent Service Logs Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Catatan Servis Terkini (Lintas Pengguna)
              </h2>
              <p className="text-xs font-bold text-foreground/60">
                Aktivitas pencatatan servis terbaru yang dilakukan oleh pengguna
              </p>
            </div>
          </div>

          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-border bg-background/50 text-[11px] font-black uppercase text-foreground/70 tracking-wider">
                    <th className="py-3 px-4">Kendaraan</th>
                    <th className="py-3 px-4">Pemilik</th>
                    <th className="py-3 px-4">Odometer</th>
                    <th className="py-3 px-4">Komponen</th>
                    <th className="py-3 px-4">Total Biaya</th>
                    <th className="py-3 px-4">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border text-xs font-bold">
                  {recentServicesRaw.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/60">
                        Belum ada catatan servis yang tersimpan di sistem.
                      </td>
                    </tr>
                  ) : (
                    recentServicesRaw.map((record) => (
                      <tr key={record.id} className="hover:bg-background/40 transition-colors">
                        <td className="py-3 px-4 font-black text-foreground">
                          {record.vehicle.name}
                          {record.vehicle.licensePlate && (
                            <span className="ml-2 text-[10px] bg-background px-1.5 py-0.5 border border-border rounded">
                              {record.vehicle.licensePlate}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-foreground/80 font-medium">
                          {record.vehicle.user.name || record.vehicle.user.email}
                        </td>
                        <td className="py-3 px-4 text-foreground font-mono">
                          {record.mileage.toLocaleString('id-ID')} km
                        </td>
                        <td className="py-3 px-4 text-foreground/70 font-medium text-[11px]">
                          {record.details.map((d) => d.componentName).join(', ') || 'Servis Rutin'}
                        </td>
                        <td className="py-3 px-4 text-foreground font-black">
                          Rp {record.totalCost.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-foreground/60 font-medium text-[11px]">
                          {new Date(record.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
