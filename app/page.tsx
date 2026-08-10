import { NewHero } from '@/components/marketing/sections/new-hero'
import { ProductShowcase } from '@/components/marketing/sections/product-showcase'
import { ProblemSection } from '@/components/marketing/sections/problem-solution'
import { DatabaseConnectors } from '@/components/marketing/sections/database-connectors'
import { FeaturesSection } from '@/components/landing/features-section'
import { ArchitectureDiagram } from '@/components/landing/architecture-diagram'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { MarketingFooter } from '@/components/marketing/navigation/marketing-footer'
import { MarketingNav } from '@/components/marketing/navigation/marketing-nav'
import { FinalConversion } from '@/components/marketing/sections/final-conversion'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 antialiased font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <MarketingNav />

      {/* 1. Hero Section */}
      <NewHero />

      {/* 2. Connected Database Ecosystem */}
      <DatabaseConnectors />

      {/* 3. Interactive Product Query & Visualizer Demo */}
      <ProductShowcase />

      {/* 4. Core Features & Capabilities */}
      <FeaturesSection />

      {/* 5. Hybrid Vector RAG & Schema Architecture */}
      <ArchitectureDiagram />

      {/* 6. Problem & Solution Context */}
      <ProblemSection />

      {/* 7. SaaS Billing & Subscription Pricing */}
      <PricingSection />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Final Conversion CTA */}
      <FinalConversion />

      {/* 10. Footer */}
      <MarketingFooter />
    </main>
  )
}
