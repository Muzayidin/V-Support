'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateProfile } from '../actions'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Check, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Camera,
  ShieldCheck
} from 'lucide-react'

const AVATAR_PRESETS = [
  { id: '1', emoji: '🏍️', label: 'Rider Hitam', bg: 'bg-[#FFE500]' },
  { id: '2', emoji: '🛵', label: 'Skuter Matic', bg: 'bg-[#7A83FF]' },
  { id: '3', emoji: '⚡', label: 'Motor Listrik EV', bg: 'bg-[#00D696]' },
  { id: '4', emoji: '🔧', label: 'Mekanik Handal', bg: 'bg-[#FF4D50]' },
  { id: '5', emoji: '🏁', label: 'Racing Track', bg: 'bg-[#FACC00]' },
  { id: '6', emoji: '🛡️', label: 'Safety Driver', bg: 'bg-white' },
]

export default function EditProfileForm({
  user
}: {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    hasPassword: boolean
  }
}) {
  const router = useRouter()
  const [name, setName] = useState(user.name || '')
  const [selectedImage, setSelectedImage] = useState(user.image || '')
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih berkas foto (JPG, PNG, WebP).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran foto maksimal 10MB.')
      return
    }

    setIsUploadingAvatar(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'avatars')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setSelectedImage(data.url)
      } else {
        setErrorMessage(data.error || 'Gagal mengunggah foto avatar.')
      }
    } catch {
      setErrorMessage('Terjadi gangguan saat mengunggah foto avatar.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const isPhoto = selectedImage && (
    selectedImage.startsWith('http') || 
    selectedImage.startsWith('/') || 
    selectedImage.startsWith('data:')
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(false)
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('Nama lengkap tidak boleh kosong.')
      return
    }

    startTransition(async () => {
      try {
        await updateProfile({
          name: name.trim(),
          image: selectedImage || undefined
        })
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
          router.push('/profile')
        }, 1200)
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal menyimpan profil.')
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
          <h1 className="text-lg font-black text-foreground tracking-tight">Edit Profil</h1>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-base)] bg-main text-black text-xs font-black border-2 border-border shadow-[1.5px_1.5px_0px_0px_var(--border)]">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Cruz</span>
        </div>
      </header>

      <main className="px-4 py-5 flex flex-col gap-5 pb-28 md:max-w-md md:mx-auto">
        {saveSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)] animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Perubahan profil berhasil disimpan! Mengalihkan...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border-2 border-red-500 text-red-600 rounded-[var(--radius-base)] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Avatar Preview Card */}
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-[var(--radius-base)] border-2 border-border bg-main shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-center overflow-hidden">
              {isPhoto ? (
                <img src={selectedImage} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : selectedImage ? (
                <span className="text-4xl">{selectedImage}</span>
              ) : (
                <User className="w-12 h-12 text-black stroke-[2.5]" />
              )}
            </div>

            {/* Quick Upload Button on Avatar */}
            <label
              title="Unggah foto avatar"
              className="absolute -bottom-2 -right-2 p-2 rounded-[var(--radius-base)] bg-main hover:bg-[#8AE500] text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
              ) : (
                <Camera className="w-4 h-4 stroke-[2.5]" />
              )}
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingAvatar}
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h2 className="text-base font-black text-foreground">{name || 'Nama Pengguna'}</h2>
            <p className="text-xs text-foreground/70 font-bold">{user.email}</p>
          </div>

          {/* Action Buttons for Avatar */}
          <div className="w-full pt-2 flex flex-col gap-2">
            <label className="w-full py-2.5 px-3 bg-main hover:bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5">
              {isUploadingAvatar ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>Mengunggah Foto...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                  <span>{isPhoto ? 'Ganti Foto Avatar Sendiri' : 'Unggah Foto Avatar Sendiri'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingAvatar}
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </label>

            {isPhoto && (
              <button
                type="button"
                onClick={() => setSelectedImage('')}
                className="w-full py-1.5 px-3 bg-background hover:bg-red-50 text-red-600 border-2 border-border rounded-[var(--radius-base)] text-xs font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Hapus Foto (Gunakan Ikon Bawaan)</span>
              </button>
            )}
          </div>

          {/* Preset Avatar Selection */}
          <div className="w-full pt-3 border-t-2 border-border space-y-2">
            <span className="text-[11px] font-black uppercase text-foreground/70 tracking-wider block text-left">
              Atau Pilih Ikon Avatar:
            </span>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedImage(preset.emoji)}
                  className={`h-11 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--border)] transition-transform cursor-pointer hover:scale-105 active:scale-95 ${
                    preset.bg
                  } ${selectedImage === preset.emoji ? 'ring-2 ring-foreground' : ''}`}
                  title={preset.label}
                >
                  {preset.emoji}
                </button>
              ))}
            </div>

            {user.image && user.image.startsWith('http') && (
              <button
                type="button"
                onClick={() => setSelectedImage(user.image!)}
                className={`w-full mt-2 py-1.5 px-3 rounded-[var(--radius-base)] border-2 border-border text-xs font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] flex items-center justify-center gap-2 cursor-pointer ${
                  selectedImage === user.image ? 'bg-main text-foreground' : 'bg-background text-foreground/80'
                }`}
              >
                <span>Gunakan Foto Akun Google Semula</span>
              </button>
            )}

            {showCustomInput && (
              <div className="pt-2 flex gap-2">
                <input
                  type="url"
                  placeholder="Atau tempel URL foto (https://...)"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customImageUrl.trim()) {
                      setSelectedImage(customImageUrl.trim())
                    }
                  }}
                  className="px-3 py-1.5 bg-main border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)] cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:ring-1 focus:ring-foreground text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                Alamat Email (Akun Utama)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/60 border-2 border-border/70 rounded-[var(--radius-base)] text-foreground/70 shadow-[1px_1px_0px_0px_var(--border)] text-xs font-bold cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] font-bold text-foreground/60 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-main stroke-[3]" />
                Email terikat dengan identitas autentikasi akun Anda.
              </p>
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
                <Save className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
