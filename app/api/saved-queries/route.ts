import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateReadOnlyQuery } from '@/server/services/query/safety'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId } })
  if (!membership) return NextResponse.json({ error: 'Workspace membership required' }, { status: 403 })

  const savedQueries = await prisma.savedQuery.findMany({
    where: { organizationId: membership.organizationId },
    include: { query: { include: { connection: { select: { name: true, type: true } } } } },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json({ savedQueries })
}

export async function POST(request: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null) as {
    databaseId?: string
    query?: string
    name?: string
    description?: string
    queryLanguage?: string
    queryId?: string
  } | null

  if (!body?.databaseId || !body.query?.trim()) {
    return NextResponse.json({ error: 'databaseId and query are required' }, { status: 400 })
  }

  const membership = await prisma.membership.findFirst({ where: { userId } })
  if (!membership) return NextResponse.json({ error: 'Workspace membership required' }, { status: 403 })

  const connection = await prisma.databaseConnection.findFirst({
    where: { id: body.databaseId, organizationId: membership.organizationId },
    select: { id: true, projectId: true, type: true },
  })
  if (!connection) return NextResponse.json({ error: 'Database not found' }, { status: 404 })

  if ((body.queryLanguage ?? 'sql').toLowerCase() === 'sql') {
    const safety = validateReadOnlyQuery(body.query, connection.type.toLowerCase() === 'mysql' ? 'mysql' : 'postgresql')
    if (!safety.isValid) return NextResponse.json({ error: `Only read-only queries can be saved: ${safety.reason}` }, { status: 422 })
  }

  const saved = await prisma.savedQuery.create({
    data: {
      organizationId: membership.organizationId,
      projectId: connection.projectId,
      queryId: body.queryId,
      name: body.name?.trim() || `Saved query ${new Date().toLocaleDateString('en-CA')}`,
      description: body.description?.trim() || 'Read-only saved query',
      rawQuery: body.query.trim(),
      queryLanguage: body.queryLanguage?.toLowerCase() || 'sql',
    },
    select: { id: true, name: true },
  })

  return NextResponse.json(saved, { status: 201 })
}
