/**
 * Centralized Design Tokens & Section Background Registry for Internite AI
 * Enforces Apple / Linear / Vercel minimal aesthetic principles.
 */

export interface BackgroundConfig {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  intensity: number // 0.05 to 0.35 max
  blurAmount: string
  interactive: boolean
  hasDotGrid?: boolean
  hasGridLines?: boolean
}

export const LANDING_DESIGN_TOKENS = {
  colors: {
    bg: '#050507',
    surface: 'rgba(255, 255, 255, 0.035)',
    surfaceHover: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderBright: 'rgba(255, 255, 255, 0.15)',
    textPrimary: '#F5F5F7',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    indigo: '#6366F1',
    blue: '#3B82F6',
    violet: '#8B5CF6',
    cyan: '#06B6D4',
    emerald: '#10B981',
  },
  blur: {
    subtle: 'blur(40px)',
    medium: 'blur(80px)',
    heavy: 'blur(120px)',
  },
}

export const LANDING_BACKGROUNDS: Record<string, BackgroundConfig> = {
  hero: {
    id: 'hero',
    name: 'Hero Aurora',
    primaryColor: 'rgba(99, 102, 241, 0.14)', // Indigo
    secondaryColor: 'rgba(59, 130, 246, 0.10)', // Blue
    accentColor: 'rgba(6, 182, 212, 0.06)', // Cyan
    intensity: 0.25,
    blurAmount: '130px',
    interactive: true,
    hasDotGrid: false,
  },
  integrations: {
    id: 'integrations',
    name: 'Connected Data Nodes',
    primaryColor: 'rgba(16, 185, 129, 0.08)', // Emerald
    secondaryColor: 'rgba(6, 182, 212, 0.08)', // Cyan
    accentColor: 'rgba(59, 130, 246, 0.05)',
    intensity: 0.18,
    blurAmount: '90px',
    interactive: true,
    hasDotGrid: true,
  },
  aiChat: {
    id: 'aiChat',
    name: 'Data Flow Stream',
    primaryColor: 'rgba(59, 130, 246, 0.12)', // Blue
    secondaryColor: 'rgba(99, 102, 241, 0.10)', // Indigo
    accentColor: 'rgba(139, 92, 246, 0.06)',
    intensity: 0.2,
    blurAmount: '100px',
    interactive: false,
  },
  rag: {
    id: 'rag',
    name: 'Neural Schema Mesh',
    primaryColor: 'rgba(139, 92, 246, 0.12)', // Violet
    secondaryColor: 'rgba(99, 102, 241, 0.10)', // Indigo
    accentColor: 'rgba(6, 182, 212, 0.08)', // Cyan
    intensity: 0.22,
    blurAmount: '110px',
    interactive: true,
  },
  visualizer: {
    id: 'visualizer',
    name: 'Spectrum Analytics',
    primaryColor: 'rgba(6, 182, 212, 0.12)', // Cyan
    secondaryColor: 'rgba(59, 130, 246, 0.10)', // Blue
    accentColor: 'rgba(139, 92, 246, 0.08)', // Violet
    intensity: 0.2,
    blurAmount: '100px',
    interactive: false,
    hasGridLines: true,
  },
  dashboard: {
    id: 'dashboard',
    name: 'Spatial Grid',
    primaryColor: 'rgba(99, 102, 241, 0.10)',
    secondaryColor: 'rgba(15, 23, 42, 0.8)',
    accentColor: 'rgba(6, 182, 212, 0.05)',
    intensity: 0.15,
    blurAmount: '80px',
    interactive: false,
    hasGridLines: true,
  },
  developer: {
    id: 'developer',
    name: 'Monospace Grid',
    primaryColor: 'rgba(30, 41, 59, 0.8)',
    secondaryColor: 'rgba(99, 102, 241, 0.08)',
    accentColor: 'rgba(16, 185, 129, 0.06)',
    intensity: 0.15,
    blurAmount: '70px',
    interactive: false,
    hasDotGrid: true,
  },
  security: {
    id: 'security',
    name: 'Concentric Security Rings',
    primaryColor: 'rgba(59, 130, 246, 0.08)',
    secondaryColor: 'rgba(16, 185, 129, 0.06)',
    accentColor: 'rgba(99, 102, 241, 0.04)',
    intensity: 0.15,
    blurAmount: '90px',
    interactive: false,
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing Spotlight',
    primaryColor: 'rgba(99, 102, 241, 0.12)',
    secondaryColor: 'rgba(139, 92, 246, 0.08)',
    accentColor: 'rgba(59, 130, 246, 0.05)',
    intensity: 0.2,
    blurAmount: '120px',
    interactive: true,
  },
  faq: {
    id: 'faq',
    name: 'Minimal Dot Texture',
    primaryColor: 'rgba(255, 255, 255, 0.02)',
    secondaryColor: 'rgba(99, 102, 241, 0.05)',
    accentColor: 'rgba(0, 0, 0, 0)',
    intensity: 0.1,
    blurAmount: '60px',
    interactive: false,
    hasDotGrid: true,
  },
  cta: {
    id: 'cta',
    name: 'Climax Aurora',
    primaryColor: 'rgba(99, 102, 241, 0.16)',
    secondaryColor: 'rgba(139, 92, 246, 0.14)',
    accentColor: 'rgba(6, 182, 212, 0.10)',
    intensity: 0.28,
    blurAmount: '140px',
    interactive: true,
  },
}
