import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import { saveVisualization } from '@/server/services/visualization/visualization-engine'
import type { Prisma } from '@prisma/client'

/**
 * GET /api/visualizations
 * List all visualizations for the current organization
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const { searchParams } = new URL(req.url)
    const databaseId = searchParams.get('databaseId')

    const where: Prisma.VisualizationWhereInput = {
      organizationId: tenant.organizationId,
    }

    if (databaseId) {
      where.databaseId = databaseId
    }

    const visualizations = await prisma.visualization.findMany({
      where,
      include: {
        database: {
          select: { id: true, name: true, type: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ visualizations })
  } catch (err) {
    console.error('[VISUALIZATION] List error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/visualizations
 * Create a new visualization
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const body = await req.json()

    const {
      name,
      description,
      databaseId,
      queryId,
      chartType,
      configuration,
      sourceQuery,
    } = body

    if (!name || !databaseId || !chartType) {
      return NextResponse.json(
        { error: 'Name, databaseId, and chartType are required' },
        { status: 400 }
      )
    }

    // Verify database ownership
    const database = await prisma.databaseConnection.findFirst({
      where: {
        id: databaseId,
        organizationId: tenant.organizationId,
      },
    })

    if (!database) {
      return NextResponse.json(
        { error: 'Database not found or access denied' },
        { status: 404 }
      )
    }

    const visualization = await saveVisualization(session.user.id, {
      name,
      databaseId,
      chartType,
      configuration: configuration || {},
      sourceQuery,
    })

    return NextResponse.json({ visualization }, { status: 201 })
  } catch (err) {
    console.error('[VISUALIZATION] Create error:', err)
    return NextResponse.json(
      { error: 'Failed to create visualization' },
      { status: 500 }
    )
  }
}
