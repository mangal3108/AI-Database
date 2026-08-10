import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { getTenantContext, authorizeResource, logAuditEvent } from '@/server/services/auth/tenant-context'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tenant = await getTenantContext(session.user.id)

  const conversations = await prisma.conversation.findMany({
    where: { organizationId: tenant.organizationId, deletedAt: null },
    select: {
      id: true,
      title: true,
      databaseConnectionId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, role: true, createdAt: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ conversations })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const tenant = await getTenantContext(session.user.id)

  // Verify resource access before deletion
  await authorizeResource({
    tenant,
    resourceType: 'conversation',
    action: 'delete',
    resourceId: id,
  })

  await prisma.conversation.updateMany({
    where: { id, organizationId: tenant.organizationId },
    data: { deletedAt: new Date() },
  })

  await logAuditEvent({
    tenant,
    action: 'conversation.deleted',
    resourceType: 'conversation',
    resourceId: id,
  })

  return NextResponse.json({ success: true })
}
