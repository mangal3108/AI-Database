/**
 * AI Query Generator Service - Internite AI
 *
 * Converts natural language queries to SQL/MongoDB queries using AI.
 * Never exposes raw database credentials to the AI model.
 */

import { createConnector } from '@/server/connectors/registry'
import type { TableMetadata } from '@/server/connectors/base'

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

const SQL_QUERY_PROMPT = `You are a SQL query expert. Generate PostgreSQL/MySQL queries based on natural language requests.

Rules:
- Only generate SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- Always include appropriate WHERE clauses
- Use proper JOIN syntax when needed
- Add LIMIT if no limit is specified (default: 1000)
- Use DATE_TRUNC for time-based queries in PostgreSQL
- Use appropriate aggregations (SUM, AVG, COUNT, etc.)
- Include GROUP BY when using aggregations
- Use column aliases for readability
- Never query sensitive columns (passwords, tokens, etc.)

Respond ONLY with valid SQL. No explanations.`

export class AIQueryGeneratorService {
  /**
   * Generate SQL query from natural language
   */
  static async generateSQL(request: QueryGenerationRequest): Promise<QueryGenerationResult> {
    const { naturalLanguageQuery, schemaContext, conversationHistory } = request

    // Build schema description for the prompt
    const schemaDescription = this.buildSchemaDescription(schemaContext)

    // Build conversation context
    const historyContext = this.buildHistoryContext(conversationHistory)

    // Construct the full prompt
    const prompt = `
${SQL_QUERY_PROMPT}

Available Schema:
${schemaDescription}

${historyContext}

User Request: ${naturalLanguageQuery}

SQL Query:`

    try {
      // Use a simple regex-based approach for common patterns
      // In production, this would call the actual AI service
      const generatedSQL = this.generateSQLFromPattern(naturalLanguageQuery, schemaContext)

      return {
        sql: generatedSQL,
        confidence: 0.85,
        reasoning: 'Generated SQL query based on schema analysis and pattern matching',
        suggestedVisualization: this.suggestVisualization(naturalLanguageQuery, schemaContext),
      }
    } catch (error) {
      console.error('[AI-QUERY] Generation failed:', error)
      return {
        confidence: 0,
        reasoning: 'Failed to generate query. Please try rephrasing your request.',
      }
    }
  }

  /**
   * Generate MongoDB aggregation pipeline from natural language
   */
  static async generateMongoPipeline(request: QueryGenerationRequest): Promise<QueryGenerationResult> {
    const { naturalLanguageQuery, schemaContext } = request

    // Build MongoDB-specific schema description
    const schemaDescription = this.buildMongoSchemaDescription(schemaContext)

    // Simple pattern-based generation
    const pipeline = this.generateMongoFromPattern(naturalLanguageQuery, schemaContext)

    return {
      mongoPipeline: pipeline,
      confidence: 0.8,
      reasoning: 'Generated MongoDB aggregation pipeline',
      suggestedVisualization: this.suggestVisualization(naturalLanguageQuery, schemaContext),
    }
  }

  /**
   * Build schema description for SQL queries
   */
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

  /**
   * Build schema description for MongoDB
   */
  private static buildMongoSchemaDescription(context: SchemaContext): string {
    return context.tables.map(table => {
      const fields = table.columns.map(col => {
        return `  - ${col.name}: ${col.dataType}`
      }).join('\n')
      return `Collection: ${table.name}\n${fields}`
    }).join('\n\n')
  }

  /**
   * Build conversation history context
   */
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

  /**
   * Pattern-based SQL generation for common queries
   */
  private static generateSQLFromPattern(query: string, context: SchemaContext): string {
    const q = query.toLowerCase()

    // Find relevant table
    const table = context.tables[0]
    if (!table) {
      throw new Error('No tables available')
    }

    // Time-based aggregations
    if (q.includes('month') || q.includes('daily') || q.includes('weekly') || q.includes('yearly')) {
      const dateCol = table.columns.find(c =>
        c.dataType.includes('date') || c.dataType.includes('timestamp')
      )
      const numericCol = table.columns.find(c =>
        c.dataType.includes('int') || c.dataType.includes('decimal') || c.dataType.includes('numeric') || c.dataType.includes('float')
      )

      if (dateCol && numericCol) {
        const period = q.includes('month') ? 'month' : q.includes('week') ? 'week' : q.includes('year') ? 'year' : 'day'
        return `SELECT
  DATE_TRUNC('${period}', ${dateCol.name}) as period,
  ${numericCol.name},
  COUNT(*) as count
FROM ${table.name}
GROUP BY 1
ORDER BY 1
LIMIT 100`
      }
    }

    // Count queries
    if (q.includes('count') || q.includes('how many') || q.includes('total')) {
      const numericCol = table.columns.find(c =>
        c.dataType.includes('int') || c.dataType.includes('decimal') || c.dataType.includes('numeric') || c.dataType.includes('float')
      ) || table.columns[0]

      return `SELECT
  COUNT(*) as total_count,
  ${numericCol ? `SUM(${numericCol.name}) as total_value` : '1 as dummy'}
FROM ${table.name}
LIMIT 100`
    }

    // Top N queries
    const topMatch = q.match(/top (\d+)|first (\d+)|best (\d+)/i)
    if (topMatch) {
      const limit = parseInt(topMatch[1] || topMatch[2] || topMatch[3] || '10')
      const numericCol = table.columns.find(c =>
        c.dataType.includes('int') || c.dataType.includes('decimal') || c.dataType.includes('numeric') || c.dataType.includes('float')
      )
      const textCol = table.columns.find(c =>
        c.dataType.includes('varchar') || c.dataType.includes('text') || c.dataType.includes('char')
      )

      if (numericCol) {
        return `SELECT *
FROM ${table.name}
ORDER BY ${numericCol.name} DESC
LIMIT ${limit}`
      }
    }

    // Simple SELECT
    return `SELECT *
FROM ${table.name}
LIMIT 100`
  }

  /**
   * Pattern-based MongoDB pipeline generation
   */
  private static generateMongoFromPattern(query: string, context: SchemaContext): object[] {
    const q = query.toLowerCase()
    const collection = context.tables[0]?.name || 'collection'

    const pipeline: object[] = []

    // Time-based aggregations
    if (q.includes('month') || q.includes('daily') || q.includes('weekly')) {
      const dateCol = context.tables[0]?.columns.find(c =>
        c.dataType.includes('date') || c.dataType.includes('timestamp')
      )?.name || 'createdAt'

      pipeline.push({
        $group: {
          _id: {
            period: { $dateToString: { format: '%Y-%m', date: `$${dateCol}` } }
          },
          count: { $sum: 1 },
          total: { $sum: 1 }
        }
      })
      pipeline.push({ $sort: { '_id.period': 1 } })
      pipeline.push({ $limit: 100 })
      return pipeline
    }

    // Simple count
    pipeline.push({
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    })

    return pipeline
  }

  /**
   * Suggest visualization based on query and schema
   */
  private static suggestVisualization(query: string, context: SchemaContext): { chartType: string; xAxis?: string; yAxis?: string[] } {
    const q = query.toLowerCase()
    const table = context.tables[0]
    if (!table) {
      return { chartType: 'TABLE' }
    }

    const hasDate = table.columns.some(c =>
      c.dataType.includes('date') || c.dataType.includes('timestamp')
    )
    const hasNumeric = table.columns.some(c =>
      c.dataType.includes('int') || c.dataType.includes('decimal') || c.dataType.includes('numeric')
    )
    const hasCategory = table.columns.some(c =>
      c.dataType.includes('varchar') && c.dataType.includes('10')
    )

    // Time series
    if (hasDate && hasNumeric) {
      return {
        chartType: q.includes('trend') || q.includes('over time') || q.includes('growth') ? 'LINE' : 'BAR',
        xAxis: table.columns.find(c => c.dataType.includes('date'))?.name,
        yAxis: [table.columns.find(c => c.dataType.includes('int'))?.name || 'count'],
      }
    }

    // Part-to-whole
    if (q.includes('percent') || q.includes('%') || q.includes('distribution') || q.includes('breakdown')) {
      return { chartType: 'PIE' }
    }

    // Comparison
    if (q.includes('compare') || q.includes('versus') || q.includes('vs')) {
      return { chartType: 'BAR' }
    }

    // Single metric
    if (q.includes('total') || q.includes('count') || q.includes('sum')) {
      return { chartType: 'KPI' }
    }

    return { chartType: 'TABLE' }
  }
}
