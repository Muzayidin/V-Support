'use client'

import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import { ShieldAlert, ArrowLeft, Terminal, KeyRound } from 'lucide-react'

export default function AccessDenied({ userEmail }: { userEmail?: string | null }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full bg-secondary-background border-2 border-border shadow-[6px_6px_0px_0px_var(--border)] rounded-[var(--radius-base)] p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <CruzLogo className="w-10 h-10" />
          <span className="px-2.5 py-1 bg-red-500 text-white border-2 border-border text-xs font-black rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            403 FORBIDDEN
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Akses Khusus Developer
          </h1>
          <p className="mt-2 text-xs font-medium text-foreground/80 leading-relaxed">
            Halaman ini hanya dapat diakses oleh Developer atau Administrator terdaftar aplikasi Cruz.
          </p>
        </div>

        <div className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
          <p className="text-[11px] font-bold text-foreground/60 uppercase tracking-wider">
            Akun Saat Ini:
          </p>
          <p className="text-xs font-black text-foreground break-all">
            {userEmail || 'Tidak teridentifikasi'}
          </p>
        </div>

        <div className="p-4 bg-amber-500/10 border-2 border-border rounded-[var(--radius-base)] space-y-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-xs">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>Cara Mendapatkan Akses:</span>
          </div>
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            Tambahkan email akun Anda ke environment variable <code className="bg-background px-1.5 py-0.5 border border-border rounded font-mono text-[10px] font-bold">ADMIN_EMAILS</code> di file <code className="bg-background px-1.5 py-0.5 border border-border rounded font-mono text-[10px] font-bold">.env</code>:
          </p>
          <pre className="p-2 bg-background border border-border rounded text-[11px] font-mono text-foreground overflow-x-auto">
            ADMIN_EMAILS=&quot;{userEmail || 'email-anda@domain.com'}&quot;
          </pre>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-main text-foreground border-2 border-border font-black text-xs rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background text-foreground border-2 border-border font-black text-xs rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <KeyRound className="w-4 h-4" />
            Ganti Akun
          </Link>
        </div>
      </div>
    </div>
  )
}
