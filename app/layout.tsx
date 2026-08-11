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
    default: 'AI Database Chatbot & Data Visualizer | Internite AI',
    template: '%s | Internite AI',
  },
  description:
    'Connect PostgreSQL, MySQL, MongoDB, Supabase, Neon and more. Ask your database questions in natural language, generate safe SQL, visualize results, and build dashboards with Internite AI.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  keywords: [
    'AI database chatbot',
    'natural language SQL',
    'text to SQL',
    'database AI',
    'AI SQL generator',
    'database chatbot',
    'AI analytics',
    'AI data visualizer',
    'PostgreSQL AI',
    'MySQL AI',
    'MongoDB AI',
    'Supabase AI',
    'business intelligence AI',
  ],
  authors: [{ name: 'Internite AI' }],
  creator: 'Internite AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://internite.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://internite.online',
    siteName: 'Internite AI',
    title: 'AI Database Chatbot & Data Visualizer | Internite AI',
    description:
      'Connect any database. Ask questions in plain English. Get safe SQL, instant visualizations, and dashboards in seconds — no SQL expertise required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Internite AI — Talk to your data. Not your SQL.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Database Chatbot & Data Visualizer | Internite AI',
    description: 'Connect your database, ask questions in plain English, get answers and charts instantly.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://internite.online/#organization',
        name: 'Internite AI',
        url: 'https://internite.online',
        logo: {
          '@type': 'ImageObject',
          url: 'https://internite.online/logo.png',
        },
        sameAs: ['https://github.com/mangal3108/AI-Database'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://internite.online/#website',
        url: 'https://internite.online',
        name: 'Internite AI',
        publisher: { '@id': 'https://internite.online/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://internite.online/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Internite AI',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://internite.online',
        description:
          'AI-powered database chatbot and data visualizer. Connect PostgreSQL, MySQL, MongoDB, Supabase, and more. Ask questions in natural language, get safe SQL, instant charts, and dashboards.',
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            name: 'Free Tier',
          },
          {
            '@type': 'Offer',
            price: '29',
            priceCurrency: 'USD',
            name: 'Pro Developer',
            billingIncrement: 'Monthly',
          },
        ],
      },
    ],
  }

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}