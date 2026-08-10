'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Database, BarChart3, TrendingUp, MessageSquare } from 'lucide-react'

const DEMO_QUESTIONS = [
  'Which products generated the most revenue this month?',
  'Show monthly sales for the last 12 months',
  'What are our top 10 customers by order volume?',
]

export function HeroChatDemo() {
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [showInsight, setShowInsight] = useState(false)

  useEffect(() => {
    // Reset and cycle through questions
    const timer = setTimeout(() => {
      setShowAnswer(true)
    }, 1500)

    const chartTimer = setTimeout(() => {
      setShowChart(true)
    }, 2500)

    const insightTimer = setTimeout(() => {
      setShowInsight(true)
    }, 3200)

    const nextQuestionTimer = setTimeout(() => {
      setActiveQuestion((prev) => (prev + 1) % DEMO_QUESTIONS.length)
      setShowAnswer(false)
      setShowChart(false)
      setShowInsight(false)
    }, 6000)

    return () => {
      clearTimeout(timer)
      clearTimeout(chartTimer)
      clearTimeout(insightTimer)
      clearTimeout(nextQuestionTimer)
    }
  }, [activeQuestion])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative bg-[#0D111A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="ml-3 flex items-center gap-2 px-3 py-1 bg-[#0D111A] rounded-lg text-xs text-slate-400">
            <Database size={12} />
            <span>PostgreSQL — Production</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">internite.ai</div>
      </div>

      {/* Chat Content */}
      <div className="p-6 space-y-6 h-[460px] overflow-hidden">
        {/* User Question */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-end"
        >
          <div className="max-w-[85%] px-4 py-3 bg-indigo-600 rounded-2xl rounded-br-md">
            <p className="text-sm text-white">
              {DEMO_QUESTIONS[activeQuestion]}
            </p>
          </div>
        </motion.div>

        {/* AI Response */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showAnswer ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* AI Header */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <MessageSquare size={14} className="text-white" />
            </div>
            <span className="text-xs text-slate-400">Internite AI</span>
          </div>

          {/* Answer */}
          <div className="pl-8 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Revenue increased <span className="text-green-400 font-semibold">18.4%</span> compared with last month.
            </p>

            {/* Mini Results Table */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 rounded-xl p-4 border border-slate-800"
              >
                <p className="text-xs text-slate-500 mb-3">Top products by revenue</p>
                <div className="space-y-2">
                  {['Product A', 'Product B', 'Product C', 'Product D'].map((product, i) => (
                    <div key={product} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-16">{product}</span>
                      <div className="flex-1 h-5 bg-slate-800 rounded overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - i * 20}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded"
                        />
                      </div>
                      <span className="text-xs text-slate-300 font-mono w-16 text-right">
                        ${(84 - i * 12).toFixed(1)}K
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mini Chart */}
            {showChart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 rounded-xl p-4 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-500">Revenue Trend</p>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-400 rounded">Line</span>
                    <span className="px-2 py-0.5 text-[10px] text-slate-500">Bar</span>
                    <span className="px-2 py-0.5 text-[10px] text-slate-500">Area</span>
                  </div>
                </div>
                <div className="h-24 flex items-end gap-1">
                  {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </motion.div>
            )}

            {/* Insight */}
            {showInsight && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3"
              >
                <TrendingUp size={14} className="text-green-400 mt-0.5" />
                <p className="text-xs text-green-300">
                  <span className="font-semibold">Insight:</span> Q4 showed the strongest growth at 24.2%. Product A is your top performer, accounting for 28% of total revenue.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 pt-2"
              >
                <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                  View SQL
                </button>
                <button className="px-3 py-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors flex items-center gap-1.5">
                  <BarChart3 size={12} />
                  Create Chart
                </button>
                <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                  Add to Dashboard
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Input Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl">
          <Database size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="Ask your database..."
            className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none"
            readOnly
          />
          <span className="text-xs text-slate-600">Enter ↵</span>
        </div>
      </div>
    </motion.div>
  )
}
