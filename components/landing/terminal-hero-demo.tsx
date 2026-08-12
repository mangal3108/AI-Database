'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Database, Check, Play, BarChart3, LineChart, Cpu, ArrowRight, ShieldCheck } from 'lucide-react'
import { TerminalWindow } from '@/components/ui/terminal-window'

const DEMO_STEPS = [
  {
    cmd: 'internite connect postgres --db=production_v2',
    logs: [
      '✓ Connection established (TLS 1.3)',
      '✓ Schema indexed (84 tables, 213 relations)',
      '✓ RAG Knowledge Embeddings initialized',
    ],
    query: 'Show monthly revenue growth for the last 6 months',
    sql: `SELECT 
  DATE_TRUNC('month', created_at) AS month,
  SUM(total_amount) AS revenue,
  COUNT(id) AS total_orders
FROM sales_orders
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY 1 ORDER BY 1 ASC;`,
    data: [
      { month: 'Mar', val: '$42.5K', pct: 60 },
      { month: 'Apr', val: '$51.2K', pct: 72 },
      { month: 'May', val: '$58.9K', pct: 83 },
      { month: 'Jun', val: '$64.1K', pct: 90 },
      { month: 'Jul', val: '$71.8K', pct: 95 },
      { month: 'Aug', val: '$84.2K', pct: 100 },
    ],
    insight: 'Revenue increased 98.1% over the last 2 quarters with an average order value of $142.',
  },
  {
    cmd: 'internite query --db=mongodb_analytics',
    logs: [
      '✓ Connected to MongoDB Atlas Cluster',
      '✓ Collection schemas mapped',
      '✓ Hybrid Vector Index Ready',
    ],
    query: 'Which product categories have highest conversion rates?',
    sql: `db.conversions.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$category", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
])`,
    data: [
      { month: 'Electronics', val: '38.4%', pct: 100 },
      { month: 'SaaS Tools', val: '29.1%', pct: 78 },
      { month: 'Cloud Infra', val: '18.6%', pct: 50 },
      { month: 'API Units', val: '13.9%', pct: 36 },
    ],
    insight: 'Electronics & SaaS Tools generate 67.5% of total high-value customer acquisitions.',
  },
]

export function TerminalHeroDemo() {
  const [stepIdx, setStepIdx] = useState(0)
  const [stage, setStage] = useState<'connect' | 'typing' | 'reasoning' | 'sql' | 'chart'>('connect')
  const [typedText, setTypedText] = useState('')

  const current = DEMO_STEPS[stepIdx]

  useEffect(() => {
    let t2: NodeJS.Timeout
    let t3: NodeJS.Timeout
    let t4: NodeJS.Timeout
    const t1: NodeJS.Timeout = setTimeout(() => {
      setStage('typing')
      let charIdx = 0
      const text = current.query
      const interval = setInterval(() => {
        if (charIdx <= text.length) {
          setTypedText(text.slice(0, charIdx))
          charIdx++
        } else {
          clearInterval(interval)
          t2 = setTimeout(() => setStage('reasoning'), 600)
          t3 = setTimeout(() => setStage('sql'), 1600)
          t4 = setTimeout(() => setStage('chart'), 2600)
        }
      }, 35)
    }, 1000)
    setStage('connect')
    setTypedText('')

    const cycleTimer = setTimeout(() => {
      setStepIdx((prev) => (prev + 1) % DEMO_STEPS.length)
    }, 9500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(cycleTimer)
    }
  }, [stepIdx])

  return (
    <TerminalWindow title="internite-ai@production-cluster" status="AI_ENGINE_ACTIVE" variant="indigo" className="w-full max-w-2xl mx-auto shadow-indigo-500/10 h-[500px]">
      <div className="space-y-4 font-mono text-xs h-[430px] overflow-y-auto pr-1">
        {/* Terminal Connect Command */}
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-emerald-400 font-bold">$</span>
          <span className="text-indigo-300 font-semibold">{current.cmd}</span>
        </div>

        {/* Connection logs */}
        <div className="space-y-1 pl-4 border-l-2 border-slate-800 text-slate-400 text-[11px]">
          {current.logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2 text-emerald-400/90">
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Prompt */}
        <div className="pt-2 flex items-center gap-2">
          <span className="text-cyan-400 font-bold">{'>'}</span>
          <span className="text-white font-semibold">{typedText}</span>
          <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
        </div>

        {/* AI Reasoning Stage */}
        <AnimatePresence>
          {(stage === 'reasoning' || stage === 'sql' || stage === 'chart') && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2"
            >
              <Cpu size={14} className="text-indigo-400 animate-spin" />
              <span>[AI Grounding] Searching schema vector index & inspecting foreign keys...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated SQL Code Block */}
        <AnimatePresence>
          {(stage === 'sql' || stage === 'chart') && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#07090E] border border-slate-800 rounded-xl p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                <span className="text-indigo-400">Generated SQL</span>
                <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck size={12} /> Safe Read-Only Execution</span>
              </div>
              <pre className="text-[11px] text-indigo-200 overflow-x-auto leading-relaxed">
                <code>{current.sql}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Visualization */}
        <AnimatePresence>
          {stage === 'chart' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <BarChart3 size={14} className="text-cyan-400" />
                  Dataset Result ({current.data.length} records)
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Execution: 12ms
                </span>
              </div>

              {/* Bar visualization */}
              <div className="space-y-2 pt-1">
                {current.data.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px]">
                    <span className="w-16 text-slate-400 font-semibold">{item.month}</span>
                    <div className="flex-1 h-4 bg-slate-950 rounded overflow-hidden p-0.5 border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded"
                      />
                    </div>
                    <span className="w-14 text-right font-bold text-slate-200">{item.val}</span>
                  </div>
                ))}
              </div>

              {/* AI Insight */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300 flex items-start gap-1.5">
                <span className="font-bold text-emerald-400">Insight:</span>
                <span>{current.insight}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TerminalWindow>
  )
}
