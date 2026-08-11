import { prisma } from '../../../lib/prisma'
import { aiRouter, getAIProvider } from '../ai'
import { createConnector, connectorRegistry } from '../../connectors/registry'
import { buildQuerySystemPrompt } from '../schema/intelligence'
import { retrieveRelevantChunks, buildRagContext } from '../rag/pipeline'
import { aiResponseSchema, type AiResponse } from '../../../lib/zod-schemas'
import { getTenantContext, authorizeResource, logAuditEvent } from '../auth/tenant-context'

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
  queryResult?: {
    columns: string[]
    rows: Record<string, unknown>[]
    rowCount: number
    executionTimeMs: number
  }
  visualization?: AiResponse['visualization']
  warnings?: string[]
  confidence?: AiResponse['confidence']
  sources?: AiResponse['sources']
  conversationId: string
  messageId: string
  executionError?: string
}

/**
 * The core Chat Engine.
 * 
 * Flow:
 * 1. Load conversation context
 * 2. Retrieve database metadata
 * 3. Run RAG retrieval
 * 4. Build AI prompt with schema + RAG context
 * 5. Call AI (with streaming)
 * 6. Parse and validate AI response
 * 7. Execute query (if any)
 * 8. Save conversation
 * 9. Return result
 */
export async function runChatEngine(opts: ChatEngineOptions): Promise<ChatEngineResult> {
  const {
    organizationId,
    projectId,
    userId,
    databaseConnectionId,
    message,
    streamCallback,
  } = opts

  // ── Step 0: Resolve & Enforce Server-Side Tenant Context ──────────────────
  if (!userId) {
    throw new Error('User ID is required for chat execution')
  }
  const tenant = await getTenantContext(userId, organizationId, projectId)

  // Verify connection access if specified
  if (databaseConnectionId) {
    await authorizeResource({
      tenant,
      resourceType: 'database_connection',
      action: 'read',
      resourceId: databaseConnectionId,
    })
  }

  // ── Step 1: Create/load conversation ──────────────────────────────────────
  let conversationId = opts.conversationId
  let conversation

  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, organizationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
      },
    })
    if (!conversation) throw new Error('Conversation not found')
  } else {
    conversation = await prisma.conversation.create({
      data: {
        organizationId: tenant.organizationId,
        projectId: tenant.projectId,
        userId: tenant.userId,
        databaseConnectionId,
        title: null, // Will be set after first AI response
      },
      include: { messages: true },
    })
    conversationId = conversation.id
  }

  // ── Step 2: Load database metadata ────────────────────────────────────────
  let dbMetadata = null
  let databaseConnection: Awaited<ReturnType<typeof prisma.databaseConnection.findFirst>> | null = null
  let connector = null

  if (databaseConnectionId) {
    databaseConnection = await prisma.databaseConnection.findFirst({
      where: { id: databaseConnectionId, organizationId },
    })

    if (!databaseConnection) {
      throw new Error('Database connection not found or access denied')
    }

    const connSnap = databaseConnection
    try {
      connector = await connectorRegistry.getOrCreate(
        databaseConnectionId,
        async () => {
          const c = createConnector(
            connSnap.type as 'POSTGRESQL',
            connSnap.encryptedCredentials
          )
          await c.connect()
          return c
        }
      )
      dbMetadata = await connector.getDatabaseMetadata()
    } catch {
      // Fallback: build metadata from Prisma stored DB schema if live connector fails
      try {
        const storedSchemas = await prisma.dbSchema.findMany({
          where: { databaseConnectionId },
          include: { tables: { include: { columns: true } } },
        })

        if (storedSchemas.length > 0) {
          dbMetadata = {
            databaseName: databaseConnection.name,
            databaseType: databaseConnection.type,
            version: 'Ready',
            totalTables: storedSchemas.reduce((acc, s) => acc + s.tables.length, 0),
            schemas: storedSchemas.map(s => ({
              name: s.name,
              tables: s.tables.map(t => ({
                name: t.name,
                schema: s.name,
                rowCount: t.rowCount ? Number(t.rowCount) : 0,
                columns: t.columns.map(c => ({
                  name: c.name,
                  dataType: c.dataType,
                  isNullable: c.isNullable,
                  isPrimaryKey: c.isPrimaryKey,
                  isForeignKey: c.isForeignKey,
                  isUnique: c.isUnique,
                })),
                primaryKeys: t.columns.filter(c => c.isPrimaryKey).map(c => c.name),
                foreignKeys: [],
                indexes: [],
              })),
            })),
          }
        }
      } catch {
        // Continue without DB metadata — AI will explain the issue
      }
    }
  }

  // ── Step 3: Token Budget & Complexity Classification ──────────────────────
  const { classifyQueryComplexity, BUDGET_TIERS, pruneSchemaByQuestion, calculateTokenMetrics } = await import('../ai/token-optimization')
  const complexity = classifyQueryComplexity(message)
  const budget = BUDGET_TIERS[complexity]

  // Prune schema context according to token budget
  let prunedSchema = dbMetadata ? JSON.stringify(dbMetadata) : ''
  if (dbMetadata) {
    prunedSchema = pruneSchemaByQuestion(prunedSchema, message, complexity)
  }

  // ── Step 3.5: RAG retrieval ───────────────────────────────────────────────
  let ragContext = ''
  if (complexity !== 'CONVERSATIONAL') {
    streamCallback?.('Searching knowledge base...')
    const topK = complexity === 'SIMPLE' ? 3 : complexity === 'MEDIUM' ? 5 : 8
    const ragChunks = await retrieveRelevantChunks(
      organizationId,
      databaseConnectionId,
      message,
      topK
    )
    ragContext = buildRagContext(ragChunks)
  }

  // ── Step 4: Build messages & trim context ──────────────────────────────────
  const systemPrompt = dbMetadata
    ? buildQuerySystemPrompt(
        dbMetadata,
        connector?.getCapabilities().dialect ?? 'postgresql'
      )
    : `You are Internite AI, an intelligent database assistant. No database is currently connected. Help the user understand what Internite AI can do and guide them to connect a database.

RESPONSE FORMAT (JSON only):
{
  "answer": "Your response",
  "query": null,
  "queryLanguage": null,
  "tablesUsed": [],
  "columnsUsed": [],
  "visualization": null,
  "warnings": [],
  "confidence": "high",
  "intent": "GENERAL_CHAT",
  "clarificationNeeded": null,
  "sources": []
}`

  // Context-aware history trimming based on complexity tier budget
  const maxHistoryCount = complexity === 'SIMPLE' ? 4 : complexity === 'MEDIUM' ? 6 : 10
  const conversationHistory = (conversation.messages ?? [])
    .filter(m => m.role !== 'SYSTEM')
    .slice(-maxHistoryCount)
    .map(m => ({
      role: m.role.toLowerCase() as 'user' | 'assistant',
      content: m.content,
    }))

  const userMessageWithContext = ragContext
    ? `${message}\n\n${ragContext}`
    : message

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: userMessageWithContext },
  ]

  // ── Step 4.5: Entitlement & Limit Check ──────────────────────────────
  const { EntitlementService, UsageService } = await import('@/server/services/billing')
  await EntitlementService.require(tenant.organizationId, 'AI_QUERY')

  // ── Step 5: Save user message ─────────────────────────────────────────────
  const userMsg = await prisma.message.create({
    data: {
      conversationId,
      role: 'USER',
      content: message,
    },
  })

  // ── Step 6: Call AI ───────────────────────────────────────────────────────
  streamCallback?.('Generating answer...')

  const startTime = Date.now()
  const systemMessage = { role: 'system' as const, content: systemPrompt }
  const fullMessages = [systemMessage, ...messages]

  const aiResp = await aiRouter.chat(fullMessages, { temperature: 0.1, maxTokens: 4096 }, {
    taskType: 'chat',
    preferredProvider: (tenant.plan === 'ENTERPRISE' ? 'groq' : 'mistral'),
  })

  const latencyMs = Date.now() - startTime
  let aiResponseText = aiResp.content

  // Log AI Tokens and Query Usage
  await UsageService.logAiCost({
    organizationId: tenant.organizationId,
    userId: tenant.userId,
    conversationId,
    databaseConnectionId,
    provider: (aiResp as any).provider ?? 'mistral',
    model: (aiResp as any).model ?? 'mistral-small-latest',
    inputTokens: (aiResp as any).tokensUsed?.input ?? 150,
    outputTokens: (aiResp as any).tokensUsed?.output ?? 250,
    latencyMs,
  })

  // ── Step 7: Parse AI response ─────────────────────────────────────────────
  let parsed: AiResponse
  try {
    let jsonText = aiResponseText.trim()
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) jsonText = jsonMatch[1]!.trim()
    parsed = aiResponseSchema.parse(JSON.parse(jsonText))
  } catch {
    // Fallback: treat entire response as the answer
    parsed = {
      answer: aiResponseText || 'I encountered an issue generating a response.',
      confidence: 'low',
      intent: 'GENERAL_CHAT',
    }
  }

  // ── Step 8: Execute query ─────────────────────────────────────────────────
  let queryResult: ChatEngineResult['queryResult'] | undefined
  let executionError: string | undefined
  let queryId: string | undefined

  if (parsed.query && connector) {
    streamCallback?.('Executing query...')

    try {
      const result = await connector.executeReadQuery(parsed.query)
      queryResult = result

      // Save query record
      const savedQuery = await prisma.query.create({
        data: {
          organizationId: tenant.organizationId,
          projectId: tenant.projectId,
          databaseConnectionId: databaseConnectionId!,
          conversationId,
          userId: tenant.userId,
          rawQuery: parsed.query,
          queryLanguage: parsed.queryLanguage ?? 'sql',
          status: 'SUCCESS',
          rowCount: result.rowCount,
          executionTimeMs: result.executionTimeMs,
        },
      })
      queryId = savedQuery.id
    } catch (err) {
      executionError = err instanceof Error ? err.message : String(err)

      await prisma.query.create({
        data: {
          organizationId: tenant.organizationId,
          projectId: tenant.projectId,
          databaseConnectionId: databaseConnectionId!,
          conversationId,
          userId: tenant.userId,
          rawQuery: parsed.query,
          queryLanguage: parsed.queryLanguage ?? 'sql',
          status: 'FAILED',
          executionTimeMs: 0,
          errorMessage: executionError,
        },
      })
    }
  }

  // ── Step 9: Save assistant message ───────────────────────────────────────
  const assistantMsg = await prisma.message.create({
    data: {
      conversationId,
      role: 'ASSISTANT',
      content: parsed.answer,
      metadata: {
        query: parsed.query,
        queryLanguage: parsed.queryLanguage,
        visualization: parsed.visualization,
        warnings: parsed.warnings,
        confidence: parsed.confidence,
        sources: parsed.sources,
        queryId,
        rowCount: queryResult?.rowCount,
      },
    },
  })

  // ── Step 10: Auto-title conversation ─────────────────────────────────────
  if (!conversation.title && conversationHistory.length === 0) {
    // Generate title asynchronously (fire and forget)
    generateConversationTitle(conversationId, message, parsed.answer).catch(() => {})
  }

  // Audit log query execution
  await logAuditEvent({
    tenant,
    action: 'query.generated',
    resourceType: 'conversation',
    resourceId: conversationId,
    metadata: {
      queryLanguage: parsed.queryLanguage,
      hasExecutedQuery: !!queryResult,
      confidence: parsed.confidence,
    },
  })

  return {
    answer: parsed.answer,
    query: parsed.query,
    queryLanguage: parsed.queryLanguage,
    queryResult,
    visualization: parsed.visualization,
    warnings: parsed.warnings,
    confidence: parsed.confidence,
    sources: parsed.sources,
    conversationId,
    messageId: assistantMsg.id,
    executionError,
  }
}

async function generateConversationTitle(
  conversationId: string,
  userMessage: string,
  aiAnswer: string
): Promise<void> {
  const ai = getAIProvider()
  try {
    const response = await ai.chat([
      {
        role: 'user',
        content: `Generate a 3-5 word title for this database conversation.
User asked: "${userMessage.slice(0, 200)}"
AI answered: "${aiAnswer.slice(0, 200)}"
Return only the title, nothing else.`,
      },
    ], { temperature: 0.3, maxTokens: 20 })

    const title = response.content.trim().replace(/^["']|["']$/g, '')

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: title.slice(0, 100) },
    })
  } catch {
    // Title generation is non-critical
  }
}
