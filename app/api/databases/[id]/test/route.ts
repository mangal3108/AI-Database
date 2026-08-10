import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createConnector } from '@/server/connectors/registry'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 403 })

  const connection = await prisma.databaseConnection.findFirst({
    where: { id, organizationId: membership.organizationId, deletedAt: null },
  })
  if (!connection) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const connector = createConnector(
      connection.type as 'POSTGRESQL',
      connection.encryptedCredentials
    )
    const result = await connector.testConnection()

    // Update connection status
    await prisma.databaseConnection.update({
      where: { id },
      data: {
        status: result.success ? 'CONNECTED' : 'ERROR',
        lastTestedAt: new Date(),
        lastErrorMessage: result.error ?? null,
      },
    })

    await connector.disconnect()

    return NextResponse.json({
      success: result.success,
      latencyMs: result.latencyMs,
      error: result.error,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    await prisma.databaseConnection.update({
      where: { id },
      data: {
        status: 'ERROR',
        lastTestedAt: new Date(),
        lastErrorMessage: message,
      },
    })

    return NextResponse.json({ success: false, error: message })
  }
}
