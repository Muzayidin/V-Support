'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { changePassword } from '../actions'
import { 
  ArrowLeft, 
  KeyRound, 
  Lock, 
  Check, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react'

export default function ChangePasswordForm({
  hasPassword
}: {
  hasPassword: boolean
}) {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setErrorMessage(null)

    if (hasPassword && !currentPassword) {
      setErrorMessage('Kata sandi saat ini wajib diisi.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok.')
      return
    }

    startTransition(async () => {
      try {
        await changePassword({
          currentPassword: hasPassword ? currentPassword : undefined,
          newPassword
        })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          router.push('/profile')
        }, 1500)
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal mengubah kata sandi.')
      }
    })
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)] px-4 h-16 flex items-center justify-between md:max-w-md md:mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="w-9 h-9 rounded-[var(--radius-base)] border-2 border-border bg-secondary-background flex items-center justify-center text-foreground hover:bg-slate-200 shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <h1 className="text-lg font-black text-foreground tracking-tight">
            {hasPassword ? 'Ubah Kata Sandi' : 'Buat Kata Sandi'}
          </h1>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-base)] bg-main text-black text-xs font-black border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)]">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Cruz</span>
        </div>
      </header>

      <main className="px-4 py-5 flex flex-col gap-5 pb-28 md:max-w-md md:mx-auto">
        {success && (
          <div className="p-3.5 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)] animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Kata sandi berhasil diperbarui! Mengalihkan ke profil...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border-2 border-red-500 text-red-600 rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!hasPassword && (
          <div className="p-3.5 bg-amber-400/20 border-2 border-border rounded-[var(--radius-base)] text-xs text-foreground font-bold shadow-[2px_2px_0px_0px_var(--border)]">
            Akun Anda saat ini masuk lewat Google OAuth. Anda dapat membuat kata sandi agar bisa masuk menggunakan email dan kata sandi langsung.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
            {hasPassword && (
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    className="w-full pl-10 pr-10 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:ring-1 focus:ring-foreground text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/70 hover:text-foreground cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:ring-1 focus:ring-foreground text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/70 hover:text-foreground cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:ring-1 focus:ring-foreground text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Link
              href="/profile"
              className="py-3 px-4 bg-secondary-background hover:bg-slate-200 text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] text-center cursor-pointer"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-main hover:bg-[#8AE500] text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>Simpan Kata Sandi Baru</span>
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
