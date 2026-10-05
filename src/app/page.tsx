import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LandingClientView from './landing/LandingClientView'
import RootPwaRedirect from './RootPwaRedirect'

export const metadata = {
  title: 'Cruz — Asisten Perawatan Motor Pintar',
  description: 'Aplikasi pendamping cerdas untuk Motor Bensin (ICE) dan Motor Listrik (EV). Pantau kondisi fisik komponen, estimasi jadwal servis, dan miliki buku servis digital.',
}

export default async function HomePage() {
  const session = await auth()

  // Jika pengguna sudah login, arahkan langsung ke dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <>
      <RootPwaRedirect />
      <LandingClientView />
    </>
  )
}
