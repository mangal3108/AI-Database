import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null) as { databaseId?: string; query?: string; title?: string } | null
  if (!body?.databaseId || !body.query?.trim()) return NextResponse.json({ error: 'databaseId and query are required' }, { status: 400 })

  const tenant = await getTenantContext(session.user.id)
  const database = await prisma.databaseConnection.findFirst({ where: { id: body.databaseId, organizationId: tenant.organizationId }, select: { id: true } })
  if (!database) return NextResponse.json({ error: 'Database not found' }, { status: 404 })

  const dashboard = await prisma.dashboard.findFirst({ where: { organizationId: tenant.organizationId, name: 'Executive Overview' } })
    || await prisma.dashboard.create({ data: { organizationId: tenant.organizationId, projectId: tenant.projectId, name: 'Executive Overview', description: 'Saved results from Chat' } })
  const item = await prisma.dashboardItem.create({
    data: {
      dashboardId: dashboard.id,
      title: body.title?.trim() || 'Chat result',
      visualizationType: 'TABLE',
      config: { query: body.query.trim(), databaseId: database.id },
    },
    select: { id: true, dashboardId: true, title: true },
  })
  return NextResponse.json({ dashboard, item }, { status: 201 })
}
