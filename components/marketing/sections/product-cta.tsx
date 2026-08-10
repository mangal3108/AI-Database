'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { SectionBackground } from '@/components/landing/section-background'

interface ProductCTAProps {
  title: string
  description: string
  primaryCTA: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  theme?: 'blue' | 'purple' | 'green' | 'cyan'
}

export function ProductCTA({ title, description, primaryCTA, secondaryCTA, theme = 'blue' }: ProductCTAProps) {
  const themeStyles = {
    blue: { gradient: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/25' },
    purple: { gradient: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/25' },
    green: { gradient: 'from-emerald-500 to-cyan-500', glow: 'shadow-emerald-500/25' },
    cyan: { gradient: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/25' },
  }

  const style = themeStyles[theme]

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <SectionBackground theme="minimal" opacity={0.6} />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">{description}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryCTA.href}
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${style.gradient} text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg ${style.glow} hover:scale-105`}
            >
              <MessageSquare className="w-5 h-5" />
              {primaryCTA.label}
              <ArrowRight className="w-5 h-5" />
            </Link>

            {secondaryCTA && (
              <Link
                href={secondaryCTA.href}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-slate-700"
              >
                {secondaryCTA.label}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
