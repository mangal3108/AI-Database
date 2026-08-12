import { describe, expect, it } from 'vitest'
import { classifyQueryIntent, semanticValidateSQL, validateReadOnlyQuery } from '../server/services/query/safety'

const schema = {
  tables: [{
    name: 'users',
    columns: [{ name: 'id' }, { name: 'email' }, { name: 'created_at' }],
  }],
} as any

describe('read-only query safety and grounding', () => {
  it.each([
    'DROP TABLE users',
    'DELETE FROM users WHERE id = 1',
    'UPDATE users SET email = \'x@example.com\'',
    'INSERT INTO users (email) VALUES (\'x@example.com\')',
    'TRUNCATE users',
  ])('rejects destructive SQL: %s', query => {
    expect(validateReadOnlyQuery(query, 'postgresql').isValid).toBe(false)
  })

  it('accepts a read-only aggregate and reports its type', () => {
    const result = validateReadOnlyQuery('SELECT COUNT(*) FROM users', 'postgresql')
    expect(result.isValid).toBe(true)
    expect(result.queryType).toBe('AGGREGATE')
  })

  it('warns on an unbounded row query without rejecting it', () => {
    const result = validateReadOnlyQuery('SELECT id, email FROM users', 'postgresql')
    expect(result.isValid).toBe(true)
    expect(result.warnings?.some(w => w.includes('no LIMIT'))).toBe(true)
  })

  it('blocks restricted PostgreSQL file functions', () => {
    expect(validateReadOnlyQuery("SELECT pg_read_file('/etc/passwd')", 'postgresql').isValid).toBe(false)
  })

  it('blocks MySQL file export operations', () => {
    expect(validateReadOnlyQuery("SELECT * FROM users INTO OUTFILE '/tmp/users.csv'", 'mysql').isValid).toBe(false)
  })

  it('rejects tables missing from the retrieved schema', () => {
    const result = semanticValidateSQL(['orders'], [], schema)
    expect(result.isValid).toBe(false)
    expect(result.reason).toContain("Table 'orders'")
  })

  it('rejects columns missing from the retrieved schema', () => {
    const result = semanticValidateSQL(['users'], ['password_hash'], schema)
    expect(result.isValid).toBe(false)
    expect(result.reason).toContain("Column 'password_hash'")
  })

  it('accepts grounded tables and columns case-insensitively', () => {
    expect(semanticValidateSQL(['USERS'], ['EMAIL'], schema).isValid).toBe(true)
  })

  it('classifies common user intents deterministically', () => {
    expect(classifyQueryIntent('show the schema tables')).toBe('SCHEMA_QUERY')
    expect(classifyQueryIntent('plot monthly revenue')).toBe('VISUALIZATION')
  })
})
