import { NewHero } from '@/components/marketing/sections/new-hero'
import { DatabaseConnectors } from '@/components/marketing/sections/database-connectors'
import { ProblemSection } from '@/components/marketing/sections/problem-solution'
import { HowItWorks } from '@/components/marketing/sections/how-it-works'
import { ProductShowcase } from '@/components/marketing/sections/product-showcase'
import { FeaturesSection } from '@/components/landing/features-section'
import { WhoIsThisFor } from '@/components/marketing/sections/who-is-this-for'
import { ArchitectureDiagram } from '@/components/landing/architecture-diagram'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { MarketingFooter } from '@/components/marketing/navigation/marketing-footer'
import { MarketingNav } from '@/components/marketing/navigation/marketing-nav'
import { FinalConversion } from '@/components/marketing/sections/final-conversion'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Database Chatbot & Data Visualizer | Internite AI',
  description:
    'Connect PostgreSQL, MySQL, MongoDB, Supabase, Neon and more. Ask your database questions in natural language, generate safe SQL, visualize results, and build dashboards instantly.',
  alternates: { canonical: 'https://internite.online' },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 antialiased font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <MarketingNav />

      {/* 1. Hero — outcome-first headline + 2 CTAs */}
      <NewHero />

      {/* 2. Database trust strip */}
      <DatabaseConnectors />

      {/* 3. Stop Waiting for SQL — before/after comparison */}
      <ProblemSection />

      {/* 4. How It Works — 4-step visual flow */}
      <HowItWorks />

      {/* 5. Interactive Product Demo */}
      <ProductShowcase />

      {/* 6. Core Features — outcome-first language */}
      <FeaturesSection />

      {/* 7. Who Is This For — 5 persona tabs */}
      <WhoIsThisFor />

      {/* 8. Architecture — collapsible for developers */}
      <ArchitectureDiagram />

      {/* 9. Pricing — plan selector + ROI calculator + SOC 2 fix */}
      <PricingSection />

      {/* 10. FAQ — expanded answers + FAQPage JSON-LD */}
      <FaqSection />

      {/* 11. Final CTA */}
      <FinalConversion />

      {/* 12. Footer */}
      <MarketingFooter />
    </main>
  )
}
