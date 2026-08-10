'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Check, Database, Sparkles, Zap } from 'lucide-react'
import { HeroChatDemo } from './hero-chat-demo'
import LetterGlitch from './letter-glitch'
import { SectionBackground } from './section-background'

export function HeroSection() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#050505]">
      {/* Unified Freeform Background */}
      <SectionBackground theme="minimal" opacity={1} />

      {/* Letter Glitch Accent - subtle */}
      <div className="absolute inset-0 z-[1] opacity-[0.08]">
        <LetterGlitch
          glitchColors={['#2b4539', '#61dca3', '#61b3dc', '#60A5FA', '#818CF8']}
          glitchSpeed={100}
          outerVignette={true}
          centerVignette={false}
          smooth={true}
        />
      </div>

      {/* Gradient Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/50 to-[#050505] z-[2] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Hero Copy */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Now in public beta</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
            >
              Your database,{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                finally
              </span>{' '}
              talking.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-400 max-w-xl"
            >
              Connect your PostgreSQL, MySQL, or MongoDB. Ask questions in plain English. Get SQL, answers, and visualizations — instantly.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                Start free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowDemo(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium px-6 py-3.5 rounded-xl border border-slate-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Watch demo
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>100 free queries</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <HeroChatDemo />
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0D111A] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <button
                  onClick={() => setShowDemo(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="aspect-video bg-[#050505] flex items-center justify-center">
                <p className="text-slate-500">Demo video placeholder</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
