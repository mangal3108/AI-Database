// Database Connector Interface
// All database connectors must implement this interface.
// Never make chat logic depend directly on any specific database driver.

export interface ColumnMetadata {
  name: string
  dataType: string
  isNullable: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
  isUnique: boolean
  isSensitive?: boolean
  defaultValue?: string | null
  comment?: string | null
}

export interface TableMetadata {
  name: string
  schema?: string
  rowCount?: number | bigint
  columns: ColumnMetadata[]
  primaryKeys: string[]
  foreignKeys: ForeignKeyMetadata[]
  indexes: IndexMetadata[]
  comment?: string | null
}

export interface ForeignKeyMetadata {
  constraintName: string
  columnName: string
  referencedSchema?: string
  referencedTable: string
  referencedColumn: string
}

export interface IndexMetadata {
  name: string
  columns: string[]
  isUnique: boolean
  type?: string
}

export interface SchemaMetadata {
  name: string
  tables: TableMetadata[]
}

export interface DatabaseMetadata {
  databaseName: string
  databaseType: string
  version: string
  schemas: SchemaMetadata[]
  totalTables: number
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTimeMs: number
}

export interface ExplainResult {
  plan: string
  estimatedRows?: number
  estimatedCost?: number
  warnings: string[]
}

export interface DatabaseCapabilities {
  supportsMultiSchema: boolean
  supportsTransactions: boolean
  supportsExplain: boolean
  supportsStoredProcedures: boolean
  defaultReadOnlyMode: boolean
  maxQueryRows: number
  dialect: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'sqlserver' | 'mariadb' | 'cockroachdb'
}

export interface DatabaseConnector {
  readonly databaseType: string

  /**
   * Establish connection to the database.
   * Must be called before any other method.
   */
  connect(): Promise<void>

  /**
   * Release all connections and clean up.
   */
  disconnect(): Promise<void>

  /**
   * Test if the connection is alive.
   * Returns latency in ms.
   */
  testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }>

  /**
   * Get high-level database metadata.
   */
  getDatabaseMetadata(): Promise<DatabaseMetadata>

  /**
   * Get all schemas in the database.
   */
  getSchemas(): Promise<string[]>

  /**
   * Get all tables in a schema.
   */
  getTables(schema?: string): Promise<string[]>

  /**
   * Get full metadata for a specific table.
   */
  getTableMetadata(tableName: string, schema?: string): Promise<TableMetadata>

  /**
   * Get a sample of rows from a table.
   * Must never return sensitive columns (marked by detector).
   */
  getSampleRows(tableName: string, schema?: string, limit?: number): Promise<QueryResult>

  /**
   * Execute a read-only query.
   * Must reject write operations.
   */
  executeReadQuery(query: string): Promise<QueryResult>

  /**
   * Explain a query execution plan.
   */
  explainQuery(query: string): Promise<ExplainResult>

  /**
   * Get connector capabilities.
   */
  getCapabilities(): DatabaseCapabilities
}

export class QueryRejectedError extends Error {
  constructor(
    message: string,
    public readonly reason: string
  ) {
    super(message)
    this.name = 'QueryRejectedError'
  }
}

export class ConnectionError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = 'ConnectionError'
  }
}
