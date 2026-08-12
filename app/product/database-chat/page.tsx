import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { ProductHero } from '@/components/marketing/sections/product-hero'
import { ProductFeatures } from '@/components/marketing/sections/product-features'
import { ProductHowItWorks } from '@/components/marketing/sections/product-how-it-works'
import { ProductCTA } from '@/components/marketing/sections/product-cta'
import { Database, Shield, BarChart3, MessageSquare, History, Code, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'AI Database Chat — Ask Your Database Anything',
  description: 'Connect your database and ask questions in plain English. Internite AI generates safe SQL, executes queries, and returns answers with visualizations. No SQL knowledge required.',
  path: '/product/database-chat',
  keywords: ['AI database chat', 'natural language SQL', 'database chatbot', 'text to SQL', 'AI SQL'],
})

const FEATURES = [
  {
    title: 'Natural Language Queries',
    description: 'Ask questions like "Which customers generated the most revenue this quarter?" and get instant answers.',
    icon: 'MessageSquare',
  },
  {
    title: 'Safe SQL Generation',
    description: 'Every query is validated before execution. Destructive operations are blocked by default.',
    icon: 'Shield',
  },
  {
    title: 'Schema Awareness',
    description: 'AI understands your database structure, tables, relationships, and column types.',
    icon: 'Database',
  },
  {
    title: 'Interactive Results',
    description: 'View results as tables, export to CSV, or visualize as charts with one click.',
    icon: 'BarChart3',
  },
  {
    title: 'Query History',
    description: 'Track all your queries, revisit previous analyses, and share insights with your team.',
    icon: 'History',
  },
  {
    title: 'Multi-Database Support',
    description: 'Connect PostgreSQL, MySQL, MongoDB, SQL Server, and more without configuration.',
    icon: 'Code',
  },
]

const STEPS = [
  { step: 1, title: 'Connect your database', description: 'Add your database connection. Credentials are encrypted and never exposed.' },
  { step: 2, title: 'Ask in plain English', description: 'Type questions like "Show monthly revenue" or "Which products are underperforming?"' },
  { step: 3, title: 'Get instant answers', description: 'Receive accurate SQL, execution results, and optional visualizations.' },
]

export default function DatabaseChatPage() {
  return (
    <MarketingLayout>
      <ProductHero
        badge="Database Chat"
        title="Chat with your database."
        subtitle="Without writing SQL."
        description="Connect your database and ask questions in plain English. Get instant answers, generated SQL, and visualizations — no SQL knowledge required."
        primaryCTA={{ label: 'Start Free', href: '/signup' }}
        secondaryCTA={{ label: 'See How It Works', href: '#how-it-works' }}
        features={[
          'Schema-aware queries',
          'Read-only by default',
          'Supports 8+ databases',
        ]}
        theme="blue"
      />

      {/* Features */}
      <ProductFeatures
        title="Everything you need to query databases"
        subtitle="Built for developers and data teams who want answers fast"
        features={FEATURES}
        theme="blue"
      />

      {/* How It Works */}
      <div id="how-it-works">
        <ProductHowItWorks
          title="How Database Chat works"
          subtitle="From question to answer in under a second"
          steps={STEPS}
          theme="blue"
        />
      </div>

      {/* Supported Databases */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Supported Databases</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Connect to your existing databases with zero configuration.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'PostgreSQL', popular: true },
              { name: 'MySQL', popular: true },
              { name: 'MongoDB', popular: true },
              { name: 'SQL Server' },
              { name: 'MariaDB' },
              { name: 'SQLite' },
              { name: 'Supabase' },
              { name: 'Neon' },
            ].map((db) => (
              <div
                key={db.name}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <Database className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-white">{db.name}</span>
                {db.popular && (
                  <span className="ml-auto text-[10px] font-medium text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">Popular</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Security by default</h2>
          <p className="text-slate-400 text-center mb-12">
            Your database credentials and data are protected at every layer.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Encrypted credentials', desc: 'AES-256-GCM encryption for all stored credentials.' },
              { icon: Database, title: 'Read-only mode', desc: 'Destructive queries blocked by default. Write access requires opt-in.' },
              { icon: MessageSquare, title: 'Server-side execution', desc: 'Credentials never reach the browser. All queries run server-side.' },
              { icon: History, title: 'Audit logging', desc: 'Every query is logged with user, timestamp, and SQL for compliance.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ProductCTA
        title="Ready to talk to your data?"
        description="Connect your database and start asking questions in minutes."
        primaryCTA={{ label: 'Start Free', href: '/signup' }}
        secondaryCTA={{ label: 'View Documentation', href: '/developers/docs' }}
        theme="blue"
      />
    </MarketingLayout>
  )
}
