'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Copy, Check, Database, ArrowRight, Code } from 'lucide-react'

interface DemoState {
  question: string
  sql: string
  result: string
  chart: 'table' | 'bar' | 'line' | 'pie'
}

const DEMO_QUERIES: DemoState[] = [
  {
    question: 'Which customers generated the most revenue this quarter?',
    sql: 'SELECT c.name, SUM(o.total) as revenue\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.created_at >= DATE_TRUNC(\'quarter\', NOW())\nGROUP BY c.id, c.name\nORDER BY revenue DESC\nLIMIT 10;',
    result: 'Showing 10 customers\n\nAcme Corp — $284,500\nBeta Inc — $231,200\nGamma LLC — $198,750\nDelta Co — $176,300\n...',
    chart: 'bar',
  },
  {
    question: 'Show monthly active users for the last 6 months',
    sql: 'SELECT DATE_TRUNC(\'month\', created_at) as month,\n       COUNT(DISTINCT user_id) as mau\nFROM user_activity\nWHERE created_at >= NOW() - INTERVAL \'6 months\'\nGROUP BY 1\nORDER BY 1;',
    result: 'Showing 6 months\n\nJan 2026 — 12,450 MAU\nFeb 2026 — 13,820 MAU\nMar 2026 — 15,230 MAU\nApr 2026 — 16,890 MAU\nMay 2026 — 18,450 MAU\nJun 2026 — 21,230 MAU',
    chart: 'line',
  },
  {
    question: 'What is our current inventory by category?',
    sql: 'SELECT category, COUNT(*) as items,\n       SUM(quantity) as total_stock,\n       AVG(unit_price) as avg_price\nFROM products\nGROUP BY category\nORDER BY total_stock DESC;',
    result: 'Showing 5 categories\n\nElectronics — 1,245 items, $289 avg\nClothing — 2,890 items, $45 avg\nHome — 876 items, $78 avg\nSports — 654 items, $120 avg\nBooks — 3,420 items, $18 avg',
    chart: 'pie',
  },
]

export function ProductDemo() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)

  const active = DEMO_QUERIES[activeIndex]

  const copySQL = () => {
    navigator.clipboard.writeText(active.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">See it in action</h2>
          <p className="text-slate-400 text-lg">Ask questions, get SQL, see results</p>
        </motion.div>

        {/* Demo Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {DEMO_QUERIES.map((query, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeIndex === index
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Demo Panel */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-slate-500 font-mono">internite.ai/chat</span>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2">
            {/* Left: Query & SQL */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-800">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  YOU
                </div>
                <p className="text-white text-lg">{active.question}</p>
              </div>

              {/* SQL */}
              <div className="bg-slate-950 rounded-lg p-4 relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-mono">Generated SQL</span>
                  <button
                    onClick={copySQL}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-slate-800"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} className="text-slate-400" />
                    )}
                  </button>
                </div>
                <pre className="text-sm font-mono text-cyan-400 overflow-x-auto">
                  <code>{active.sql}</code>
                </pre>
              </div>
            </div>

            {/* Right: Result */}
            <div className="p-6 bg-slate-950/50">
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-4">
                <Database size={14} />
                RESULTS
              </div>

              {/* Chart Preview */}
              <div className="bg-slate-900 rounded-lg p-4 mb-4 h-40 flex items-center justify-center">
                {active.chart === 'bar' && (
                  <div className="flex items-end gap-2 h-full">
                    {[65, 80, 55, 48, 72, 90, 85, 78].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="w-8 bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t"
                      />
                    ))}
                  </div>
                )}
                {active.chart === 'line' && (
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <motion.path
                      d="M 0 80 Q 50 60 80 50 T 130 30 T 180 10"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5 }}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                {active.chart === 'pie' && (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100">
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="20"
                        strokeDasharray="100 251"
                        initial={{ strokeDasharray: '0 251' }}
                        animate={{ strokeDasharray: '100 251' }}
                        transition={{ duration: 1 }}
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="20"
                        strokeDasharray="60 251"
                        strokeDashoffset="-100"
                        initial={{ strokeDasharray: '0 251' }}
                        animate={{ strokeDasharray: '60 251' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray="40 251"
                        strokeDashoffset="-160"
                        initial={{ strokeDasharray: '0 251' }}
                        animate={{ strokeDasharray: '40 251' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Result Text */}
              <p className="text-xs text-slate-500 font-mono whitespace-pre-line">{active.result}</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Try it yourself <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
