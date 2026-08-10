import { createPool, Pool, PoolConnection } from 'mysql2/promise'
import type {
  DatabaseConnector,
  DatabaseMetadata,
  SchemaMetadata,
  TableMetadata,
  QueryResult,
  ExplainResult,
  DatabaseCapabilities,
  ColumnMetadata,
  ForeignKeyMetadata,
  IndexMetadata,
} from './base'
import { ConnectionError, QueryRejectedError } from './base'
import { validateReadOnlyQuery } from '../services/query/safety'

export interface MySQLCredentials {
  host: string
  port?: number
  database: string
  user: string
  password: string
  ssl?: boolean
}

export class MySQLConnector implements DatabaseConnector {
  readonly databaseType = 'MYSQL'
  private pool: Pool | null = null
  private credentials: MySQLCredentials

  constructor(credentials: MySQLCredentials) {
    this.credentials = credentials
  }

  async connect(): Promise<void> {
    try {
      this.pool = createPool({
        host: this.credentials.host,
        port: this.credentials.port ?? 3306,
        database: this.credentials.database,
        user: this.credentials.user,
        password: this.credentials.password,
        ssl: this.credentials.ssl ? {} : undefined,
        connectionLimit: 5,
        connectTimeout: 10000,
        waitForConnections: true,
        queueLimit: 0,
      })

      // Test connection
      const conn = await this.pool.getConnection()
      conn.release()
    } catch (err) {
      throw new ConnectionError(
        `Failed to connect to MySQL: ${err instanceof Error ? err.message : String(err)}`,
        err
      )
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }

  async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    if (!this.pool) await this.connect()
    const start = Date.now()
    let conn: PoolConnection | null = null

    try {
      conn = await this.pool!.getConnection()
      await conn.query('SELECT 1')
      return { success: true, latencyMs: Date.now() - start }
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      }
    } finally {
      conn?.release()
    }
  }

  async getDatabaseMetadata(): Promise<DatabaseMetadata> {
    if (!this.pool) await this.connect()
    const conn = await this.pool!.getConnection()

    try {
      const [versionRows] = await conn.query('SELECT VERSION() as version') as [Array<{ version: string }>, unknown]
      const version = versionRows[0]?.version ?? 'Unknown'

      const schemas = await this.getSchemas()
      const schemaData: SchemaMetadata[] = []

      for (const schema of schemas) {
        const tables = await this.getTables(schema)
        schemaData.push({
          name: schema,
          tables: await Promise.all(tables.map(t => this.getTableMetadata(t, schema))),
        })
      }

      return {
        databaseName: this.credentials.database,
        databaseType: 'MySQL',
        version,
        schemas: schemaData,
        totalTables: schemaData.reduce((sum, s) => sum + s.tables.length, 0),
      }
    } finally {
      conn.release()
    }
  }

  async getSchemas(): Promise<string[]> {
    return [this.credentials.database]
  }

  async getTables(schema?: string): Promise<string[]> {
    if (!this.pool) await this.connect()
    const conn = await this.pool!.getConnection()
    const db = schema ?? this.credentials.database

    try {
      const [rows] = await conn.query(
        'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = ? ORDER BY TABLE_NAME',
        [db, 'BASE TABLE']
      ) as [Array<{ TABLE_NAME: string }>, unknown]

      return rows.map(r => r.TABLE_NAME)
    } finally {
      conn.release()
    }
  }

  async getTableMetadata(tableName: string, schema?: string): Promise<TableMetadata> {
    if (!this.pool) await this.connect()
    const conn = await this.pool!.getConnection()
    const db = schema ?? this.credentials.database

    try {
      const [columnRows] = await conn.query(`
        SELECT
          COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,
          COLUMN_KEY, EXTRA
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [db, tableName]) as [Array<{
        COLUMN_NAME: string
        DATA_TYPE: string
        IS_NULLABLE: string
        COLUMN_DEFAULT: string | null
        COLUMN_KEY: string
      }>, unknown]

      const columns: ColumnMetadata[] = columnRows.map(r => ({
        name: r.COLUMN_NAME,
        dataType: r.DATA_TYPE,
        isNullable: r.IS_NULLABLE === 'YES',
        isPrimaryKey: r.COLUMN_KEY === 'PRI',
        isForeignKey: r.COLUMN_KEY === 'MUL',
        isUnique: r.COLUMN_KEY === 'UNI',
        defaultValue: r.COLUMN_DEFAULT,
      }))

      const primaryKeys = columns.filter(c => c.isPrimaryKey).map(c => c.name)

      const [fkRows] = await conn.query(`
        SELECT
          kcu.CONSTRAINT_NAME, kcu.COLUMN_NAME,
          kcu.REFERENCED_TABLE_SCHEMA, kcu.REFERENCED_TABLE_NAME, kcu.REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE kcu
        JOIN information_schema.TABLE_CONSTRAINTS tc
          ON kcu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
          AND kcu.TABLE_SCHEMA = tc.TABLE_SCHEMA
        WHERE tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
          AND kcu.TABLE_SCHEMA = ? AND kcu.TABLE_NAME = ?
      `, [db, tableName]) as [Array<{
        CONSTRAINT_NAME: string
        COLUMN_NAME: string
        REFERENCED_TABLE_SCHEMA: string
        REFERENCED_TABLE_NAME: string
        REFERENCED_COLUMN_NAME: string
      }>, unknown]

      const foreignKeys: ForeignKeyMetadata[] = fkRows.map(r => ({
        constraintName: r.CONSTRAINT_NAME,
        columnName: r.COLUMN_NAME,
        referencedSchema: r.REFERENCED_TABLE_SCHEMA,
        referencedTable: r.REFERENCED_TABLE_NAME,
        referencedColumn: r.REFERENCED_COLUMN_NAME,
      }))

      const [indexRows] = await conn.query(`
        SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE, INDEX_TYPE
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY INDEX_NAME, SEQ_IN_INDEX
      `, [db, tableName]) as [Array<{
        INDEX_NAME: string
        COLUMN_NAME: string
        NON_UNIQUE: number
        INDEX_TYPE: string
      }>, unknown]

      const indexMap = new Map<string, IndexMetadata>()
      for (const row of indexRows) {
        const existing = indexMap.get(row.INDEX_NAME)
        if (existing) {
          existing.columns.push(row.COLUMN_NAME)
        } else {
          indexMap.set(row.INDEX_NAME, {
            name: row.INDEX_NAME,
            columns: [row.COLUMN_NAME],
            isUnique: row.NON_UNIQUE === 0,
            type: row.INDEX_TYPE,
          })
        }
      }

      const [countRows] = await conn.query(
        'SELECT TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
        [db, tableName]
      ) as [Array<{ TABLE_ROWS: number }>, unknown]

      return {
        name: tableName,
        schema: db,
        rowCount: countRows[0]?.TABLE_ROWS,
        columns,
        primaryKeys,
        foreignKeys,
        indexes: Array.from(indexMap.values()),
      }
    } finally {
      conn.release()
    }
  }

  async getSampleRows(tableName: string, schema?: string, limit = 5): Promise<QueryResult> {
    const db = schema ?? this.credentials.database
    return this.executeReadQuery(`SELECT * FROM \`${db}\`.\`${tableName}\` LIMIT ${Math.min(limit, 10)}`)
  }

  async executeReadQuery(query: string): Promise<QueryResult> {
    if (!this.pool) await this.connect()

    const validation = validateReadOnlyQuery(query, 'mysql')
    if (!validation.isValid) {
      throw new QueryRejectedError(`Query rejected: ${validation.reason}`, validation.reason ?? 'Unknown')
    }

    const conn = await this.pool!.getConnection()
    const start = Date.now()

    try {
      await conn.query('SET SESSION max_execution_time = 30000')
      const [rows, fields] = await conn.query(query) as [Record<string, unknown>[], { name: string }[]]

      return {
        columns: fields?.map(f => f.name) ?? Object.keys(rows[0] ?? {}),
        rows: Array.isArray(rows) ? rows : [],
        rowCount: Array.isArray(rows) ? rows.length : 0,
        executionTimeMs: Date.now() - start,
      }
    } finally {
      conn.release()
    }
  }

  async explainQuery(query: string): Promise<ExplainResult> {
    if (!this.pool) await this.connect()
    const conn = await this.pool!.getConnection()

    try {
      const [rows] = await conn.query(`EXPLAIN ${query}`) as [Record<string, unknown>[], unknown]
      return {
        plan: JSON.stringify(rows, null, 2),
        warnings: [],
      }
    } finally {
      conn.release()
    }
  }

  getCapabilities(): DatabaseCapabilities {
    return {
      supportsMultiSchema: false,
      supportsTransactions: true,
      supportsExplain: true,
      supportsStoredProcedures: true,
      defaultReadOnlyMode: true,
      maxQueryRows: 10000,
      dialect: 'mysql',
    }
  }
}
