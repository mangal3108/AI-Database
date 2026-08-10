import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Internite AI — Talk to your data. Understand everything.',
    template: '%s — Internite AI',
  },
  description:
    'Connect PostgreSQL, MySQL, MongoDB, Supabase, Neon and more. Ask questions in plain English and let Internite AI turn your data into answers.',
  keywords: ['database AI', 'SQL AI', 'natural language SQL', 'database chatbot', 'AI analytics'],
  authors: [{ name: 'Internite AI' }],
  creator: 'Internite AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Internite AI',
    title: 'Internite AI — Talk to your data. Understand everything.',
    description:
      'The AI-powered database intelligence platform. Connect any database and start asking questions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Internite AI',
    description: 'Talk to your data. Understand everything.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
