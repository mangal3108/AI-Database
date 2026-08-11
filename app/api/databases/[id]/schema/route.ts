import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import { createConnector } from '@/server/connectors/registry'

/**
 * GET /api/databases/[id]/schema
 * Get database schema for a specific database
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

    // SECURITY: Verify database ownership
    const database = await prisma.databaseConnection.findFirst({
      where: {
        id,
        organizationId: tenant.organizationId,
      },
    })

    if (!database) {
      return NextResponse.json(
        { error: 'Database not found or access denied' },
        { status: 404 }
      )
    }

    // 1. Try reading introspected schema from Prisma database records first
    const dbSchemas = await prisma.dbSchema.findMany({
      where: { databaseConnectionId: id },
      include: {
        tables: {
          include: {
            columns: true,
          },
        },
      },
    })

    if (dbSchemas.length > 0) {
      const tables = dbSchemas.flatMap(s =>
        s.tables.map(t => ({
          name: t.name,
          rowCount: t.rowCount ? Number(t.rowCount) : undefined,
          columns: t.columns.map(c => ({
            name: c.name,
            type: c.dataType,
            isPk: c.isPrimaryKey,
            isFk: c.isForeignKey,
          })),
        }))
      )
      return NextResponse.json({ tables, schemas: dbSchemas.map(s => ({ name: s.name, tables: s.tables.map(t => t.name) })) })
    }

    // 2. Fallback: query live database via connector
    try {
      const connector = await createConnector(database.type, database.encryptedCredentials)
      const schemaNames = await connector.getSchemas()

      const schemas = await Promise.all(
        schemaNames.slice(0, 5).map(async (schemaName) => {
          try {
            const tables = await connector.getTables(schemaName)
            return { name: schemaName, tables }
          } catch {
            return { name: schemaName, tables: [] }
          }
        })
      )
      const tables = schemas.flatMap(s => s.tables.map(t => ({ name: typeof t === 'string' ? t : (t as any).name, columns: [] })))
      return NextResponse.json({ tables, schemas })
    } catch {
      return NextResponse.json({ tables: [], schemas: [] })
    }
  } catch (err) {
    console.error('[DATABASE] Schema error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch schema' },
      { status: 500 }
    )
  }
}
