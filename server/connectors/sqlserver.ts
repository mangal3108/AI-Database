import type { DatabaseCapabilities, DatabaseConnector, DatabaseMetadata, ExplainResult, QueryResult, TableMetadata } from './base'

export interface SQLServerConfig {
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  encrypt?: boolean
  trustServerCertificate?: boolean
  connectionString?: string
}

export class SQLServerConnector implements DatabaseConnector {
  readonly databaseType = 'SQLSERVER'
  private config: SQLServerConfig
  private connected = false

  constructor(config: SQLServerConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    this.connected = true
  }

  async disconnect(): Promise<void> {
    this.connected = false
  }

  async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now()
    if (!this.config.host && !this.config.connectionString) {
      return { success: false, latencyMs: Date.now() - start, error: 'Host or connection string is required' }
    }
    return {
      success: true,
      latencyMs: Date.now() - start,
    }
  }

  async getDatabaseMetadata(): Promise<DatabaseMetadata> {
    return {
      databaseName: this.config.database || 'master',
      databaseType: 'SQLSERVER',
      version: 'Microsoft SQL Server 2022',
      schemas: [
        {
          name: 'dbo',
          tables: [],
        },
      ],
      totalTables: 0,
    }
  }

  async getSchemas(): Promise<string[]> {
    return ['dbo']
  }

  async getTables(schema?: string): Promise<string[]> {
    return []
  }

  async getTableMetadata(tableName: string, schema?: string): Promise<TableMetadata> {
    return {
      name: tableName,
      schema: schema || 'dbo',
      columns: [],
      primaryKeys: [],
      foreignKeys: [],
      indexes: [],
    }
  }

  async getSampleRows(tableName: string, schema?: string, limit?: number): Promise<QueryResult> {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
    }
  }

  async executeReadQuery(sql: string): Promise<QueryResult> {
    const start = Date.now()
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Date.now() - start,
    }
  }

  async explainQuery(query: string): Promise<ExplainResult> {
    return {
      plan: 'SHOWPLAN TEXT',
      warnings: [],
    }
  }

  getCapabilities(): DatabaseCapabilities {
    return {
      supportsMultiSchema: true,
      supportsTransactions: true,
      supportsExplain: true,
      supportsStoredProcedures: true,
      defaultReadOnlyMode: true,
      maxQueryRows: 10000,
      dialect: 'sqlserver',
    }
  }
}
