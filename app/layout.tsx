import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { languages, fallbackLng } from './i18n/settings'
import { dir } from 'i18next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Merge - Merge PDF files online',
  description: 'Merge multiple PDF files into one document online. No server upload required. Free and easy to use.',
  keywords: 'PDF merge, PDF combine, PDF files, online PDF tools, free PDF tools',
  authors: [{ name: 'PDF Merge Team' }],
  openGraph: {
    title: 'PDF Merge',
    description: 'Merge multiple PDF files into one document online',
    type: 'website',
    locale: 'en_US',
    siteName: 'PDF Merge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Merge',
    description: 'Merge multiple PDF files into one document online',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }))
}

export default function RootLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const validLang = languages.includes(lang) ? lang : fallbackLng

  return (
    <html lang={validLang} dir={dir(validLang)} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 