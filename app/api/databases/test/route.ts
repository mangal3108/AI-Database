import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createConnector } from '@/server/connectors/registry'
import { createConnectionSchema } from '@/lib/zod-schemas'
import { getTenantContext } from '@/server/services/auth/tenant-context'

/**
 * Structured error mapping for database connection failures
 */
function mapConnectionError(error: unknown): { code: string; userMessage: string; technicalMessage: string; retryable: boolean } {
  const errorStr = String(error)

  if (errorStr.includes('ENOTFOUND') || errorStr.includes('getaddrinfo') || errorStr.includes('DNS')) {
    return {
      code: 'DNS_RESOLUTION_FAILED',
      userMessage: 'We couldn\'t find this database host.',
      technicalMessage: errorStr,
      retryable: true,
    }
  }
  if (errorStr.includes('authentication') || errorStr.includes('password') || errorStr.includes('Access denied') || errorStr.includes('ECONNREFUSED')) {
    return {
      code: 'AUTHENTICATION_FAILED',
      userMessage: 'Authentication failed. Check your username and password.',
      technicalMessage: errorStr,
      retryable: true,
    }
  }
  if (errorStr.includes('timeout') || errorStr.includes('ETIMEDOUT')) {
    return {
      code: 'CONNECTION_TIMEOUT',
      userMessage: 'Connection timed out. The database may be busy or unreachable.',
      technicalMessage: errorStr,
      retryable: true,
    }
  }
  if (errorStr.includes('TLS') || errorStr.includes('SSL') || errorStr.includes('certificate')) {
    return {
      code: 'TLS_ERROR',
      userMessage: 'TLS/SSL connection failed. Check your SSL configuration.',
      technicalMessage: errorStr,
      retryable: false,
    }
  }
  if (errorStr.includes('Unknown host') || errorStr.includes('EHOSTUNREACH')) {
    return {
      code: 'NETWORK_BLOCKED',
      userMessage: 'Network error. The host may be blocked or unreachable.',
      technicalMessage: errorStr,
      retryable: true,
    }
  }
  if (errorStr.includes('database') && errorStr.includes('does not exist')) {
    return {
      code: 'DATABASE_NOT_FOUND',
      userMessage: 'Database not found. Check the database name in your connection string.',
      technicalMessage: errorStr,
      retryable: true,
    }
  }
  if (errorStr.includes('parse') || errorStr.includes('Invalid') || errorStr.includes('malformed')) {
    return {
      code: 'INVALID_CONNECTION_STRING',
      userMessage: 'Invalid connection string format.',
      technicalMessage: errorStr,
      retryable: false,
    }
  }

  return {
    code: 'UNKNOWN_DATABASE_ERROR',
    userMessage: 'An unexpected error occurred while connecting.',
    technicalMessage: errorStr,
    retryable: true,
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      retryable: false
    }, { status: 401 })
  }

  const tenant = await getTenantContext(session.user.id)
  if (!tenant.permissions.canConnectDatabase()) {
    return NextResponse.json({
      success: false,
      code: 'FORBIDDEN',
      message: 'Members with your role cannot test database connections',
      retryable: false
    }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({
      success: false,
      code: 'INVALID_JSON',
      message: 'Malformed JSON payload',
      retryable: false
    }, { status: 400 })
  }

  const parsed = createConnectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      code: 'VALIDATION_FAILED',
      message: 'Invalid database configuration',
      details: parsed.error.issues,
      retryable: false
    }, { status: 400 })
  }

  const { type, credentials } = parsed.data

  try {
    // Encrypt credentials temporarily for connector factory
    const tempConnector = createConnector(type as any, JSON.stringify(credentials))
    await tempConnector.connect()

    const testResult = await tempConnector.testConnection()
    const metadata = testResult.success ? await tempConnector.getDatabaseMetadata().catch(() => null) : null
    await tempConnector.disconnect()

    if (!testResult.success) {
      const errMessage = testResult.error || 'Connection failed'
      let code = 'CONNECTION_FAILED'
      let userMessage = 'Unable to establish database connection'
      let retryable = true

      // Map to structured error
      const mapped = mapConnectionError(errMessage)
      code = mapped.code
      userMessage = mapped.userMessage
      retryable = mapped.retryable

      if (errMessage.includes('ECONNREFUSED') || errMessage.includes('ENOTFOUND') || errMessage.includes('querySrv')) {
        code = 'DNS_RESOLUTION_FAILED'
        userMessage = 'Could not resolve database hostname. Verify your connection URI or server address.'
      } else if (errMessage.includes('Authentication failed') || errMessage.includes('Access denied') || errMessage.includes('password')) {
        code = 'AUTHENTICATION_FAILED'
        userMessage = 'Database authentication failed. Verify your username and password.'
      } else if (errMessage.includes('timeout') || errMessage.includes('ETIMEDOUT')) {
        code = 'CONNECTION_TIMEOUT'
        userMessage = 'Database connection timed out. Check your firewall or Network Access Allowlist.'
      }

      return NextResponse.json({
        success: false,
        code,
        message: errMessage,
        userMessage,
        retryable: code === 'CONNECTION_TIMEOUT' || code === 'DNS_RESOLUTION_FAILED',
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      code: 'SUCCESS',
      message: 'Database connection successful',
      diagnostics: {
        databaseType: metadata?.databaseType || type,
        version: metadata?.version || 'Ready',
        databaseName: metadata?.databaseName || 'Connected',
        latencyMs: testResult.latencyMs,
        tableCount: metadata?.totalTables || 0,
        schemas: metadata?.schemas.map(s => ({ name: s.name, tableCount: s.tables.length })) || [],
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    let code = 'TEST_ERROR'
    let userMessage = 'Connection test encountered an error'

    if (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND') || message.includes('querySrv')) {
      code = 'DNS_RESOLUTION_FAILED'
      userMessage = 'Could not resolve cluster host. Check your cluster URL or DNS.'
    }

    return NextResponse.json({
      success: false,
      code,
      message,
      userMessage,
      retryable: true,
    }, { status: 400 })
  }
}
