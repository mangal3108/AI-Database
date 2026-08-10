import { Pool, PoolClient } from 'pg'
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

export interface PostgresCredentials {
  connectionString?: string
  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
  ssl?: boolean
}

export class PostgresConnector implements DatabaseConnector {
  readonly databaseType = 'POSTGRESQL'
  private pool: Pool | null = null
  private credentials: PostgresCredentials

  constructor(credentials: PostgresCredentials) {
    this.credentials = credentials
  }

  async connect(): Promise<void> {
    try {
      const config = this.credentials.connectionString
        ? {
            connectionString: this.credentials.connectionString,
            ssl: this.credentials.ssl !== false
              ? { rejectUnauthorized: false }
              : false,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
          }
        : {
            host: this.credentials.host,
            port: this.credentials.port ?? 5432,
            database: this.credentials.database,
            user: this.credentials.user,
            password: this.credentials.password,
            ssl: this.credentials.ssl !== false
              ? { rejectUnauthorized: false }
              : false,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
          }

      this.pool = new Pool(config)

      // Test the connection
      const client = await this.pool.connect()
      client.release()
    } catch (err) {
      throw new ConnectionError(
        `Failed to connect to PostgreSQL: ${err instanceof Error ? err.message : String(err)}`,
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
    let client: PoolClient | null = null

    try {
      client = await this.pool!.connect()
      await client.query('SELECT 1')
      return { success: true, latencyMs: Date.now() - start }
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      }
    } finally {
      client?.release()
    }
  }

  async getDatabaseMetadata(): Promise<DatabaseMetadata> {
    if (!this.pool) await this.connect()
    const client = await this.pool!.connect()

    try {
      const versionResult = await client.query('SELECT version()')
      const version = versionResult.rows[0]?.version ?? 'Unknown'

      const dbResult = await client.query('SELECT current_database()')
      const databaseName = dbResult.rows[0]?.current_database ?? 'Unknown'

      const schemas = await this.getSchemas()
      const schemaData: SchemaMetadata[] = []

      for (const schema of schemas.filter(s => !['information_schema', 'pg_catalog', 'pg_toast'].includes(s))) {
        const tables = await this.getTables(schema)
        const schemaMeta: SchemaMetadata = {
          name: schema,
          tables: await Promise.all(tables.map(t => this.getTableMetadata(t, schema))),
        }
        schemaData.push(schemaMeta)
      }

      return {
        databaseName,
        databaseType: 'PostgreSQL',
        version: version.split(' ').slice(0, 2).join(' '),
        schemas: schemaData,
        totalTables: schemaData.reduce((sum, s) => sum + s.tables.length, 0),
      }
    } finally {
      client.release()
    }
  }

  async getSchemas(): Promise<string[]> {
    if (!this.pool) await this.connect()
    const client = await this.pool!.connect()

    try {
      const result = await client.query(`
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
          AND schema_name NOT LIKE 'pg_%'
        ORDER BY schema_name
      `)
      return result.rows.map((r: { schema_name: string }) => r.schema_name)
    } finally {
      client.release()
    }
  }

  async getTables(schema = 'public'): Promise<string[]> {
    if (!this.pool) await this.connect()
    const client = await this.pool!.connect()

    try {
      const result = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = $1
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `, [schema])
      return result.rows.map((r: { table_name: string }) => r.table_name)
    } finally {
      client.release()
    }
  }

  async getTableMetadata(tableName: string, schema = 'public'): Promise<TableMetadata> {
    if (!this.pool) await this.connect()
    const client = await this.pool!.connect()

    try {
      // Columns
      const columnsResult = await client.query(`
        SELECT
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          c.character_maximum_length,
          pgd.description as column_comment,
          EXISTS(
            SELECT 1 FROM information_schema.key_column_usage kcu
            JOIN information_schema.table_constraints tc
              ON kcu.constraint_name = tc.constraint_name
              AND kcu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'PRIMARY KEY'
              AND kcu.table_schema = $2
              AND kcu.table_name = $1
              AND kcu.column_name = c.column_name
          ) as is_primary_key,
          EXISTS(
            SELECT 1 FROM information_schema.key_column_usage kcu
            JOIN information_schema.table_constraints tc
              ON kcu.constraint_name = tc.constraint_name
              AND kcu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND kcu.table_schema = $2
              AND kcu.table_name = $1
              AND kcu.column_name = c.column_name
          ) as is_foreign_key,
          EXISTS(
            SELECT 1 FROM information_schema.key_column_usage kcu
            JOIN information_schema.table_constraints tc
              ON kcu.constraint_name = tc.constraint_name
              AND kcu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'UNIQUE'
              AND kcu.table_schema = $2
              AND kcu.table_name = $1
              AND kcu.column_name = c.column_name
          ) as is_unique
        FROM information_schema.columns c
        LEFT JOIN pg_catalog.pg_statio_all_tables psat
          ON psat.relname = c.table_name AND psat.schemaname = c.table_schema
        LEFT JOIN pg_catalog.pg_description pgd
          ON pgd.objoid = psat.relid
          AND pgd.objsubid = c.ordinal_position
        WHERE c.table_schema = $2 AND c.table_name = $1
        ORDER BY c.ordinal_position
      `, [tableName, schema])

      const columns: ColumnMetadata[] = columnsResult.rows.map((r: {
        column_name: string
        data_type: string
        is_nullable: string
        column_default: string | null
        column_comment: string | null
        is_primary_key: boolean
        is_foreign_key: boolean
        is_unique: boolean
      }) => ({
        name: r.column_name,
        dataType: r.data_type,
        isNullable: r.is_nullable === 'YES',
        isPrimaryKey: r.is_primary_key,
        isForeignKey: r.is_foreign_key,
        isUnique: r.is_unique,
        defaultValue: r.column_default,
        comment: r.column_comment,
      }))

      // Primary keys
      const pkResult = await client.query(`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = $2
          AND tc.table_name = $1
      `, [tableName, schema])
      const primaryKeys = pkResult.rows.map((r: { column_name: string }) => r.column_name)

      // Foreign keys
      const fkResult = await client.query(`
        SELECT
          kcu.constraint_name,
          kcu.column_name,
          ccu.table_schema as referenced_schema,
          ccu.table_name as referenced_table,
          ccu.column_name as referenced_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = $2
          AND tc.table_name = $1
      `, [tableName, schema])

      const foreignKeys: ForeignKeyMetadata[] = fkResult.rows.map((r: {
        constraint_name: string
        column_name: string
        referenced_schema: string
        referenced_table: string
        referenced_column: string
      }) => ({
        constraintName: r.constraint_name,
        columnName: r.column_name,
        referencedSchema: r.referenced_schema,
        referencedTable: r.referenced_table,
        referencedColumn: r.referenced_column,
      }))

      // Indexes
      const indexResult = await client.query(`
        SELECT
          i.relname as index_name,
          ix.indisunique as is_unique,
          array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum)) as columns,
          am.amname as index_type
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        JOIN pg_am am ON am.oid = i.relam
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE t.relname = $1 AND n.nspname = $2
        GROUP BY i.relname, ix.indisunique, am.amname
      `, [tableName, schema])

      const indexes: IndexMetadata[] = indexResult.rows.map((r: {
        index_name: string
        is_unique: boolean
        columns: string[]
        index_type: string
      }) => ({
        name: r.index_name,
        columns: r.columns,
        isUnique: r.is_unique,
        type: r.index_type,
      }))

      // Row count estimate
      const countResult = await client.query(`
        SELECT reltuples::bigint as row_count
        FROM pg_class
        WHERE relname = $1
      `, [tableName])
      const rowCount = countResult.rows[0]?.row_count ?? 0

      return {
        name: tableName,
        schema,
        rowCount,
        columns,
        primaryKeys,
        foreignKeys,
        indexes,
      }
    } finally {
      client.release()
    }
  }

  async getSampleRows(tableName: string, schema = 'public', limit = 5): Promise<QueryResult> {
    return this.executeReadQuery(`SELECT * FROM "${schema}"."${tableName}" LIMIT ${Math.min(limit, 10)}`)
  }

  async executeReadQuery(query: string): Promise<QueryResult> {
    if (!this.pool) await this.connect()

    // Safety check
    const validation = validateReadOnlyQuery(query, 'postgresql')
    if (!validation.isValid) {
      throw new QueryRejectedError(
        `Query rejected: ${validation.reason}`,
        validation.reason ?? 'Unknown reason'
      )
    }

    const client = await this.pool!.connect()
    const start = Date.now()

    try {
      // Set statement timeout
      await client.query('SET statement_timeout = 30000')
      const result = await client.query(query)
      const executionTimeMs = Date.now() - start

      const columns = result.fields.map(f => f.name)
      const rows = result.rows as Record<string, unknown>[]

      return {
        columns,
        rows,
        rowCount: result.rowCount ?? rows.length,
        executionTimeMs,
      }
    } finally {
      client.release()
    }
  }

  async explainQuery(query: string): Promise<ExplainResult> {
    if (!this.pool) await this.connect()
    const client = await this.pool!.connect()

    try {
      const result = await client.query(`EXPLAIN (FORMAT JSON, ANALYZE false) ${query}`)
      const plan = JSON.stringify(result.rows[0]?.['QUERY PLAN'] ?? {}, null, 2)

      const planData = result.rows[0]?.['QUERY PLAN']?.[0]?.Plan as {
        'Total Cost'?: number
        'Plan Rows'?: number
      } | undefined

      const warnings: string[] = []
      if (planData?.['Total Cost'] && planData['Total Cost'] > 10000) {
        warnings.push('High estimated query cost')
      }

      return {
        plan,
        estimatedRows: planData?.['Plan Rows'],
        estimatedCost: planData?.['Total Cost'],
        warnings,
      }
    } finally {
      client.release()
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
      dialect: 'postgresql',
    }
  }
}
