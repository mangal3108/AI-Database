import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Database, Shield, Zap, BarChart3, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Chatbot for MySQL | Natural Language MySQL Queries',
  description: 'Ask your MySQL database questions in plain English. Connect MySQL or MariaDB to Internite AI and get instant answers, charts, and insights.',
  keywords: ['MySQL AI chatbot', 'chat with MySQL', 'natural language SQL', 'MySQL query AI', 'MariaDB AI assistant'],
  openGraph: {
    title: 'AI Chatbot for MySQL | Internite AI',
    description: 'Ask your MySQL database questions in plain English. Get instant SQL-backed answers with visualizations.',
    type: 'website',
  },
}

const FEATURES = [
  { icon: MessageSquare, title: 'Natural Language Queries', description: 'Ask questions like "Show top products by sales" — Internite AI generates the MySQL-compatible SQL.' },
  { icon: Database, title: 'Full Schema Discovery', description: 'Automatically discovers tables, columns, indexes, and foreign keys in your MySQL database.' },
  { icon: Shield, title: 'Read-Only Security', description: 'DROP, DELETE, UPDATE blocked by default. Credentials encrypted with AES-256-GCM.' },
  { icon: BarChart3, title: 'Automatic Visualization', description: 'Query results turned into charts, graphs, and dashboards automatically.' },
  { icon: Zap, title: 'Streaming Results', description: 'Watch queries execute in real-time. See SQL generation and results as they appear.' },
]

const QUERIES = [
  '"Show monthly active users for the last year"',
  '"What is our average order processing time?"',
  '"Which customers have the highest LTV?"',
  '"Find products with low inventory"',
  '"Calculate conversion rate by source"',
]

export default function MySQLPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight">
              <span className="text-white">INTERN</span>
              <span className="text-[#60A5FA]">ITE</span>
            </span>
          </Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Start free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-indigo-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>MySQL & MariaDB Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ask your MySQL database questions in plain English
          </h1>
          <p className="text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
            Connect MySQL or MariaDB to Internite AI. Ask questions naturally, get accurate SQL queries, and visualize results instantly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30">
              Connect MySQL free →
            </Link>
            <Link href="/#demo" className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-semibold px-8 py-4 rounded-2xl text-sm transition-all duration-200">
              See it in action →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-[#080B10]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Everything you need to query MySQL with AI</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
                <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Queries */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Questions you can ask</h2>
          <div className="space-y-3">
            {QUERIES.map((q) => (
              <div key={q} className="bg-[#0D111A] border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-mono text-sm">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-slate-800/60">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Ready to query MySQL with AI?</h2>
          <p className="text-slate-400 mt-4">Connect your database in minutes. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-sm mt-8 transition-colors">
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-sm text-slate-500">
        <p>© 2026 Internite AI Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
