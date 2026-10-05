'use client'

import { useState, useTransition } from 'react'
import { submitFeedback } from '@/actions/feedback'
import { 
  MessageSquareHeart, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Star, 
  Sparkles,
  Lightbulb,
  Bug,
  MessageSquareWarning,
  Heart,
  Camera,
  X
} from 'lucide-react'

export default function FeedbackForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState<'SUGGESTION' | 'BUG' | 'CRITICISM' | 'OTHER'>('SUGGESTION')
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const categories = [
    { id: 'SUGGESTION', label: 'Saran Fitur', icon: Lightbulb, color: 'bg-amber-300' },
    { id: 'CRITICISM', label: 'Kritik & Evaluasi', icon: MessageSquareWarning, color: 'bg-orange-300' },
    { id: 'BUG', label: 'Lapor Kendala / Bug', icon: Bug, color: 'bg-red-300' },
    { id: 'OTHER', label: 'Apresiasi & Lainnya', icon: Heart, color: 'bg-emerald-300' },
  ] as const

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih berkas gambar (JPG, PNG, WebP).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran gambar maksimal 10MB.')
      return
    }

    setIsUploading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'feedback')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setImageUrl(data.url)
      } else {
        setErrorMessage(data.error || 'Gagal mengunggah foto.')
      }
    } catch {
      setErrorMessage('Terjadi gangguan saat mengunggah foto.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!message.trim()) {
      setErrorMessage('Harap tuliskan kritik atau saran Anda terlebih dahulu.')
      return
    }

    startTransition(async () => {
      const res = await submitFeedback({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        category,
        message: message.trim(),
        imageUrl: imageUrl || undefined,
        rating
      })

      if (res.success) {
        setIsSuccess(true)
        setName('')
        setEmail('')
        setMessage('')
        setImageUrl(null)
      } else {
        setErrorMessage(res.error || 'Gagal mengirim kritik dan saran.')
      }
    })
  }

  return (
    <section id="feedback" className="py-16 md:py-24 border-b-2 border-border bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-main border-2 border-border rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)] text-black">
            <MessageSquareHeart className="w-3.5 h-3.5 fill-black" />
            <span>Suara Pengguna</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Kritik, Saran & Masukan Anda
          </h2>
          <p className="text-xs sm:text-sm font-bold text-foreground/75 max-w-xl mx-auto leading-relaxed">
            Cruz dibangun dan terus berkembang dari pengalaman nyata para pengendara motor di Indonesia. Berikan aspirasi Anda agar aplikasi ini semakin baik!
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[6px_6px_0px_0px_var(--border)] p-5 sm:p-8">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-main border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-center mx-auto text-black animate-bounce">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  Terima Kasih Banyak!
                </h3>
                <p className="text-xs sm:text-sm font-bold text-foreground/75 max-w-md mx-auto leading-relaxed">
                  Kritik dan saran Anda telah kami terima langsung di sistem Cruz. Setiap masukan sangat berharga bagi peningkatan fitur berikutnya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-6 py-2.5 bg-background hover:bg-slate-100 text-foreground border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Kirim Masukan Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Category Pills */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-2">
                  1. Pilih Kategori Masukan:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-[var(--radius-base)] border-2 border-border text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? `${cat.color} text-black shadow-[3px_3px_0px_0px_var(--border)] -translate-y-0.5`
                            : 'bg-background text-foreground/70 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 stroke-[2.5]" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Rating Bintang */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                  2. Nilai Pengalaman Anda dengan Cruz:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeVal = hoverRating !== null ? hoverRating : rating
                    const isFilled = star <= activeVal
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(star)}
                        className="p-1 rounded transition-transform hover:scale-110 cursor-pointer"
                        title={`${star} Bintang`}
                      >
                        <Star
                          className={`w-6 h-6 stroke-[2.2] transition-colors ${
                            isFilled
                              ? 'text-black fill-main stroke-black'
                              : 'text-foreground/30 fill-transparent'
                          }`}
                        />
                      </button>
                    )
                  })}
                  <span className="text-xs font-black text-foreground ml-2">
                    {rating === 5 && '⭐️ Sangat Puas'}
                    {rating === 4 && '👍 Bagus / Puas'}
                    {rating === 3 && '😐 Cukup Baik'}
                    {rating === 2 && '👎 Perlu Perbaikan'}
                    {rating === 1 && '⚠️ Kecewa'}
                  </span>
                </div>
              </div>

              {/* Textarea Pesan */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
                  3. Kritik & Saran Anda <span className="text-red-500">*</span>:
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pengalaman, kritik yang membangun, kendala yang Anda temui, atau saran fitur yang ingin Anda lihat di Cruz..."
                  className="w-full p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white resize-y"
                />
              </div>

              {/* Upload Foto / Screenshot (Opsional) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-foreground">
                  4. Lampirkan Foto / Tangkapan Layar (Opsional):
                </label>
                
                {imageUrl ? (
                  <div className="relative inline-block border-2 border-border rounded-[var(--radius-base)] overflow-hidden bg-background shadow-[3px_3px_0px_0px_var(--border)] p-2">
                    <img 
                      src={imageUrl} 
                      alt="Pratinjau Foto" 
                      className="max-h-48 max-w-full rounded-[var(--radius-base)] object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="absolute top-3 right-3 p-1.5 bg-[#FF4D50] hover:bg-red-600 text-white rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-transform hover:scale-110"
                      title="Hapus foto"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <div className="mt-1.5 text-[10px] font-black text-foreground/70 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00D696]" />
                      <span>Foto berhasil dilampirkan</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 bg-background hover:bg-slate-100 border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] flex items-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                          <span>Mengunggah Foto...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 stroke-[2.5]" />
                          <span>Pilih Foto / Screenshot</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] font-bold text-foreground/60">
                      Format JPG, PNG, atau WebP (Maks. 10MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Kontak Identitas Opsional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1">
                    Nama Anda (Opsional):
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1">
                    Email / WhatsApp (Opsional):
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Untuk balasan dari developer"
                    className="w-full px-3.5 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-100 border-2 border-red-500 rounded-[var(--radius-base)] text-xs font-bold text-red-900 flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--border)]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-3.5 bg-main hover:bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span>Mengirim Masukan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Kirim Kritik & Saran</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  )
}
