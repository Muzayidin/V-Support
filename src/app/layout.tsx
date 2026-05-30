import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "V-Support | Motor Maintenance",
  description: "Aplikasi perawatan motor dan estimasi servis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-surface-bg text-on-surface antialiased min-h-[100dvh] pb-24 md:max-w-md md:mx-auto md:shadow-2xl relative">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
