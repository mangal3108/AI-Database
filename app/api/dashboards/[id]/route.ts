import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'

/**
 * GET /api/dashboards/[id]
 * Get a specific dashboard
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const { id } = await params

    const dashboard = await prisma.dashboard.findFirst({
      where: { id, organizationId: tenant.organizationId },
      include: {
        widgets: true,
        items: true,
      },
    })

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
    }

    return NextResponse.json({ dashboard })
  } catch (err) {
    console.error('[DASHBOARD] Get error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * PUT /api/dashboards/[id]
 * Update a dashboard
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const { id } = await params
    const body = await req.json()

    // Verify ownership
    const existing = await prisma.dashboard.findFirst({
      where: { id, organizationId: tenant.organizationId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
    }

    const { name, description, layout, widgets } = body

    // Update dashboard
    const dashboard = await prisma.dashboard.update({
      where: { id },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        layout: layout ? JSON.parse(JSON.stringify(layout)) : existing.layout,
      },
    })

    // Update widgets if provided
    if (widgets && Array.isArray(widgets)) {
      // Delete existing widgets
      await prisma.dashboardWidget.deleteMany({ where: { dashboardId: id } })

      // Create new widgets
      await prisma.dashboardWidget.createMany({
        data: widgets.map((w: {
          id?: string
          type: string
          title?: string
          visualizationId?: string
          position: object
          config: object
        }) => ({
          dashboardId: id,
          organizationId: tenant.organizationId,
          type: w.type,
          title: w.title || null,
          visualizationId: w.visualizationId || null,
          position: JSON.stringify(w.position),
          config: JSON.stringify(w.config || {}),
        })),
      })
    }

    // Fetch updated dashboard
    const updated = await prisma.dashboard.findUnique({
      where: { id },
      include: { widgets: true },
    })

    return NextResponse.json({ dashboard: updated })
  } catch (err) {
    console.error('[DASHBOARD] Update error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboards/[id]
 * Delete a dashboard
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const { id } = await params

    // Verify ownership
    const existing = await prisma.dashboard.findFirst({
      where: { id, organizationId: tenant.organizationId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
    }

    await prisma.dashboard.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DASHBOARD] Delete error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
