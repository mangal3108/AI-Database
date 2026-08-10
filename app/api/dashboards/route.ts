import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'

/**
 * GET /api/dashboards
 * List all dashboards for the current organization
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)

    const dashboards = await prisma.dashboard.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        _count: { select: { widgets: true, items: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({
      dashboards: dashboards.map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        widgetCount: d._count.widgets + d._count.items,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
    })
  } catch (err) {
    console.error('[DASHBOARDS] List error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * POST /api/dashboards
 * Create a new dashboard
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const body = await req.json()

    const { name, description, layout } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        name,
        description: description || null,
        layout: layout || null,
        organizationId: tenant.organizationId,
      },
    })

    return NextResponse.json({ dashboard }, { status: 201 })
  } catch (err) {
    console.error('[DASHBOARDS] Create error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
