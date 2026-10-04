import LandingClientView from './landing/LandingClientView'

export const metadata = {
  title: 'Cruz — Asisten Perawatan Motor Pintar',
  description: 'Aplikasi pendamping cerdas untuk Motor Bensin (ICE) dan Motor Listrik (EV). Pantau kondisi fisik komponen, estimasi jadwal servis, dan miliki buku servis digital.',
}

export default function HomePage() {
  return <LandingClientView />
}
