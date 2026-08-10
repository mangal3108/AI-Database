import { MongoClient, Db, Document } from 'mongodb'
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

export interface MongoCredentials {
  connectionString: string
  database?: string
}

export class MongoDBConnector implements DatabaseConnector {
  readonly databaseType = 'MONGODB'
  private client: MongoClient | null = null
  private db: Db | null = null
  private credentials: MongoCredentials

  constructor(credentials: MongoCredentials) {
    this.credentials = credentials
  }

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.credentials.connectionString, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 5,
      })
      await this.client.connect()

      const dbName = this.credentials.database ?? this.extractDatabaseFromUri()
      this.db = this.client.db(dbName)
    } catch (err) {
      throw new ConnectionError(
        `Failed to connect to MongoDB: ${err instanceof Error ? err.message : String(err)}`,
        err
      )
    }
  }

  private extractDatabaseFromUri(): string {
    try {
      const url = new URL(this.credentials.connectionString.replace('mongodb+srv://', 'https://'))
      return url.pathname.slice(1) || 'test'
    } catch {
      return 'test'
    }
  }

  async disconnect(): Promise<void> {
    await this.client?.close()
    this.client = null
    this.db = null
  }

  async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    if (!this.client) await this.connect()
    const start = Date.now()
    try {
      await this.client!.db('admin').command({ ping: 1 })
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
    const schemas = await this.getSchemas()
    const schemaData: SchemaMetadata[] = []

    for (const schema of schemas) {
      const collections = await this.getTables(schema)
      const collMeta = await Promise.all(collections.map(c => this.getTableMetadata(c)))
      schemaData.push({ name: schema, tables: collMeta })
    }

    return {
      databaseName: this.db!.databaseName,
      databaseType: 'MongoDB',
      version: 'Atlas',
      schemas: schemaData,
      totalTables: schemaData.reduce((sum, s) => sum + s.tables.length, 0),
    }
  }

  async getSchemas(): Promise<string[]> {
    if (!this.db) await this.connect()
    return [this.db!.databaseName]
  }

  async getTables(schema?: string): Promise<string[]> {
    if (!this.db) await this.connect()
    const db = schema ? this.client!.db(schema) : this.db!
    const collections = await db.listCollections().toArray()
    return collections.map(c => c.name)
  }

  async getTableMetadata(collectionName: string): Promise<TableMetadata> {
    if (!this.db) await this.connect()
    const collection = this.db!.collection(collectionName)

    // Sample documents to infer schema
    const sample = await collection.find({}).limit(20).toArray()
    const columns: ColumnMetadata[] = this.inferSchema(sample)

    let rowCount = 0
    try {
      const count = await collection.estimatedDocumentCount()
      rowCount = count
    } catch {
      rowCount = sample.length
    }

    return {
      name: collectionName,
      rowCount,
      columns,
      primaryKeys: ['_id'],
      foreignKeys: [],
      indexes: [],
    }
  }

  private inferSchema(documents: Document[]): ColumnMetadata[] {
    const fieldMap = new Map<string, Set<string>>()

    for (const doc of documents) {
      this.flattenDocument(doc, '', fieldMap)
    }

    const columns: ColumnMetadata[] = []
    for (const [field, types] of fieldMap.entries()) {
      columns.push({
        name: field,
        dataType: Array.from(types).join(' | '),
        isNullable: true,
        isPrimaryKey: field === '_id',
        isForeignKey: false,
        isUnique: field === '_id',
      })
    }

    return columns
  }

  private flattenDocument(
    doc: Document,
    prefix: string,
    result: Map<string, Set<string>>
  ) {
    for (const [key, value] of Object.entries(doc)) {
      const fieldName = prefix ? `${prefix}.${key}` : key
      const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value

      if (!result.has(fieldName)) result.set(fieldName, new Set())
      result.get(fieldName)!.add(type)

      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        this.flattenDocument(value as Document, fieldName, result)
      }
    }
  }

  async getSampleRows(collectionName: string): Promise<QueryResult> {
    if (!this.db) await this.connect()
    const docs = await this.db!.collection(collectionName).find({}).limit(5).toArray()
    const rows = docs.map(d => ({ ...d, _id: d._id?.toString() })) as Record<string, unknown>[]
    const columns = rows.length > 0 ? Object.keys(rows[0]!) : []

    return { columns, rows, rowCount: rows.length, executionTimeMs: 0 }
  }

  async executeReadQuery(query: string): Promise<QueryResult> {
    if (!this.db) await this.connect()

    // MongoDB queries are passed as JSON pipeline strings
    // Format: { "collection": "...", "operation": "find|aggregate", "pipeline": [...] }
    let parsed: {
      collection: string
      operation: 'find' | 'aggregate'
      filter?: Record<string, unknown>
      pipeline?: Document[]
      limit?: number
      sort?: Record<string, number>
    }

    try {
      parsed = JSON.parse(query) as typeof parsed
    } catch {
      throw new QueryRejectedError('Invalid MongoDB query format. Expected JSON.', 'INVALID_FORMAT')
    }

    const start = Date.now()
    const collection = this.db!.collection(parsed.collection)
    let docs: Record<string, unknown>[]

    if (parsed.operation === 'aggregate') {
      docs = await collection.aggregate(parsed.pipeline ?? []).toArray() as Record<string, unknown>[]
    } else {
      docs = await collection
        .find(parsed.filter ?? {})
        .sort(parsed.sort as Document ?? {})
        .limit(Math.min(parsed.limit ?? 100, 10000))
        .toArray() as Record<string, unknown>[]
    }

    // Serialize ObjectIDs
    docs = docs.map(d => {
      const serialized: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(d)) {
        serialized[k] = v !== null && typeof v === 'object' && 'toHexString' in v
          ? (v as { toHexString: () => string }).toHexString()
          : v
      }
      return serialized
    })

    const columns = docs.length > 0 ? Object.keys(docs[0]!) : []
    return {
      columns,
      rows: docs,
      rowCount: docs.length,
      executionTimeMs: Date.now() - start,
    }
  }

  async explainQuery(_query: string): Promise<ExplainResult> {
    return { plan: 'Explain not available for MongoDB queries', warnings: [] }
  }

  getCapabilities(): DatabaseCapabilities {
    return {
      supportsMultiSchema: true,
      supportsTransactions: true,
      supportsExplain: false,
      supportsStoredProcedures: false,
      defaultReadOnlyMode: true,
      maxQueryRows: 10000,
      dialect: 'mongodb' as 'postgresql',
    }
  }
}
