import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  title: "TOTORAS | イベントコミュニティ",
  description:
    "若い男女向けのイベントコミュニティ TOTORAS の公式ウェブサイト。サウナ、フットサル、その他様々なイベントを開催しています。",
  keywords: "TOTORAS, イベント, コミュニティ, サウナ, フットサル, 東京, 交流会",
  openGraph: {
    title: "TOTORAS | イベントコミュニティ",
    description: "若い男女向けのイベントコミュニティ TOTORAS の公式ウェブサイト",
    url: "https://totoras.jp",
    siteName: "TOTORAS",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "TOTORAS Logo",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOTORAS | イベントコミュニティ",
    description: "若い男女向けのイベントコミュニティ TOTORAS の公式ウェブサイト",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#ff6b6b",
  manifest: "/manifest.json",
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://totoras.jp",
    languages: {
      "ja-JP": "https://totoras.jp",
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
