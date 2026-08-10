import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { DashboardsClient } from '@/components/dashboards/dashboards-client'

export const metadata: Metadata = { title: 'Dashboards — Internite AI' }

export default async function DashboardsPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const membership = await prisma.membership.findFirst({
    where: { userId },
  })

  const dashboards = membership
    ? await prisma.dashboard.findMany({
        where: { organizationId: membership.organizationId },
        orderBy: { updatedAt: 'desc' },
      })
    : []

  return <DashboardsClient initialDashboards={dashboards} />
}
