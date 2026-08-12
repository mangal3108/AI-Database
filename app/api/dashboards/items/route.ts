import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenant = await getTenantContext(session.user.id)
  const items = await prisma.dashboardItem.findMany({
    where: { dashboard: { organizationId: tenant.organizationId } },
    include: { dashboard: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null) as { databaseId?: string; query?: string; title?: string } | null
  if (!body?.databaseId || !body.query?.trim()) return NextResponse.json({ error: 'databaseId and query are required' }, { status: 400 })

  const tenant = await getTenantContext(session.user.id)
  const database = await prisma.databaseConnection.findFirst({ where: { id: body.databaseId, organizationId: tenant.organizationId }, select: { id: true } })
  if (!database) return NextResponse.json({ error: 'Database not found' }, { status: 404 })

  try {
    const existing = await prisma.dashboard.findFirst({ where: { organizationId: tenant.organizationId, name: 'Executive Overview' } })
    const dashboard = existing || await prisma.dashboard.create({ data: { organizationId: tenant.organizationId, projectId: tenant.projectId, name: 'Executive Overview', description: 'Saved results from Chat', layout: { savedResults: [] } } })
    const layout = (dashboard.layout && typeof dashboard.layout === 'object' && !Array.isArray(dashboard.layout)) ? dashboard.layout as Record<string, unknown> : {}
    const savedResults = Array.isArray(layout.savedResults) ? layout.savedResults : []
    const result = { title: body.title?.trim() || 'Chat result', query: body.query.trim(), databaseId: database.id, createdAt: new Date().toISOString() }
    const updatedDashboard = await prisma.dashboard.update({ where: { id: dashboard.id }, data: { layout: { ...layout, savedResults: [...savedResults, result] } } })
    let item: { id: string; dashboardId: string; title: string } | null = null
    try {
      item = await prisma.dashboardItem.create({
        data: {
          dashboardId: dashboard.id,
          title: body.title?.trim() || 'Chat result',
          visualizationType: 'TABLE',
          config: { query: body.query.trim(), databaseId: database.id },
        },
        select: { id: true, dashboardId: true, title: true },
      })
    } catch (itemError) {
      console.error('[DASHBOARD ITEMS] Optional item row failed; layout persistence retained:', itemError)
    }
    return NextResponse.json({ dashboard: updatedDashboard, item }, { status: 201 })
  } catch (error) {
    console.error('[DASHBOARD ITEMS] Create error:', error)
    return NextResponse.json({ error: 'Failed to persist dashboard item' }, { status: 500 })
  }
}
