'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Play } from 'lucide-react'
import { SectionBackground } from '@/components/landing/section-background'

interface ProductHeroProps {
  badge?: string
  title: string
  subtitle: string
  description: string
  primaryCTA: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  features?: string[]
  theme?: 'blue' | 'purple' | 'green' | 'cyan'
}

const THEME_CONFIG = {
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    accent: 'text-cyan-400',
    border: 'border-blue-500/30',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    accent: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  green: {
    gradient: 'from-emerald-500 to-cyan-500',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  cyan: {
    gradient: 'from-cyan-500 to-blue-500',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
}

export function ProductHero({
  badge,
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  features,
  theme = 'blue',
}: ProductHeroProps) {
  const config = THEME_CONFIG[theme]

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <SectionBackground theme="minimal" opacity={0.8} />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.border} bg-white/5 mb-6`}
          >
            <span className={`text-xs font-medium ${config.accent}`}>{badge}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-lg sm:text-xl ${config.accent} font-medium mb-6`}
        >
          {subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={primaryCTA.href}
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {primaryCTA.label}
            <ArrowRight className="w-4 h-4" />
          </Link>

          {secondaryCTA && (
            <Link
              href={secondaryCTA.href}
              className="inline-flex items-center gap-2 text-slate-300 font-medium px-6 py-3 hover:text-white transition-colors"
            >
              <Play className="w-4 h-4" />
              {secondaryCTA.label}
            </Link>
          )}
        </motion.div>

        {/* Features */}
        {features && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                <Check className={`w-4 h-4 ${config.accent}`} />
                {feature}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
