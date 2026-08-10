'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Copy, Check, Database, ArrowRight, Code, Eye, Save, Download, BarChart3, LineChart, PieChart, Table2, Shield } from 'lucide-react'

import { SectionBackground } from '@/components/landing/section-background'

interface QueryExample {
  id: string
  question: string
  sql: string
  result: { label: string; value: string }[]
  visualization: 'bar' | 'line' | 'pie' | 'table'
  description: string
}

const EXAMPLES: QueryExample[] = [
  {
    id: 'revenue',
    question: 'Show monthly revenue for the last 12 months',
    sql: `SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(total) as revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY 1
ORDER BY 1`,
    result: [
      { label: 'Jan', value: '$45,230' },
      { label: 'Feb', value: '$52,890' },
      { label: 'Mar', value: '$61,450' },
      { label: 'Apr', value: '$58,120' },
      { label: 'May', value: '$72,340' },
      { label: 'Jun', value: '$89,670' },
    ],
    visualization: 'line',
    description: 'Line chart showing revenue growth over 6 months',
  },
  {
    id: 'customers',
    question: 'Which customers generated the most revenue?',
    sql: `SELECT
  c.name,
  COUNT(o.id) as orders,
  SUM(o.total) as revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY revenue DESC
LIMIT 5`,
    result: [
      { label: 'Acme Corp', value: '$284,500' },
      { label: 'Beta Inc', value: '$231,200' },
      { label: 'Gamma LLC', value: '$198,750' },
      { label: 'Delta Co', value: '$176,300' },
      { label: 'Epsilon', value: '$145,890' },
    ],
    visualization: 'bar',
    description: 'Top 5 customers by revenue',
  },
  {
    id: 'products',
    question: 'What is our revenue by product category?',
    sql: `SELECT
  p.category,
  COUNT(DISTINCT p.id) as products,
  SUM(oi.quantity) as units_sold,
  SUM(oi.quantity * oi.price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.category
ORDER BY revenue DESC`,
    result: [
      { label: 'Electronics', value: '34%' },
      { label: 'Clothing', value: '28%' },
      { label: 'Home', value: '21%' },
      { label: 'Sports', value: '12%' },
      { label: 'Books', value: '5%' },
    ],
    visualization: 'pie',
    description: 'Revenue distribution by category',
  },
]

const VISUALIZATION_TYPES = [
  { id: 'line', icon: LineChart, label: 'Line' },
  { id: 'bar', icon: BarChart3, label: 'Bar' },
  { id: 'pie', icon: PieChart, label: 'Pie' },
  { id: 'table', icon: Table2, label: 'Table' },
] as const

export function ProductShowcase() {
  const [activeExample, setActiveExample] = useState(0)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'sql' | 'results' | 'chart'>('chat')

  const example = EXAMPLES[activeExample]

  const copySQL = () => {
    navigator.clipboard.writeText(example.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#050505] to-[#080810] relative overflow-hidden">
      <SectionBackground theme="blue" opacity={0.35} />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} SEE_IT_IN_ACTION
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From question to visualization in seconds
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Ask in natural language. Get safe SQL, query results, and beautiful visualizations automatically.
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0D1117] border border-slate-800 rounded-2xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-1">
              {(['chat', 'sql', 'results', 'chart'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Try it:</span>
              <div className="flex gap-1">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveExample(i)}
                    className={`w-6 h-6 text-xs font-medium rounded ${
                      i === activeExample
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2">
            {/* Left: Input & SQL */}
            <div className="p-6 border-r border-slate-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Question */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-2 font-mono">{'>'} ASK</p>
                    <p className="text-white text-lg">{example.question}</p>
                  </div>

                  {/* Generated SQL */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500 font-mono">SQL GENERATED</p>
                      <button
                        onClick={copySQL}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-[#161B22] rounded-xl p-4 overflow-x-auto text-sm">
                      <code className="text-slate-300 font-mono">{example.sql}</code>
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      <Play size={16} />
                      Run Query
                    </button>
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg transition-colors">
                      <Code size={16} />
                      View Details
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Results & Visualization */}
            <div className="p-6 bg-[#0D1117]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500 font-mono">RESULTS</p>
                <div className="flex items-center gap-2">
                  {VISUALIZATION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className={`p-2 rounded-lg transition-colors ${
                        example.visualization === type.id
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                      }`}
                      title={type.label}
                    >
                      <type.icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Preview */}
              <div className="bg-[#161B22] rounded-xl p-4 h-48 flex items-center justify-center mb-4">
                <div className="w-full h-full flex items-end justify-around gap-2">
                  {example.result.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ height: 0 }}
                      animate={{ height: `${60 + Math.random() * 40}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`flex-1 rounded-t ${
                        example.visualization === 'bar'
                          ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                          : example.visualization === 'line'
                          ? 'bg-emerald-500/50'
                          : example.visualization === 'pie'
                          ? 'bg-slate-600'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Result Summary */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{example.description}</span>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Save size={14} /> Save
                  </button>
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Download size={14} /> Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Row */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Database, title: 'Schema Aware', description: 'AI understands your tables, columns, and relationships' },
            { icon: Shield, title: 'Safe by Default', description: 'Destructive queries are blocked automatically' },
            { icon: BarChart3, title: 'Auto-Visualize', description: 'Results become charts without manual configuration' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800/50"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <feature.icon size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
