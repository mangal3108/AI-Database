import { AuditLog } from '@/components/dashboard/audit-log'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ActivityPage() {
  const session = await auth()
  const membership = await prisma.membership.findFirst({ where: { userId: session?.user?.id ?? '' } })
  const rows = membership ? await prisma.auditLog.findMany({
    where: { organizationId: membership.organizationId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  }) : []
  const events = rows.map(row => ({
    id: row.id,
    userId: row.userId ?? '',
    userName: row.user?.name ?? 'System',
    userEmail: row.user?.email ?? '',
    action: row.action,
    resource: row.resourceType ?? 'workspace',
    resourceId: row.resourceId ?? '',
    timestamp: row.createdAt,
    ip: row.ipAddress ?? '—',
    status: 'success' as const,
    metadata: (row.metadata && typeof row.metadata === 'object' ? row.metadata : undefined) as Record<string, unknown> | undefined,
    userAgent: row.userAgent ?? undefined,
  }))

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-foreground">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review queries, database changes, and account events.</p>
      </div>
      <AuditLog initialEvents={events} />
    </div>
  )
}
