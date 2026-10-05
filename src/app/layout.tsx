import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cruz" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Cruz" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                if (document.readyState === 'complete') {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' });
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' });
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen">
        <AppShell isAuthenticated={!!session?.user?.id}>{children}</AppShell>
      </body>
    </html>
  );
}
