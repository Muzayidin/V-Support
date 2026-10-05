'use client'

import { useState } from 'react'
import { 
  Server, 
  Database, 
  Download, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  HardDrive, 
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'

export interface DbTableStat {
  table: string
  count: number
  description: string
}

interface AdminSystemViewProps {
  dbStats: DbTableStat[]
  devEmail: string
  usersData: any[]
  vehiclesData: any[]
  servicesData: any[]
}

export default function AdminSystemView({
  dbStats,
  devEmail,
  usersData,
  vehiclesData,
  servicesData
}: AdminSystemViewProps) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const downloadCSV = (filename: string, rows: Record<string, any>[]) => {
    if (!rows || rows.length === 0) {
      alert('Tidak ada data untuk diekspor.')
      return
    }

    setDownloading(filename)

    try {
      const headers = Object.keys(rows[0])
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          headers
            .map((header) => {
              const val = row[header] === null || row[header] === undefined ? '' : String(row[header])
              return `"${val.replace(/"/g, '""')}"`
            })
            .join(',')
        )
      ].join('\r\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setTimeout(() => setDownloading(null), 600)
    }
  }

  const handleExportUsers = () => {
    const rows = usersData.map((u) => ({
      ID: u.id,
      Nama: u.name || '-',
      Email: u.email || '-',
      Role: u.role,
      JumlahKendaraan: u.vehicleCount,
      JumlahServis: u.serviceCount,
      TanggalDaftar: u.createdAt
    }))
    downloadCSV('cruz_users_export', rows)
  }

  const handleExportVehicles = () => {
    const rows = vehiclesData.map((v) => ({
      ID: v.id,
      NamaMotor: v.name,
      PlatNomor: v.licensePlate || '-',
      TipeMesin: v.engineType,
      Transmisi: v.transmission,
      OdometerKM: v.currentMileage,
      Pemilik: v.owner.name || v.owner.email,
      EmailPemilik: v.owner.email,
      JumlahServis: v.serviceCount,
      TanggalDibuat: v.createdAt
    }))
    downloadCSV('cruz_vehicles_export', rows)
  }

  const handleExportServices = () => {
    const rows = servicesData.map((s) => ({
      ID: s.id,
      Kendaraan: s.vehicle.name,
      PlatNomor: s.vehicle.licensePlate || '-',
      Pemilik: s.vehicle.user.name || s.vehicle.user.email,
      OdometerSaatServis: s.mileage,
      Komponen: s.details.map((d: any) => d.componentName).join('; '),
      BiayaJasaMekanik: s.laborCost,
      TotalBiayaServis: s.totalCost,
      TanggalServis: s.date
    }))
    downloadCSV('cruz_services_export', rows)
  }

  return (
    <div className="space-y-6">
      {/* Diagnostics & Environment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Runtime Spec */}
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Lingkungan Server & Runtime
            </h3>
          </div>

          <div className="space-y-2 text-xs font-bold divide-y divide-border/60">
            <div className="flex justify-between py-1.5">
              <span className="text-foreground/70">Framework:</span>
              <span className="text-foreground">Next.js 16 (App Router + React 19)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-foreground/70">ORM & Query Engine:</span>
              <span className="text-foreground">Prisma Client ORM</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-foreground/70">Database Engine:</span>
              <span className="text-foreground">SQLite (Production Ready for MySQL)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-foreground/70">Otentikasi & Keamanan:</span>
              <span className="text-foreground">Auth.js (NextAuth v5 Beta)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-foreground/70">PWA & Offline Cache:</span>
              <span className="text-foreground text-emerald-600">Service Worker Active (v1.4.0)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-foreground/70">Akun Developer Utama:</span>
              <span className="text-foreground font-mono text-[11px] bg-background px-1.5 py-0.5 rounded border border-border">
                {devEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Database Tables Stats */}
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Tabel & Koleksi Database
            </h3>
          </div>

          <div className="space-y-2 text-xs font-bold divide-y divide-border/60">
            {dbStats.map((item) => (
              <div key={item.table} className="flex justify-between items-center py-1.5">
                <div>
                  <span className="font-mono text-foreground">{item.table}</span>
                  <span className="block text-[10px] text-foreground/50 font-normal">
                    {item.description}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-background border border-border rounded font-black font-mono">
                  {item.count} record
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Export Data Tools */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Ekspor Data Backup (CSV Spreadsheet)
            </h3>
          </div>
          <p className="text-xs font-bold text-foreground/60 mt-1">
            Unduh salinan data seluruh sistem secara instan untuk audit dan pencadangan lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExportUsers}
            disabled={downloading !== null}
            className="flex items-center justify-between p-3.5 bg-background hover:bg-slate-100 border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] transition-all cursor-pointer text-left active:translate-x-0.5 active:translate-y-0.5"
          >
            <div>
              <span className="font-black text-xs text-foreground block">
                Ekspor Data Pengguna
              </span>
              <span className="text-[10px] text-foreground/60 font-medium">
                {usersData.length} baris akun
              </span>
            </div>
            <Download className="w-4 h-4 text-foreground/70 shrink-0" />
          </button>

          <button
            onClick={handleExportVehicles}
            disabled={downloading !== null}
            className="flex items-center justify-between p-3.5 bg-background hover:bg-slate-100 border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] transition-all cursor-pointer text-left active:translate-x-0.5 active:translate-y-0.5"
          >
            <div>
              <span className="font-black text-xs text-foreground block">
                Ekspor Data Kendaraan
              </span>
              <span className="text-[10px] text-foreground/60 font-medium">
                {vehiclesData.length} unit kendaraan
              </span>
            </div>
            <Download className="w-4 h-4 text-foreground/70 shrink-0" />
          </button>

          <button
            onClick={handleExportServices}
            disabled={downloading !== null}
            className="flex items-center justify-between p-3.5 bg-background hover:bg-slate-100 border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] transition-all cursor-pointer text-left active:translate-x-0.5 active:translate-y-0.5"
          >
            <div>
              <span className="font-black text-xs text-foreground block">
                Ekspor Riwayat Servis
              </span>
              <span className="text-[10px] text-foreground/60 font-medium">
                {servicesData.length} transaksi servis
              </span>
            </div>
            <Download className="w-4 h-4 text-foreground/70 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
