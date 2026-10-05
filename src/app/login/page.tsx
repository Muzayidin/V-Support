import { Suspense } from "react"
import CruzLogo from "@/components/CruzLogo"
import { signIn } from "@/auth"
import { ShieldCheck, Wrench, Zap } from "lucide-react"
import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      {/* Main Glass Card */}
      <div className="relative w-full max-w-[440px] z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <CruzLogo className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center justify-center gap-2">
            Cruz
          </h1>
          <p className="mt-1 text-xs text-foreground/80 font-bold max-w-xs mx-auto">
            Pantau kondisi komponen, riwayat servis, dan estimasi perawatan kendaraan Anda.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-secondary-background border-2 border-border shadow-[6px_6px_0px_0px_var(--border)] rounded-[var(--radius-base)] p-6 sm:p-8 space-y-6">
          <Suspense fallback={<div className="p-4 text-center text-xs font-bold text-foreground/60 animate-pulse">Memuat formulir...</div>}>
            <LoginForm />
          </Suspense>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t-2 border-border w-full" />
            <span className="bg-secondary-background px-3 text-xs font-black uppercase tracking-wider text-foreground absolute">
              atau
            </span>
          </div>

          {/* Google Button */}
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 bg-background hover:bg-slate-200 border-2 border-border rounded-[var(--radius-base)] text-xs font-black text-foreground transition-all duration-200 shadow-[3px_3px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>
          </form>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 flex items-center justify-center gap-4 text-foreground text-xs font-black">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
            <Wrench className="w-3.5 h-3.5" />
            <span>Kalkulasi Otomatis</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>EV & ICE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Terenkripsi</span>
          </div>
        </div>

        <p suppressHydrationWarning className="mt-6 text-center text-[11px] font-black text-foreground/60">
          © {new Date().getFullYear()} Cruz. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </div>
  )
}
