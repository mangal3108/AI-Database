import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Natural Language SQL — Convert Plain English to SQL | Internite AI',
  description: 'Internite AI converts natural language questions into safe, accurate SQL queries for PostgreSQL, MySQL, MongoDB, and more. No SQL expertise required.',
  alternates: { canonical: 'https://internite.online/natural-language-sql' },
}

export default function NaturalLanguageSQLPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 antialiased font-sans">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">Natural Language SQL</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Ask your database anything.<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Get SQL instantly.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Internite AI converts any plain-English question into safe, accurate SQL in seconds. No syntax. No schema memorisation. Just ask.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/25">
            Try Natural Language SQL Free
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {[
            { q: 'Show monthly revenue for Q4 2024', note: 'Internite finds orders, payments, and timestamps automatically' },
            { q: 'Which customers churned in the last 30 days?', note: 'Detects churn logic from your subscription table structure' },
            { q: 'Top 10 products by units sold this year', note: 'Joins products and order_items correctly without guidance' },
            { q: 'Average session duration by device type', note: 'Reads analytics tables and groups by device column' },
          ].map(ex => (
            <div key={ex.q} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 mb-3 font-medium">
                &ldquo;{ex.q}&rdquo;
              </div>
              <p className="text-xs text-slate-500 font-mono">{ex.note}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-slate-900/60 border border-slate-800 rounded-2xl p-10">
          <h2 className="text-2xl font-black text-white mb-3">Stop writing SQL. Start asking questions.</h2>
          <p className="text-slate-300 mb-6">100 free natural language queries. No credit card. Connects in minutes.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all">
            Start Free
          </Link>
        </div>
      </div>
    </main>
  )
}
