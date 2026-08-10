import { z } from 'zod'

// ─────────────────────────────────────────────
// DATABASE CONNECTION SCHEMAS
// ─────────────────────────────────────────────

export const postgresCredentialsSchema = z.object({
  type: z.literal('POSTGRESQL'),
  connectionString: z.string().url().optional(),
  host: z.string().optional(),
  port: z.coerce.number().int().min(1).max(65535).optional().default(5432),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  ssl: z.boolean().optional().default(true),
})

export const mysqlCredentialsSchema = z.object({
  type: z.literal('MYSQL'),
  host: z.string().min(1),
  port: z.coerce.number().int().min(1).max(65535).default(3306),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string(),
  ssl: z.boolean().optional().default(false),
})

export const mongoCredentialsSchema = z.object({
  type: z.literal('MONGODB'),
  connectionString: z.string().min(1),
  database: z.string().optional(),
})

export const sqliteCredentialsSchema = z.object({
  type: z.literal('SQLITE'),
  filePath: z.string().min(1),
})

export const databaseCredentialsSchema = z.discriminatedUnion('type', [
  postgresCredentialsSchema,
  mysqlCredentialsSchema,
  mongoCredentialsSchema,
  sqliteCredentialsSchema,
])

export type DatabaseCredentials = z.infer<typeof databaseCredentialsSchema>

export const createConnectionSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['POSTGRESQL', 'MYSQL', 'MARIADB', 'SQLSERVER', 'SQLITE', 'MONGODB', 'COCKROACHDB', 'NEON', 'SUPABASE']),
  credentials: z.record(z.string(), z.unknown()),
  readOnly: z.boolean().default(true),
  sslEnabled: z.boolean().default(true),
})

// ─────────────────────────────────────────────
// CHAT SCHEMAS
// ─────────────────────────────────────────────

export const chatMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(10000),
  databaseConnectionId: z.string().optional(),
})

export const aiResponseSchema = z.object({
  answer: z.string(),
  query: z.string().optional(),
  queryLanguage: z.enum(['postgresql', 'mysql', 'mongodb', 'sqlite', 'sql']).optional(),
  tablesUsed: z.array(z.string()).optional(),
  columnsUsed: z.array(z.string()).optional(),
  visualization: z.object({
    type: z.enum(['bar', 'line', 'area', 'pie', 'donut', 'scatter', 'histogram', 'kpi', 'table', 'heatmap']),
    xAxis: z.string().optional(),
    yAxis: z.string().optional(),
    title: z.string().optional(),
  }).optional(),
  warnings: z.array(z.string()).optional(),
  confidence: z.enum(['high', 'medium', 'low', 'insufficient']).optional(),
  intent: z.enum([
    'DATA_QUERY', 'SCHEMA_QUERY', 'ANALYTICS', 'EXPLANATION',
    'VISUALIZATION', 'DATABASE_HEALTH', 'DOCUMENT_SEARCH',
    'GENERAL_CHAT', 'QUERY_DEBUGGING', 'QUERY_OPTIMIZATION',
    'SAVED_QUERY', 'DASHBOARD_REQUEST', 'CLARIFICATION_NEEDED'
  ]).optional(),
  clarificationNeeded: z.string().optional(),
  sources: z.array(z.object({
    type: z.string(),
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
})

export type AiResponse = z.infer<typeof aiResponseSchema>

// ─────────────────────────────────────────────
// API KEY SCHEMAS
// ─────────────────────────────────────────────

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  expiresAt: z.string().datetime().optional(),
})

// ─────────────────────────────────────────────
// SETTINGS SCHEMAS
// ─────────────────────────────────────────────

export const updateAiSettingsSchema = z.object({
  model: z.string().optional(),
  maxTokens: z.number().int().min(100).max(32000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxRows: z.number().int().min(1).max(100000).optional(),
  readOnlyMode: z.boolean().optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
})
