'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPwaRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Deteksi apakah aplikasi dibuka di mode Standalone PWA atau .apk (WebView / TWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.location.search.includes('source=pwa') ||
      window.location.search.includes('source=apk')

    if (isStandalone) {
      router.replace('/dashboard')
    }
  }, [router])

  return null
}
