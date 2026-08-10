import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, X, Minus, BarChart3, MessageSquare, Zap, Shield, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Internite AI vs Tableau | AI Database Chat vs Traditional BI',
  description: 'Compare Internite AI and Tableau. See how AI-powered natural language database queries compare to traditional dashboard building. Setup in minutes, not days.',
  keywords: ['Internite vs Tableau', 'AI database chatbot vs BI tool', 'natural language SQL vs dashboard builder', 'Tableau alternative'],
  openGraph: {
    title: 'Internite AI vs Tableau | Natural Language Database Queries',
    description: 'Setup in minutes instead of days. Ask questions in plain English instead of building dashboards.',
    type: 'website',
  },
}

const COMPARISON = [
  { feature: 'Ask questions in plain English', internite: true, tableau: false },
  { feature: 'Automatic SQL generation', internite: true, tableau: false },
  { feature: 'Setup time', internite: 'Minutes', tableau: 'Days/Weeks' },
  { feature: 'No dashboard building required', internite: true, tableau: false },
  { feature: 'Automatic visualization', internite: true, tableau: 'Manual' },
  { feature: 'AI insights', internite: true, tableau: 'Limited' },
  { feature: 'Read-only by default', internite: true, tableau: 'Configurable' },
  { feature: 'Multi-database support', internite: true, tableau: 'Requires connectors' },
  { feature: 'Developer required', internite: false, tableau: 'Often' },
  { feature: 'Embedded AI assistant', internite: true, tableau: false },
  { feature: 'Real-time data exploration', internite: true, tableau: 'Scheduled refresh' },
  { feature: 'Monthly cost', internite: '$29+', tableau: '$75+' },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl">
            <span className="text-white">INTERN</span>
            <span className="text-blue-400">ITE</span>
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">AI</span>
          </Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            Start Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
            COMPARISON
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Internite AI vs Tableau
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Traditional BI tools require days of setup and dashboard building. Internite AI gets you answers in minutes with natural language queries.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#161B22] border-b border-slate-800 text-sm font-bold">
              <div className="text-slate-400">Feature</div>
              <div className="text-center text-indigo-400">Internite AI</div>
              <div className="text-center text-slate-400">Tableau</div>
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 gap-4 p-4 items-center ${
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
                    <span className="text-sm text-emerald-400 font-medium">{row.internite}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.tableau === 'boolean' ? (
                    row.tableau ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )
                  ) : (
                    <span className="text-sm text-slate-400">{row.tableau}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 px-4 bg-[#080B10]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Why teams switch to Internite AI
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Minutes, not months</h3>
              <p className="text-slate-400 text-sm">
                Connect your database and ask your first question in under 5 minutes. No data engineering team required.
              </p>
            </div>

            <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No SQL knowledge needed</h3>
              <p className="text-slate-400 text-sm">
                Ask questions in plain English. Get SQL-backed answers without writing a single query.
              </p>
            </div>

            <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Read-only by design</h3>
              <p className="text-slate-400 text-sm">
                DROP, DELETE, UPDATE blocked by default. Your data stays safe, even with AI-generated queries.
              </p>
            </div>

            <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automatic charts</h3>
              <p className="text-slate-400 text-sm">
                Query results automatically visualized. No manual dashboard building or chart configuration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to skip the dashboard builder?
          </h2>
          <p className="text-slate-400 mb-8">
            Get answers to your database questions in minutes, not days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              Try Internite AI free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
