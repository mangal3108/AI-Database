import Database from 'better-sqlite3'
import type {
  DatabaseConnector,
  DatabaseMetadata,
  SchemaMetadata,
  TableMetadata,
  QueryResult,
  ExplainResult,
  DatabaseCapabilities,
  ColumnMetadata,
} from './base'
import { ConnectionError, QueryRejectedError } from './base'
import { validateReadOnlyQuery } from '../services/query/safety'

export class SQLiteConnector implements DatabaseConnector {
  readonly databaseType = 'SQLITE'
  private db: Database.Database | null = null
  private filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }

  async connect(): Promise<void> {
    try {
      this.db = new Database(this.filePath, { readonly: true, fileMustExist: true })
    } catch (err) {
      throw new ConnectionError(
        `Failed to open SQLite database: ${err instanceof Error ? err.message : String(err)}`,
        err
      )
    }
  }

  async disconnect(): Promise<void> {
    this.db?.close()
    this.db = null
  }

  async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    if (!this.db) await this.connect()
    const start = Date.now()
    try {
      this.db!.prepare('SELECT 1').get()
      return { success: true, latencyMs: Date.now() - start }
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async getDatabaseMetadata(): Promise<DatabaseMetadata> {
    if (!this.db) await this.connect()
    const tables = await this.getTables()
    const tablesMeta = await Promise.all(tables.map(t => this.getTableMetadata(t)))

    return {
      databaseName: this.filePath.split(/[\\/]/).pop() ?? 'sqlite.db',
      databaseType: 'SQLite',
      version: '3.x',
      schemas: [{ name: 'main', tables: tablesMeta }],
      totalTables: tables.length,
    }
  }

  async getSchemas(): Promise<string[]> {
    return ['main']
  }

  async getTables(): Promise<string[]> {
    if (!this.db) await this.connect()
    const rows = this.db!.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all() as { name: string }[]
    return rows.map(r => r.name)
  }

  async getTableMetadata(tableName: string): Promise<TableMetadata> {
    if (!this.db) await this.connect()

    const pragma = this.db!.prepare(`PRAGMA table_info(${JSON.stringify(tableName)})`).all() as Array<{
      cid: number
      name: string
      type: string
      notnull: number
      dflt_value: string | null
      pk: number
    }>

    const columns: ColumnMetadata[] = pragma.map(r => ({
      name: r.name,
      dataType: r.type || 'TEXT',
      isNullable: r.notnull === 0,
      isPrimaryKey: r.pk > 0,
      isForeignKey: false,
      isUnique: false,
      defaultValue: r.dflt_value,
    }))

    const fkPragma = this.db!.prepare(`PRAGMA foreign_key_list(${JSON.stringify(tableName)})`).all() as Array<{
      id: number
      seq: number
      table: string
      from: string
      to: string
    }>

    const countRow = this.db!.prepare(`SELECT COUNT(*) as cnt FROM ${JSON.stringify(tableName)}`).get() as { cnt: number }

    return {
      name: tableName,
      rowCount: countRow.cnt,
      columns,
      primaryKeys: columns.filter(c => c.isPrimaryKey).map(c => c.name),
      foreignKeys: fkPragma.map(r => ({
        constraintName: `fk_${tableName}_${r.from}`,
        columnName: r.from,
        referencedTable: r.table,
        referencedColumn: r.to,
      })),
      indexes: [],
    }
  }

  async getSampleRows(tableName: string, _schema?: string, limit = 5): Promise<QueryResult> {
    return this.executeReadQuery(`SELECT * FROM ${JSON.stringify(tableName)} LIMIT ${Math.min(limit, 10)}`)
  }

  async executeReadQuery(query: string): Promise<QueryResult> {
    if (!this.db) await this.connect()

    const validation = validateReadOnlyQuery(query, 'sqlite')
    if (!validation.isValid) {
      throw new QueryRejectedError(`Query rejected: ${validation.reason}`, validation.reason ?? 'Unknown')
    }

    const start = Date.now()
    try {
      const stmt = this.db!.prepare(query)
      const rows = stmt.all() as Record<string, unknown>[]
      const columns = rows.length > 0 ? Object.keys(rows[0]!) : []

      return {
        columns,
        rows,
        rowCount: rows.length,
        executionTimeMs: Date.now() - start,
      }
    } catch (err) {
      throw new Error(`SQLite query error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  async explainQuery(query: string): Promise<ExplainResult> {
    if (!this.db) await this.connect()
    const rows = this.db!.prepare(`EXPLAIN QUERY PLAN ${query}`).all() as Record<string, unknown>[]
    return {
      plan: JSON.stringify(rows, null, 2),
      warnings: [],
    }
  }

  getCapabilities(): DatabaseCapabilities {
    return {
      supportsMultiSchema: false,
      supportsTransactions: true,
      supportsExplain: true,
      supportsStoredProcedures: false,
      defaultReadOnlyMode: true,
      maxQueryRows: 10000,
      dialect: 'sqlite',
    }
  }
}
