/**
 * SECURE LOGGER — Internite AI
 *
 * Automatically redacts sensitive values from logs.
 * Never log: passwords, tokens, API keys, secrets, connection strings.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /api[_-]?key/i,
  /connection[_-]?string/i,
  /authorization/i,
  /cookie/i,
  /client[_-]?secret/i,
  /private[_-]?key/i,
  /bearer/i,
  /credential/i,
  /ssl/i,
]

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'apiKey',
  'api_key',
  'connectionString',
  'connectionstring',
  'authorization',
  'cookie',
  'clientSecret',
  'client_secret',
  'privateKey',
  'private_key',
  'bearer',
  'credential',
  'ssl',
  'key',
  'pass',
  'pwd',
  'auth',
])

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase()
  if (SENSITIVE_KEYS.has(lower)) return true
  return SENSITIVE_PATTERNS.some(p => p.test(key))
}

function isSensitiveValue(value: unknown): boolean {
  if (typeof value === 'string') {
    // Check if value looks like a secret (long random string, JWT, etc.)
    if (value.length > 20 && /^[A-Za-z0-9_=-]+$/.test(value)) {
      return true
    }
    // Check for JWT format
    if (value.split('.').length === 3) {
      return true
    }
  }
  return false
}

function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 10) return '[MAX_DEPTH]'
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return '[REDACTED]'
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value)) {
    return value.map(v => redactValue(v, depth + 1))
  }
  if (typeof value === 'object') {
    const redacted: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      if (isSensitiveKey(k) || isSensitiveValue(v)) {
        redacted[k] = '[REDACTED]'
      } else {
        redacted[k] = redactValue(v, depth + 1)
      }
    }
    return redacted
  }
  return value
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`

  if (!meta) {
    return `${prefix} ${message}`
  }

  const redactedMeta = redactValue(meta)
  return `${prefix} ${message} ${JSON.stringify(redactedMeta)}`
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'production') return
    console.debug(formatMessage('debug', message, meta))
  },

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(formatMessage('info', message, meta))
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(formatMessage('warn', message, meta))
  },

  error(message: string, meta?: Record<string, unknown>): void {
    // For errors, also include non-sensitive stack trace info
    console.error(formatMessage('error', message, meta))
  },
}

// Export for use in API routes
export const secureLog = {
  auth: (message: string, meta?: Record<string, unknown>) =>
    logger.debug(`[AUTH] ${message}`, meta),

  tenant: (message: string, meta?: Record<string, unknown>) =>
    logger.debug(`[TENANT] ${message}`, meta),

  billing: (message: string, meta?: Record<string, unknown>) =>
    logger.info(`[BILLING] ${message}`, meta),

  webhook: (message: string, meta?: Record<string, unknown>) =>
    logger.info(`[WEBHOOK] ${message}`, meta),

  api: (message: string, meta?: Record<string, unknown>) =>
    logger.debug(`[API] ${message}`, meta),

  db: (message: string, meta?: Record<string, unknown>) =>
    logger.debug(`[DB] ${message}`, meta),

  ai: (message: string, meta?: Record<string, unknown>) =>
    logger.debug(`[AI] ${message}`, meta),
}
