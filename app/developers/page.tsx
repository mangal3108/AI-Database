import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { ArrowRight, Code, Box, GitBranch, BookOpen, Zap, Terminal, Database } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Developers — Build With Internite AI',
  description: 'Integrate Internite AI into your applications with our REST API, TypeScript SDK, and webhooks. Full documentation and code examples.',
  path: '/developers',
  keywords: ['developer API', 'REST API', 'TypeScript SDK', 'webhooks', 'database API'],
})

const API_FEATURES = [
  {
    icon: Box,
    title: 'REST API',
    description: 'Full-featured REST API for all operations. Query databases, manage connections, and retrieve results programmatically.',
    href: '/developers/api',
  },
  {
    icon: Code,
    title: 'TypeScript SDK',
    description: 'Official JavaScript/TypeScript client with full type safety, auto-completion, and modern async patterns.',
    href: '/developers/sdk',
  },
  {
    icon: GitBranch,
    title: 'Webhooks',
    description: 'Subscribe to events like query completion, dashboard updates, and billing notifications.',
    href: '/developers/webhooks',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Comprehensive guides, tutorials, and API reference. From quickstart to advanced patterns.',
    href: '/developers/docs',
  },
]

const CODE_EXAMPLE = `// Install the SDK
npm install @interniteai/sdk

// Initialize the client
import { Internite } from '@interniteai/sdk'

const client = new Internite({
  apiKey: process.env.INTERNITE_API_KEY
})

// Query your database
const result = await client.queries.create({
  databaseId: 'db_abc123',
  question: 'Show monthly revenue for the last 12 months'
})

// Get results
const { data, visualization, sql } = await client.queries.getResult(result.id)
console.log(data) // [{ month: '2026-01', revenue: 45000 }, ...]`

export default function DevelopersPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#050505] to-[#080810]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Build with <span className="text-[#60A5FA]">Internite AI</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Integrate powerful database intelligence into your applications. REST API, TypeScript SDK, and webhooks for every workflow.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/developers/docs"
              className="inline-flex items-center gap-2 bg-[#60A5FA] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#4d94e0] transition-colors"
            >
              Read the Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/developers/api"
              className="inline-flex items-center gap-2 text-slate-300 font-medium px-6 py-3 hover:text-white transition-colors"
            >
              API Reference
            </Link>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Everything you need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {API_FEATURES.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-[#60A5FA]/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-slate-400 group-hover:text-[#60A5FA] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      {feature.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Type-safe SDK</h2>
              <p className="text-slate-400 mb-6">
                The official SDK provides full TypeScript support with auto-completion for queries, databases, and visualizations. Works in Node.js and modern browsers.
              </p>
              <ul className="space-y-3">
                {['Full TypeScript support', 'Tree-shakeable', 'Auto-pagination', 'Retry logic built-in', 'Webhook verification'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 to-transparent rounded-2xl blur-xl" />
              <div className="relative bg-[#0a0a0f] rounded-xl border border-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-500 ml-2">example.ts</span>
                </div>
                <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto">
                  <code>{CODE_EXAMPLE}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Start building</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              href="/developers/docs"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-center hover:border-slate-700 transition-all"
            >
              <BookOpen className="w-8 h-8 text-[#60A5FA] mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Documentation</h3>
              <p className="text-sm text-slate-400">Guides and tutorials</p>
            </Link>
            <Link
              href="/developers/api"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-center hover:border-slate-700 transition-all"
            >
              <Terminal className="w-8 h-8 text-[#60A5FA] mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">API Reference</h3>
              <p className="text-sm text-slate-400">Endpoint documentation</p>
            </Link>
            <Link
              href="/changelog"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-center hover:border-slate-700 transition-all"
            >
              <Zap className="w-8 h-8 text-[#60A5FA] mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Changelog</h3>
              <p className="text-sm text-slate-400">Latest updates</p>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
