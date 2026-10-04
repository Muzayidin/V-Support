"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { loginWithCredentials, registerWithCredentials } from "./actions"
import { Mail, Lock, User, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const [isRegister, setIsRegister] = useState(() => searchParams.get('mode') === 'register')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // State untuk timer popup
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [timer, setTimer] = useState<number | null>(null)
  const [savedFormData, setSavedFormData] = useState<FormData | null>(null)

  useEffect(() => {
    if (timer === null) return
    if (timer > 0) {
      const id = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(id)
    } else {
      setSuccessMsg("Memasukkan Anda ke sistem...")
      if (savedFormData) {
        loginWithCredentials(savedFormData, "/welcome").then((res) => {
          if (res?.error) {
            setError(res.error)
            setIsLoading(false)
            setSuccessMsg(null)
          }
        })
      }
    }
  }, [timer, savedFormData])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccessMsg(null)
    
    if (isRegister) {
      const res = await registerWithCredentials(formData)
      if (res?.error) {
        setError(res.error)
        setIsLoading(false)
      } else if (res?.success) {
        setSuccessMsg("Akun Berhasil Dibuat!")
        setSavedFormData(formData)
        setTimer(3)
      }
    } else {
      const res = await loginWithCredentials(formData)
      if (res?.error) {
        setError(res.error)
        setIsLoading(false)
      }
    }
  }

  if (successMsg) {
    return (
      <div className="p-6 bg-main border-2 border-border rounded-[var(--radius-base)] text-center space-y-4 shadow-[5px_5px_0px_0px_var(--border)] animate-in fade-in duration-200">
        <div className="mx-auto w-14 h-14 bg-secondary-background rounded-full border-2 border-border flex items-center justify-center shadow-[3px_3px_0px_0px_var(--border)] text-black">
          <CheckCircle2 className="w-8 h-8 stroke-[3]" />
        </div>
        <div>
          <h3 className="text-lg font-black text-black tracking-tight">{successMsg}</h3>
          <p className="text-xs text-black/80 font-bold mt-1">
            Menyiapkan preferensi & spesifikasi kendaraan Anda.
          </p>
        </div>
        
        {timer !== null && timer > 0 && (
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <p className="text-xs font-black text-black">
              Otomatis beralih dalam <strong className="text-sm underline">{timer}</strong> detik...
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Segmented Tab Switcher */}
      <div className="flex p-1 bg-background rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] gap-1">
        <button
          type="button"
          onClick={() => { setIsRegister(false); setError(null); }}
          className={`flex-1 py-2 text-xs font-black rounded-[var(--radius-base)] transition-all cursor-pointer ${
            !isRegister
              ? "bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
              : "text-foreground hover:bg-slate-200 border-2 border-transparent"
          }`}
        >
          Masuk Akun
        </button>
        <button
          type="button"
          onClick={() => { setIsRegister(true); setError(null); }}
          className={`flex-1 py-2 text-xs font-black rounded-[var(--radius-base)] transition-all cursor-pointer ${
            isRegister
              ? "bg-main text-black border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
              : "text-foreground hover:bg-slate-200 border-2 border-transparent"
          }`}
        >
          Daftar Baru
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#FF4D50] text-black text-xs font-black rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form action={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
                <User className="w-4 h-4" />
              </div>
              <input
                required
                type="text"
                name="name"
                className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:bg-white focus:outline-none text-xs font-bold"
                placeholder="Mis. Ahmad Pratama"
              />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
              <Mail className="w-4 h-4" />
            </div>
            <input
              required
              type="email"
              name="email"
              className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:bg-white focus:outline-none text-xs font-bold"
              placeholder="nama@email.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-foreground mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/70">
              <Lock className="w-4 h-4" />
            </div>
            <input
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full pl-10 pr-10 py-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] text-foreground placeholder:text-foreground/50 shadow-[2px_2px_0px_0px_var(--border)] focus:bg-white focus:outline-none text-xs font-bold"
              placeholder={isRegister ? "Minimal 6 karakter" : "Masukkan kata sandi Anda"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-foreground hover:text-black transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-main hover:bg-[#8AE500] text-black font-black text-xs uppercase tracking-wider rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{isRegister ? "Daftar Akun Baru" : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
