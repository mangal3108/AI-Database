import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Database, Shield, Zap, BarChart3, MessageSquare, Brain, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Natural Language to SQL | Text to SQL AI | Internite AI',
  description: 'Convert plain English questions to SQL queries instantly. Internite AI understands your database schema, generates accurate SQL, and provides visualizations — no SQL knowledge required.',
  keywords: ['text to SQL', 'natural language to SQL', 'NL to SQL', 'English to SQL', 'AI SQL generator'],
  openGraph: {
    title: 'Natural Language to SQL | Text to SQL AI | Internite AI',
    description: 'Convert plain English questions to SQL queries. Schema-aware AI generates accurate, safe SQL for PostgreSQL, MySQL, MongoDB, and more.',
    type: 'website',
  },
}

const STEPS = [
  { icon: MessageSquare, title: 'Ask in English', description: 'Type your question naturally: "Show monthly revenue by product"' },
  { icon: Brain, title: 'AI Understands', description: 'Our AI analyzes your schema, relationships, and business context' },
  { icon: Code, title: 'SQL Generated', description: 'Accurate SQL created and validated — never guess at syntax' },
  { icon: BarChart3, title: 'Results Visualized', description: 'Get charts, tables, and AI insights automatically' },
]

const EXAMPLE_QUESTIONS = [
  { question: 'Show top 10 customers by order volume', sql: 'SELECT customer_name, SUM(amount) FROM orders GROUP BY 1 ORDER BY 2 DESC LIMIT 10' },
  { question: 'What is our monthly recurring revenue?', sql: 'SELECT DATE_TRUNC(\'month\', created_at), SUM(amount) FROM subscriptions GROUP BY 1' },
  { question: 'Which products have the highest return rate?', sql: 'SELECT product_name, COUNT(*) as returns FROM orders WHERE status = \'returned\' GROUP BY 1 ORDER BY 2 DESC' },
]

export default function TextToSQLPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl">
            <span className="text-white">INTERN</span>
            <span className="text-blue-400">ITE</span>
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">AI</span>
          </Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
            Start free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
            NATURAL LANGUAGE TO SQL
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ask your database questions in plain English.
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            No SQL knowledge required. Internite AI converts your questions into accurate, schema-aware SQL queries for PostgreSQL, MySQL, MongoDB, and more.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30">
            Try it free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-[#080B10]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Example conversions</h2>
          <p className="text-slate-400 text-center mb-12">See how natural language becomes SQL.</p>

          <div className="space-y-6">
            {EXAMPLE_QUESTIONS.map((example, i) => (
              <div key={i} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-3">{example.question}</p>
                    <div className="bg-[#161B22] rounded-xl p-4 overflow-x-auto">
                      <code className="text-sm text-emerald-400 font-mono">{example.sql}</code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[#080B10]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">What makes Internite AI different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Database, title: 'Schema-Aware', description: 'Understands your specific tables, columns, and relationships — not generic SQL' },
              { icon: Shield, title: 'Safe by Default', description: 'Read-only queries enforced. DROP, DELETE, UPDATE blocked automatically' },
              { icon: Zap, title: 'Instant Results', description: 'Stream results in real-time. See SQL generation as it happens' },
              { icon: BarChart3, title: 'Automatic Charts', description: 'Query results turned into visualizations without manual work' },
            ].map((feature, i) => (
              <div key={i} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
                <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to stop writing SQL?</h2>
          <p className="text-slate-400 mb-8">Start asking questions in plain English. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30">
            Start free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 px-4 text-center text-xs text-slate-500">
        <Link href="/" className="hover:text-white transition-colors">← Back to Internite AI</Link>
      </footer>
    </div>
  )
}
