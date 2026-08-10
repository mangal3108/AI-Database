import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Database, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react'
import { DatabaseLogo } from '@/components/database/database-logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Databases — Internite AI',
}

const DB_ICONS: Record<string, { color: string; abbr: string }> = {
  POSTGRESQL: { color: '#336791', abbr: 'PG' },
  NEON: { color: '#00E5A0', abbr: 'NE' },
  SUPABASE: { color: '#3ECF8E', abbr: 'SB' },
  MYSQL: { color: '#4479A1', abbr: 'MY' },
  MONGODB: { color: '#47A248', abbr: 'MO' },
  SQLSERVER: { color: '#CC2927', abbr: 'MS' },
  SQLITE: { color: '#0F80CC', abbr: 'SL' },
  COCKROACHDB: { color: '#6933FF', abbr: 'CR' },
  MARIADB: { color: '#003545', abbr: 'MA' },
}

export default async function DatabasesPage() {
  const session = await auth()
  const membership = await prisma.membership.findFirst({ where: { userId: session?.user?.id ?? '' } })
  
  const connections = membership ? await prisma.databaseConnection.findMany({
    where: { organizationId: membership.organizationId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  }) : []

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Databases</h1>
          <p className="text-muted-foreground mt-1">
            Manage your database connections
          </p>
        </div>
        <Link
          href="/dashboard/databases/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          Connect database
        </Link>
      </div>

      {/* Empty state */}
      {connections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border rounded-2xl">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <Database size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No databases connected</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            Connect your first database to start asking questions with Internite AI.
          </p>
          <Link
            href="/dashboard/databases/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-all"
          >
            <Plus size={16} />
            Connect database
          </Link>
        </div>
      )}

      {/* Connections grid */}
      {connections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map(conn => {
            const icon = DB_ICONS[conn.type] ?? { color: '#666', abbr: 'DB' }
            return (
              <Link
                key={conn.id}
                href={`/dashboard/databases/${conn.id}`}
                className="group p-5 bg-card/40 border border-border/50 rounded-2xl hover:border-border hover:bg-card/70 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800"
                  >
                    <DatabaseLogo type={conn.type} className="w-5 h-5" />
                  </div>
                  <StatusBadge status={conn.status} />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {conn.name}
                </h3>
                <p className="text-xs text-muted-foreground">{conn.type}</p>
                {conn.lastTestedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last tested: {new Date(conn.lastTestedAt).toLocaleDateString()}
                  </p>
                )}
                {conn.lastErrorMessage && conn.status === 'ERROR' && (
                  <p className="text-xs text-destructive mt-2 truncate">{conn.lastErrorMessage}</p>
                )}
              </Link>
            )
          })}

          {/* Add new card */}
          <Link
            href="/dashboard/databases/new"
            className="flex flex-col items-center justify-center gap-2 p-5 border border-dashed border-border/50 rounded-2xl hover:border-border hover:bg-muted/20 transition-all text-muted-foreground hover:text-foreground"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">Add database</span>
          </Link>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'CONNECTED':
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} />
          Connected
        </span>
      )
    case 'ERROR':
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
          <AlertCircle size={10} />
          Error
        </span>
      )
    case 'INDEXING':
      return (
        <span className="flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">
          <Loader2 size={10} className="animate-spin" />
          Indexing
        </span>
      )
    default:
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          <Clock size={10} />
          Pending
        </span>
      )
  }
}
