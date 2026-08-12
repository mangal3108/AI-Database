/**
 * AI Query Generator Service - Internite AI
 *
 * Converts natural language queries to SQL/MongoDB queries using AI.
 * Never exposes raw database credentials to the AI model.
 */

import { z } from 'zod'
import { getAIProvider } from '../ai'

export interface QueryGenerationRequest {
  naturalLanguageQuery: string
  databaseId: string
  databaseType: string
  schemaContext: SchemaContext
  conversationHistory?: ConversationMessage[]
}

export interface SchemaContext {
  tables: TableInfo[]
  relationships?: Relationship[]
}

export interface TableInfo {
  name: string
  schema?: string
  columns: ColumnInfo[]
}

export interface ColumnInfo {
  name: string
  dataType: string
  isNullable: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
  sampleValues?: string[]
}

export interface Relationship {
  from: { table: string; column: string }
  to: { table: string; column: string }
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  sql?: string
}

export interface QueryGenerationResult {
  sql?: string
  mongoPipeline?: object[]
  confidence: number
  reasoning: string
  suggestedVisualization?: {
    chartType: string
    xAxis?: string
    yAxis?: string[]
  }
}

const sqlGenerationSchema = z.object({
  sql: z.string().nullable(),
  tables: z.array(z.string()),
  columns: z.array(z.string()),
  metrics: z.array(z.string()),
  dimensions: z.array(z.string()),
  filters: z.array(z.string()),
  aggregation: z.string().nullable(),
  timeRange: z.string().nullable(),
  reason: z.string()
})

const mongoGenerationSchema = z.object({
  mongoPipeline: z.array(z.record(z.string(), z.any())).nullable(),
  tables: z.array(z.string()),
  columns: z.array(z.string()),
  metrics: z.array(z.string()),
  dimensions: z.array(z.string()),
  filters: z.array(z.string()),
  aggregation: z.string().nullable(),
  timeRange: z.string().nullable(),
  reason: z.string()
})

const SQL_QUERY_PROMPT = `You are a strict data-grounded SQL query expert. Generate PostgreSQL/MySQL queries based on natural language requests.

Rules:
- Only generate SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- Only use tables and columns present in the schema. Do not invent columns.
- Always include appropriate WHERE clauses.
- Use proper JOIN syntax when needed.
- Add LIMIT if no limit is specified (default: 1000).
- Use DATE_TRUNC for time-based queries in PostgreSQL.
- If information isn't in the schema, return sql as null and explain why in the reason.
- Never query sensitive columns (passwords, tokens, etc.).

Respond with valid JSON according to the schema.`

const MONGO_QUERY_PROMPT = `You are a strict data-grounded MongoDB query expert. Generate MongoDB aggregation pipelines based on natural language requests.

Rules:
- Only use collections and fields present in the schema. Do not invent fields.
- Always include appropriate $match clauses.
- Limit results appropriately using $limit.
- If information isn't in the schema, return mongoPipeline as null and explain why in the reason.
- Never query sensitive fields.

Respond with valid JSON according to the schema.`

export class AIQueryGeneratorService {
  static async generateSQL(request: QueryGenerationRequest): Promise<QueryGenerationResult> {
    const { naturalLanguageQuery, schemaContext, conversationHistory } = request
    const schemaDescription = this.buildSchemaDescription(schemaContext)
    const historyContext = this.buildHistoryContext(conversationHistory)

    const prompt = `
${SQL_QUERY_PROMPT}

Available Schema:
${schemaDescription}

${historyContext}

User Request: ${naturalLanguageQuery}
`
    const ai = getAIProvider()
    try {
      const rawResponse = await ai.generateStructuredOutput<z.infer<typeof sqlGenerationSchema>>([
        { role: 'user', content: prompt }
      ], { temperature: 0 })
      
      const parsed = sqlGenerationSchema.parse(rawResponse)

      return {
        sql: parsed.sql ?? undefined,
        confidence: parsed.sql ? 0.9 : 0,
        reasoning: parsed.reason,
        suggestedVisualization: this.suggestVisualization(naturalLanguageQuery, schemaContext)
      }
    } catch (error) {
      console.error('[AI-QUERY] Structured SQL generation failed:', error)

      // Some providers return valid SQL but do not reliably honor the larger
      // JSON contract. Fall back to the provider's plain SQL mode, then let
      // the query safety layer decide whether it is executable.
      try {
        const rawQuery = await ai.generateQuery(
          `Generate one read-only SQL query for this request. Return only SQL.\nUser request: ${naturalLanguageQuery}`,
          schemaDescription
        )
        const sql = extractSql(rawQuery)
        if (sql && /^(select|with)\b/i.test(sql)) {
          return {
            sql,
            confidence: 0.7,
            reasoning: 'Generated using the read-only SQL fallback.',
            suggestedVisualization: this.suggestVisualization(naturalLanguageQuery, schemaContext),
          }
        }
      } catch (fallbackError) {
        console.error('[AI-QUERY] Plain SQL fallback failed:', fallbackError)
      }

      return {
        confidence: 0,
        reasoning: 'Failed to generate a valid SQL query from the available schema. Please try rephrasing your request.',
      }
    }
  }

  static async generateMongoPipeline(request: QueryGenerationRequest): Promise<QueryGenerationResult> {
    const { naturalLanguageQuery, schemaContext, conversationHistory } = request
    const schemaDescription = this.buildMongoSchemaDescription(schemaContext)
    const historyContext = this.buildHistoryContext(conversationHistory)

    const prompt = `
${MONGO_QUERY_PROMPT}

Available Schema:
${schemaDescription}

${historyContext}

User Request: ${naturalLanguageQuery}
`
    try {
      const ai = getAIProvider()
      const rawResponse = await ai.generateStructuredOutput<z.infer<typeof mongoGenerationSchema>>([
        { role: 'user', content: prompt }
      ], { temperature: 0 })
      
      const parsed = mongoGenerationSchema.parse(rawResponse)

      return {
        mongoPipeline: parsed.mongoPipeline ?? undefined,
        confidence: parsed.mongoPipeline ? 0.9 : 0,
        reasoning: parsed.reason,
        suggestedVisualization: this.suggestVisualization(naturalLanguageQuery, schemaContext)
      }
    } catch (error) {
      console.error('[AI-QUERY] Mongo Pipeline Generation failed:', error)
      return {
        confidence: 0,
        reasoning: 'Failed to generate a valid MongoDB pipeline from the available schema.',
      }
    }
  }

  private static buildSchemaDescription(context: SchemaContext): string {
    return context.tables.map(table => {
      const columns = table.columns.map(col => {
        const nullable = col.isNullable ? 'NULL' : 'NOT NULL'
        const key = col.isPrimaryKey ? ' PK' : col.isForeignKey ? ' FK' : ''
        return `  - ${col.name}: ${col.dataType} (${nullable})${key}`
      }).join('\n')
      return `Table: ${table.schema ? `${table.schema}.` : ''}${table.name}\n${columns}`
    }).join('\n\n')
  }

  private static buildMongoSchemaDescription(context: SchemaContext): string {
    return context.tables.map(table => {
      const fields = table.columns.map(col => {
        return `  - ${col.name}: ${col.dataType}`
      }).join('\n')
      return `Collection: ${table.name}\n${fields}`
    }).join('\n\n')
  }

  private static buildHistoryContext(history?: ConversationMessage[]): string {
    if (!history || history.length === 0) return ''
    return `Conversation History:\n${history.map(msg => {
      if (msg.role === 'user') {
        return `User: ${msg.content}`
      } else {
        return `Assistant: ${msg.sql ? `Generated query: ${msg.sql}` : msg.content}`
      }
    }).join('\n')}`
  }

  private static suggestVisualization(query: string, context: SchemaContext): { chartType: string; xAxis?: string; yAxis?: string[] } {
    // This will be overridden later by the deterministic chart config, but keeping skeleton for compatibility
    return { chartType: 'TABLE' }
  }
}

function extractSql(value: string): string {
  let sql = value.trim()
  const fenced = sql.match(/```(?:sql)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) sql = fenced[1].trim()
  sql = sql.replace(/^sql\s*:\s*/i, '').trim()
  const start = sql.search(/\b(select|with)\b/i)
  if (start > 0) sql = sql.slice(start)
  return sql.replace(/;?\s*$/, ';')
}
