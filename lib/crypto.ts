import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16
const KEY_LENGTH = 32

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is not set. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
  }
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== KEY_LENGTH) {
    throw new Error(`ENCRYPTION_KEY must be ${KEY_LENGTH * 2} hex characters (${KEY_LENGTH} bytes)`)
  }
  return keyBuffer
}

export interface EncryptedData {
  ciphertext: string
  iv: string
  tag: string
}

/**
 * Encrypt a string using AES-256-GCM.
 * Returns a structured object with ciphertext, IV, and auth tag.
 * NEVER store plaintext credentials.
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])

  const tag = cipher.getAuthTag()

  const data: EncryptedData = {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  }

  return JSON.stringify(data)
}

/**
 * Decrypt an encrypted credential string.
 * Throws if tampered or key is wrong.
 */
export function decrypt(encryptedJson: string): string {
  const key = getEncryptionKey()

  let data: EncryptedData
  try {
    data = JSON.parse(encryptedJson) as EncryptedData
  } catch {
    throw new Error('Invalid encrypted data format')
  }

  const iv = Buffer.from(data.iv, 'base64')
  const tag = Buffer.from(data.tag, 'base64')
  const ciphertext = Buffer.from(data.ciphertext, 'base64')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}

/**
 * Mask a connection string for display in the UI.
 * Never show real passwords to the browser.
 */
export function maskConnectionString(connectionString: string): string {
  // Mask postgresql://user:password@host/db
  const urlPattern = /(:\/\/[^:]+:)[^@]+(@)/
  if (urlPattern.test(connectionString)) {
    return connectionString.replace(urlPattern, '$1••••••••$2')
  }

  // Mask password=something
  const passwordPattern = /(password\s*=\s*)[^\s;]+/gi
  if (passwordPattern.test(connectionString)) {
    return connectionString.replace(passwordPattern, '$1••••••••')
  }

  return connectionString
}

/**
 * Hash a string (for API keys, etc.)
 */
export function hashString(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url')
}
