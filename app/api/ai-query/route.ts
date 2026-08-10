import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import { createConnector } from '@/server/connectors/registry'
import { AIQueryGeneratorService } from '@/server/services/ai-query/ai-query-generator'

/**
 * POST /api/ai-query
 * Generate SQL/MongoDB query from natural language using AI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantContext(session.user.id)
    const body = await req.json()

    const { databaseId, naturalLanguageQuery, conversationHistory } = body

    if (!databaseId || !naturalLanguageQuery) {
      return NextResponse.json(
        { error: 'Database ID and query are required' },
        { status: 400 }
      )
    }

    // Verify database ownership
    const database = await prisma.databaseConnection.findFirst({
      where: { id: databaseId, organizationId: tenant.organizationId },
    })

    if (!database) {
      return NextResponse.json(
        { error: 'Database not found or access denied' },
        { status: 404 }
      )
    }

    // Get schema context - simplified
    const connector = await createConnector(database.type, database.encryptedCredentials)
    const schemaNames = await connector.getSchemas()

    const tables = []
    for (const schemaName of schemaNames.slice(0, 3)) {
      try {
        const tableNames = await connector.getTables(schemaName)
        for (const tableName of tableNames.slice(0, 10)) {
          tables.push({
            name: tableName,
            schema: schemaName,
            columns: [], // Skip detailed columns for now - pattern-based generation
          })
        }
      } catch {
        // Skip schemas that fail
      }
    }

    // Generate query based on database type
    let result
    if (database.type === 'MONGODB') {
      result = await AIQueryGeneratorService.generateMongoPipeline({
        naturalLanguageQuery,
        databaseId,
        databaseType: database.type,
        schemaContext: { tables },
        conversationHistory,
      })
    } else {
      result = await AIQueryGeneratorService.generateSQL({
        naturalLanguageQuery,
        databaseId,
        databaseType: database.type,
        schemaContext: { tables },
        conversationHistory,
      })
    }

    return NextResponse.json({
      success: true,
      sql: result.sql,
      mongoPipeline: result.mongoPipeline,
      confidence: result.confidence,
      reasoning: result.reasoning,
      suggestedVisualization: result.suggestedVisualization,
    })
  } catch (err) {
    console.error('[AI-QUERY] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Query generation failed' },
      { status: 500 }
    )
  }
}
