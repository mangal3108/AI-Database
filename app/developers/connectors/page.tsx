import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Database, Server, Cpu, CheckCircle } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Database Connectors — Internite AI',
  description: 'Native drivers and connectors for PostgreSQL, MySQL, MongoDB, SQLite, SQL Server, Supabase, Neon, and MariaDB.',
  path: '/developers/connectors',
})

export default function ConnectorsPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Integrations
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Native Database Connectors</h1>
          <p className="text-slate-400 text-lg mt-2">
            Secure, encrypted TLS connection drivers for all major relational and document database engines.
          </p>
        </div>
      </div>
    </MarketingLayout>
  )
}
