'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp } from 'lucide-react'
import { SectionBackground } from './section-background'
import MorphSlider from './morph-slider'

const VISUALIZATION_STEPS = [
  {
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1600&auto=format&fit=crop',
    caption: '01 // CONNECT TO DATABASE'
  },
  {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    caption: '02 // ASK IN PLAIN ENGLISH'
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    caption: '03 // INSTANT VISUALIZATION'
  },
]

export function VisualizationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background with blue tint */}
      <SectionBackground theme="blue" opacity={0.7} />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
          >
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 font-mono">
              {'>'} AUTOMATIC_VISUALIZATION
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your database answers shouldn&apos;t live in a terminal.
            </h2>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              Turn every query into a beautiful, interactive visualization. Line charts, bar graphs, pie charts, KPIs, and tables — generated automatically based on your data.
            </p>

            {/* Benefits */}
            <ul className="mt-8 space-y-4">
              {[
                'Automatic chart type selection based on data',
                'Interactive charts with hover tooltips',
                'Export to CSV or PNG in one click',
                'Save visualizations to dashboards',
                'No Excel. No exporting. No manual work.',
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <TrendingUp size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Morph Slider Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 rounded-3xl blur-xl" />

            {/* Morph Slider */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl">
              <div className="aspect-[4/3]">
                <MorphSlider
                  items={VISUALIZATION_STEPS}
                  transition="melt"
                  intensity={0.5}
                  aberration={0.3}
                  drift={0.2}
                  autoplay={true}
                  autoplayDelay={4}
                  loop={true}
                  radius={0}
                  overlayColor="#000000"
                  showCaptions={true}
                  showControls={true}
                  showIndicators={true}
                />
              </div>
            </div>

            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-3 -right-3 bg-slate-900/90 backdrop-blur border border-slate-700/50 text-white px-3 py-1.5 rounded-lg text-xs font-mono"
            >
              <span className="text-emerald-400">status:</span> <span className="text-cyan-400">LIVE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
