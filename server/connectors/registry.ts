import type { DatabaseConnector } from './base'
import { PostgresConnector } from './postgres'
import { MySQLConnector } from './mysql'
import { SQLiteConnector } from './sqlite'
import { MongoDBConnector } from './mongodb'
import { SQLServerConnector } from './sqlserver'
import { decrypt } from '../../lib/crypto'

export type DatabaseType = 'POSTGRESQL' | 'MYSQL' | 'MARIADB' | 'SQLSERVER' | 'SQLITE' | 'MONGODB' | 'COCKROACHDB' | 'NEON' | 'SUPABASE'

/**
 * Creates a DatabaseConnector from stored encrypted credentials.
 * This is the only place where credentials are decrypted — never expose
 * decrypted credentials to the browser or log them.
 */
export function createConnector(
  databaseType: DatabaseType,
  encryptedCredentials: string
): DatabaseConnector {
  const credentialsJson = decrypt(encryptedCredentials)
  const credentials = JSON.parse(credentialsJson) as Record<string, unknown>

  switch (databaseType) {
    case 'POSTGRESQL':
    case 'NEON':
    case 'SUPABASE':
    case 'COCKROACHDB':
      return new PostgresConnector({
        connectionString: credentials.connectionString as string | undefined,
        host: credentials.host as string | undefined,
        port: credentials.port as number | undefined,
        database: credentials.database as string | undefined,
        user: credentials.username as string | undefined,
        password: credentials.password as string | undefined,
        ssl: credentials.ssl as boolean | undefined,
      })

    case 'MYSQL':
    case 'MARIADB':
      return new MySQLConnector({
        host: credentials.host as string,
        port: credentials.port as number | undefined,
        database: credentials.database as string,
        user: credentials.username as string,
        password: credentials.password as string,
        ssl: credentials.ssl as boolean | undefined,
      })

    case 'SQLITE':
      return new SQLiteConnector(credentials.filePath as string)

    case 'MONGODB':
      return new MongoDBConnector({
        connectionString: credentials.connectionString as string,
        database: credentials.database as string | undefined,
      })

    case 'SQLSERVER':
      return new SQLServerConnector({
        host: credentials.host as string | undefined,
        port: credentials.port as number | undefined,
        database: credentials.database as string | undefined,
        username: credentials.username as string | undefined,
        password: credentials.password as string | undefined,
        connectionString: credentials.connectionString as string | undefined,
      })

    default:
      throw new Error(`Unsupported database type: ${databaseType}`)
  }
}

/**
 * In-memory connector cache.
 * Keyed by database connection ID.
 * Entries are automatically evicted after inactivity.
 */
class ConnectorCache {
  private cache = new Map<string, {
    connector: DatabaseConnector
    lastUsed: number
  }>()
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor(private ttlMs = 5 * 60 * 1000) {
    // Clean up stale connections every minute
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
    }
  }

  async getOrCreate(
    connectionId: string,
    factory: () => Promise<DatabaseConnector>
  ): Promise<DatabaseConnector> {
    const existing = this.cache.get(connectionId)
    if (existing) {
      existing.lastUsed = Date.now()
      return existing.connector
    }

    const connector = await factory()
    this.cache.set(connectionId, { connector, lastUsed: Date.now() })
    return connector
  }

  async invalidate(connectionId: string): Promise<void> {
    const entry = this.cache.get(connectionId)
    if (entry) {
      await entry.connector.disconnect()
      this.cache.delete(connectionId)
    }
  }

  private async cleanup(): Promise<void> {
    const now = Date.now()
    for (const [id, entry] of this.cache.entries()) {
      if (now - entry.lastUsed > this.ttlMs) {
        await entry.connector.disconnect()
        this.cache.delete(id)
      }
    }
  }

  destroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval)
    for (const entry of this.cache.values()) {
      entry.connector.disconnect().catch(() => {})
    }
    this.cache.clear()
  }
}

// Global connector registry (survives across requests in same process)
const globalForRegistry = globalThis as unknown as { connectorRegistry?: ConnectorCache }
export const connectorRegistry =
  globalForRegistry.connectorRegistry ?? new ConnectorCache()

if (process.env.NODE_ENV !== 'production') {
  globalForRegistry.connectorRegistry = connectorRegistry
}
