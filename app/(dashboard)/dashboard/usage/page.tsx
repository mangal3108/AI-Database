import { UsageDashboardClient } from '@/components/usage/usage-dashboard-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Usage Dashboard — Internite AI',
}

export default function UsagePage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Usage Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed breakdown of AI queries, token consumption, and database connections.</p>
      </div>

      <UsageDashboardClient />
    </div>
  )
}
