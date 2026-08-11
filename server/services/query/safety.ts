/**
 * Query Safety Engine
 * 
 * This is the security layer between the AI and the database.
 * Never execute raw LLM output directly against a database.
 * 
 * The AI is NEVER the final security authority.
 */

type Dialect = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'sqlserver' | 'mariadb' | 'cockroachdb'
import type { SchemaContext } from '../ai-query/ai-query-generator'

export interface ValidationResult {
  isValid: boolean
  reason?: string
  queryType?: 'SELECT' | 'AGGREGATE' | 'SCHEMA_QUERY' | 'MONGO_FIND' | 'MONGO_AGGREGATE' | 'DESTRUCTIVE'
  warnings?: string[]
}

// Statements that are NEVER allowed in read-only mode
const FORBIDDEN_STATEMENTS = [
  /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW|SEQUENCE|FUNCTION|PROCEDURE)\b/i,
  /\bTRUNCATE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bUPDATE\s+\w+\s+SET\b/i,
  /\bALTER\s+(TABLE|DATABASE|SCHEMA|COLUMN|INDEX)\b/i,
  /\bCREATE\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW|FUNCTION|PROCEDURE|TRIGGER)\b/i,
  /\bGRANT\b/i,
  /\bREVOKE\b/i,
  /\bEXECUTE\b/i,
  /\bEXEC\b/i,
  /\bCOPY\s+\w+\s+(FROM|TO)\b/i,
  /\bLOAD\s+DATA\b/i,
  /\bCREATE\s+USER\b/i,
  /\bDROP\s+USER\b/i,
  /\bALTER\s+USER\b/i,
  /\bSHUTDOWN\b/i,
  /\bKILL\b/i,
]

// PostgreSQL-specific dangerous functions
const FORBIDDEN_FUNCTIONS_PG = [
  /\bpg_read_file\s*\(/i,
  /\bpg_write_file\s*\(/i,
  /\bcopy_file_range\s*\(/i,
  /\blo_export\s*\(/i,
  /\blo_import\s*\(/i,
  /\bdblink\s*\(/i,
  /\bpg_sleep\s*\(\s*[5-9]\d{0,}\s*\)/i, // sleep > 5 seconds
  /\bpg_cancel_backend\s*\(/i,
  /\bpg_terminate_backend\s*\(/i,
]

// Detect prompt injection attempts in queries
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /forget\s+everything/i,
  /you\s+are\s+now\s+a/i,
  /system\s+prompt/i,
]

/**
 * Validate that a SQL query is safe to execute in read-only mode.
 * This is a defense-in-depth layer — the connection should also be
 * configured as read-only at the database level where possible.
 */
export function validateReadOnlyQuery(
  query: string,
  dialect: Dialect
): ValidationResult {
  if (!query || query.trim().length === 0) {
    return { isValid: false, reason: 'Empty query' }
  }

  // Check for prompt injection attempts in the query itself
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(query)) {
      return {
        isValid: false,
        reason: 'Query contains suspicious patterns that may indicate a prompt injection attempt',
      }
    }
  }

  // Normalize: remove comments and whitespace
  const normalized = removeComments(query).trim()

  // Check for forbidden statements
  for (const pattern of FORBIDDEN_STATEMENTS) {
    if (pattern.test(normalized)) {
      return {
        isValid: false,
        reason: `Destructive or write operation detected. Internite AI operates in read-only mode by default.`,
        queryType: 'DESTRUCTIVE',
      }
    }
  }

  // PostgreSQL-specific checks
  if (dialect === 'postgresql' || dialect === 'cockroachdb') {
    for (const pattern of FORBIDDEN_FUNCTIONS_PG) {
      if (pattern.test(normalized)) {
        return {
          isValid: false,
          reason: 'Query uses a restricted PostgreSQL function',
        }
      }
    }
  }

  // MySQL-specific checks
  if (dialect === 'mysql' || dialect === 'mariadb') {
    if (/\bINTO\s+(OUTFILE|DUMPFILE)\b/i.test(normalized)) {
      return { isValid: false, reason: 'File export operations are not permitted' }
    }
    if (/\bLOAD_FILE\s*\(/i.test(normalized)) {
      return { isValid: false, reason: 'File operations are not permitted' }
    }
  }

  // Detect potential Cartesian joins (warn, don't reject)
  const warnings: string[] = []
  const tableCount = (normalized.match(/\bJOIN\b/gi) ?? []).length
  if (tableCount > 5) {
    warnings.push(`Query has ${tableCount} joins — may be slow`)
  }

  // Check for unbounded queries (no LIMIT)
  if (
    /\bSELECT\b/i.test(normalized) &&
    !/\bLIMIT\b/i.test(normalized) &&
    !/\bTOP\b/i.test(normalized) &&
    !normalized.includes('COUNT(') &&
    !normalized.includes('SUM(') &&
    !normalized.includes('AVG(') &&
    !normalized.includes('MAX(') &&
    !normalized.includes('MIN(')
  ) {
    warnings.push('Query has no LIMIT clause — results may be very large')
  }

  // Determine query type
  let queryType: ValidationResult['queryType'] = 'SELECT'
  if (/\bCOUNT\s*\(|SUM\s*\(|AVG\s*\(|GROUP\s+BY\b/i.test(normalized)) {
    queryType = 'AGGREGATE'
  } else if (/^SELECT.+FROM\s+information_schema|pg_catalog/i.test(normalized)) {
    queryType = 'SCHEMA_QUERY'
  }

  return { isValid: true, queryType, warnings }
}

/**
 * Validate that referenced tables and columns actually exist in the schema context.
 */
export function semanticValidateSQL(
  tablesUsed: string[],
  columnsUsed: string[],
  schema: SchemaContext
): ValidationResult {
  const schemaTables = new Set(schema.tables.map(t => t.name.toLowerCase()))
  const schemaColumns = new Set(schema.tables.flatMap(t => t.columns.map(c => c.name.toLowerCase())))

  for (const table of tablesUsed) {
    if (!schemaTables.has(table.toLowerCase())) {
      return { isValid: false, reason: `Table '${table}' does not exist in the retrieved schema.` }
    }
  }

  for (const col of columnsUsed) {
    if (!schemaColumns.has(col.toLowerCase())) {
      return { isValid: false, reason: `Column '${col}' does not exist in the retrieved schema.` }
    }
  }

  return { isValid: true }
}

/**
 * Remove SQL comments from a query to prevent bypass techniques.
 */
function removeComments(sql: string): string {
  // Remove -- line comments
  let result = sql.replace(/--[^\n]*/g, ' ')
  // Remove /* */ block comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, ' ')
  return result
}

/**
 * Classify the intent of a user's natural language question.
 * Used to route to the appropriate AI prompt template.
 */
export function classifyQueryIntent(question: string): string {
  const q = question.toLowerCase()

  if (/\b(schema|table|column|structure|what tables|what fields|describe)\b/.test(q)) {
    return 'SCHEMA_QUERY'
  }
  if (/\b(chart|graph|plot|visualize|visualization|trend)\b/.test(q)) {
    return 'VISUALIZATION'
  }
  if (/\b(why|analyze|analysis|explain|reason|cause|insight)\b/.test(q)) {
    return 'ANALYTICS'
  }
  if (/\b(dashboard|report|summary)\b/.test(q)) {
    return 'DASHBOARD_REQUEST'
  }
  if (/\b(health|slow|performance|index|optimize)\b/.test(q)) {
    return 'DATABASE_HEALTH'
  }

  return 'DATA_QUERY'
}
