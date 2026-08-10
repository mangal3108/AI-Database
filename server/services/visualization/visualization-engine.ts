/**
 * Visualization Engine - Internite AI
 */

import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import { createConnector } from '@/server/connectors/registry'
import type { NormalizedDataset } from './types'

export async function createVisualization(userId: string, params: {
  databaseId: string
  query: string
  chartType?: string
}) {
  const { organizationId } = await getTenantContext(userId)

  const database = await prisma.databaseConnection.findFirst({
    where: { id: params.databaseId, organizationId },
  })

  if (!database) {
    throw new Error('DATABASE_NOT_FOUND')
  }

  const startTime = Date.now()
  const connector = await createConnector(database.type, database.encryptedCredentials)
  const result = await connector.executeReadQuery(params.query)

  const executionTimeMs = Date.now() - startTime

  const columns = result.columns || []
  const rows = result.rows || []

  const dataset: NormalizedDataset = {
    columns,
    rows,
    metadata: {
      databaseId: params.databaseId,
      executionTimeMs,
      rowCount: rows.length,
      columns: columns.map(name => ({ name, type: 'unknown' as const })),
      databaseType: 'POSTGRESQL' as const,
    },
  }

  return { dataset, query: params.query, executionTimeMs }
}

export async function saveVisualization(userId: string, params: {
  name: string
  databaseId: string
  chartType: string
  configuration: Record<string, unknown>
  sourceQuery?: string
}) {
  const { organizationId } = await getTenantContext(userId)

  return prisma.visualization.create({
    data: {
      name: params.name,
      databaseId: params.databaseId,
      chartType: params.chartType,
      configuration: params.configuration as unknown as Record<string, object>,
      sourceQuery: params.sourceQuery,
      organizationId,
      createdById: userId,
    },
  })
}
