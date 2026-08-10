'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Database, CheckCircle2, Play, Code2, Table, BarChart2, ShieldCheck, Sparkles } from 'lucide-react'

const DEMO_STAGES = [
  { stage: 'Connecting...', detail: 'Establishing TLS 1.3 encrypted tunnel to PostgreSQL cluster' },
  { stage: 'Reading Schema...', detail: 'Discovered 24 tables, 142 foreign keys, 8 enum types' },
  { stage: 'Retrieving Context...', detail: 'Hybrid RAG retrieved customer_revenue & quarterly_orders vectors' },
  { stage: 'Generating Query...', detail: 'Constructed optimized SQL with index-aware JOINs' },
  { stage: 'Validating Query...', detail: 'Passed safety policy: READ-ONLY, no DDL/DML detected' },
  { stage: 'Executing...', detail: 'Query executed in 4.2ms on Neon PostgreSQL' },
  { stage: 'Insight Generated', detail: 'Transformed tabular results into executive summary & chart' },
]

const MAGIC_SUGGESTIONS = [
  {
    prompt: "Which customers generated the most revenue this quarter?",
    sql: `SELECT \n  c.company_name, \n  COUNT(o.id) AS total_orders, \n  SUM(o.amount) AS revenue \nFROM customers c \nJOIN orders o ON c.id = o.customer_id \nWHERE o.created_at >= NOW() - INTERVAL '90 days' \nGROUP BY c.id \nORDER BY revenue DESC LIMIT 3;`,
    metrics: [
      { label: 'Revenue', val: '₹42.8L' },
      { label: 'Orders', val: '18,420' },
      { label: 'Top Customer', val: 'Acme Corp' },
    ]
  },
  {
    prompt: "Which customer accounts are at risk of churning?",
    sql: `SELECT \n  c.company_name, \n  c.last_active_date, \n  c.monthly_mrr \nFROM customers c \nWHERE c.last_login < NOW() - INTERVAL '30 days' \n  AND c.support_tickets_open > 3 \nORDER BY c.monthly_mrr DESC;`,
    metrics: [
      { label: 'At-Risk Accounts', val: '14' },
      { label: 'MRR Impact', val: '₹8.4L' },
      { label: 'Avg Health Score', val: '38/100' },
    ]
  },
  {
    prompt: "Compare quarterly sales growth across North & South regions",
    sql: `SELECT \n  r.region_name, \n  DATE_TRUNC('quarter', s.sale_date) AS qtr, \n  SUM(s.total_amount) AS total_sales \nFROM sales s \nJOIN regions r ON s.region_id = r.id \nGROUP BY 1, 2 ORDER BY 2, 3 DESC;`,
    metrics: [
      { label: 'North Region', val: '+24.2%' },
      { label: 'South Region', val: '+18.7%' },
      { label: 'Growth Delta', val: '₹14.1L' },
    ]
  }
]

export function HeroDemo() {
  const [activePromptIdx, setActivePromptIdx] = useState(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'sql' | 'data' | 'chart'>('sql')

  const currentData = MAGIC_SUGGESTIONS[activePromptIdx]!

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIdx(prev => (prev + 1) % DEMO_STAGES.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [activePromptIdx])

  const handlePromptClick = (idx: number) => {
    setActivePromptIdx(idx)
    setStageIdx(0)
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 text-left">
      {/* Magic Suggestions Bar */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles size={14} className="text-indigo-400" />
          <span>Try asking your database:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {MAGIC_SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(idx)}
              className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                activePromptIdx === idx
                  ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-300 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>&ldquo;{item.prompt}&rdquo;</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Product Window */}
      <div className="bg-[#0D111A] border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden relative group">
        {/* Window Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="h-4 w-px bg-slate-800 mx-2" />
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono font-medium">
              <Database size={14} className="text-indigo-400" />
              <span>Production PostgreSQL</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span>Read-Only Encrypted TLS 1.3</span>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-6 font-sans space-y-6">
          {/* Natural Language User Prompt */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
              YOU
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex-1 text-sm font-medium text-slate-100 shadow-inner">
              &ldquo;{currentData.prompt}&rdquo;
            </div>
          </div>

          {/* AI Execution Stage Timeline */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-indigo-400 font-bold">{DEMO_STAGES[stageIdx]!.stage}</span>
              <span className="text-slate-500 hidden sm:inline">— {DEMO_STAGES[stageIdx]!.detail}</span>
            </div>
            <span className="text-[10px] text-slate-600">0.42s total</span>
          </div>

          {/* Result Output Tabs */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/80 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/40 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('sql')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                    activeTab === 'sql' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  <Code2 size={14} />
                  <span>Generated SQL</span>
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                    activeTab === 'data' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  <Table size={14} />
                  <span>Data Metrics</span>
                </button>
                <button
                  onClick={() => setActiveTab('chart')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                    activeTab === 'chart' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  <BarChart2 size={14} />
                  <span>Visual Chart</span>
                </button>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Safety Validated: READ-ONLY
              </span>
            </div>

            <div className="p-4 font-mono text-xs text-slate-300">
              {activeTab === 'sql' && (
                <pre className="text-indigo-300/90 leading-relaxed overflow-x-auto">
                  {currentData.sql}
                </pre>
              )}

              {activeTab === 'data' && (
                <div className="grid grid-cols-3 gap-4 font-sans py-2">
                  {currentData.metrics.map((m, i) => (
                    <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</p>
                      <p className="text-lg font-bold text-white mt-1">{m.val}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'chart' && (
                <div className="h-32 flex items-end justify-between gap-4 font-sans pt-4 pb-2 px-6">
                  <div className="flex-1 bg-indigo-600/30 hover:bg-indigo-600/50 rounded-t-lg h-[80%] transition-all relative group/bar">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">₹42.8L</span>
                  </div>
                  <div className="flex-1 bg-indigo-500/40 hover:bg-indigo-500/60 rounded-t-lg h-[60%] transition-all relative group/bar">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">₹28.4L</span>
                  </div>
                  <div className="flex-1 bg-blue-500/40 hover:bg-blue-500/60 rounded-t-lg h-[40%] transition-all relative group/bar">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">₹14.2L</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
