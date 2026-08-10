/**
 * STRUCTURED ERROR CODES — Internite AI
 *
 * Never return 500 Internal Server Error for normal connection failures.
 * Each error contains a code, user message, and actionable suggestions.
 */

export enum ErrorCode {
  // Connection Errors (0xxx)
  DNS_RESOLUTION_FAILED = 'DNS_RESOLUTION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  TLS_ERROR = 'TLS_ERROR',
  NETWORK_BLOCKED = 'NETWORK_BLOCKED',
  DATABASE_NOT_FOUND = 'DATABASE_NOT_FOUND',
  INVALID_CONNECTION_STRING = 'INVALID_CONNECTION_STRING',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNSUPPORTED_DATABASE = 'UNSUPPORTED_DATABASE',
  SCHEMA_DISCOVERY_FAILED = 'SCHEMA_DISCOVERY_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN_DATABASE_ERROR = 'UNKNOWN_DATABASE_ERROR',

  // Auth Errors (1xxx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // Tenant Errors (2xxx)
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  CROSS_TENANT_ACCESS = 'CROSS_TENANT_ACCESS',

  // Billing Errors (3xxx)
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PLAN_NOT_FOUND = 'PLAN_NOT_FOUND',

  // Validation Errors (4xxx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Server Errors (5xxx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface StructuredError {
  success: false
  code: ErrorCode
  userMessage: string
  technicalMessage?: string
  suggestedAction?: string
  retryable: boolean
  details?: Record<string, unknown>
}

export interface SuccessResponse<T = unknown> {
  success: true
  data: T
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | StructuredError

/**
 * Create a structured error response
 */
export function error(
  code: ErrorCode,
  userMessage: string,
  options?: {
    technicalMessage?: string
    suggestedAction?: string
    retryable?: boolean
    details?: Record<string, unknown>
  }
): StructuredError {
  return {
    success: false,
    code,
    userMessage,
    technicalMessage: options?.technicalMessage,
    suggestedAction: options?.suggestedAction ?? getDefaultAction(code),
    retryable: options?.retryable ?? isRetryable(code),
    details: options?.details,
  }
}

/**
 * Create a success response
 */
export function success<T>(data: T): SuccessResponse<T> {
  return { success: true, data }
}

/**
 * Map connection errors to structured responses
 */
export function fromConnectionError(err: Error & { code?: string }): StructuredError {
  const message = err.message.toLowerCase()

  // DNS errors
  if (message.includes('getaddrinfo') || message.includes('ename or service not known') || message.includes('nodename nor servname')) {
    return error(
      ErrorCode.DNS_RESOLUTION_FAILED,
      "We couldn't find this database host.",
      {
        technicalMessage: err.message,
        suggestedAction: 'Check the hostname in your connection string.',
        retryable: true,
      }
    )
  }

  // Authentication errors
  if (message.includes('password authentication failed') ||
      message.includes('authentication') ||
      message.includes('access denied') ||
      message.includes('invalid credentials') ||
      message.includes('auth')) {
    return error(
      ErrorCode.AUTHENTICATION_FAILED,
      'Database authentication failed.',
      {
        technicalMessage: err.message,
        suggestedAction: 'Verify your username and password.',
        retryable: false,
      }
    )
  }

  // Timeout errors
  if (message.includes('timeout') || message.includes('etimedout') || message.includes('connection timed out')) {
    return error(
      ErrorCode.CONNECTION_TIMEOUT,
      'Connection timed out.',
      {
        technicalMessage: err.message,
        suggestedAction: 'Check if the database is accessible and try again.',
        retryable: true,
      }
    )
  }

  // TLS/SSL errors
  if (message.includes('ssl') || message.includes('tls') || message.includes('certificate')) {
    return error(
      ErrorCode.TLS_ERROR,
      'Secure connection failed.',
      {
        technicalMessage: err.message,
        suggestedAction: 'Check your SSL/TLS configuration.',
        retryable: true,
      }
    )
  }

  // Database not found
  if (message.includes('does not exist') || message.includes('unknown database')) {
    return error(
      ErrorCode.DATABASE_NOT_FOUND,
      'Database not found.',
      {
        technicalMessage: err.message,
        suggestedAction: 'Verify the database name in your connection string.',
        retryable: true,
      }
    )
  }

  // Permission denied
  if (message.includes('permission denied') || message.includes('access denied')) {
    return error(
      ErrorCode.PERMISSION_DENIED,
      'Permission denied.',
      {
        technicalMessage: err.message,
        suggestedAction: 'Grant the user read access to the database.',
        retryable: false,
      }
    )
  }

  // Invalid connection string
  if (message.includes('invalid') && message.includes('connection')) {
    return error(
      ErrorCode.INVALID_CONNECTION_STRING,
      'Invalid connection string format.',
      {
        technicalMessage: err.message,
        suggestedAction: 'Check the format of your connection string.',
        retryable: false,
      }
    )
  }

  // Default: unknown error
  return error(
    ErrorCode.UNKNOWN_DATABASE_ERROR,
    'An unexpected error occurred while connecting.',
    {
      technicalMessage: err.message,
      suggestedAction: 'Try again or contact support.',
      retryable: true,
    }
  )
}

function isRetryable(code: ErrorCode): boolean {
  const retryableCodes = [
    ErrorCode.CONNECTION_TIMEOUT,
    ErrorCode.RATE_LIMITED,
    ErrorCode.DNS_RESOLUTION_FAILED,
    ErrorCode.NETWORK_BLOCKED,
    ErrorCode.UNKNOWN_DATABASE_ERROR,
    ErrorCode.SERVICE_UNAVAILABLE,
  ]
  return retryableCodes.includes(code)
}

function getDefaultAction(code: ErrorCode): string {
  switch (code) {
    case ErrorCode.DNS_RESOLUTION_FAILED:
      return 'Check the hostname in your connection string.'
    case ErrorCode.AUTHENTICATION_FAILED:
      return 'Verify your username and password.'
    case ErrorCode.CONNECTION_TIMEOUT:
      return 'Check if the database is accessible and try again.'
    case ErrorCode.TLS_ERROR:
      return 'Check your SSL/TLS configuration.'
    case ErrorCode.DATABASE_NOT_FOUND:
      return 'Verify the database name in your connection string.'
    case ErrorCode.PERMISSION_DENIED:
      return 'Grant the user read access to the database.'
    case ErrorCode.INVALID_CONNECTION_STRING:
      return 'Check the format of your connection string.'
    case ErrorCode.UNAUTHORIZED:
      return 'Log in and try again.'
    case ErrorCode.SESSION_EXPIRED:
      return 'Log in again.'
    case ErrorCode.ACCESS_DENIED:
      return 'Request access from your organization admin.'
    case ErrorCode.USAGE_LIMIT_EXCEEDED:
      return 'Upgrade your plan to continue.'
    case ErrorCode.PAYMENT_FAILED:
      return 'Update your payment method.'
    default:
      return 'Try again or contact support.'
  }
}

/**
 * Create HTTP response from structured error
 */
export function errorResponse(err: StructuredError, statusCode = 400): Response {
  const statusMap: Record<ErrorCode, number> = {
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.SESSION_EXPIRED]: 401,
    [ErrorCode.TOKEN_INVALID]: 401,
    [ErrorCode.TENANT_NOT_FOUND]: 404,
    [ErrorCode.RESOURCE_NOT_FOUND]: 404,
    [ErrorCode.ACCESS_DENIED]: 403,
    [ErrorCode.CROSS_TENANT_ACCESS]: 403,
    [ErrorCode.SUBSCRIPTION_REQUIRED]: 402,
    [ErrorCode.USAGE_LIMIT_EXCEEDED]: 402,
    [ErrorCode.PAYMENT_FAILED]: 402,
    [ErrorCode.PLAN_NOT_FOUND]: 404,
    [ErrorCode.VALIDATION_ERROR]: 400,
    [ErrorCode.INVALID_INPUT]: 400,
    [ErrorCode.INTERNAL_ERROR]: 500,
    [ErrorCode.SERVICE_UNAVAILABLE]: 503,
    // Connection errors are typically 400 or 502
    [ErrorCode.DNS_RESOLUTION_FAILED]: 400,
    [ErrorCode.AUTHENTICATION_FAILED]: 400,
    [ErrorCode.CONNECTION_TIMEOUT]: 502,
    [ErrorCode.TLS_ERROR]: 400,
    [ErrorCode.NETWORK_BLOCKED]: 400,
    [ErrorCode.DATABASE_NOT_FOUND]: 400,
    [ErrorCode.INVALID_CONNECTION_STRING]: 400,
    [ErrorCode.PERMISSION_DENIED]: 403,
    [ErrorCode.UNSUPPORTED_DATABASE]: 400,
    [ErrorCode.SCHEMA_DISCOVERY_FAILED]: 502,
    [ErrorCode.RATE_LIMITED]: 429,
    [ErrorCode.UNKNOWN_DATABASE_ERROR]: 500,
  }

  return Response.json(err, { status: statusMap[err.code] ?? statusCode })
}
