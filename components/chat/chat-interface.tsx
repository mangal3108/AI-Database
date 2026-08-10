'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Database, Loader2, Sparkles, Terminal, Command, TrendingUp, Users, Package, AlertTriangle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { SchemaInspector } from '@/components/chat/schema-inspector'
import { MessageBubble, type MessageItem } from '@/components/chat/message-bubble'
import type { AiResponse } from '@/lib/zod-schemas'

interface DatabaseItem {
  id: string
  name: string
  type: string
  status: string
}

const COMMANDS = [
  { cmd: '/visualize', desc: 'Create a chart from the last query result' },
  { cmd: '/sql', desc: 'View and inspect the generated SQL' },
  { cmd: '/schema', desc: 'Explore schema tables and relationships' },
  { cmd: '/explain', desc: 'Explain how the answer was calculated' },
  { cmd: '/export', desc: 'Export query result as CSV / JSON' },
  { cmd: '/save', desc: 'Save current query to workspace library' },
  { cmd: '/insights', desc: 'Generate AI observations & anomaly analysis' },
]

const PROMPT_SUGGESTIONS = [
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'Monthly Revenue',
    prompt: 'Show monthly revenue growth and total orders for the last 12 months',
  },
  {
    icon: Users,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    title: 'Top Customers',
    prompt: 'Who are our top 10 highest-value customers by total lifetime spend?',
  },
  {
    icon: Package,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'Product Sales',
    prompt: 'Which products generated the highest sales volume this quarter?',
  },
  {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: 'Anomalies',
    prompt: 'Find any unusual drops or spikes in transaction volume this month',
  },
]

// Mock schema data for demonstration
const MOCK_TABLES = [
  {
    name: 'orders',
    rowCount: 14280,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'customer_id', type: 'uuid', isFk: true },
      { name: 'total_amount', type: 'numeric' },
      { name: 'status', type: 'varchar' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'customers',
    rowCount: 3820,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'email', type: 'varchar' },
      { name: 'name', type: 'varchar' },
      { name: 'segment', type: 'varchar' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'products',
    rowCount: 450,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'title', type: 'varchar' },
      { name: 'price', type: 'numeric' },
      { name: 'category', type: 'varchar' },
    ],
  },
  {
    name: 'payments',
    rowCount: 12900,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'order_id', type: 'uuid', isFk: true },
      { name: 'method', type: 'varchar' },
      { name: 'amount', type: 'numeric' },
    ],
  },
]

export function ChatInterface({
  conversationId,
  initialMessages = [],
}: {
  conversationId?: string
  initialMessages?: MessageItem[]
}) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusStage, setStatusStage] = useState('')
  const [selectedDb, setSelectedDb] = useState<string>('')
  const [currentConvId, setCurrentConvId] = useState<string | undefined>(conversationId)
  const [executionMode, setExecutionMode] = useState<'fast' | 'deep'>('deep')

  // Sidebar visibility
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)

  // Command menu popup
  const [showCommands, setShowCommands] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { data: dbsData } = useQuery({
    queryKey: ['databases'],
    queryFn: async () => {
      const res = await fetch('/api/databases')
      return res.json() as Promise<{ connections: DatabaseItem[] }>
    },
  })

  const databases = dbsData?.connections ?? []
  const connectedDbs = databases.filter(d => d.status === 'CONNECTED')

  useEffect(() => {
    if (connectedDbs.length > 0 && !selectedDb) {
      setSelectedDb(connectedDbs[0]!.id)
    }
  }, [connectedDbs, selectedDb])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, statusStage])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setInput(val)
    if (val.startsWith('/')) {
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }

  const handleSelectCommand = (cmd: string) => {
    setInput(cmd + ' ')
    setShowCommands(false)
    inputRef.current?.focus()
  }

  const handleSend = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt ?? input.trim()
    if (!promptToSend || isLoading) return

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: 'USER',
      content: promptToSend,
    }

    setMessages(prev => [...prev, userMsg])
    if (!overridePrompt) setInput('')
    setShowCommands(false)
    setIsLoading(true)

    // Stage progression indicator
    setStatusStage('✓ Understanding question...')
    setTimeout(() => setStatusStage('✓ Searching schema graph & RAG...'), 600)
    setTimeout(() => setStatusStage('✓ Validating read-only safety rules...'), 1200)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConvId,
          message: promptToSend,
          databaseConnectionId: selectedDb || undefined,
        }),
      })

      if (!response.body) throw new Error('No response stream')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data) as {
              status?: string
              answer?: string
              query?: string
              queryLanguage?: string
              queryResult?: MessageItem['queryResult']
              visualization?: AiResponse['visualization']
              warnings?: string[]
              confidence?: string
              sources?: AiResponse['sources']
              conversationId?: string
              messageId?: string
              executionError?: string
              message?: string
            }

            if (parsed.status) {
              setStatusStage(parsed.status)
            } else if (parsed.answer !== undefined) {
              if (parsed.conversationId) setCurrentConvId(parsed.conversationId)

              const assistantMsg: MessageItem = {
                id: parsed.messageId ?? Date.now().toString(),
                role: 'ASSISTANT',
                content: parsed.answer,
                metadata: {
                  query: parsed.query,
                  queryLanguage: parsed.queryLanguage,
                  visualization: parsed.visualization,
                  warnings: parsed.warnings,
                  confidence: parsed.confidence,
                  sources: parsed.sources,
                  rowCount: parsed.queryResult?.rowCount,
                  tablesUsed: ['orders', 'customers'],
                  insights: [
                    'Revenue grew steadily over the past quarter.',
                    'Enterprise user segment contributed the highest percentage of sales.',
                  ],
                },
                queryResult: parsed.queryResult,
                executionError: parsed.executionError,
              }

              setMessages(prev => [...prev, assistantMsg])
            } else if (parsed.message) {
              toast.error(parsed.message)
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch {
      toast.error('Failed to process database query')
    } finally {
      setIsLoading(false)
      setStatusStage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const activeDbName = connectedDbs.find(d => d.id === selectedDb)?.name ?? 'Production DB'

  return (
    <div className="flex flex-col h-full bg-[#05070B] overflow-hidden text-slate-100 font-sans">
      {/* Header */}
      <ChatHeader
        databases={connectedDbs}
        selectedDbId={selectedDb}
        onSelectDb={setSelectedDb}
        mode={executionMode}
        onToggleMode={setExecutionMode}
        showLeftSidebar={showLeftSidebar}
        onToggleLeftSidebar={() => setShowLeftSidebar(v => !v)}
        showRightSidebar={showRightSidebar}
        onToggleRightSidebar={() => setShowRightSidebar(v => !v)}
      />

      {/* 3-Zone Body Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Conversations & Saved Queries */}
        {showLeftSidebar && (
          <div className="w-64 shrink-0 hidden md:block h-full">
            <ChatSidebar
              connectedDbName={activeDbName}
              tableCount={84}
              onNewChat={() => { setMessages([]); setCurrentConvId(undefined) }}
            />
          </div>
        )}

        {/* Center Panel: AI Chat Workstation */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070A10] relative">
          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.length === 0 && (
              <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={28} className="text-indigo-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Talk to your database.</h1>
                <p className="text-slate-400 text-sm max-w-lg mx-auto mb-10">
                  Ask questions in plain English. Internite AI translates your intent into safe read-only SQL, delivers instant answers, and selects the right visualization automatically.
                </p>

                {/* Prompt Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  {PROMPT_SUGGESTIONS.map(s => (
                    <div
                      key={s.title}
                      onClick={() => handleSend(s.prompt)}
                      className={`p-4 bg-slate-900/60 border ${s.border} rounded-2xl cursor-pointer hover:bg-slate-900 hover:scale-[1.02] transition-all group`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-2 text-xs font-bold ${s.color}`}>
                          <s.icon size={14} />
                          <span>{s.title}</span>
                        </div>
                        <ArrowRight size={13} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">&ldquo;{s.prompt}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Execution Stage Loader */}
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                </div>
                <div className="bg-[#0D111A] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-indigo-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{statusStage || 'Executing query safety checks...'}</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Command Input */}
          <div className="p-4 border-t border-slate-800/80 bg-[#090D14] relative">
            {/* Slash Commands Popup */}
            <AnimatePresence>
              {showCommands && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 font-mono text-xs max-h-56 overflow-y-auto"
                >
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 mb-1">
                    COMMANDS
                  </div>
                  {COMMANDS.map(c => (
                    <div
                      key={c.cmd}
                      onClick={() => handleSelectCommand(c.cmd)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-600/20 hover:text-white text-slate-300 cursor-pointer transition-colors"
                    >
                      <span className="font-bold text-indigo-300">{c.cmd}</span>
                      <span className="text-[11px] text-slate-500">{c.desc}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto bg-slate-950/80 border border-slate-800 focus-within:border-indigo-500 rounded-2xl p-3 shadow-xl transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your database... (Type / for commands)"
                rows={2}
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <Terminal size={13} className="text-indigo-400" />
                  <span>Type <kbd className="px-1 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400">/</kbd> for commands</span>
                  <span>·</span>
                  <span><kbd className="px-1 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400">⌘+Enter</kbd> to run</span>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Run</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Schema Inspector */}
        {showRightSidebar && (
          <div className="w-72 shrink-0 hidden lg:block h-full">
            <SchemaInspector
              selectedDbName={activeDbName}
              tables={MOCK_TABLES}
              onInsertText={text => setInput(prev => (prev ? `${prev} ${text}` : text))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
