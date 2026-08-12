import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, X, Minus, MessageSquare, Shield, Database, Zap, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Internite AI vs ChatGPT | Database-Specific AI vs General AI',
  description: 'Compare Internite AI and ChatGPT for database queries. See why domain-specific AI with schema understanding beats general AI assistants for data exploration.',
  keywords: ['Internite vs ChatGPT', 'database AI vs general AI', 'ChatGPT SQL', 'AI database assistant vs chatbot'],
  openGraph: {
    title: 'Internite AI vs ChatGPT | Domain-Specific Database AI',
    description: 'ChatGPT doesn\'t know your schema. Internite AI does — and generates accurate, safe SQL accordingly.',
    type: 'website',
  },
}

const COMPARISON = [
  { feature: 'Understands your database schema', internite: true, chatgpt: false },
  { feature: 'Connects directly to your database', internite: true, chatgpt: false },
  { feature: 'Generates SQL for your specific dialect', internite: true, chatgpt: 'Generic' },
  { feature: 'Read-only query enforcement', internite: true, chatgpt: false },
  { feature: 'No prompt engineering required', internite: true, chatgpt: false },
  { feature: 'Handles schema changes automatically', internite: true, chatgpt: false },
  { feature: 'Query result visualization', internite: true, chatgpt: false },
  { feature: 'Multi-database support', internite: true, chatgpt: false },
  { feature: 'Audit logging', internite: true, chatgpt: false },
  { feature: 'Credentials never leave your server', internite: true, chatgpt: false },
  { feature: 'RAG with your business knowledge', internite: true, chatgpt: false },
  { feature: 'Query safety validation', internite: true, chatgpt: false },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight">
            <span className="text-white">INTERN</span>
            <span className="text-blue-400">ITE</span>
          </Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
            COMPARISON
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Internite AI vs ChatGPT
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Why domain-specific AI beats general AI assistants for database queries.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-colors">
            Try Internite AI free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-[#161B22] border-b border-slate-800">
              <div className="text-sm font-bold text-slate-300">Feature</div>
              <div className="text-sm font-bold text-indigo-400 text-center">Internite AI</div>
              <div className="text-sm font-bold text-slate-400 text-center">ChatGPT</div>
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 gap-4 p-5 ${
                  i !== COMPARISON.length - 1 ? 'border-b border-slate-800/50' : ''
                }`}
              >
                <div className="text-sm text-slate-300">{row.feature}</div>
                <div className="flex justify-center">
                  {typeof row.internite === 'boolean' ? (
                    row.internite ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )
                  ) : (
                    <span className="text-sm text-emerald-400">{row.internite}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.chatgpt === 'boolean' ? (
                    row.chatgpt ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )
                  ) : (
                    <span className="text-sm text-slate-400">{row.chatgpt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <div className="py-20 px-4 bg-[#080B10]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">
            The key difference
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ChatGPT */}
            <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-400 mb-4">ChatGPT</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                ChatGPT doesn't know your database schema. It generates generic SQL based on common patterns — which often fails or returns incorrect results for your specific tables and columns.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>Doesn&apos;t know your schema</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>Generic SQL may be wrong</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>Requires prompt engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>No direct database access</span>
                </li>
              </ul>
            </div>

            {/* Internite */}
            <div className="bg-[#0D111A] border border-indigo-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-indigo-400 mb-4">Internite AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Internite AI connects directly to your database, understands your schema, relationships, and business context — then generates precise SQL for your specific setup.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Schema-aware SQL generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Automatic schema discovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Read-only safety enforcement</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Direct database connection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to get accurate database answers?
          </h2>
          <p className="text-slate-400 mb-8">
            Stop guessing with generic AI. Get precise SQL backed by your actual schema.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-colors">
            Start free — no credit card
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 Internite AI Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
