"use client"

import { useState } from "react"
import { resetUserVehiclesForTesting } from "./actions"
import { RotateCcw } from "lucide-react"

export default function ResetTestVehiclesButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua kendaraan uji coba untuk mengulang alur Welcome dari awal?")) {
      return
    }

    setIsLoading(true)
    const res = await resetUserVehiclesForTesting()
    setIsLoading(false)

    if (res.success) {
      window.location.reload()
    } else {
      alert(res.error || "Gagal mereset data.")
    }
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4D50] text-white border-2 border-border font-bold text-xs shadow-[3px_3px_0px_0px_var(--border)] rounded-[var(--radius-base)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] disabled:opacity-50 cursor-pointer shrink-0 uppercase"
      title="Hapus data kendaraan uji coba untuk tes ulang alur awal"
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <RotateCcw className="w-3.5 h-3.5" />
      )}
      <span>Reset Data Tes</span>
    </button>
  )
}
