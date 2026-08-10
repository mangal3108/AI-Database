'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Check, Database, Zap, Shield, BarChart3 } from 'lucide-react'
import { MatrixRainBackground } from '@/components/landing/backgrounds/MatrixRainBackground'
import { TerminalHeroDemo } from '@/components/landing/terminal-hero-demo'

export function NewHero() {
  return (
    <MatrixRainBackground className="min-h-screen flex items-center pt-16">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-400">Now in public beta</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
            >
              <span className="text-white">Talk to your data.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Not your SQL.
              </span>
            </motion.h1>

            {/* Subheadline — outcome-first */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Connect your database. Ask questions in plain English.{' '}
              <span className="text-white font-semibold">Get trustworthy answers, charts, and insights in seconds.</span>
            </motion.p>

            {/* CTAs — exactly 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:scale-105"
              >
                Start Free — No Credit Card
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-200 font-medium px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 backdrop-blur-sm transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                See It In Action
              </Link>
            </motion.div>

            {/* Trust indicators — benefit language */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-medium text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Read-only by default</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>No data migration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Connect in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>100 free queries</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Interactive Terminal Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <TerminalHeroDemo />
          </motion.div>
        </div>
      </div>
    </MatrixRainBackground>
  )
}
