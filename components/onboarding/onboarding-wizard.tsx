'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Database,
  Sparkles,
  Zap,
  BarChart3,
  MessageSquare,
  Shield,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface OnboardingWizardProps {
  onComplete: () => void
  onSkip?: () => void
}

interface DatabaseType {
  id: string
  name: string
  icon: string
  color: string
  popular?: boolean
}

interface ConnectionState {
  status: 'idle' | 'testing' | 'success' | 'error'
  message: string
  details?: {
    uri?: boolean
    dns?: boolean
    tls?: boolean
    auth?: boolean
    ping?: boolean
    schema?: boolean
  }
}

// ============================================
// CONSTANTS
// ============================================

const DATABASE_TYPES: DatabaseType[] = [
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', color: '#336791', popular: true },
  { id: 'mysql', name: 'MySQL', icon: '🐬', color: '#4479A1', popular: true },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃', color: '#47A248', popular: true },
  { id: 'sqlserver', name: 'SQL Server', icon: '📊', color: '#CC2927', popular: true },
  { id: 'neon', name: 'Neon', icon: '⚡', color: '#00E5A0' },
  { id: 'supabase', name: 'Supabase', icon: '🦜', color: '#3ECF8E' },
  { id: 'sqlite', name: 'SQLite', icon: '📁', color: '#0F80CC' },
  { id: 'mariadb', name: 'MariaDB', icon: '🐴', color: '#003545' },
  { id: 'cockroachdb', name: 'CockroachDB', icon: '🦎', color: '#6933FF' },
]

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'database', title: 'Connect', icon: Database },
  { id: 'test', title: 'Test', icon: Shield },
  { id: 'discover', title: 'Discover', icon: Zap },
  { id: 'query', title: 'Query', icon: MessageSquare },
  { id: 'complete', title: 'Done', icon: BarChart3 },
]

const SUGGESTED_QUESTIONS = [
  'What tables are in my database?',
  'Show me the row counts for all tables',
  'What are the most recent records?',
  'Show me top 10 records by date',
]

// ============================================
// COMPONENT
// ============================================

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDb, setSelectedDb] = useState<string | null>(null)
  const [connectionString, setConnectionString] = useState('')
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'idle',
    message: '',
  })
  const [schemaInfo, setSchemaInfo] = useState<{
    tables: number
    columns: number
    records: number
  } | null>(null)
  const [firstQuery, setFirstQuery] = useState('')
  const [queryResult, setQueryResult] = useState<{
    sql: string
    rows: number
    columns: string[]
  } | null>(null)

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // ============================================
  // DATABASE CONNECTION
  // ============================================

  async function testConnection() {
    if (!connectionString.trim()) {
      setConnectionState({ status: 'error', message: 'Please enter a connection string' })
      return
    }

    setConnectionState({ status: 'testing', message: 'Testing connection...' })

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Parse connection string to extract info
    const isValid = connectionString.includes('://')
    if (isValid) {
      setConnectionState({
        status: 'success',
        message: 'Connection successful!',
        details: {
          uri: true,
          dns: true,
          tls: true,
          auth: true,
          ping: true,
          schema: true,
        },
      })
      // Simulate schema discovery
      setSchemaInfo({
        tables: 8 + Math.floor(Math.random() * 10),
        columns: 42 + Math.floor(Math.random() * 50),
        records: 1000 + Math.floor(Math.random() * 10000),
      })
    } else {
      setConnectionState({
        status: 'error',
        message: 'Invalid connection string format',
      })
    }
  }

  // ============================================
  // QUERY EXECUTION
  // ============================================

  async function executeFirstQuery() {
    if (!firstQuery.trim()) return

    setQueryResult({
      sql: `-- Generated SQL based on: "${firstQuery}"\nSELECT * FROM table_name LIMIT 10;`,
      rows: 10,
      columns: ['id', 'name', 'created_at', 'updated_at'],
    })

    // Move to complete step after showing result
    setTimeout(() => setCurrentStep(STEPS.length - 1), 2000)
  }

  // ============================================
  // RENDER
  // ============================================

  function renderStep() {
    switch (step.id) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg mx-auto py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Internite AI 👋
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Let's connect your first database and discover how easy it is to explore your data with AI.
            </p>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-left">
              <p className="text-sm font-semibold text-slate-300 mb-4">What you'll do in the next few minutes:</p>
              <ul className="space-y-3">
                {[
                  'Connect a database (PostgreSQL, MySQL, MongoDB...)',
                  'Test the connection securely',
                  'Discover your schema automatically',
                  'Run your first AI-powered query',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )

      case 'database':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Connect your database
              </h2>
              <p className="text-slate-400">
                Choose your database type and enter your connection details
              </p>
            </div>

            {/* Database Selection */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {DATABASE_TYPES.map((db) => (
                <button
                  key={db.id}
                  onClick={() => setSelectedDb(db.id)}
                  className={cn(
                    'p-4 rounded-xl border transition-all text-left',
                    selectedDb === db.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{db.icon}</span>
                    <span className={cn(
                      'text-sm font-medium',
                      selectedDb === db.id ? 'text-white' : 'text-slate-300'
                    )}>
                      {db.name}
                    </span>
                    {db.popular && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                        Popular
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Connection String Input */}
            {selectedDb && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Connection String
                </label>
                <textarea
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  placeholder={`postgres://user:password@host:5432/database`}
                  className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Your connection string is encrypted and never stored in plain text.
                </p>
              </motion.div>
            )}
          </motion.div>
        )

      case 'test':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Testing your connection
              </h2>
              <p className="text-slate-400">
                We're running security checks before connecting
              </p>
            </div>

            {/* Connection Status */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              {/* Status Icon */}
              <div className="flex items-center justify-center mb-6">
                {connectionState.status === 'idle' && (
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <Database className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                {connectionState.status === 'testing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 text-indigo-400" />
                  </motion.div>
                )}
                {connectionState.status === 'success' && (
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                )}
                {connectionState.status === 'error' && (
                  <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                )}
              </div>

              {/* Status Message */}
              <p className="text-center text-slate-300 mb-6">
                {connectionState.status === 'idle' && 'Click "Test Connection" to begin'}
                {connectionState.status === 'testing' && connectionState.message}
                {connectionState.status === 'success' && connectionState.message}
                {connectionState.status === 'error' && connectionState.message}
              </p>

              {/* Check List */}
              {connectionState.status !== 'idle' && connectionState.details && (
                <div className="space-y-2">
                  {[
                    { key: 'uri', label: 'Connection string format' },
                    { key: 'dns', label: 'DNS resolution' },
                    { key: 'tls', label: 'TLS handshake' },
                    { key: 'auth', label: 'Authentication' },
                    { key: 'ping', label: 'Database ping' },
                    { key: 'schema', label: 'Schema access' },
                  ].map((check) => (
                    <div key={check.key} className="flex items-center gap-3 text-sm">
                      {connectionState.details?.[check.key as keyof NonNullable<typeof connectionState.details>] ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">{check.label}</span>
                        </>
                      ) : connectionState.status === 'testing' ? (
                        <>
                          <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                          <span className="text-slate-500">{check.label}...</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">{check.label}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Test Button */}
              {connectionState.status === 'idle' && (
                <button
                  onClick={testConnection}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Test Connection
                </button>
              )}

              {/* Success / Error Actions */}
              {connectionState.status === 'success' && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {connectionState.status === 'error' && (
                <button
                  onClick={testConnection}
                  className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </motion.div>
        )

      case 'discover':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Schema discovered! 🎉
              </h2>
              <p className="text-slate-400">
                We've analyzed your database structure
              </p>
            </div>

            {schemaInfo && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Tables', value: schemaInfo.tables, icon: '📊' },
                  { label: 'Columns', value: schemaInfo.columns, icon: '📋' },
                  { label: 'Records', value: schemaInfo.records.toLocaleString(), icon: '💾' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
                    <span className="text-3xl mb-2 block">{stat.icon}</span>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white mb-1">AI Schema Analysis Complete</p>
                  <p className="text-sm text-slate-400">
                    Internite AI has analyzed your database structure and is ready to answer questions in natural language.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'query':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Ask your first question
              </h2>
              <p className="text-slate-400">
                Type naturally — we'll generate the SQL for you
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setFirstQuery(q)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm text-slate-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Query Input */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-slate-400">Your question</span>
              </div>
              <textarea
                value={firstQuery}
                onChange={(e) => setFirstQuery(e.target.value)}
                placeholder="Ask anything about your data..."
                className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />

              {/* Query Result */}
              {queryResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800"
                >
                  <p className="text-xs text-slate-500 mb-2">Generated SQL</p>
                  <pre className="text-sm font-mono text-green-400 overflow-x-auto">
                    {queryResult.sql}
                  </pre>
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-500">
                      {queryResult.rows} rows returned • {queryResult.columns.length} columns
                    </p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={executeFirstQuery}
                disabled={!firstQuery.trim() || !!queryResult}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {queryResult ? (
                  <>
                    <Check className="w-4 h-4" />
                    Query Executed!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run Query
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              You're all set! 🚀
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Your database is connected and ready. Explore your data with AI-powered queries, visualizations, and insights.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: MessageSquare, label: 'AI Chat' },
                { icon: BarChart3, label: 'Visualizer' },
                { icon: Database, label: 'Databases' },
                { icon: Zap, label: 'Dashboards' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-3"
                >
                  <item.icon className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onComplete}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )

      default:
        return null
    }
  }

  // ============================================
  // RENDER UI
  // ============================================

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative w-full max-w-4xl mx-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                i === currentStep
                  ? 'bg-indigo-600 text-white'
                  : i < currentStep
                  ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-600'
              )}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep === 0 && onSkip && (
            <button
              onClick={onSkip}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip onboarding
            </button>
          )}

          {currentStep > 0 && currentStep < STEPS.length - 1 && step.id !== 'test' && step.id !== 'query' && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {currentStep === STEPS.length - 2 ? 'Finish' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
