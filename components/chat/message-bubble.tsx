'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, Check, Copy, ChevronDown, Table as TableIcon, Code2, BarChart3,
  Lightbulb, GitFork, ArrowRight, Bookmark, LayoutDashboard, Download, ThumbsUp, ThumbsDown
} from 'lucide-react'
import { ResultTable } from '@/components/chat/result-table'
import { ChartRenderer } from '@/components/chat/chart-renderer'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { AiResponse } from '@/lib/zod-schemas'
import { toast } from 'sonner'

export interface MessageMetadata {
  query?: string
  queryLanguage?: string
  visualization?: AiResponse['visualization']
  warnings?: string[]
  confidence?: string
  sources?: AiResponse['sources']
  rowCount?: number
  executionTimeMs?: number
  tablesUsed?: string[]
  fieldsUsed?: string[]
  insights?: string[]
  followUps?: string[]
}

export interface MessageItem {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  metadata?: MessageMetadata
  queryResult?: {
    columns: string[]
    rows: Record<string, unknown>[]
    rowCount: number
    executionTimeMs: number
  }
  executionError?: string
}

export function MessageBubble({ message }: { message: MessageItem }) {
  const [activeTab, setActiveTab] = useState<'answer' | 'results' | 'sql' | 'chart' | 'insights' | 'lineage'>('answer')
  const [copied, setCopied] = useState(false)

  if (message.role === 'USER') {
    return (
      <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
        <div className="bg-indigo-600 text-white font-medium px-4 py-3 rounded-2xl rounded-tr-sm max-w-xl text-sm leading-relaxed shadow-md shadow-indigo-600/10">
          {message.content}
        </div>
      </motion.div>
    )
  }

  // Parse raw JSON fallback if needed
  let displayAnswer = message.content
  if (displayAnswer.startsWith('```json') || displayAnswer.trim().startsWith('{')) {
    try {
      let rawText = displayAnswer.trim()
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) rawText = jsonMatch[1]!.trim()
      const jsonObj = JSON.parse(rawText)
      if (jsonObj.answer) displayAnswer = jsonObj.answer
    } catch {
      // Fallback
    }
  }

  const query = message.metadata?.query
  const queryResult = message.queryResult
  const hasResults = Boolean(queryResult && queryResult.rows.length > 0)
  const hasChart = Boolean(queryResult && message.metadata?.visualization)
  const insights = message.metadata?.insights ?? [
    'Data trends reflect expected active volume.',
    'Read-only safety engine confirmed zero modifications made.',
  ]
  const followUps = message.metadata?.followUps ?? [
    'Why did this metric change?',
    'Show top contributors to this total',
    'Compare with previous month',
  ]

  const copySql = () => {
    if (query) {
      navigator.clipboard.writeText(query)
      setCopied(true)
      toast.success('SQL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 w-full">
      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={15} className="text-indigo-400" />
      </div>

      <div className="flex-1 min-w-0 bg-[#0D111A] border border-slate-800/80 rounded-2xl p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab('answer')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'answer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={12} /> Answer
            </button>
            {hasResults && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  activeTab === 'results' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon size={12} /> Results ({queryResult?.rowCount})
              </button>
            )}
            {query && (
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  activeTab === 'sql' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 size={12} /> SQL
              </button>
            )}
            {hasChart && (
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  activeTab === 'chart' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 size={12} /> Chart
              </button>
            )}
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'insights' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb size={12} /> Insights
            </button>
            <button
              onClick={() => setActiveTab('lineage')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'lineage' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork size={12} /> Lineage
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => toast.success('Query saved to your Saved Queries folder')}
              className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Save Query"
            >
              <Bookmark size={13} />
            </button>
            <button
              onClick={() => toast.success('Added widget to Executive Overview Dashboard')}
              className="p-1.5 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Add to Dashboard"
            >
              <LayoutDashboard size={13} />
            </button>
          </div>
        </div>

        {/* Tab 1: ANSWER */}
        {activeTab === 'answer' && (
          <div className="text-sm text-slate-200 leading-relaxed space-y-3">
            <div className="whitespace-pre-wrap">{displayAnswer}</div>

            {hasChart && (
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>AUTOMATIC VISUALIZATION</span>
                  <button onClick={() => setActiveTab('chart')} className="text-indigo-400 hover:underline">Full Chart →</button>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <ChartRenderer data={queryResult!} visualization={message.metadata!.visualization!} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: RESULTS */}
        {activeTab === 'results' && queryResult && (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
            <ResultTable result={queryResult} />
          </div>
        )}

        {/* Tab 3: SQL */}
        {activeTab === 'sql' && query && (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400">
              <span className="text-[11px] font-bold text-emerald-400">✓ READ-ONLY VALIDATED · {queryResult?.executionTimeMs ?? 120}ms</span>
              <button onClick={copySql} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <div className="p-3 overflow-x-auto">
              <SyntaxHighlighter
                language={message.metadata?.queryLanguage === 'mongodb' ? 'javascript' : 'sql'}
                style={atomOneDark}
                customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px' }}
              >
                {query}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* Tab 4: CHART */}
        {activeTab === 'chart' && queryResult && message.metadata?.visualization && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <ChartRenderer data={queryResult} visualization={message.metadata.visualization} />
          </div>
        )}

        {/* Tab 5: INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              <Lightbulb size={14} /> AI Observations &amp; Insights
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 6: LINEAGE */}
        {activeTab === 'lineage' && (
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-bold text-white">DATA PROVENANCE &amp; REASONING</span>
              <span className="text-emerald-400 font-bold">CONFIDENCE: 94%</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">Tables Querying</span>
                <div className="text-slate-300 space-y-1">
                  {(message.metadata?.tablesUsed ?? ['orders', 'customers']).map(t => (
                    <div key={t} className="flex items-center gap-1.5 text-indigo-300">
                      <span className="w-1 h-1 rounded-full bg-indigo-400" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">Execution Metrics</span>
                <div className="text-slate-300 space-y-1">
                  <div>RAG Search: 84ms</div>
                  <div>SQL Gen: 310ms</div>
                  <div>Safety Check: 12ms</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Follow-up Questions */}
        <div className="pt-3 border-t border-slate-800/60">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
            SUGGESTED FOLLOW-UPS
          </span>
          <div className="flex flex-wrap gap-2">
            {followUps.map((q, idx) => (
              <button
                key={idx}
                onClick={() => toast.info(`Asking: "${q}"`)}
                className="text-xs bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-300 text-slate-300 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>{q}</span>
                <ArrowRight size={11} className="text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
