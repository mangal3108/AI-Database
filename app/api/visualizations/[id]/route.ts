import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'

/**
 * GET /api/visualizations/[id]
 * Get a specific visualization with full details
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

    const visualization = await prisma.visualization.findFirst({
      where: {
        id,
        organizationId: tenant.organizationId, // SECURITY: Tenant isolation
      },
      include: {
        database: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        query: true,
      },
    })

    if (!visualization) {
      return NextResponse.json({ error: 'Visualization not found' }, { status: 404 })
    }

    return NextResponse.json({ visualization })
  } catch (err) {
    console.error('[VISUALIZATION] Get error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/visualizations/[id]
 * Update a visualization
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
    const existing = await prisma.visualization.findFirst({
      where: {
        id,
        organizationId: tenant.organizationId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Visualization not found' }, { status: 404 })
    }

    const updated = await prisma.visualization.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        chartType: body.chartType,
        configuration: body.configuration,
        sourceQuery: body.sourceQuery,
      },
    })

    return NextResponse.json({ visualization: updated })
  } catch (err) {
    console.error('[VISUALIZATION] Update error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/visualizations/[id]
 * Delete a visualization
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

    // Verify ownership before deletion
    const existing = await prisma.visualization.findFirst({
      where: {
        id,
        organizationId: tenant.organizationId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Visualization not found' }, { status: 404 })
    }

    await prisma.visualization.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[VISUALIZATION] Delete error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
