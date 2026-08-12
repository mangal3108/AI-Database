'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Database, Loader2, Terminal, TrendingUp, Users, Package, AlertTriangle, ArrowRight } from 'lucide-react'
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
  // Include any non-DISCONNECTED/PENDING database so users can still query
  // even if RAG indexing failed (ERROR) or schema is being indexed (INDEXING)
  const connectedDbs = databases.filter(
    d => d.status === 'CONNECTED' || d.status === 'ERROR' || d.status === 'INDEXING'
  )

  // Fetch real schema tables for selected database
  const { data: schemaData, isLoading: isSchemaLoading } = useQuery({
    queryKey: ['schema', selectedDb],
    queryFn: async () => {
      if (!selectedDb) return { tables: [] }
      const res = await fetch(`/api/databases/${selectedDb}/schema`)
      if (!res.ok) return { tables: [] }
      return res.json() as Promise<{ tables: Array<{ name: string; rowCount?: number; columns: Array<{ name: string; type: string; isPk?: boolean; isFk?: boolean }> }> }>
    },
    enabled: Boolean(selectedDb),
  })

  useEffect(() => {
    if (connectedDbs.length > 0 && !selectedDb) {
      // Prefer a CONNECTED db, fall back to first available
      const preferred = connectedDbs.find(d => d.status === 'CONNECTED') ?? connectedDbs[0]!
      setSelectedDb(preferred.id)
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
                tablesUsed?: string[]
                columnsUsed?: string[]
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
                  tablesUsed: parsed.tablesUsed ?? [],
                  fieldsUsed: parsed.columnsUsed ?? [],
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

  const handleSaveQuery = async (message: MessageItem) => {
    if (!selectedDb || !message.metadata?.query) {
      toast.error('This response does not contain a saveable SQL query')
      return
    }
    try {
      const response = await fetch('/api/saved-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseId: selectedDb,
          query: message.metadata.query,
          queryLanguage: message.metadata.queryLanguage || 'sql',
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save query')
      toast.success('Query saved to your Saved Queries folder')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save query')
    }
  }

  const handleAddToDashboard = async (message: MessageItem) => {
    if (!selectedDb || !message.metadata?.query) {
      toast.error('This response does not contain a dashboard-ready query')
      return
    }
    try {
      const response = await fetch('/api/dashboards/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseId: selectedDb, query: message.metadata.query, title: 'Chat result' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not add dashboard item')
      toast.success('Added to Executive Overview dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not add dashboard item')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const activeDbName = connectedDbs.find(d => d.id === selectedDb)?.name ?? 'No Database Connected'
  const activeDbTables = schemaData?.tables ?? []

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden text-slate-900 font-sans">
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
              tableCount={activeDbTables.length}
              onNewChat={() => { setMessages([]); setCurrentConvId(undefined) }}
            />
          </div>
        )}

        {/* Center Panel: AI Chat Workstation */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.length === 0 && (
              <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6">
                  <Database size={28} className="text-indigo-600" />
                </div>
                <h1 className="text-3xl font-semibold text-slate-900 tracking-[-0.04em] mb-2">Explore your data.</h1>
                <p className="text-slate-500 text-sm max-w-lg mx-auto mb-10">
                  Ask questions in plain language and get clear, read-only answers from your connected database.
                </p>

                {/* Prompt Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  {PROMPT_SUGGESTIONS.map(s => (
                    <div
                      key={s.title}
                      onClick={() => handleSend(s.prompt)}
                      className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-2 text-xs font-bold ${s.color.replace('400', '600')}`}>
                          <s.icon size={14} />
                          <span className="text-slate-900">{s.title}</span>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">&ldquo;{s.prompt}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} onSaveQuery={handleSaveQuery} onAddToDashboard={handleAddToDashboard} />
            ))}

            {/* Execution Stage Loader */}
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{statusStage || 'Executing query safety checks...'}</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Command Input */}
          <div className="p-4 bg-white relative">
            {/* Slash Commands Popup */}
            <AnimatePresence>
              {showCommands && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl z-50 font-mono text-xs max-h-56 overflow-y-auto"
                >
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest px-3 py-1 mb-1">
                    COMMANDS
                  </div>
                  {COMMANDS.map(c => (
                    <div
                      key={c.cmd}
                      onClick={() => handleSelectCommand(c.cmd)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-50 text-slate-700 cursor-pointer transition-colors"
                    >
                      <span className="font-bold text-indigo-600">{c.cmd}</span>
                      <span className="text-[11px] text-slate-500">{c.desc}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto bg-white border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl p-3 shadow-sm transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your database... (Type / for commands)"
                rows={2}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs mt-1">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <Terminal size={13} className="text-slate-400" />
                  <span>Type <kbd className="px-1 py-0.5 bg-slate-50 rounded border border-slate-200 text-slate-500">/</kbd> for commands</span>
                  <span>·</span>
                  <span><kbd className="px-1 py-0.5 bg-slate-50 rounded border border-slate-200 text-slate-500">⌘+Enter</kbd> to run</span>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#1d1d1f] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-40 disabled:bg-slate-200 disabled:text-slate-500 flex items-center gap-1.5"
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
              tables={activeDbTables}
              isLoading={isSchemaLoading}
              onInsertText={text => setInput(prev => (prev ? `${prev} ${text}` : text))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
