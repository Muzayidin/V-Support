'use client'

import { useState, useTransition } from 'react'
import { deleteAccount } from './actions'
import { 
  Trash2, 
  AlertTriangle, 
  X, 
  Loader2 
} from 'lucide-react'

export default function DeleteAccountModal({
  userEmail
}: {
  userEmail: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDelete = () => {
    if (confirmText.trim().toUpperCase() !== 'HAPUS') {
      setErrorMessage('Ketik "HAPUS" untuk mengonfirmasi.')
      return
    }

    setErrorMessage(null)
    startTransition(async () => {
      try {
        await deleteAccount()
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal menghapus akun.')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
          setConfirmText('')
          setErrorMessage(null)
        }}
        className="w-full flex items-center justify-between p-3.5 hover:bg-red-500/10 transition-colors group cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius-base)] bg-background border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black text-red-600 block">Hapus Akun Saya</span>
            <span className="text-[11px] font-bold text-foreground/60">Hapus data akun & semua kendaraan permanen</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[6px_6px_0px_0px_var(--border)] p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                <h3 className="text-sm font-black text-foreground">Hapus Akun Permanen?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-[var(--radius-base)] border-2 border-border bg-background flex items-center justify-center text-foreground hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-red-500/10 border-2 border-red-500/30 rounded-[var(--radius-base)] text-xs text-foreground font-medium space-y-1.5 leading-relaxed">
              <p className="font-black text-red-600">Peringatan: Tindakan ini tidak dapat dibatalkan!</p>
              <p className="text-[11px] text-foreground/80">
                Seluruh data profil akun <strong>{userEmail}</strong>, daftar kendaraan, log riwayat servis, serta pengingat pajak akan dihapus secara permanen dari server Cruz.
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-red-500 text-white text-xs font-black rounded-[var(--radius-base)] border-2 border-border">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-foreground/70 block">
                Ketik <span className="text-red-600 underline">HAPUS</span> untuk konfirmasi:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Ketik HAPUS"
                className="w-full px-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-center tracking-widest placeholder:tracking-normal focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="flex-1 py-2.5 px-3 bg-background hover:bg-slate-200 border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || confirmText.trim().toUpperCase() !== 'HAPUS'}
                className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Ya, Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
