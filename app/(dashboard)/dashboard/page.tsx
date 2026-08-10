import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Database, MessageSquare, BookmarkCheck, Zap, Plus, ArrowRight, Sparkles, Check, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Internite AI',
}

async function getDashboardData(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
  })

  if (!membership) return null

  const [connectionsCount, conversationsCount, savedQueriesCount, usageRecord] = await Promise.all([
    prisma.databaseConnection.count({
      where: { organizationId: membership.organizationId, deletedAt: null },
    }),
    prisma.conversation.count({
      where: { organizationId: membership.organizationId, deletedAt: null },
    }),
    prisma.savedQuery.count({
      where: { organizationId: membership.organizationId },
    }),
    prisma.usageRecord.findFirst({
      where: { organizationId: membership.organizationId },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const recentConversations = await prisma.conversation.findMany({
    where: { organizationId: membership.organizationId, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      connection: { select: { name: true, type: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, role: true },
      },
    },
  })

  const connections = await prisma.databaseConnection.findMany({
    where: { organizationId: membership.organizationId, deletedAt: null },
    select: { id: true, name: true, type: true, status: true },
    take: 4,
  })

  return {
    org: membership.organization,
    connectionsCount,
    conversationsCount,
    savedQueriesCount,
    aiQueriesUsed: usageRecord?.value ?? 0,
    recentConversations,
    connections,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData(session?.user?.id ?? '')

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Setting up your workspace...</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {greeting}, {firstName}.
          </h1>
          <p className="text-sm text-slate-300 mt-1">Talk to your database in plain English. Get answers, SQL & charts instantly.</p>
        </div>
        <Link
          href="/dashboard/chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          <Sparkles size={16} />
          Start AI Chat
        </Link>
      </div>

      {/* 3-Step Onboarding Guide */}
      <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-4">ONBOARDING PROGRESS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${data.connectionsCount > 0 ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">① CONNECT DATABASE</span>
              {data.connectionsCount > 0 ? <Check size={16} className="text-emerald-400" /> : <Link href="/dashboard/databases/new" className="text-xs text-indigo-400 hover:underline">Connect →</Link>}
            </div>
            <p className="text-xs text-slate-300">Connect PostgreSQL, MySQL, MongoDB, Neon or Supabase.</p>
          </div>

          <div className={`p-4 rounded-xl border ${data.connectionsCount > 0 ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-slate-900/40 border-slate-800/60'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400">② SCHEMA INDEXING</span>
              <span className="text-[10px] font-mono text-slate-400">AUTOMATIC</span>
            </div>
            <p className="text-xs text-slate-300">Hybrid RAG indexes tables, fields and foreign key relations.</p>
          </div>

          <div className={`p-4 rounded-xl border ${data.conversationsCount > 0 ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-900/40 border-slate-800/60'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">③ ASK AI QUESTIONS</span>
              {data.conversationsCount > 0 ? <Check size={16} className="text-emerald-400" /> : <Link href="/dashboard/chat" className="text-xs text-cyan-400 hover:underline">Try Now →</Link>}
            </div>
            <p className="text-xs text-slate-300">Ask natural language questions & auto-generate charts.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Database}
          label="Connected Databases"
          value={data.connectionsCount}
          href="/dashboard/databases"
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard
          icon={MessageSquare}
          label="Conversations"
          value={data.conversationsCount}
          href="/dashboard/chat"
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <StatCard
          icon={BookmarkCheck}
          label="Saved Queries"
          value={data.savedQueriesCount}
          href="/dashboard/queries"
          color="text-green-500"
          bg="bg-green-500/10"
        />
        <StatCard
          icon={Zap}
          label="AI Queries Used"
          value={data.aiQueriesUsed}
          href="/dashboard/settings"
          color="text-yellow-500"
          bg="bg-yellow-500/10"
          suffix="/ 100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Databases */}
        <div className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="font-semibold text-foreground text-sm">Connected Databases</h2>
            <Link href="/dashboard/databases" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {data.connections.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No databases connected"
              description="Connect your first database to start asking questions."
              action={{ label: 'Connect database', href: '/dashboard/databases/new' }}
            />
          ) : (
            <div className="divide-y divide-border/50">
              {data.connections.map(conn => (
                <Link
                  key={conn.id}
                  href={`/dashboard/databases/${conn.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="status-dot" style={{
                    background: conn.status === 'CONNECTED' ? 'hsl(142, 76%, 36%)' :
                      conn.status === 'ERROR' ? 'hsl(0, 84%, 60%)' :
                      conn.status === 'INDEXING' ? 'hsl(45, 93%, 47%)' : 'hsl(var(--muted-foreground))',
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{conn.name}</p>
                    <p className="text-xs text-muted-foreground">{conn.type}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          <div className="px-6 py-3 border-t border-border/50">
            <Link
              href="/dashboard/databases/new"
              className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
            >
              <Plus size={14} />
              Add database
            </Link>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="font-semibold text-foreground text-sm">Recent Conversations</h2>
            <Link href="/dashboard/chat" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {data.recentConversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No conversations yet"
              description="Connect a database and start asking questions."
              action={{ label: 'Start a chat', href: '/dashboard/chat' }}
            />
          ) : (
            <div className="divide-y divide-border/50">
              {data.recentConversations.map(conv => (
                <Link
                  key={conv.id}
                  href={`/dashboard/chat/${conv.id}`}
                  className="flex items-start gap-3 px-6 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare size={12} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {conv.title ?? 'Untitled conversation'}
                    </p>
                    {conv.messages[0] && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5 font-sans">
                        {(() => {
                          const raw = conv.messages[0].content.trim()
                          if (raw.startsWith('```json') || raw.startsWith('{')) {
                            try {
                              let jsonText = raw
                              const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
                              if (match) jsonText = match[1]!.trim()
                              const parsed = JSON.parse(jsonText)
                              if (parsed.answer) return parsed.answer.slice(0, 65) + '...'
                            } catch {
                              // Fallback if parsing fails
                            }
                          }
                          return raw.slice(0, 65) + '...'
                        })()}
                      </p>
                    )}
                    {conv.connection && (
                      <p className="text-xs text-muted-foreground mt-0.5">{conv.connection.name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="px-6 py-3 border-t border-border/50">
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
            >
              <Plus size={14} />
              New conversation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
  bg,
  suffix,
}: {
  icon: typeof Database
  label: string
  value: number
  href: string
  color: string
  bg: string
  suffix?: string
}) {
  return (
    <Link href={href} className="group bg-card/40 border border-border/50 rounded-2xl p-5 hover:border-border hover:bg-card/70 transition-all">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/5`}>
        <Icon size={16} className={color} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </Link>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Database
  title: string
  description: string
  action: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-10">
      <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={22} className="text-indigo-400" />
      </div>
      <p className="font-semibold text-foreground text-base mb-1">{title}</p>
      <p className="text-xs text-muted-foreground mb-5 max-w-xs leading-relaxed">{description}</p>
      <Link
        href={action.href}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2"
      >
        <Plus size={14} />
        <span>{action.label}</span>
      </Link>
    </div>
  )
}
