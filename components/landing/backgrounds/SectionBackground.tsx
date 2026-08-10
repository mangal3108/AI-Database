'use client'

import React from 'react'
import { LANDING_BACKGROUNDS } from '@/lib/landingBackgrounds'
import { AuroraBackground } from './AuroraBackground'
import { DotGridBackground } from './DotGridBackground'
import { NeuralNetworkBackground } from './NeuralNetworkBackground'
import { PricingGlowBackground } from './PricingGlowBackground'

interface SectionBackgroundProps {
  sectionKey?: keyof typeof LANDING_BACKGROUNDS
  children?: React.ReactNode
  className?: string
}

export function SectionBackground({
  sectionKey = 'hero',
  children,
  className = '',
}: SectionBackgroundProps) {
  const config = LANDING_BACKGROUNDS[sectionKey] || LANDING_BACKGROUNDS.hero

  switch (sectionKey) {
    case 'hero':
    case 'cta':
      return <AuroraBackground className={className}>{children}</AuroraBackground>
    case 'integrations':
    case 'developer':
    case 'faq':
      return <DotGridBackground className={className}>{children}</DotGridBackground>
    case 'rag':
    case 'visualizer':
    case 'aiChat':
      return <NeuralNetworkBackground className={className}>{children}</NeuralNetworkBackground>
    case 'pricing':
      return <PricingGlowBackground className={className}>{children}</PricingGlowBackground>
    default:
      return (
        <div className={`relative overflow-hidden bg-[#050507] ${className}`}>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-b from-[#050507] via-slate-900/20 to-[#050507]" aria-hidden="true" />
          {children}
        </div>
      )
  }
}
