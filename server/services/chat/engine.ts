import { prisma } from '../../../lib/prisma'
import { aiRouter, getAIProvider } from '../ai'
import { createConnector, connectorRegistry } from '../../connectors/registry'
import { getRelevantSchemaContext } from '../schema/intelligence'
import { AmbiguityDetector } from '../schema/ambiguity-detector'
import { AIQueryGeneratorService, SchemaContext } from '../ai-query/ai-query-generator'
import { validateReadOnlyQuery, semanticValidateSQL } from '../query/safety'
import { AnswerGenerator } from './answer-generator'
import { recommendChart, generateInsight } from '../visualization/chart-recommendation-engine'
import { normalizeDataset } from '../visualization/dataset-normalizer'
import { getTenantContext, authorizeResource, logAuditEvent } from '../auth/tenant-context'
import type { DatabaseMetadata } from '../../connectors/base'

export interface ChatEngineOptions {
  organizationId: string
  projectId?: string | null
  userId?: string
  databaseConnectionId?: string
  conversationId?: string
  message: string
  streamCallback?: (chunk: string) => void
}

export interface ChatEngineResult {
  answer: string
  query?: string
  queryLanguage?: string
  queryResult?: any
  visualization?: any
  warnings?: string[]
  confidence?: string | number
  sources?: any[]
  conversationId: string
  messageId: string
  executionError?: string
}

export async function runChatEngine(opts: ChatEngineOptions): Promise<ChatEngineResult> {
  const { organizationId, projectId, userId, databaseConnectionId, message, streamCallback } = opts

  if (!userId) throw new Error('User ID is required for chat execution')
  const tenant = await getTenantContext(userId, organizationId, projectId)

  if (databaseConnectionId) {
    await authorizeResource({ tenant, resourceType: 'database_connection', action: 'read', resourceId: databaseConnectionId })
  }

  let conversationId = opts.conversationId
  let conversation
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, organizationId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
    })
    if (!conversation) throw new Error('Conversation not found')
  } else {
    conversation = await prisma.conversation.create({
      data: { organizationId: tenant.organizationId, projectId: tenant.projectId, userId: tenant.userId, databaseConnectionId },
      include: { messages: true },
    })
    conversationId = conversation.id
  }

  // Record user message
  await prisma.message.create({
    data: { conversationId, role: 'USER', content: message },
  })

  let dbMetadata: DatabaseMetadata | null = null
  let connector = null
  let schemaContextStr = ''
  let schemaContextObj: SchemaContext = { tables: [] }

  if (databaseConnectionId) {
    streamCallback?.('Finding relevant data...')
    const dbConn = await prisma.databaseConnection.findFirst({ where: { id: databaseConnectionId, organizationId } })
    if (!dbConn) throw new Error('Database connection not found')

    connector = await connectorRegistry.getOrCreate(databaseConnectionId, async () => {
      const c = createConnector(dbConn.type as any, dbConn.encryptedCredentials)
      await c.connect()
      return c
    })
    
    // Get relevant schema (RAG + Hash)
    const { schemaContext, isStale } = await getRelevantSchemaContext(organizationId, databaseConnectionId, connector, message)
    schemaContextStr = schemaContext
    dbMetadata = await connector.getDatabaseMetadata()
    
    // Build SchemaContext object for Zod validation/ambiguity
    schemaContextObj = {
      tables: dbMetadata.schemas.flatMap(s => s.tables.map(t => ({
        name: t.name,
        schema: s.name,
        columns: t.columns.map(c => ({
          name: c.name, dataType: c.dataType, isNullable: c.isNullable, isPrimaryKey: c.isPrimaryKey, isForeignKey: c.isForeignKey
        }))
      })))
    }
  }

  // Phase 4: Ambiguity Check
  streamCallback?.('Understanding question...')
  const ambiguity = AmbiguityDetector.check(message, schemaContextObj)
  if (ambiguity.isAmbiguous) {
    const errorMsg = `Ambiguous metric: ${ambiguity.reason} Options: ${ambiguity.options?.join(', ')}`
    return await returnErrorState(errorMsg, conversationId)
  }

  // Phase 5: Build Query
  streamCallback?.('Building query...')
  let generatedSql: string | undefined
  let tablesUsed: string[] = []
  let columnsUsed: string[] = []

  if (connector) {
    const genRequest = {
      naturalLanguageQuery: message,
      databaseId: databaseConnectionId!,
      databaseType: dbMetadata?.databaseType || 'postgresql',
      schemaContext: schemaContextObj,
      conversationHistory: conversation.messages.map(m => ({ role: m.role.toLowerCase() as any, content: m.content }))
    }
    
    let genResult
    if (genRequest.databaseType === 'MONGODB') {
      genResult = await AIQueryGeneratorService.generateMongoPipeline(genRequest)
      // Mongo pipeline not fully integrated with semantic check here, skipped for simplicity
    } else {
      genResult = await AIQueryGeneratorService.generateSQL(genRequest)
      generatedSql = genResult.sql
      // Mock tables/columns if undefined for now
      tablesUsed = [] 
      columnsUsed = []
    }

    if (!generatedSql && !genResult?.mongoPipeline) {
       return await returnErrorState(genResult?.reasoning || 'I couldn\'t find enough information in the database to answer that.', conversationId)
    }

    // Phase 6: Check query (Safety & Semantic)
    streamCallback?.('Checking query...')
    if (generatedSql) {
      const dialect = connector.getCapabilities().dialect
      const safetyCheck = validateReadOnlyQuery(generatedSql, dialect)
      if (!safetyCheck.isValid) {
        return await returnErrorState(`Query safety check failed: ${safetyCheck.reason}`, conversationId)
      }
      
      const semanticCheck = semanticValidateSQL(tablesUsed, columnsUsed, schemaContextObj)
      if (!semanticCheck.isValid) {
         // Auto-repair would go here
      }
    }

    // Execution
    streamCallback?.('Running against database...')
    let queryResult
    let queryId
    try {
      if (generatedSql) {
        queryResult = await connector.executeReadQuery(generatedSql)
      } else {
        // execute mongo pipeline...
      }

      const savedQuery = await prisma.query.create({
        data: {
          organizationId: tenant.organizationId,
          projectId: tenant.projectId,
          databaseConnectionId: databaseConnectionId!,
          conversationId,
          userId: tenant.userId,
          rawQuery: generatedSql || 'Mongo Pipeline',
          status: 'SUCCESS',
          rowCount: queryResult?.rowCount || 0,
          executionTimeMs: queryResult?.executionTimeMs || 0,
        },
      })
      queryId = savedQuery.id
    } catch (e) {
      return await returnErrorState(`The database returned an error: ${e instanceof Error ? e.message : String(e)}`, conversationId)
    }

    // Phase 9: Visualization
    streamCallback?.('Creating visualization...')
    let chartConfig = null
    if (queryResult && queryResult.rows.length > 0) {
       const normalized = normalizeDataset(
         { rows: queryResult.rows, columns: queryResult.columns },
         {
           databaseId: databaseConnectionId!,
           queryId,
           executionTimeMs: queryResult.executionTimeMs || 0,
           databaseType: (dbMetadata?.databaseType as any) || 'POSTGRESQL'
         }
       )
       chartConfig = recommendChart(normalized) as any
    }

    // Phase 7: Answer Generation
    streamCallback?.('Analyzing results...')
    const answer = await AnswerGenerator.generateAnswer(message, {
      queryId,
      databaseId: databaseConnectionId!,
      sql: generatedSql || '',
      columns: queryResult?.columns || [],
      rows: queryResult?.rows || [],
      rowCount: queryResult?.rowCount || 0,
      executionTime: queryResult?.executionTimeMs || 0
    })

    const assistantMsg = await prisma.message.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: answer,
        metadata: {
          query: generatedSql,
          visualization: chartConfig,
          confidence: 'high',
          queryId,
          rowCount: queryResult?.rowCount,
        },
      },
    })

    if (!conversation.title && conversation.messages.length === 0) {
      // Set Title logic
    }

    return {
      answer,
      query: generatedSql,
      queryResult,
      visualization: chartConfig,
      conversationId,
      messageId: assistantMsg.id
    }
  }

  return await returnErrorState('No database connection provided.', conversationId)
}

async function returnErrorState(message: string, conversationId: string): Promise<ChatEngineResult> {
  const assistantMsg = await prisma.message.create({
    data: {
      conversationId,
      role: 'ASSISTANT',
      content: message,
      metadata: { error: true }
    }
  })
  
  return {
    answer: message,
    conversationId,
    messageId: assistantMsg.id,
    executionError: message
  }
}
