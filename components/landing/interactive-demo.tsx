'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  Database,
  MessageSquare,
  Sparkles,
  Check,
  ChevronRight,
  ArrowRight,
  Table2,
  BarChart3,
  TrendingUp,
  Eye,
  Code,
  Zap,
  RefreshCw,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface DemoState {
  stage: 'idle' | 'understanding' | 'finding' | 'generating' | 'executing' | 'done'
  query: string
  generatedSQL: string
  resultData: { columns: string[]; rows: number }
  visualization: { type: string; label: string }
  insight: string
}

// ============================================
// CONSTANTS
// ============================================

const DEMO_STAGES = [
  { id: 'understanding', label: 'Understanding question...', icon: MessageSquare, color: 'text-blue-400' },
  { id: 'finding', label: 'Finding relevant tables...', icon: Database, color: 'text-purple-400' },
  { id: 'generating', label: 'Generating SQL...', icon: Code, color: 'text-green-400' },
  { id: 'executing', label: 'Executing safely...', icon: Zap, color: 'text-yellow-400' },
]

const DEMO_QUERIES = [
  'Show me monthly revenue for the last 12 months',
  'What are the top 10 customers by order volume?',
  'Which products have the highest return rate?',
]

const SAMPLE_SQL = `SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(amount) AS revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY 1
ORDER BY 1;`

const SAMPLE_RESULT = {
  columns: ['month', 'revenue'],
  rows: 12,
}

const SAMPLE_VISUALIZATION = { type: 'AREA', label: 'Area Chart' }

const SAMPLE_INSIGHT = 'Revenue increased 18.4% compared to the previous 12-month period. Q4 showed the strongest growth at 24.2%.'

// ============================================
// COMPONENT
// ============================================

export function InteractiveDemo() {
  const [state, setState] = useState<DemoState>({
    stage: 'idle',
    query: '',
    generatedSQL: '',
    resultData: { columns: [], rows: 0 },
    visualization: { type: '', label: '' },
    insight: '',
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQueryIndex, setCurrentQueryIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Animation sequence
  useEffect(() => {
    if (!isPlaying) return

    const stages: DemoState['stage'][] = ['understanding', 'finding', 'generating', 'executing', 'done']
    let currentIndex = 0

    // Start with understanding
    setState(prev => ({ ...prev, query: DEMO_QUERIES[currentQueryIndex], stage: 'understanding' }))

    function animate() {
      if (currentIndex >= stages.length) {
        setIsPlaying(false)
        return
      }

      const stage = stages[currentIndex]
      setState(prev => {
        if (stage === 'done') {
          return {
            ...prev,
            stage,
            generatedSQL: SAMPLE_SQL,
            resultData: SAMPLE_RESULT,
            visualization: SAMPLE_VISUALIZATION,
            insight: SAMPLE_INSIGHT,
          }
        }
        return { ...prev, stage }
      })

      currentIndex++
      intervalRef.current = setTimeout(animate, 1200)
    }

    const startTimeout = setTimeout(() => {
      currentIndex = 1
      animate()
    }, 500)

    return () => {
      clearTimeout(startTimeout)
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [isPlaying, currentQueryIndex])

  function startDemo() {
    setIsPlaying(true)
    setState({
      stage: 'idle',
      query: '',
      generatedSQL: '',
      resultData: { columns: [], rows: 0 },
      visualization: { type: '', label: '' },
      insight: '',
    })
  }

  function nextQuery() {
    setCurrentQueryIndex((prev) => (prev + 1) % DEMO_QUERIES.length)
    setState({
      stage: 'idle',
      query: '',
      generatedSQL: '',
      resultData: { columns: [], rows: 0 },
      visualization: { type: '', label: '' },
      insight: '',
    })
    setIsPlaying(false)
  }

  function resetDemo() {
    setState({
      stage: 'idle',
      query: '',
      generatedSQL: '',
      resultData: { columns: [], rows: 0 },
      visualization: { type: '', label: '' },
      insight: '',
    })
    setIsPlaying(false)
  }

  return (
    <section id="demo" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-900/20 via-purple-900/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3"
          >
            SEE IT IN ACTION
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Ask questions.
            <br />
            <span className="text-[#60A5FA]">Get answers.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto"
          >
            Watch how Internite AI transforms natural language into safe SQL, executes it, and visualizes the results.
          </motion.p>
        </div>

        {/* Interactive Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Main Demo Window */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-500">demo.internite.ai</span>
              </div>
              <div className="w-16" />
            </div>

            {/* Demo Content */}
            <div className="grid lg:grid-cols-2 min-h-[480px]">
              {/* Left: Query & Processing */}
              <div className="p-6 border-r border-slate-800">
                {/* Query Input */}
                <div className="relative">
                  <div className="flex items-center gap-3 bg-[#161B22] border border-slate-800 rounded-xl px-4 py-3">
                    <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                    {state.query ? (
                      <span className="text-white text-sm flex-1">{state.query}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Ask your database..."
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 outline-none"
                        value={state.query}
                        onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                      />
                    )}
                    {!isPlaying && state.stage === 'idle' && (
                      <button
                        onClick={startDemo}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Demo
                      </button>
                    )}
                  </div>
                </div>

                {/* Processing Animation */}
                <AnimatePresence mode="wait">
                  {state.stage !== 'idle' && state.stage !== 'done' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 space-y-3"
                    >
                      {DEMO_STAGES.map((stage, index) => {
                        const stageIndex = DEMO_STAGES.findIndex(s => s.id === state.stage)
                        const isActive = stage.id === state.stage
                        const isPast = DEMO_STAGES.findIndex(s => s.id === stage.id) < stageIndex

                        return (
                          <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              'flex items-center gap-3 text-sm px-4 py-2.5 rounded-lg border transition-all',
                              isActive && 'bg-slate-800/50 border-slate-700',
                              isPast && 'bg-green-500/10 border-green-500/30',
                              !isActive && !isPast && 'bg-slate-900/50 border-slate-800/50'
                            )}
                          >
                            {isPast ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : isActive ? (
                              <Loader2 className={cn('w-4 h-4 animate-spin', stage.color)} />
                            ) : (
                              <div className={cn('w-4 h-4 rounded-full border-2 border-slate-600', stage.color.replace('text-', 'border-'))} />
                            )}
                            <span className={isPast ? 'text-green-400' : isActive ? 'text-white' : 'text-slate-500'}>
                              {stage.label}
                            </span>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generated SQL */}
                <AnimatePresence>
                  {(state.stage === 'done' || state.generatedSQL) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generated SQL</span>
                      </div>
                      <div className="bg-[#161B22] border border-slate-800 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-xs text-green-400 font-mono whitespace-pre">
                          {state.generatedSQL || SAMPLE_SQL}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result Summary */}
                <AnimatePresence>
                  {state.stage === 'done' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-4 text-xs text-slate-400"
                    >
                      <div className="flex items-center gap-1.5">
                        <Table2 className="w-3.5 h-3.5" />
                        <span>{state.resultData.rows || 12} rows</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{state.resultData.columns.length || 2} columns</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{state.visualization.label || 'Area Chart'}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Visualization */}
              <div className="p-6 bg-slate-900/30">
                {/* Visualization Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Revenue Trend</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <RefreshCw className="w-3 h-3" />
                    <span>Last 12 months</span>
                  </div>
                </div>

                {/* Chart Area */}
                {state.stage === 'done' || state.generatedSQL ? (
                  <div className="relative h-48">
                    {/* Simple area chart visualization */}
                    <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="37.5" x2="400" y2="37.5" stroke="#1e293b" strokeWidth="1" />
                      <line x1="0" y1="75" x2="400" y2="75" stroke="#1e293b" strokeWidth="1" />
                      <line x1="0" y1="112.5" x2="400" y2="112.5" stroke="#1e293b" strokeWidth="1" />

                      {/* Area fill */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,120 Q40,110 80,100 T160,80 T240,90 T320,50 T400,30 L400,150 L0,150 Z"
                        fill="url(#areaGradient)"
                      />
                      {/* Line */}
                      <path
                        d="M0,120 Q40,110 80,100 T160,80 T240,90 T320,50 T400,30"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Data points */}
                      {[
                        { x: 0, y: 120 },
                        { x: 80, y: 100 },
                        { x: 160, y: 80 },
                        { x: 240, y: 90 },
                        { x: 320, y: 50 },
                        { x: 400, y: 30 },
                      ].map((point, i) => (
                        <circle key={i} cx={point.x} cy={point.y} r="4" fill="#6366f1" stroke="#0D111A" strokeWidth="2" />
                      ))}
                    </svg>

                    {/* X-axis labels */}
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Jan</span>
                      <span>Apr</span>
                      <span>Jul</span>
                      <span>Oct</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Results will appear here</p>
                    </div>
                  </div>
                )}

                {/* AI Insight */}
                {state.stage === 'done' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Insight</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {state.insight || SAMPLE_INSIGHT}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Demo Controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#161B22] border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetDemo}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-3">
                {!isPlaying && state.stage === 'idle' && (
                  <button
                    onClick={startDemo}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Run Demo
                  </button>
                )}
                {state.stage === 'done' && (
                  <button
                    onClick={nextQuery}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Another
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feature Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {['Natural Language', 'SQL Generation', 'Safe Execution', 'Visualization', 'AI Insights'].map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-400"
              >
                <Check className="w-3 h-3 text-green-400" />
                {tag}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
