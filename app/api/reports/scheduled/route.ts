import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'

/**
 * GET /api/reports/scheduled
 * List all scheduled reports
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)

    const reports = await prisma.scheduledReport.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        dashboard: { select: { id: true, name: true } },
      },
      orderBy: { nextRunAt: 'asc' },
    })

    return NextResponse.json({ reports })
  } catch (err) {
    console.error('[SCHEDULED-REPORTS] List error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * POST /api/reports/scheduled
 * Create a new scheduled report
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
      dashboardId,
      frequency,
      dayOfWeek,
      dayOfMonth,
      timeOfDay,
      recipients,
      format,
      includeAIInsights,
    } = body

    if (!name || !dashboardId || !frequency) {
      return NextResponse.json(
        { error: 'Name, dashboard, and frequency are required' },
        { status: 400 }
      )
    }

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: { id: dashboardId, organizationId: tenant.organizationId },
    })

    if (!dashboard) {
      return NextResponse.json(
        { error: 'Dashboard not found' },
        { status: 404 }
      )
    }

    const report = await prisma.scheduledReport.create({
      data: {
        name,
        dashboardId,
        organizationId: tenant.organizationId,
        createdById: session.user.id,
        frequency: frequency || 'WEEKLY',
        dayOfWeek: dayOfWeek ?? 1,
        dayOfMonth: dayOfMonth ?? 1,
        timeOfDay: timeOfDay || '09:00',
        recipients: recipients || [],
        format: format || 'PDF',
        includeAIInsights: includeAIInsights ?? true,
      },
    })

    return NextResponse.json({ report }, { status: 201 })
  } catch (err) {
    console.error('[SCHEDULED-REPORTS] Create error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create report' },
      { status: 500 }
    )
  }
}
