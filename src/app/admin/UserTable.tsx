'use client'

import { useState, useTransition } from 'react'
import { updateUserRole, deleteUser } from './actions'
import { 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  Trash2, 
  Bike, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react'

export type AdminUserRow = {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: string
  vehicleCount: number
  serviceCount: number
  image: string | null
}

export default function UserTable({ 
  users, 
  currentDevId 
}: { 
  users: AdminUserRow[]
  currentDevId: string 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL')
  const [isPending, startTransition] = useTransition()
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterRole === 'ALL') return matchesSearch
    return matchesSearch && u.role === filterRole
  })

  const handleRoleToggle = (user: AdminUserRow) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    const confirmMsg = user.role === 'ADMIN'
      ? `Turunkan status admin untuk ${user.email}?`
      : `Jadikan ${user.email} sebagai Administrator?`

    if (!window.confirm(confirmMsg)) return

    setActiveActionId(user.id)
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await updateUserRole(user.id, newRole)
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal mengubah role pengguna.')
      } finally {
        setActiveActionId(null)
      }
    })
  }

  const handleDeleteUser = (user: AdminUserRow) => {
    if (user.id === currentDevId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri.')
      return
    }

    const confirmMsg = `PERINGATAN: Hapus pengguna "${user.email}" beserta semua data kendaraan dan riwayat servisnya secara permanen?`
    if (!window.confirm(confirmMsg)) return

    setActiveActionId(user.id)
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await deleteUser(user.id)
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal menghapus pengguna.')
      } finally {
        setActiveActionId(null)
      }
    })
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border-2 border-red-500 text-red-600 rounded-[var(--radius-base)] text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold placeholder:text-foreground/40 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="flex gap-1.5 shrink-0">
          {(['ALL', 'ADMIN', 'USER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 text-xs font-black rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer ${
                filterRole === r
                  ? 'bg-main text-foreground'
                  : 'bg-secondary-background text-foreground/70 hover:bg-background'
              }`}
            >
              {r === 'ALL' ? 'Semua' : r}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-background/50 text-[11px] font-black uppercase text-foreground/70 tracking-wider">
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Servis</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-foreground/60 font-bold">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentDev = user.id === currentDevId
                  const isBusy = isPending && activeActionId === user.id

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-background/40 transition-colors ${
                        isCurrentDev ? 'bg-main/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[var(--radius-base)] border-2 border-border bg-main font-black text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-[1px_1px_0px_0px_var(--border)]">
                            {user.image && (user.image.startsWith('http') || user.image.startsWith('/') || user.image.startsWith('data:')) ? (
                              <img 
                                src={user.image} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            ) : user.image ? (
                              <span className="text-base select-none leading-none">{user.image}</span>
                            ) : (
                              (user.name || user.email || 'U')[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-foreground truncate flex items-center gap-1.5">
                              {user.name || 'Tanpa Nama'}
                              {isCurrentDev && (
                                <span className="text-[10px] bg-foreground text-background px-1.5 py-0.2 rounded font-black">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-medium text-foreground/70 truncate">
                              {user.email || '-'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[var(--radius-base)] border-2 border-border text-[11px] font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] ${
                            user.role === 'ADMIN'
                              ? 'bg-amber-400 text-black'
                              : 'bg-background text-foreground'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <UserIcon className="w-3 h-3" />
                          )}
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5 text-foreground/60" />
                          {user.vehicleCount}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-foreground">
                        {user.serviceCount} log
                      </td>

                      <td className="py-3 px-4 text-foreground/70 font-medium text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-foreground/50" />
                          {user.createdAt}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleRoleToggle(user)}
                            disabled={isBusy || (isCurrentDev && user.role === 'ADMIN')}
                            title={user.role === 'ADMIN' ? 'Jadikan User Biasa' : 'Jadikan Admin'}
                            className={`p-1.5 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-xs font-black transition-all cursor-pointer ${
                              user.role === 'ADMIN'
                                ? 'bg-background hover:bg-slate-200 text-foreground'
                                : 'bg-amber-400 hover:bg-amber-300 text-black'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={isBusy || isCurrentDev}
                            title="Hapus Akun Pengguna"
                            className="p-1.5 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] text-xs font-black bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
