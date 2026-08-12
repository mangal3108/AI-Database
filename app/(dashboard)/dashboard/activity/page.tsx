import { AuditLog } from '@/components/dashboard/audit-log'

export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review queries, database changes, and account events.</p>
      </div>
      <AuditLog />
    </div>
  )
}
