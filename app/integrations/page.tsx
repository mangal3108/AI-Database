import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { ProductHero } from '@/components/marketing/sections/product-hero'
import { ArrowRight, Database, Search, Filter } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Database Connectors — Integrate With Your Data',
  description: 'Connect Internite AI to PostgreSQL, MySQL, MongoDB, SQL Server, and more. Secure, read-only database connections with zero data migration.',
  path: '/integrations',
  keywords: ['database connectors', 'PostgreSQL', 'MySQL', 'MongoDB', 'SQL Server', 'database integration'],
})

const DATABASES = [
  {
    name: 'PostgreSQL',
    description: 'The world\'s most advanced open source database.',
    icon: '🐘',
    category: 'relational',
    features: ['Full SQL support', 'JSON operations', 'Advanced indexing', 'PostGIS support'],
    href: '/databases/postgresql',
    popular: true,
  },
  {
    name: 'MySQL',
    description: 'The world\'s most popular open source database.',
    icon: '🐬',
    category: 'relational',
    features: ['ACID transactions', 'Replication', 'Full-text search', 'InnoDB storage'],
    href: '/databases/mysql',
    popular: true,
  },
  {
    name: 'MongoDB',
    description: 'The document database for modern applications.',
    icon: '🍃',
    category: 'nosql',
    features: ['Flexible schema', 'Aggregation pipeline', 'Geospatial queries', 'Auto-sharding'],
    href: '/databases/mongodb',
    popular: true,
  },
  {
    name: 'SQL Server',
    description: 'Microsoft\'s enterprise-grade relational database.',
    icon: '🔷',
    category: 'relational',
    features: ['T-SQL support', 'SSIS integration', 'Enterprise security', 'Always On'],
    href: '/databases/sql-server',
    popular: false,
  },
  {
    name: 'MariaDB',
    description: 'A community-developed MySQL replacement.',
    icon: '🦭',
    category: 'relational',
    features: ['MariaDB Galera', 'Thread pooling', 'JSON functions', 'ColumnStore'],
    href: '/databases/mariadb',
    popular: false,
  },
  {
    name: 'SQLite',
    description: 'The most used database engine in the world.',
    icon: '📦',
    category: 'relational',
    features: ['Zero-config', 'Serverless', 'ACID compliant', 'Embedded'],
    href: '/databases/sqlite',
    popular: false,
  },
  {
    name: 'Supabase',
    description: 'The open source Firebase alternative.',
    icon: '⚡',
    category: 'platform',
    features: ['PostgreSQL core', 'Real-time subscriptions', 'Auth built-in', 'Edge functions'],
    href: '/databases/supabase',
    popular: true,
  },
  {
    name: 'Neon',
    description: 'Serverless Postgres with branching.',
    icon: '🌱',
    category: 'platform',
    features: ['Serverless', 'Branching', 'Scale to zero', 'Point-in-time restore'],
    href: '/databases/neon',
    popular: true,
  },
  {
    name: 'CockroachDB',
    description: 'Distributed SQL for cloud-native applications.',
    icon: '🦎',
    category: 'distributed',
    features: ['Distributed SQL', 'Multi-region', 'Horizontal scaling', 'Consistent'],
    href: '/databases/cockroachdb',
    popular: false,
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'relational', label: 'Relational' },
  { id: 'nosql', label: 'NoSQL' },
  { id: 'platform', label: 'Platform' },
  { id: 'distributed', label: 'Distributed' },
]

export default function IntegrationsPage() {
  return (
    <MarketingLayout>
      <ProductHero
        badge="Database Connectors"
        title="Connect the databases you already use."
        subtitle="Zero migration. Instant insights."
        description="Connect Internite AI to your existing databases in minutes. We support PostgreSQL, MySQL, MongoDB, and more — with enterprise-grade security and read-only access by default."
        primaryCTA={{ label: 'Start Free', href: '/signup' }}
        secondaryCTA={{ label: 'View Documentation', href: '/developers/docs' }}
        features={[
          'Read-only access by default',
          'Encrypted credential storage',
          'No data migration required',
          'Multi-database support',
        ]}
        theme="cyan"
      />

      {/* Database Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {DATABASES.map((db) => (
              <Link
                key={db.name}
                href={db.href}
                className="group relative bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/80 transition-all duration-300"
              >
                {db.popular && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Popular
                  </span>
                )}
                <div className="text-4xl mb-4">{db.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {db.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">{db.description}</p>
                <div className="flex flex-wrap gap-2">
                  {db.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don&apos;t see your database?</h2>
          <p className="text-slate-400 mb-8">
            We&apos;re constantly adding support for new databases. Let us know what you&apos;d like to see next.
          </p>
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Request a connector <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  )
}
