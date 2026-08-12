import { NewHero } from '@/components/marketing/sections/new-hero'
import { DatabaseConnectors } from '@/components/marketing/sections/database-connectors'
import { LightFeatures } from '@/components/marketing/sections/light-features'
import { WhoIsThisFor } from '@/components/marketing/sections/who-is-this-for'
import { PricingSection } from '@/components/landing/pricing-section'
import { TrustBadges } from '@/components/marketing/sections/trust-badges'
import { MarketingFooter } from '@/components/marketing/navigation/marketing-footer'
import { MarketingNav } from '@/components/marketing/navigation/marketing-nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Database Chatbot & Data Visualizer | Internite AI',
  description:
    'Connect PostgreSQL, MySQL, MongoDB, Supabase, Neon and more. Ask your database questions in natural language, generate safe SQL, visualize results, and build dashboards instantly.',
  alternates: { canonical: 'https://internite.online' },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased font-sans overflow-x-hidden">
      <MarketingNav />
      <NewHero />
      <DatabaseConnectors />
      <LightFeatures />
      <WhoIsThisFor />
      <PricingSection />
      <TrustBadges />
      <MarketingFooter />
    </main>
  )
}

