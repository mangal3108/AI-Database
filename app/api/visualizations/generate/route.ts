import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import { createConnector } from '@/server/connectors/registry'
import { recommendChart, analyzeDataset } from '@/server/services/visualization/chart-recommendation-engine'
import { AIQueryGeneratorService } from '@/server/services/ai-query/ai-query-generator'
import type { NormalizedDataset } from '@/server/services/visualization/types'

/**
 * POST /api/visualizations/generate
 * Generate visualization data from SQL query
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const body = await req.json()

    const { databaseId, query, naturalLanguageQuery } = body

    if (!databaseId || (!query && !naturalLanguageQuery)) {
      return NextResponse.json(
        { error: 'Database ID and query are required' },
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

    const startTime = Date.now()

    // Execute query. Natural-language visualization requests use the same
    // schema-grounded generator as chat, then pass through the connector's
    // read-only execution path.
    const connector = await createConnector(database.type, database.encryptedCredentials)
    await connector.connect()
    let executableQuery = query as string | undefined
    if (!executableQuery && naturalLanguageQuery) {
      const metadata = await connector.getDatabaseMetadata()
      const schemaContext = {
        tables: metadata.schemas.flatMap(schema => schema.tables.map(table => ({
          name: table.name,
          schema: schema.name,
          columns: table.columns.map(column => ({
            name: column.name,
            dataType: column.dataType,
            isNullable: column.isNullable,
            isPrimaryKey: column.isPrimaryKey,
            isForeignKey: column.isForeignKey,
          })),
        }))),
      }
      const generated = await AIQueryGeneratorService.generateSQL({
        naturalLanguageQuery,
        databaseId,
        databaseType: metadata.databaseType,
        schemaContext,
      })
      executableQuery = generated.sql
      if (!executableQuery) {
        return NextResponse.json({ error: generated.reasoning }, { status: 422 })
      }
    }

    const result = await connector.executeReadQuery(executableQuery!)

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'NO_DATA', message: 'Query returned no results' },
        { status: 200 }
      )
    }

    const executionTimeMs = Date.now() - startTime

    // Build normalized dataset
    const columns = result.rows.length > 0 ? Object.keys(result.rows[0]) : []
    const dataset: NormalizedDataset = {
      columns,
      rows: result.rows,
      metadata: {
        databaseId,
        executionTimeMs,
        rowCount: result.rows.length,
        columns: columns.map(name => ({ name, type: 'string' })),
        databaseType: database.type as 'POSTGRESQL' | 'MYSQL' | 'MONGODB' | 'SQLSERVER' | 'SQLITE' | 'MARIADB',
      },
    }

    // Get chart recommendation
    const analysis = analyzeDataset(dataset)
    const recommendation = recommendChart(dataset)

    return NextResponse.json({
      dataset,
      recommendation: {
        type: recommendation.chartType,
        chartType: recommendation.chartType,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
        reason: recommendation.reasoning,
      },
      executionTimeMs,
    })
  } catch (err) {
    console.error('[VISUALIZATION] Generate error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Query execution failed' },
      { status: 500 }
    )
  }
}
