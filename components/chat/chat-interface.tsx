'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Database, Loader2, ChevronDown, Sparkles, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { ResultTable } from '@/components/chat/result-table'
import { ChartRenderer } from '@/components/chat/chart-renderer'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { AiResponse } from '@/lib/zod-schemas'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  metadata?: {
    query?: string
    queryLanguage?: string
    visualization?: AiResponse['visualization']
    warnings?: string[]
    confidence?: string
    sources?: AiResponse['sources']
    rowCount?: number
  }
  queryResult?: {
    columns: string[]
    rows: Record<string, unknown>[]
    rowCount: number
    executionTimeMs: number
  }
  executionError?: string
}

interface Database {
  id: string
  name: string
  type: string
  status: string
}

export function ChatInterface({ conversationId, initialMessages = [] }: {
  conversationId?: string
  initialMessages?: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [selectedDb, setSelectedDb] = useState<string>('')
  const [currentConvId, setCurrentConvId] = useState<string | undefined>(conversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { data: dbsData } = useQuery({
    queryKey: ['databases'],
    queryFn: async () => {
      const res = await fetch('/api/databases')
      return res.json() as Promise<{ connections: Database[] }>
    },
  })

  const databases = dbsData?.connections ?? []
  const connectedDbs = databases.filter(d => d.status === 'CONNECTED')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setStatus('Thinking...')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConvId,
          message: userMessage.content,
          databaseConnectionId: selectedDb || undefined,
        }),
      })

      if (!response.body) throw new Error('No response body')

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
          if (line.startsWith('event: ')) continue
          if (!line.startsWith('data: ')) continue

          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data) as {
              status?: string
              answer?: string
              query?: string
              queryLanguage?: string
              queryResult?: Message['queryResult']
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
              setStatus(parsed.status)
            } else if (parsed.answer !== undefined) {
              // Final result
              if (parsed.conversationId) {
                setCurrentConvId(parsed.conversationId)
              }

              const assistantMessage: Message = {
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
                },
                queryResult: parsed.queryResult,
                executionError: parsed.executionError,
              }

              setMessages(prev => [...prev, assistantMessage])
            } else if (parsed.message) {
              toast.error(parsed.message)
            }
          } catch {
            // Skip
          }
        }
      }
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
      setStatus('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Ask your database anything</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              {connectedDbs.length > 0
                ? `Ask questions about your ${connectedDbs[0]!.name} database in plain English.`
                : 'Connect a database to get started.'}
            </p>
            {connectedDbs.length === 0 && (
              <a href="/dashboard/databases/new" className="text-primary text-sm font-medium hover:opacity-80">
                Connect your first database →
              </a>
            )}
            {connectedDbs.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Show me all tables',
                  'What are the top 10 rows?',
                  'How many records are in each table?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs border border-border rounded-xl px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-primary" />
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              {status}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-border/50 p-4">
        {/* DB Selector */}
        {databases.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} className="text-muted-foreground" />
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="text-xs bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">No database</option>
              {connectedDbs.map(db => (
                <option key={db.id} value={db.id}>{db.name}</option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">Ctrl+Enter to send</span>
          </div>
        )}

        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your data..."
            rows={1}
            className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none transition-all max-h-40"
            style={{ minHeight: '48px' }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-primary text-primary-foreground p-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 flex-shrink-0"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const [showQuery, setShowQuery] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyQuery = () => {
    if (message.metadata?.query) {
      navigator.clipboard.writeText(message.metadata.query)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (message.role === 'USER') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end chat-message-enter"
      >
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-lg text-sm leading-relaxed">
          {message.content}
        </div>
      </motion.div>
    )
  }

  // Format answer string if raw JSON payload is passed
  let displayContent = message.content
  if (displayContent.startsWith('```json') || displayContent.trim().startsWith('{')) {
    try {
      let rawText = displayContent.trim()
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) rawText = jsonMatch[1]!.trim()
      const jsonObj = JSON.parse(rawText)
      if (jsonObj.answer) displayContent = jsonObj.answer
    } catch {
      // Fallback to original text if not JSON
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 chat-message-enter"
    >
      <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30">
        <Sparkles size={14} className="text-primary" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Main answer */}
        <div className="bg-muted/30 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {displayContent}
        </div>

        {/* Warnings */}
        {message.metadata?.warnings && message.metadata.warnings.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
            {message.metadata.warnings.map((w, i) => (
              <p key={i} className="text-xs text-yellow-600 dark:text-yellow-400">⚠️ {w}</p>
            ))}
          </div>
        )}

        {/* Execution error */}
        {message.executionError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
            <p className="text-xs text-destructive">Query execution error: {message.executionError}</p>
          </div>
        )}

        {/* SQL Query */}
        {message.metadata?.query && (
          <div className="rounded-xl overflow-hidden border border-border/50">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/50">
              <button
                onClick={() => setShowQuery(!showQuery)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform ${showQuery ? 'rotate-180' : ''}`}
                />
                {message.metadata.queryLanguage ?? 'SQL'} Query
                {message.queryResult && (
                  <span className="text-primary">· {message.queryResult.rowCount} rows</span>
                )}
              </button>
              <button onClick={copyQuery} className="text-muted-foreground hover:text-foreground p-1">
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>

            {showQuery && (
              <div className="max-h-64 overflow-auto">
                <SyntaxHighlighter
                  language={message.metadata.queryLanguage === 'mongodb' ? 'javascript' : 'sql'}
                  style={atomOneDark}
                  customStyle={{ margin: 0, padding: '12px', fontSize: '12px', background: 'transparent' }}
                  wrapLines
                >
                  {message.metadata.query}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}

        {/* Chart */}
        {message.queryResult && message.metadata?.visualization && (
          <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 p-4">
            <ChartRenderer
              data={message.queryResult}
              visualization={message.metadata.visualization}
            />
          </div>
        )}

        {/* Table */}
        {message.queryResult && message.queryResult.rows.length > 0 && (
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <ResultTable result={message.queryResult} />
          </div>
        )}

        {/* Sources */}
        {message.metadata?.sources && message.metadata.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.metadata.sources.map((source, i) => (
              <span
                key={i}
                className="text-xs bg-muted/50 border border-border/50 rounded-lg px-2 py-1 text-muted-foreground"
              >
                📄 {source.name}
              </span>
            ))}
          </div>
        )}

        {/* Feedback */}
        <div className="flex gap-2">
          <button className="text-muted-foreground hover:text-foreground p-1 transition-colors" title="Good answer">
            <ThumbsUp size={12} />
          </button>
          <button className="text-muted-foreground hover:text-foreground p-1 transition-colors" title="Bad answer">
            <ThumbsDown size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
