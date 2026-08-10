import type { DatabaseConnector, DatabaseMetadata, TableMetadata } from '../../connectors/base'
import { getAIProvider } from '../ai'

/**
 * Generates semantic descriptions for database tables using AI.
 * These descriptions power the RAG system and help the AI understand
 * business context, not just column names.
 */
export async function generateTableDescription(
  table: TableMetadata,
  schemaName: string,
  databaseType: string
): Promise<string> {
  const ai = getAIProvider()

  const columnsSummary = table.columns
    .slice(0, 30) // Don't send too many columns
    .map(c => `  - ${c.name} (${c.dataType}${c.isPrimaryKey ? ', PK' : ''}${c.isForeignKey ? ', FK' : ''}${c.isNullable ? '' : ', NOT NULL'})`)
    .join('\n')

  const fkSummary = table.foreignKeys
    .map(fk => `  - ${fk.columnName} → ${fk.referencedTable}.${fk.referencedColumn}`)
    .join('\n')

  const prompt = `You are analyzing a ${databaseType} database table to create a business description.

Table: ${schemaName}.${table.name}
Approximate row count: ${table.rowCount?.toString() ?? 'unknown'}

Columns:
${columnsSummary}

${fkSummary ? `Foreign key relationships:\n${fkSummary}` : ''}

Please provide a concise JSON response with:
{
  "summary": "One sentence describing what this table contains",
  "purpose": "The business purpose of this table",
  "importantColumns": ["column1", "column2"],
  "sensitiveColumns": ["email", "password", etc - columns likely to contain PII or secrets],
  "possibleMetrics": ["metric1 like 'total orders'", "metric2"],
  "semanticTags": ["e-commerce", "customer", etc]
}

Base this on the column names and relationships. Be concise and accurate.`

  try {
    const response = await ai.generateStructuredOutput<{
      summary: string
      purpose: string
      importantColumns: string[]
      sensitiveColumns: string[]
      possibleMetrics: string[]
      semanticTags: string[]
    }>([{ role: 'user', content: prompt }], { temperature: 0.1, maxTokens: 500 })

    return JSON.stringify(response)
  } catch {
    // Fallback: generate a basic description without AI
    return JSON.stringify({
      summary: `Table ${table.name} with ${table.columns.length} columns`,
      purpose: 'Business purpose not yet analyzed',
      importantColumns: table.primaryKeys,
      sensitiveColumns: detectSensitiveColumns(table.columns.map(c => c.name)),
      possibleMetrics: [],
      semanticTags: [],
    })
  }
}

/**
 * Heuristically detect columns likely to contain sensitive data.
 * Used as a fallback when AI is not available.
 */
export function detectSensitiveColumns(columnNames: string[]): string[] {
  const sensitivePatterns = [
    /password/i, /passwd/i, /secret/i, /token/i, /api_key/i, /apikey/i,
    /private_key/i, /credit_card/i, /card_number/i, /cvv/i, /ssn/i,
    /social_security/i, /passport/i, /license_number/i, /bank_account/i,
    /routing_number/i, /pin\b/i, /dob\b/i, /date_of_birth/i,
  ]

  return columnNames.filter(name =>
    sensitivePatterns.some(pattern => pattern.test(name))
  )
}

/**
 * Create a compact schema context string for AI prompts.
 * Limits token usage by only including relevant tables.
 */
export function buildSchemaContext(
  metadata: DatabaseMetadata,
  relevantTables?: string[]
): string {
  const lines: string[] = [
    `Database: ${metadata.databaseName} (${metadata.databaseType} ${metadata.version})`,
    '',
  ]

  for (const schema of metadata.schemas) {
    const tables = relevantTables
      ? schema.tables.filter(t => relevantTables.includes(t.name))
      : schema.tables.slice(0, 20) // Limit context size

    for (const table of tables) {
      lines.push(`TABLE: ${schema.name}.${table.name} (~${table.rowCount?.toString() ?? '?'} rows)`)

      for (const col of table.columns) {
        const flags = [
          col.isPrimaryKey ? 'PK' : null,
          col.isForeignKey ? 'FK' : null,
          !col.isNullable ? 'NOT NULL' : null,
          col.isSensitive ? 'SENSITIVE' : null,
        ].filter(Boolean).join(', ')

        lines.push(`  ${col.name}: ${col.dataType}${flags ? ` (${flags})` : ''}`)
      }

      if (table.foreignKeys.length > 0) {
        lines.push(`  Relationships:`)
        for (const fk of table.foreignKeys) {
          lines.push(`    ${fk.columnName} → ${fk.referencedTable}.${fk.referencedColumn}`)
        }
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

/**
 * Build the system prompt for the AI query engine.
 */
export function buildQuerySystemPrompt(
  metadata: DatabaseMetadata,
  dialect: string,
  relevantTables?: string[]
): string {
  const schemaContext = buildSchemaContext(metadata, relevantTables)

  return `You are Internite AI's database query engine. You help users query their ${metadata.databaseType} database.

CRITICAL RULES:
- Only use tables and columns that exist in the schema below
- Never invent tables, columns, or relationships
- Generate ${dialect} dialect SQL only — do not mix dialects
- Default to read-only SELECT queries
- Never generate: DROP, DELETE, UPDATE, INSERT, ALTER, CREATE, TRUNCATE, GRANT, REVOKE
- If the required data doesn't exist in the schema, say so explicitly
- Always add LIMIT clauses to prevent unbounded results (default LIMIT 1000)
- Prefer efficient queries; avoid Cartesian joins

DATABASE SCHEMA:
${schemaContext}

RESPONSE FORMAT (JSON only):
{
  "answer": "Natural language explanation of the answer",
  "query": "The SQL query (or null if not applicable)",
  "queryLanguage": "${dialect}",
  "tablesUsed": ["table1", "table2"],
  "columnsUsed": ["col1", "col2"],
  "visualization": { "type": "bar|line|area|pie|kpi|table", "xAxis": "...", "yAxis": "...", "title": "..." } or null,
  "warnings": ["any warnings"],
  "confidence": "high|medium|low|insufficient",
  "intent": "DATA_QUERY|SCHEMA_QUERY|ANALYTICS|VISUALIZATION|EXPLANATION|CLARIFICATION_NEEDED",
  "clarificationNeeded": "Question to ask user if intent is unclear" or null,
  "sources": [{ "type": "table|column", "name": "...", "description": "..." }]
}`
}
