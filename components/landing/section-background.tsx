'use client'

import { CSSProperties } from 'react'
import { FreeformCanvas } from './freeform-canvas'

// Color schemes for different sections - minimal Apple Freeform style
export const BACKGROUND_THEMES = {
  // Dark base themes
  dark: {
    color1: '#1a1a2e',
    color2: '#16213e',
    color3: '#0f3460',
    intensity: 0.5,
  },
  // Green accent (Pipeline, Security)
  green: {
    color1: '#0d1f1a',
    color2: '#1a3a2e',
    color3: '#0a3020',
    intensity: 0.6,
  },
  // Blue accent (Visualization, FAQ)
  blue: {
    color1: '#0d1a2e',
    color2: '#1a2a3a',
    color3: '#0a2040',
    intensity: 0.5,
  },
  // Purple accent (Before/After, Final CTA)
  purple: {
    color1: '#1a0d2e',
    color2: '#2a1a3a',
    color3: '#200a30',
    intensity: 0.5,
  },
  // Cyan accent (Pricing, Comparison)
  cyan: {
    color1: '#0d2e2a',
    color2: '#1a3a3a',
    color3: '#0a3030',
    intensity: 0.5,
  },
  // Warm accent (Enterprise)
  warm: {
    color1: '#2e1a1a',
    color2: '#3a2a1a',
    color3: '#302010',
    intensity: 0.4,
  },
  // Minimal - just soft gradients
  minimal: {
    color1: '#0a0a0f',
    color2: '#0f0f15',
    color3: '#0d0d12',
    intensity: 0.3,
  },
  // Hero specific
  hero: {
    color1: '#0a0a0f',
    color2: '#050508',
    color3: '#0f0f18',
    intensity: 0.4,
  },
}

type ThemeName = keyof typeof BACKGROUND_THEMES

interface SectionBackgroundProps {
  theme?: ThemeName
  opacity?: number
  className?: string
  style?: CSSProperties
}

export function SectionBackground({
  theme = 'dark',
  opacity = 1,
  className = '',
  style,
}: SectionBackgroundProps) {
  const config = BACKGROUND_THEMES[theme] || BACKGROUND_THEMES.dark

  return (
    <div
      className={`section-background pointer-events-none aria-hidden:true ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity,
        ...style
      }}
    >
      {/* Soft Radial Ambient Glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${config.color1}40 0%, ${config.color2}20 50%, transparent 80%)`,
        }}
      />
      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `linear-gradient(to right, ${config.color3}33 1px, transparent 1px), linear-gradient(to bottom, ${config.color3}33 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

// Convenience exports for specific sections
export function HeroBackground(props: Omit<SectionBackgroundProps, 'theme'>) {
  return <SectionBackground theme="hero" {...props} />
}

export function MinimalBackground(props: Omit<SectionBackgroundProps, 'theme'>) {
  return <SectionBackground theme="minimal" {...props} />
}
