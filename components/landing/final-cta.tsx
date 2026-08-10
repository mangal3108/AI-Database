'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Database } from 'lucide-react'
import Link from 'next/link'
import { SectionBackground } from './section-background'

export function FinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Minimal Background with purple tint */}
      <SectionBackground theme="purple" opacity={0.6} />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-900/20 via-purple-900/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mx-auto mb-8 flex items-center justify-center">
            <Database className="w-7 h-7 text-indigo-400" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to talk to your data?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of teams who&apos;ve replaced their data bottleneck with Internite AI.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/25"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center text-slate-400 hover:text-white font-medium px-6 py-4 rounded-xl transition-colors"
            >
              View pricing
            </Link>
          </div>

          {/* Trust */}
          <p className="mt-6 text-sm text-slate-500">
            No credit card required • 100 free queries • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
