import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Code, Terminal, Zap, Shield, Key, ArrowRight, Copy } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'API Reference — Internite AI',
  description: 'Programmatic REST API reference for Internite AI. Execute natural language database queries, manage schema context, and stream results via API.',
  path: '/developers/api',
})

export default function ApiDocsPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Developer Documentation
          </span>
          <h1 className="text-4xl font-black text-white mt-3">REST API Reference</h1>
          <p className="text-slate-400 text-lg mt-2">
            Execute natural language database queries, retrieve schema metadata, and manage database connections programmatically.
          </p>
        </div>

        {/* Authentication Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Key className="text-indigo-400" size={20} />
            Authentication
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            All API requests must pass a Bearer token HTTP Authorization header containing your API secret key.
          </p>
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-indigo-300">
            Authorization: Bearer int_sec_99a8b7c6d5e4f321...
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <EndpointCard
            method="POST"
            path="/api/chat"
            title="Execute AI Query"
            description="Submit a natural language question against a connected database to generate SQL and return structured dataset records."
            bodyJson={`{
  "databaseConnectionId": "conn_12345",
  "message": "Show top 10 users by order count"
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/databases"
            title="List Connected Databases"
            description="Retrieve all database connections configured for your active organization workspace."
            bodyJson={`// Response
{
  "connections": [
    { "id": "conn_12345", "name": "Production Postgres", "type": "POSTGRESQL", "status": "CONNECTED" }
  ]
}`}
          />
        </div>
      </div>
    </MarketingLayout>
  )
}

function EndpointCard({ method, path, title, description, bodyJson }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-md">{method}</span>
        <span className="font-mono text-sm font-semibold text-slate-200">{path}</span>
      </div>
      <h3 className="font-bold text-white text-base mb-1">{title}</h3>
      <p className="text-xs text-slate-400 mb-4">{description}</p>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
        <pre>{bodyJson}</pre>
      </div>
    </div>
  )
}
