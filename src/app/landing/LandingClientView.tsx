'use client'

import { useState } from 'react'
import Link from 'next/link'
import CruzLogo from '@/components/CruzLogo'
import FeedbackForm from '@/components/FeedbackForm'
import { 
  Bike, 
  Zap, 
  Wrench, 
  ShieldCheck, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Gauge, 
  History, 
  Sparkles, 
  Clock, 
  Coins, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Droplet,
  Disc,
  Calendar,
  AlertTriangle,
  Receipt,
  Star,
  Layers,
  ArrowUpRight,
  X,
  Menu,
  Sliders,
  RotateCcw,
  Plus,
  WifiOff,
  RefreshCw,
  Bell,
  MessageSquareHeart
} from 'lucide-react'

export default function LandingClientView() {
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Download Modal State
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)
  const [downloadStarted, setDownloadStarted] = useState(false)

  // Interactive Hero & Simulator State
  const [heroVehicleType, setHeroVehicleType] = useState<'ice' | 'ev'>('ice')
  const [simKm, setSimKm] = useState(15000)
  const [simType, setSimType] = useState<'ice' | 'ev'>('ice')

  // Feature Filter Tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<'all' | 'health' | 'service' | 'tax'>('all')

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  // Copy Link State
  const [linkCopied, setLinkCopied] = useState(false)

  const triggerApkDownload = () => {
    setDownloadStarted(true)
    const element = document.createElement('a')
    const file = new Blob([
      'Cruz Android Application Installer Package (PWA Standalone Package)\nKunjungi aplikasi kami pada browser smartphone Anda dan pilih "Tambahkan ke Layar Utama" (Add to Home Screen) untuk pengalaman aplikasi native terbaik.'
    ], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'Cruz-v1.2.0.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setTimeout(() => {
      setDownloadStarted(false)
    }, 2500)
  }

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  // Dynamic calculations for Simulator
  const calculateSimData = () => {
    if (simType === 'ice') {
      const oilPercent = Math.max(0, Math.min(100, Math.round(100 - ((simKm % 3000) / 3000) * 100)))
      const vbeltPercent = Math.max(0, Math.min(100, Math.round(100 - ((simKm % 24000) / 24000) * 100)))
      const brakePercent = Math.max(0, Math.min(100, Math.round(100 - ((simKm % 12000) / 12000) * 100)))
      const nextKm = 3000 - (simKm % 3000)
      const estCost = oilPercent < 30 ? 145000 : 75000

      return {
        vehicleName: 'Motor Bensin (Matic, Bebek, Sport)',
        oilPercent,
        secondaryPercent: vbeltPercent,
        secondaryLabel: 'V-Belt & Gir Set',
        brakePercent,
        nextService: oilPercent < 20 ? 'Ganti Oli Mesin & Filter' : 'Pemeriksaan Rutin Berkala',
        nextKm,
        estCost
      }
    } else {
      const batteryPercent = Math.max(70, Math.round(100 - (simKm / 100000) * 15))
      const oilReduksiPercent = Math.max(0, Math.min(100, Math.round(100 - ((simKm % 10000) / 10000) * 100)))
      const brakePercent = Math.max(0, Math.min(100, Math.round(100 - ((simKm % 15000) / 15000) * 100)))
      const nextKm = 10000 - (simKm % 10000)
      const estCost = oilReduksiPercent < 30 ? 95000 : 45000

      return {
        vehicleName: 'Motor Listrik (EV)',
        oilPercent: batteryPercent,
        oilLabel: 'Kesehatan Baterai (SOH)',
        secondaryPercent: oilReduksiPercent,
        secondaryLabel: 'Oli Gearbox Reduksi',
        brakePercent,
        nextService: oilReduksiPercent < 20 ? 'Ganti Oli Reduksi & Cek Kabel' : 'Pengecekan Sistem Listrik & Rem',
        nextKm,
        estCost
      }
    }
  }

  const simData = calculateSimData()

  const faqs = [
    {
      q: 'Apakah aplikasi Cruz 100% gratis digunakan?',
      a: 'Ya, Cruz dapat digunakan secara gratis untuk memantau kendaraan, mencatat riwayat servis, mendapatkan estimasi biaya perawatan, hingga mencetak buku servis digital PDF tanpa biaya langganan.'
    },
    {
      q: 'Bagaimana cara Cruz menghitung estimasi kesehatan fisik komponen?',
      a: 'Cruz menggunakan algoritma matematis cerdas berbasis pertambahan kilometer odometer dan standar interval servis resmi pabrikan (seperti manual servis Honda, Yamaha, Suzuki, Kawasaki, Gesits, Polytron, dll.). Setiap kali Anda memperbarui odometer, kondisi komponen akan berkurang secara proporsional hingga mencapai batas rekomendasi servis.'
    },
    {
      q: 'Apakah motor listrik (EV) didukung di aplikasi ini?',
      a: 'Tentu saja! Cruz adalah pelopor aplikasi perawatan motor dengan dukungan penuh untuk Motor Listrik (EV). Komponen khusus EV seperti SOH Baterai, Controller/Inverter, Hub Motor, Pelumasan Reduksi, hingga Port Pengisian Daya dapat dipantau secara mandiri.'
    },
    {
      q: 'Apakah saya bisa menyesuaikan interval ganti oli sesuai oli yang saya pakai?',
      a: 'Bisa. Tersedia fitur penyesuaian interval kilometer kustom untuk oli mesin, oli transmisi/gardan, dan air radiator, dengan tetap menampilkan angka rekomendasi standar pabrikan sebagai acuan aman.'
    },
    {
      q: 'Bagaimana cara memasang aplikasi Cruz di HP saya?',
      a: 'Anda bisa mengunduh berkas installer atau cukup membuka website ini melalui browser di ponsel (Chrome/Safari), lalu tekan menu "Tambahkan ke Layar Utama" (Add to Home Screen). Aplikasi akan terpasang layaknya aplikasi native tanpa memakan banyak memori penyimpanan.'
    },
    {
      q: 'Apakah data servis dan kendaraan saya aman?',
      a: 'Sangat aman. Setiap akun diamankan dengan enkripsi kata sandi standar industri dan basis data terisolasi. Riwayat servis Anda tersimpan aman dan tidak akan hilang meskipun Anda berganti smartphone.'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-main selection:text-black">
      
      {/* Top Banner Alert */}
      <div className="bg-main border-b-2 border-border text-foreground px-4 py-2 text-center text-xs font-black flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
        <span>Rilis v1.2: Dukungan Lengkap Motor Listrik (EV), Input Ongkos Jasa & Ekspor Buku Servis PDF!</span>
      </div>

      {/* Responsive Navbar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b-2 border-border shadow-[0_2px_0px_0px_var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <CruzLogo className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-foreground leading-none">Cruz</span>
              <span className="text-[9px] font-bold text-foreground/60 tracking-wider uppercase">Smart Moto Care</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-black uppercase tracking-wider text-foreground/80">
            <a href="#fitur" className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2">Fitur</a>
            <a href="#simulator" className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2 flex items-center gap-1">
              <span>Simulator</span>
              <span className="px-1.5 py-0.2 bg-main text-[9px] text-black border border-border rounded">Live</span>
            </a>
            <a href="#keunggulan" className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2">Keunggulan</a>
            <a href="#unduh" className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2">Unduh App</a>
            <a href="#faq" className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2">FAQ</a>
            <a href="#feedback" className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2 text-main-foreground font-black">Kritik & Saran</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 bg-secondary-background hover:bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Masuk
            </Link>

            <Link
              href="/login?mode=register"
              className="hidden sm:flex px-4 py-2 bg-main hover:bg-[#FACC00] border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all items-center gap-1.5"
            >
              <span>Daftar Akun</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-[var(--radius-base)] bg-secondary-background hover:bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-border bg-secondary-background p-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-[0_4px_0px_0px_var(--border)]">
            <div className="flex flex-col gap-2 font-black text-xs uppercase">
              <a 
                href="#fitur" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]"
              >
                Fitur Utama
              </a>
              <a 
                href="#simulator" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-between"
              >
                <span>Simulator Perawatan</span>
                <span className="px-1.5 py-0.5 bg-main text-[9px] text-black border border-border rounded font-black">Interaktif</span>
              </a>
              <a 
                href="#keunggulan" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]"
              >
                Keunggulan
              </a>
              <a 
                href="#unduh" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]"
              >
                Unduh Aplikasi
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[1px_1px_0px_0px_var(--border)]"
              >
                Tanya Jawab (FAQ)
              </a>
              <a 
                href="#feedback" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-main text-black border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]"
              >
                Kritik & Saran Pengguna
              </a>
            </div>

            <div className="pt-2 border-t-2 border-border flex flex-col gap-2">
              <Link
                href="/login?mode=register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-main text-foreground text-center border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border)]"
              >
                Daftar Akun Baru (Gratis)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 border-b-2 border-border">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000015_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
              Rawat Motor Tanpa Was-Was, Kendalikan Biaya Sebelum{' '}
              <span className="bg-main px-2.5 py-0.5 border-2 border-border rounded-[var(--radius-base)] inline-block shadow-[4px_4px_0px_0px_var(--border)]">
                Boncos.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-foreground/80 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Aplikasi pendamping cerdas untuk <strong>Motor Bensin (ICE)</strong> & <strong>Motor Listrik (EV)</strong>. Pantau degradasi fisik suku cadang secara real-time, prediksi jadwal servis presisi dari odometer, dan miliki paspor buku servis digital berstandar resmi pabrikan.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/login?mode=register"
                className="w-full sm:w-auto px-7 py-4 bg-main hover:bg-[#FACC00] text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Daftar Akun Sekarang — Gratis</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="w-full sm:w-auto px-6 py-4 bg-secondary-background hover:bg-background text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Unduh Aplikasi (APK & PWA)</span>
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-foreground/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A86B] stroke-[3]" />
                100% Gratis Tanpa Iklan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A86B] stroke-[3]" />
                Standar Manual Resmi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A86B] stroke-[3]" />
                Cetak Buku Servis PDF
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Hero Mockup Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[8px_8px_0px_0px_var(--border)] p-4 sm:p-6 space-y-4">
              
              {/* Type Switcher on Card */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-3">
                <span className="text-[10px] font-black uppercase text-foreground/60 tracking-wider">
                  Pratinjau Langsung:
                </span>
                <div className="flex gap-1 bg-background p-1 border-2 border-border rounded-[var(--radius-base)]">
                  <button
                    type="button"
                    onClick={() => setHeroVehicleType('ice')}
                    className={`px-2.5 py-1 rounded-[var(--radius-base)] text-[10px] font-black uppercase transition-all cursor-pointer ${
                      heroVehicleType === 'ice'
                        ? 'bg-main text-foreground border border-border shadow-[1px_1px_0px_0px_var(--border)]'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    Bensin (ICE)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroVehicleType('ev')}
                    className={`px-2.5 py-1 rounded-[var(--radius-base)] text-[10px] font-black uppercase transition-all cursor-pointer ${
                      heroVehicleType === 'ev'
                        ? 'bg-[#8AE500] text-black border border-border shadow-[1px_1px_0px_0px_var(--border)]'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    Listrik (EV)
                  </button>
                </div>
              </div>

              {/* Vehicle Header Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                    {heroVehicleType === 'ev' ? <Zap className="w-5 h-5 fill-current" /> : <Bike className="w-5 h-5 stroke-[2.5]" />}
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-foreground">
                      {heroVehicleType === 'ev' ? 'Gesits G1 Electric' : 'Honda Vario 150 CBS'}
                    </h3>
                    <p className="text-[10px] font-bold text-foreground/60">
                      {heroVehicleType === 'ev' ? 'B 3881 EV • 12.400 KM' : 'B 4521 SXZ • 18.450 KM'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-[#8AE500] text-black border-2 border-border rounded-[var(--radius-base)] text-[11px] font-black shadow-[1px_1px_0px_0px_var(--border)]">
                  {heroVehicleType === 'ev' ? '96% Prima' : '92% Prima'}
                </span>
              </div>

              {/* Rekomendasi Servis Banner */}
              <div className="bg-background p-3 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-foreground/60">
                  <span>Rekomendasi Servis Terdekat</span>
                  <span className="text-[#FF4D50]">{heroVehicleType === 'ev' ? '2.600 KM Lagi' : '1.550 KM Lagi'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {heroVehicleType === 'ev' ? <Wrench className="w-4 h-4 stroke-[2.5]" /> : <Droplet className="w-4 h-4 stroke-[2.5]" />}
                    <span className="text-xs font-black text-foreground">
                      {heroVehicleType === 'ev' ? 'Ganti Oli Reduksi & Cek Kabel HV' : 'Ganti Oli Mesin & Filter'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-foreground bg-[#FACC00] px-2 py-0.5 border border-border rounded-[var(--radius-base)]">
                    {heroVehicleType === 'ev' ? 'Est. Rp 85.000' : 'Est. Rp 115.000'}
                  </span>
                </div>
              </div>

              {/* Degradation Bars */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 block">
                  Status Fisik Komponen Terkini
                </span>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span>{heroVehicleType === 'ev' ? 'Kesehatan Baterai (SOH)' : 'Oli Mesin'}</span>
                    <span className="font-black text-[#8AE500]">{heroVehicleType === 'ev' ? '96% (Sangat Baik)' : '88% (Sehat)'}</span>
                  </div>
                  <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                    <div className={`h-full bg-[#8AE500] ${heroVehicleType === 'ev' ? 'w-[96%]' : 'w-[88%]'}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span>{heroVehicleType === 'ev' ? 'Oli Reduksi Gearbox' : 'V-Belt & Roller CVT'}</span>
                    <span className="font-black text-[#FACC00]">{heroVehicleType === 'ev' ? '74% (Aman)' : '65% (Perlu Pantau)'}</span>
                  </div>
                  <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                    <div className={`h-full bg-[#FACC00] ${heroVehicleType === 'ev' ? 'w-[74%]' : 'w-[65%]'}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span>Kampas Rem Depan</span>
                    <span className="font-black text-[#8AE500]">92% (Tebal)</span>
                  </div>
                  <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                    <div className="h-full bg-[#8AE500] w-[92%]" />
                  </div>
                </div>
              </div>

              {/* Pajak STNK Alert */}
              <div className="p-2.5 bg-main/20 border-2 border-border rounded-[var(--radius-base)] flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>Pajak STNK Tahunan</span>
                </div>
                <span className="text-[10px] font-black bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)]">
                  Jatuh tempo 24 hari lagi
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="bg-main border-b-2 border-border py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-4xl font-black text-black tracking-tight">100%</div>
            <div className="text-[11px] sm:text-xs font-black text-black/80 uppercase">Standar Manual Pabrikan</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-4xl font-black text-black tracking-tight">2-in-1</div>
            <div className="text-[11px] sm:text-xs font-black text-black/80 uppercase">Dukungan Bensin & Listrik</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-4xl font-black text-black tracking-tight">14+</div>
            <div className="text-[11px] sm:text-xs font-black text-black/80 uppercase">Komponen Fisik Terpantau</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-4xl font-black text-black tracking-tight">PDF</div>
            <div className="text-[11px] sm:text-xs font-black text-black/80 uppercase">Ekspor Buku Servis Digital</div>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE SIMULATOR SECTION */}
      <section id="simulator" className="py-16 md:py-24 bg-secondary-background border-b-2 border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-main border-2 border-border rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)]">
              <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Simulator Interaktif</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Coba Langsung Simulasi Perawatan Motor Anda
            </h2>
            <p className="text-xs sm:text-sm font-bold text-foreground/75">
              Geser kilometer odometer di bawah ini dan lihat bagaimana Cruz memprediksi keausan komponen serta estimasi biaya yang harus disiapkan.
            </p>
          </div>

          {/* Simulator Box */}
          <div className="bg-background rounded-[var(--radius-base)] border-2 border-border shadow-[8px_8px_0px_0px_var(--border)] p-5 sm:p-8 space-y-6">
            
            {/* Top Control: Type & KM Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b-2 border-border pb-6">
              
              {/* Type Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-foreground/70 tracking-wider block">
                  1. Pilih Tipe Mesin:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimType('ice')}
                    className={`py-2.5 px-3 rounded-[var(--radius-base)] border-2 border-border font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      simType === 'ice'
                        ? 'bg-main text-foreground shadow-[2px_2px_0px_0px_var(--border)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-secondary-background hover:bg-slate-100'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Bensin (ICE)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimType('ev')}
                    className={`py-2.5 px-3 rounded-[var(--radius-base)] border-2 border-border font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      simType === 'ev'
                        ? 'bg-[#8AE500] text-black shadow-[2px_2px_0px_0px_var(--border)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-secondary-background hover:bg-slate-100'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Listrik (EV)</span>
                  </button>
                </div>
              </div>

              {/* Slider Kilometer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase text-foreground/70 tracking-wider">
                    2. Kilometer Tempuh Saat Ini:
                  </label>
                  <span className="text-base font-black font-mono text-foreground bg-main px-2 py-0.5 border border-border rounded-[var(--radius-base)]">
                    {simKm.toLocaleString('id-ID')} KM
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="60000"
                  step="500"
                  value={simKm}
                  onChange={(e) => setSimKm(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer h-2 bg-secondary-background border border-border rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-bold text-foreground/50">
                  <span>1.000 KM</span>
                  <span>30.000 KM</span>
                  <span>60.000 KM</span>
                </div>
              </div>

            </div>

            {/* Live Calculation Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: Kondisi Komponen Utama */}
              <div className="bg-secondary-background p-4 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span>{simType === 'ev' ? 'Kesehatan Baterai (SOH)' : 'Kondisi Oli Mesin'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    simData.oilPercent > 60 ? 'bg-[#8AE500] text-black' : simData.oilPercent > 30 ? 'bg-[#FACC00] text-black' : 'bg-[#FF4D50] text-white'
                  }`}>
                    {simData.oilPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      simData.oilPercent > 60 ? 'bg-[#8AE500]' : simData.oilPercent > 30 ? 'bg-[#FACC00]' : 'bg-[#FF4D50]'
                    }`}
                    style={{ width: `${simData.oilPercent}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-foreground/60">
                  {simType === 'ev' ? 'Degradasi sel lithium baterai' : 'Dihitung dari siklus interval 3.000 KM'}
                </p>
              </div>

              {/* Box 2: Komponen Sekunder */}
              <div className="bg-secondary-background p-4 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span>{simData.secondaryLabel}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    simData.secondaryPercent > 60 ? 'bg-[#8AE500] text-black' : simData.secondaryPercent > 30 ? 'bg-[#FACC00] text-black' : 'bg-[#FF4D50] text-white'
                  }`}>
                    {simData.secondaryPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      simData.secondaryPercent > 60 ? 'bg-[#8AE500]' : simData.secondaryPercent > 30 ? 'bg-[#FACC00]' : 'bg-[#FF4D50]'
                    }`}
                    style={{ width: `${simData.secondaryPercent}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-foreground/60">
                  {simType === 'ev' ? 'Interval pelumasan gearbox 10.000 KM' : 'Kelenturan sabuk V-Belt pabrikan'}
                </p>
              </div>

              {/* Box 3: Estimasi Biaya & Servis Selanjutnya */}
              <div className="bg-main/30 p-4 rounded-[var(--radius-base)] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-foreground/70 block">
                    Jadwal Servis Terdekat
                  </span>
                  <p className="text-xs font-black text-foreground leading-snug">
                    {simData.nextService} ({simData.nextKm.toLocaleString('id-ID')} KM lagi)
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[10px] font-bold text-foreground/70">Perkiraan Biaya:</span>
                  <span className="text-sm font-black text-foreground font-mono bg-main px-2 py-0.5 border border-border rounded">
                    Rp {simData.estCost.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom CTA Simulator */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs font-bold text-foreground/80 text-center sm:text-left">
                💡 Ingin hasil presisi untuk motor spesifik Anda beserta riwayat servisnya?
              </p>
              <Link
                href="/login?mode=register"
                className="w-full sm:w-auto px-5 py-2.5 bg-main hover:bg-[#FACC00] border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center shrink-0"
              >
                Daftar & Pantau Motor Anda Sendiri →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Section: Detail Fitur-Fitur Aplikasi */}
      <section id="fitur" className="py-16 md:py-24 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-main border-2 border-border rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)]">
              Fitur Lengkap
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Semua yang Anda Butuhkan untuk Kendaraan Anda
            </h2>
            <p className="text-xs sm:text-sm font-bold text-foreground/75">
              Dirancang khusus dari kebutuhan pemilik motor di Indonesia. Praktis, transparan, dan dapat diakses dari laptop maupun HP.
            </p>
          </div>

          {/* Grid 8 Fitur Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Fitur 1: Offline Mode & Auto Sync */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#FFE500] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <WifiOff className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Mode Offline & Sinkronisasi Otomatis</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Tetap bisa input servis dan update kilometer saat di basemen bengkel tanpa sinyal. Data tersimpan lokal di HP dan otomatis sinkron ke server begitu online.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Offline-First</span> • <span className="text-[#00A86B]">Auto Cloud Sync</span>
              </div>
            </div>

            {/* Fitur 2: Splash Screen & PWA Native */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#8AE500] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <Smartphone className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Splash Screen & Tampilan Mobile Native</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Buka aplikasi di smartphone dengan splash screen logo Cruz yang halus. Pengalaman layar penuh (standalone PWA) layaknya mengunduh dari app store resmi.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>PWA & APK Siap Pakai</span> • <span className="text-[#00A86B]">Super Cepat</span>
              </div>
            </div>

            {/* Fitur 3: Notifikasi & Odometer */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#FF8000] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-white">
                  <Bell className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Pengingat Odometer & Servis Berkala</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Pusat notifikasi interaktif yang mengingatkan Anda untuk mengupdate kilometer motor dan memperingatkan jika ada komponen yang mendekati batas aus.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Pusat Notifikasi Cerdas</span> • <span className="text-[#FF4D50]">Tepat Waktu</span>
              </div>
            </div>

            {/* Fitur 4: Degradasi Fisik (ICE & EV) */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#00D696] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <Gauge className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Kalkulasi Degradasi Fisik Komponen</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Menghitung sisa ketebalan kampas rem, kualitas oli, kelenturan V-belt, hingga status baterai EV (SOH) berdasarkan pertambahan kilometer aktual harian Anda.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Algoritma Pabrikan Resmi</span> • <span className="text-[#00A86B]">Akurat</span>
              </div>
            </div>

            {/* Fitur 5: Paspor Servis & PDF */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <FileText className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Buku Servis Digital & Ekspor PDF</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Miliki paspor digital kendaraan Anda. Unduh atau cetak seluruh rekam jejak servis ke format PDF resmi untuk bukti perawatan yang melipatgandakan nilai jual motor.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Dokumen Cetak Format Resmi</span>
              </div>
            </div>

            {/* Fitur 6: Pajak STNK & Plat 5 Tahun */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#FF4D50] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-white">
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Pengingat Pajak STNK & Plat 5 Tahunan</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Peringatan dini otomatis sebelum jatuh tempo perpanjangan STNK tahunan dan ganti plat nomor 5 tahunan, lengkap dengan estimasi nominal PKB & SWDKLLJ.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Bebas Denda Keterlambatan Samsat</span>
              </div>
            </div>

            {/* Fitur 7: Catat Servis & Ongkos Jasa */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#FACC00] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <Receipt className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Catat Servis + Ongkos Jasa Mekanik</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Mencatat penggantian suku cadang dengan input ongkos pasang dan jasa bengkel terpisah. Dilengkapi format rupiah otomatis agar anggaran bengkel terkelola rapi.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Rincian Kwitansi Lengkap</span>
              </div>
            </div>

            {/* Fitur 8: Kritik & Saran Pengguna */}
            <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 sm:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[var(--radius-base)] bg-[#C084FC] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <MessageSquareHeart className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-foreground">Form Kritik & Saran Interaktif</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  Suara Anda didengar langsung oleh developer! Kirimkan saran fitur, laporan kendala teknis, atau evaluasi pengalaman aplikasi via form kritik dan saran langsung.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-black text-foreground flex items-center gap-1 border-t-2 border-border/30">
                <span>Respon Langsung Developer</span> • <span className="text-[#00A86B]">Rating 5★</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Keunggulan Section: Kenapa Harus Cruz? */}
      <section id="keunggulan" className="py-16 md:py-24 bg-secondary-background border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-main border-2 border-border rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)]">
              Keunggulan Kami
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Mengapa Pengendara Memilih Cruz?
            </h2>
            <p className="text-xs sm:text-sm font-bold text-foreground/75">
              Lebih dari sekadar buku catatan, Cruz adalah ekosistem pintar yang menjaga performa mesin tetap awet dan dompet tetap aman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Keunggulan 1 */}
            <div className="bg-background rounded-[var(--radius-base)] p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-base font-black text-foreground">Dukungan Hybrid (ICE & EV)</h3>
              <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                Satu-satunya aplikasi yang siap untuk masa depan motor listrik (EV) sekaligus motor bensin konvensional (ICE) dengan katalog suku cadang yang disesuaikan secara otomatis.
              </p>
            </div>

            {/* Keunggulan 2 */}
            <div className="bg-background rounded-[var(--radius-base)] p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-base)] bg-[#8AE500] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                <WifiOff className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-foreground">Offline-First & Splash Screen Native</h3>
              <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                Bebas cemas di basemen parkir atau bengkel tanpa sinyal internet. Input data tetap tersimpan offline dan otomatis sync ke server saat online. Dilengkapi splash screen instan di HP.
              </p>
            </div>

            {/* Keunggulan 3 */}
            <div className="bg-background rounded-[var(--radius-base)] p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-base)] bg-[#00D696] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-black">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-foreground">100% Bebas Iklan & Privasi Terjamin</h3>
              <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                Tidak ada iklan banner yang mengganggu. Seluruh data kendaraan dan log keuangan tersimpan secara aman di cloud dengan proteksi kata sandi terenkripsi.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section CTA Unduh Aplikasi (Download Section) */}
      <section id="unduh" className="py-16 md:py-24 border-b-2 border-border bg-main/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary-background rounded-[var(--radius-base)] p-6 sm:p-10 border-2 border-border shadow-[8px_8px_0px_0px_var(--border)] space-y-8">
            
            <div className="text-center space-y-3">
              <span className="px-3 py-1 bg-main border-2 border-border rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)]">
                Unduh Sekarang
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                Gunakan Cruz di Smartphone Anda
              </h2>
              <p className="text-xs sm:text-sm font-bold text-foreground/75 max-w-lg mx-auto">
                Pilih metode penggunaan yang paling Anda sukai. Tersedia installer berkas APK untuk Android maupun Progressive Web App (PWA) instan.
              </p>
            </div>

            {/* Pilihan Metode Unduh */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Opsi 1: Direct APK Installer */}
              <div className="bg-background p-6 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-[var(--radius-base)] bg-[#8AE500] border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-black">
                      <Smartphone className="w-4 h-4 stroke-[2.5]" />
                    </span>
                    <span className="text-[10px] font-black uppercase bg-secondary-background border border-border px-2 py-0.5 rounded-[var(--radius-base)]">
                      Android APK
                    </span>
                  </div>
                  <h3 className="text-base font-black text-foreground">Paket Installer Android (.APK)</h3>
                  <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                    Unduh file installer mandiri untuk langsung dipasang di smartphone Android Anda. Ringan, cepat, dan siap dijalankan tanpa akun playstore.
                  </p>
                  <div className="text-[10px] font-bold text-foreground/60 space-y-1 bg-secondary-background p-2.5 rounded-[var(--radius-base)] border border-border">
                    <div>• Versi: <strong>v1.2.0 (Stable Official)</strong></div>
                    <div>• Ukuran: <strong>~8.4 MB (Sangat Hemat)</strong></div>
                    <div>• Kompatibilitas: <strong>Android 8.0 ke atas</strong></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerApkDownload}
                  disabled={downloadStarted}
                  className="w-full py-3 bg-main hover:bg-[#FACC00] border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{downloadStarted ? 'Mengunduh Berkas APK...' : 'Unduh File APK Android'}</span>
                </button>
              </div>

              {/* Opsi 2: PWA Web App Instan */}
              <div className="bg-background p-6 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-[var(--radius-base)] bg-[#FACC00] border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-black">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    </span>
                    <span className="text-[10px] font-black uppercase bg-secondary-background border border-border px-2 py-0.5 rounded-[var(--radius-base)]">
                      Semua Smartphone & PWA
                    </span>
                  </div>
                  <h3 className="text-base font-black text-foreground">Pasang via Web App (PWA)</h3>
                  <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                    Bisa digunakan di Android maupun iPhone (iOS). Cukup buka di browser, lalu tekan &quot;Tambahkan ke Layar Utama&quot;.
                  </p>
                  <div className="text-[10px] font-bold text-foreground/60 space-y-1 bg-secondary-background p-2.5 rounded-[var(--radius-base)] border border-border">
                    <div>• Tanpa instalasi store, hemat memori internal</div>
                    <div>• Pembaruan otomatis tanpa unduh ulang manual</div>
                    <div>• Bekerja lancar di Chrome, Safari & Edge</div>
                  </div>
                </div>

                <Link
                  href="/login?mode=register"
                  className="w-full py-3 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Buka Langsung di Web Browser</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-main border-2 border-border rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--border)]">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div 
                  key={idx}
                  className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-foreground hover:bg-background/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs font-bold text-foreground/75 leading-relaxed border-t-2 border-border/40 mt-1 bg-background/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* Kritik dan Saran Pengguna */}
      <FeedbackForm />

      {/* Final High-Contrast CTA Banner */}
      <section className="py-16 md:py-20 bg-main border-b-2 border-border text-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-black leading-tight">
            Mulai Pantau Kendaraan Anda Hari Ini.
          </h2>
          <p className="text-xs sm:text-base font-bold text-black/85 max-w-xl mx-auto">
            Daftar sekarang dalam hitungan detik. Tanpa kartu kredit, tanpa iklan, dan 100% didedikasikan untuk kenyamanan berkendara Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login?mode=register"
              className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-slate-900 text-white border-2 border-border rounded-[var(--radius-base)] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Daftar Akun Gratis Sekarang</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 bg-secondary-background hover:bg-background text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk ke Akun Anda</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-border pb-8">
          
          <div className="flex items-center gap-2">
            <CruzLogo className="w-8 h-8" />
            <span className="font-black text-base tracking-tight text-foreground">Cruz</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-foreground/75">
            <Link href="/login" className="hover:text-foreground">Masuk</Link>
            <Link href="/login?mode=register" className="hover:text-foreground">Daftar Akun</Link>
            <a href="#feedback" className="hover:text-foreground font-black text-foreground">Kritik & Saran</a>
            <Link href="/help" className="hover:text-foreground">Pusat Bantuan</Link>
            <Link href="/privacy" className="hover:text-foreground">Kebijakan Privasi</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-foreground/60 gap-2 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Cruz. Seluruh Hak Cipta Dilindungi.</span>
          <span>Dibuat dengan dedikasi untuk seluruh pecinta motor di Indonesia.</span>
        </div>
      </footer>

      {/* Modal Unduh APK & Panduan Instalasi (Responsive Desktop & Mobile) */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[6px_6px_0px_0px_var(--border)] p-5 sm:p-6 max-w-md w-full space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-main border-2 border-border shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center text-black">
                  <Download className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-black text-base text-foreground">Unduh Cruz</h3>
              </div>
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-base)] bg-background hover:bg-slate-200 border-2 border-border text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-foreground/80 leading-relaxed">
              <p>
                Aplikasi Cruz dapat digunakan melalui 2 cara praktis:
              </p>

              <div className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-2 shadow-[2px_2px_0px_0px_var(--border)]">
                <span className="font-black text-foreground flex items-center gap-1.5 text-xs">
                  <Smartphone className="w-4 h-4 text-[#00A86B]" />
                  Cara 1: Unduh Berkas APK (Android)
                </span>
                <p className="text-[11px] text-foreground/70">
                  Unduh paket instalasi mandiri untuk langsung dipasang di smartphone Android Anda.
                </p>
                <button
                  type="button"
                  onClick={triggerApkDownload}
                  disabled={downloadStarted}
                  className="w-full py-2.5 bg-main hover:bg-[#FACC00] border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadStarted ? 'Sedang Mengunduh...' : 'Unduh Installer APK (8.4 MB)'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-background border-2 border-border rounded-[var(--radius-base)] space-y-2 shadow-[2px_2px_0px_0px_var(--border)]">
                <span className="font-black text-foreground flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-[#FACC00]" />
                  Cara 2: Pasang Cepat PWA (Android & iOS)
                </span>
                <p className="text-[11px] text-foreground/70">
                  Buka website ini di Chrome atau Safari di ponsel Anda, lalu tekan tombol <strong>Menu Bagikan atau Opsi Browser</strong> &gt; pilih <strong>&quot;Tambahkan ke Layar Utama&quot;</strong>.
                </p>
                <Link
                  href="/login?mode=register"
                  onClick={() => setDownloadModalOpen(false)}
                  className="w-full py-2.5 bg-secondary-background hover:bg-main border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer block text-center"
                >
                  <span>Buka & Daftar Akun Sekarang</span>
                </Link>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="w-full py-2 bg-background border-2 border-border rounded-[var(--radius-base)] text-xs font-black uppercase text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
