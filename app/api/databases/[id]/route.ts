import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createConnector, connectorRegistry } from '@/server/connectors/registry'

async function getConnectionForUser(connectionId: string, userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
  })
  if (!membership) return null

  return prisma.databaseConnection.findFirst({
    where: { id: connectionId, organizationId: membership.organizationId, deletedAt: null },
  })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const connection = await getConnectionForUser(id, session.user.id)
  if (!connection) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    connection: {
      id: connection.id,
      name: connection.name,
      type: connection.type,
      status: connection.status,
      readOnly: connection.readOnly,
      sslEnabled: connection.sslEnabled,
      lastTestedAt: connection.lastTestedAt,
      lastErrorMessage: connection.lastErrorMessage,
      createdAt: connection.createdAt,
      // NEVER return encryptedCredentials
    },
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const connection = await getConnectionForUser(id, session.user.id)
  if (!connection) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Soft delete
  await prisma.databaseConnection.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'DISCONNECTED' },
  })

  // Invalidate cached connector
  await connectorRegistry.invalidate(id)

  return NextResponse.json({ success: true })
}
