import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Database, Shield, Zap, BarChart3, MessageSquare, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Chatbot for MongoDB | Natural Language MongoDB Queries',
  description: 'Ask your MongoDB or MongoDB Atlas database questions in plain English. Internite AI understands document structure, generates aggregation pipelines, and provides instant insights.',
  keywords: ['MongoDB AI chatbot', 'chat with MongoDB', 'natural language MongoDB', 'MongoDB aggregation AI', 'MongoDB Atlas AI assistant'],
  openGraph: {
    title: 'AI Chatbot for MongoDB | Internite AI',
    description: 'Ask your MongoDB database questions in plain English. Get aggregation pipelines and insights automatically.',
    type: 'website',
  },
}

const FEATURES = [
  { icon: MessageSquare, title: 'Natural Language to Aggregation', description: 'Ask questions like "Count users by signup month" — Internite AI generates the MongoDB aggregation pipeline.' },
  { icon: Layers, title: 'Document Structure Understanding', description: 'Automatically analyzes collections, nested documents, arrays, and field types in your MongoDB database.' },
  { icon: Shield, title: 'Read-Only Security', description: 'write operations blocked by default. Credentials encrypted with AES-256-GCM.' },
  { icon: BarChart3, title: 'Automatic Visualization', description: 'Query results turned into charts, graphs, and dashboards automatically.' },
  { icon: Zap, title: 'Streaming Results', description: 'Watch aggregation pipelines execute in real-time with live results.' },
]

const QUERIES = [
  '"Count users registered this month"',
  '"Show me average order value by day"',
  '"What products are in each category?"',
  '"Find users who haven\'t logged in recently"',
  '"Calculate revenue by region this quarter"',
]

export default function MongoDBPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight">
            <span className="text-white">INTERN</span>
            <span className="text-[#60A5FA]">ITE</span>
          </Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            Start Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
            <Database size={14} />
            <span>MongoDB & MongoDB Atlas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ask your MongoDB questions<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">in plain English</span>
          </h1>
          <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">
            Connect your MongoDB or MongoDB Atlas database and start asking questions. Internite AI understands your document structure, generates aggregation pipelines, and delivers answers with visualizations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              Connect MongoDB Free
              <ArrowRight size={16} />
            </Link>
            <Link href="/demo" className="text-slate-300 hover:text-white font-semibold px-6 py-4 text-sm transition-colors">
              See it in action →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[#080B10]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Everything you need for MongoDB</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
                <feature.icon className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Queries */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Example queries you can ask</h2>
          <div className="grid gap-3">
            {QUERIES.map((query) => (
              <div key={query} className="bg-[#0D111A] border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <code className="text-slate-300 text-sm">{query}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-t from-emerald-950/30 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Ready to chat with your MongoDB?</h2>
          <p className="text-slate-400 mt-4">Connect in minutes. Start asking questions immediately.</p>
          <Link href="/signup" className="mt-8 inline-flex bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-500">
          <Link href="/" className="font-extrabold text-lg tracking-tight">
            <span className="text-white">INTERN</span>
            <span className="text-[#60A5FA]">ITE</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
