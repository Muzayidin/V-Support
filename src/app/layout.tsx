import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FFE500",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: {
    default: "Cruz — Asisten Perawatan Motor",
    template: "%s — Cruz",
  },
  description: "Aplikasi pendamping cerdas untuk Motor Bensin (ICE) dan Motor Listrik (EV). Pantau kondisi komponen, riwayat servis, dan estimasi biaya perawatan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cruz",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg" },
    ],
  },
  openGraph: {
    title: "Cruz — Asisten Perawatan Motor",
    description: "Pantau kondisi komponen, riwayat servis, dan estimasi biaya perawatan kendaraan Anda.",
    type: "website",
    locale: "id_ID",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head suppressHydrationWarning>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen">
        <AppShell isAuthenticated={!!session?.user?.id}>{children}</AppShell>
      </body>
    </html>
  );
}
