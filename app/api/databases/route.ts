import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/crypto'
import { createConnector } from '@/server/connectors/registry'
import { buildSchemaContext } from '@/server/services/schema/intelligence'
import { indexDatabaseSchema } from '@/server/services/rag/pipeline'
import { createConnectionSchema } from '@/lib/zod-schemas'
import { z } from 'zod'

import { getTenantContext, authorizeResource, logAuditEvent } from '@/server/services/auth/tenant-context'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await getTenantContext(session.user.id)

  const connections = await prisma.databaseConnection.findMany({
    where: { organizationId: tenant.organizationId, deletedAt: null },
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      lastTestedAt: true,
      lastErrorMessage: true,
      readOnly: true,
      createdAt: true,
      // NEVER select encryptedCredentials
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ connections })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await getTenantContext(session.user.id)

  if (!tenant.permissions.canConnectDatabase()) {
    return NextResponse.json({ error: 'Forbidden. Members with your role cannot add database connections.' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createConnectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
  }

  const { name, type, credentials, readOnly } = parsed.data

  try {
    // Encrypt credentials before storing — NEVER store plaintext
    const encryptedCredentials = encrypt(JSON.stringify(credentials))

    // Create connection record with PENDING status
    const connection = await prisma.databaseConnection.create({
      data: {
        organizationId: tenant.organizationId,
        projectId: tenant.projectId,
        name,
        type: type as any,
        encryptedCredentials,
        status: 'PENDING',
        readOnly,
      },
    })

    // Audit log database connection creation
    await logAuditEvent({
      tenant,
      action: 'database.connected',
      resourceType: 'database_connection',
      resourceId: connection.id,
      metadata: { name, type, readOnly },
    })

    // Test connection and introspect in background
    testAndIntrospect(connection.id, type as any, encryptedCredentials, tenant.organizationId).catch(console.error)

    return NextResponse.json({
      connection: {
        id: connection.id,
        name: connection.name,
        type: connection.type,
        status: connection.status,
        createdAt: connection.createdAt,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/databases Error]:', err)
    return NextResponse.json({
      error: 'Failed to connect database',
      message: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}

async function testAndIntrospect(
  connectionId: string,
  type: any,
  encryptedCredentials: string,
  organizationId: string
) {
  try {
    await prisma.databaseConnection.update({
      where: { id: connectionId },
      data: { status: 'INDEXING' },
    })

    const connector = createConnector(type, encryptedCredentials)
    await connector.connect()

    const testResult = await connector.testConnection()
    if (!testResult.success) {
      throw new Error(testResult.error ?? 'Connection test failed')
    }

    // Introspect database
    const metadata = await connector.getDatabaseMetadata()

    // Store schemas
    for (const schema of metadata.schemas) {
      const dbSchema = await prisma.dbSchema.upsert({
        where: {
          databaseConnectionId_name: {
            databaseConnectionId: connectionId,
            name: schema.name,
          },
        },
        create: { databaseConnectionId: connectionId, name: schema.name },
        update: { updatedAt: new Date() },
      })

      for (const table of schema.tables) {
        const dbTable = await prisma.dbTable.upsert({
          where: { schemaId_name: { schemaId: dbSchema.id, name: table.name } },
          create: {
            schemaId: dbSchema.id,
            name: table.name,
            rowCount: table.rowCount ? BigInt(table.rowCount.toString()) : null,
          },
          update: {
            rowCount: table.rowCount ? BigInt(table.rowCount.toString()) : null,
          },
        })

        for (const col of table.columns) {
          await prisma.dbColumn.upsert({
            where: { tableId_name: { tableId: dbTable.id, name: col.name } },
            create: {
              tableId: dbTable.id,
              name: col.name,
              dataType: col.dataType,
              isNullable: col.isNullable,
              isPrimaryKey: col.isPrimaryKey,
              isForeignKey: col.isForeignKey,
              isUnique: col.isUnique,
              isSensitive: col.isSensitive ?? false,
            },
            update: {
              dataType: col.dataType,
              isNullable: col.isNullable,
              isPrimaryKey: col.isPrimaryKey,
              isForeignKey: col.isForeignKey,
            },
          })
        }
      }
    }

    // Index schema for RAG (non-fatal — don't fail connection if RAG indexing fails)
    try {
      const schemaContext = buildSchemaContext(metadata)
      await indexDatabaseSchema(organizationId, connectionId, schemaContext)
    } catch (ragErr) {
      console.warn('[RAG Indexing Warning] Failed to index schema for RAG, but connection is still valid:', ragErr)
    }

    await connector.disconnect()

    await prisma.databaseConnection.update({
      where: { id: connectionId },
      data: { status: 'CONNECTED', lastTestedAt: new Date(), lastErrorMessage: null },
    })
  } catch (err) {
    await prisma.databaseConnection.update({
      where: { id: connectionId },
      data: {
        status: 'ERROR',
        lastErrorMessage: err instanceof Error ? err.message : String(err),
        lastTestedAt: new Date(),
      },
    })
  }
}
