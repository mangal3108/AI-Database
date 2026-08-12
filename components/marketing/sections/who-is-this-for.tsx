'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, Terminal, PieChart, Users } from 'lucide-react'

export function WhoIsThisFor() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-4 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="lg:w-1/3 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 bg-purple-100 border border-purple-200 rounded-full px-3 py-1 mb-6">
              <Sparkles size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold tracking-widest text-purple-700 uppercase">BUILT FOR EVERYONE</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              From developers to business teams
            </h2>
            
            <p className="text-slate-500 leading-relaxed text-sm">
              Internite AI bridges the gap between data and decisions. Save time, reduce manual work, and empower everyone with instant insights.
            </p>
          </motion.div>

          {/* Right Content - Cards */}
          <div className="lg:w-2/3 grid sm:grid-cols-3 gap-6">
            
            {/* Developers Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="bg-[#fcfcff] border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 bg-purple-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-purple-100/50">
                <div className="w-24 h-16 bg-white rounded-lg shadow-sm border border-purple-100 flex flex-col p-2">
                  <div className="w-16 h-1.5 bg-purple-200 rounded-full mb-2" />
                  <div className="w-20 h-1.5 bg-purple-100 rounded-full mb-1" />
                  <div className="w-12 h-1.5 bg-purple-100 rounded-full" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-white border-4 border-white">
                  <Terminal size={14} />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">For Developers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build faster with API & SDK and powerful integrations.
              </p>
            </motion.div>

            {/* Analysts Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="bg-[#fcfcff] border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow sm:translate-y-8"
            >
              <div className="w-full h-32 bg-blue-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-blue-100/50">
                <div className="w-24 h-16 bg-white rounded-lg shadow-sm border border-blue-100 flex items-end p-2 gap-1.5">
                  <div className="flex-1 bg-blue-200 h-6 rounded-sm" />
                  <div className="flex-1 bg-blue-300 h-10 rounded-sm" />
                  <div className="flex-1 bg-blue-400 h-12 rounded-sm" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                  <PieChart size={14} />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">For Analysts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore data without writing SQL and uncover insights.
              </p>
            </motion.div>

            {/* Teams Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="bg-[#fcfcff] border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 bg-orange-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-orange-100/50">
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center relative z-10 border-2 border-white">
                    <div className="w-4 h-4 bg-orange-300 rounded-full" />
                  </div>
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center relative z-20 -ml-4 border-2 border-white">
                    <div className="w-5 h-5 bg-white rounded-full" />
                  </div>
                  <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center relative z-10 -ml-4 mt-2 border-2 border-white">
                    <div className="w-3 h-3 bg-orange-200 rounded-full" />
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">For Teams</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Share insights and collaborate with your entire team.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
