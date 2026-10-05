'use client'

import { useState, useTransition } from 'react'
import { deleteFeedback } from './actions'
import { 
  MessageSquareHeart, 
  Star, 
  Trash2, 
  Search, 
  Lightbulb, 
  Bug, 
  MessageSquareWarning, 
  Heart, 
  Loader2,
  Calendar,
  User,
  Mail
} from 'lucide-react'

export interface AdminFeedbackItem {
  id: string
  name: string | null
  email: string | null
  category: string
  message: string
  imageUrl?: string | null
  rating: number | null
  createdAt: string
}

interface AdminFeedbackViewProps {
  feedbacks: AdminFeedbackItem[]
}

export default function AdminFeedbackView({ feedbacks }: AdminFeedbackViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = feedbacks.filter((f) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      f.message.toLowerCase().includes(term) ||
      (f.name || '').toLowerCase().includes(term) ||
      (f.email || '').toLowerCase().includes(term)

    if (filterCategory === 'ALL') return matchesSearch
    return matchesSearch && f.category === filterCategory
  })

  const suggestionCount = feedbacks.filter((f) => f.category === 'SUGGESTION').length
  const bugCount = feedbacks.filter((f) => f.category === 'BUG').length
  const criticismCount = feedbacks.filter((f) => f.category === 'CRITICISM').length
  const otherCount = feedbacks.filter((f) => f.category === 'OTHER').length

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
    : '0'

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus masukan kritik/saran ini dari sistem?')) return

    setDeletingId(id)
    startTransition(async () => {
      try {
        await deleteFeedback(id)
      } finally {
        setDeletingId(null)
      }
    })
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'SUGGESTION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-300 text-black border border-black">
            <Lightbulb className="w-3 h-3" />
            Saran Fitur
          </span>
        )
      case 'BUG':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-red-300 text-black border border-black">
            <Bug className="w-3 h-3" />
            Lapor Bug
          </span>
        )
      case 'CRITICISM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-orange-300 text-black border border-black">
            <MessageSquareWarning className="w-3 h-3" />
            Kritik
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-300 text-black border border-black">
            <Heart className="w-3 h-3" />
            Apresiasi / Lainnya
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider block mb-1">
            Total Masukan
          </span>
          <div className="text-2xl font-black text-foreground">
            {feedbacks.length}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            Kritik & saran dari pengunjung
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider block mb-1">
            Rata-rata Rating
          </span>
          <div className="text-2xl font-black text-foreground flex items-center gap-1.5">
            <span>{avgRating}</span>
            <Star className="w-5 h-5 fill-main text-black" />
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            Skala kepuasan 1 - 5 bintang
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider block mb-1">
            Ide Fitur Baru
          </span>
          <div className="text-2xl font-black text-amber-600">
            {suggestionCount}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            Permintaan fitur oleh pengguna
          </p>
        </div>

        <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 shadow-[4px_4px_0px_0px_var(--border)]">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider block mb-1">
            Laporan Bug / Kendala
          </span>
          <div className="text-2xl font-black text-red-600">
            {bugCount}
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground/60">
            Perlu investigasi teknis
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-3.5 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <input
            type="text"
            placeholder="Cari kata kunci pesan, nama, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterCategory === 'ALL'
                ? 'bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 border-2 border-border'
            }`}
          >
            Semua ({feedbacks.length})
          </button>
          <button
            onClick={() => setFilterCategory('SUGGESTION')}
            className={`px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterCategory === 'SUGGESTION'
                ? 'bg-amber-300 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 border-2 border-border'
            }`}
          >
            Saran ({suggestionCount})
          </button>
          <button
            onClick={() => setFilterCategory('BUG')}
            className={`px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterCategory === 'BUG'
                ? 'bg-red-300 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 border-2 border-border'
            }`}
          >
            Bug ({bugCount})
          </button>
          <button
            onClick={() => setFilterCategory('CRITICISM')}
            className={`px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterCategory === 'CRITICISM'
                ? 'bg-orange-300 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 border-2 border-border'
            }`}
          >
            Kritik ({criticismCount})
          </button>
          <button
            onClick={() => setFilterCategory('OTHER')}
            className={`px-3 py-1.5 rounded-[var(--radius-base)] text-xs font-black transition-all cursor-pointer ${
              filterCategory === 'OTHER'
                ? 'bg-emerald-300 text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]'
                : 'bg-background text-foreground/70 border-2 border-border'
            }`}
          >
            Lainnya ({otherCount})
          </button>
        </div>
      </div>

      {/* Feedback Items Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-10 text-center text-foreground/60 shadow-[4px_4px_0px_0px_var(--border)]">
            Belum ada kritik dan saran yang masuk.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)] space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {getCategoryBadge(item.category)}
                  
                  {item.rating && (
                    <div className="flex items-center gap-0.5 bg-background px-2 py-0.5 rounded border border-border">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-main text-black stroke-[2]" />
                      ))}
                    </div>
                  )}

                  <span className="text-xs font-black text-foreground">
                    {item.name || 'Pengguna Anonim'}
                  </span>

                  {item.email && (
                    <span className="text-[11px] text-foreground/60 font-mono bg-background px-1.5 py-0.2 rounded border border-border">
                      {item.email}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[11px] font-bold text-foreground/60">
                    {item.createdAt}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending && deletingId === item.id}
                    className="p-1 rounded bg-background hover:bg-red-500 hover:text-white border border-border text-foreground transition-colors cursor-pointer"
                    title="Hapus masukan"
                  >
                    {isPending && deletingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold text-foreground/85 leading-relaxed whitespace-pre-wrap bg-background p-3.5 rounded-[var(--radius-base)] border border-border">
                {item.message}
              </p>

              {item.imageUrl && (
                <div className="pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-foreground/60 block mb-1">
                    Lampiran Foto / Bukti:
                  </span>
                  <div className="relative inline-block border-2 border-border rounded-[var(--radius-base)] overflow-hidden shadow-[2px_2px_0px_0px_var(--border)] bg-background">
                    <img
                      src={item.imageUrl}
                      alt="Lampiran Feedback"
                      onClick={() => setPreviewImage(item.imageUrl!)}
                      className="max-h-40 max-w-xs object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(item.imageUrl!)}
                      className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 hover:bg-black text-white text-[10px] font-black rounded flex items-center gap-1 cursor-pointer"
                    >
                      <span>Perbesar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Zoom Gambar */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-secondary-background border-3 border-border rounded-[var(--radius-base)] p-3 max-w-2xl max-h-[90vh] flex flex-col gap-2 shadow-[8px_8px_0px_0px_var(--border)]"
          >
            <div className="flex justify-between items-center pb-2 border-b-2 border-border">
              <span className="text-xs font-black text-foreground uppercase tracking-wider">
                Lampiran Foto Pengguna
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-2 py-1 bg-main border border-border rounded text-xs font-black text-black cursor-pointer hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-background rounded p-1 border border-border">
              <img
                src={previewImage}
                alt="Detail Lampiran"
                className="max-h-[70vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
