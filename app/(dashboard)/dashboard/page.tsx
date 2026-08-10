import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Database, MessageSquare, BarChart3, ArrowUpRight, Plus, Activity,
  CheckCircle2, Clock, Shield, Sparkles, ChevronRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Overview — Internite AI',
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
  })

  const orgId = membership?.organizationId

  const databases = orgId
    ? await prisma.databaseConnection.findMany({
        where: { organizationId: orgId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      })
    : []

  const conversations = orgId
    ? await prisma.conversation.findMany({
        where: { organizationId: orgId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      })
    : []

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans space-y-10 text-slate-100">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good day, {session?.user?.name ?? 'Developer'}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is what is happening across your databases and AI intelligence layer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm shadow-indigo-600/20"
          >
            <MessageSquare size={14} />
            Ask Question
          </Link>
          <Link
            href="/dashboard/databases/new"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all"
          >
            <Plus size={14} />
            Connect DB
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Connected Databases', value: databases.length, sub: 'Active PostgreSQL & MySQL', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'AI Conversations', value: conversations.length, sub: 'Natural language queries', icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'RAG Knowledge Index', value: 'Ready', sub: 'Schema graph vector space', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Security Policy', value: 'Read-Only', sub: 'AST Query Safety Engine', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map(m => (
          <div key={m.label} className="bg-[#111113]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
              <div className={`p-2 rounded-xl ${m.bg} ${m.color}`}>
                <m.icon size={15} />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-sans">{m.value}</div>
            <p className="text-[11px] text-slate-500 font-mono">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Section Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Connected Databases List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">YOUR DATABASES</h2>
            <Link href="/dashboard/databases" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View all <ChevronRight size={13} />
            </Link>
          </div>

          {databases.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                <Database size={20} />
              </div>
              <h3 className="text-sm font-bold text-white">No databases connected yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Connect your PostgreSQL, MySQL, or MongoDB database to start asking questions in natural language.
              </p>
              <Link
                href="/dashboard/databases/new"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
              >
                Connect First Database
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {databases.map(db => (
                <div
                  key={db.id}
                  className="p-4 rounded-2xl bg-[#111113] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-indigo-400">
                      <Database size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{db.name}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {db.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {db.type} · Read-only validated
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/databases/${db.id}`}
                    className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity / Chats (1 Col) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">RECENT CHATS</h2>

          {conversations.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#111113] border border-white/5 text-center text-xs text-slate-500">
              No recent chat activity
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map(c => (
                <Link
                  key={c.id}
                  href={`/dashboard/chat/${c.id}`}
                  className="p-3.5 rounded-2xl bg-[#111113] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all flex items-center justify-between block group"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <MessageSquare size={14} className="text-indigo-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                      {c.title ?? 'Untitled Analysis'}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-slate-300 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
