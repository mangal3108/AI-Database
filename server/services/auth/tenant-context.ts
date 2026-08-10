import { prisma } from '@/lib/prisma'
import { MembershipRole, OrgPlan } from '@prisma/client'

// ─────────────────────────────────────────────
// TYPES & PERMISSIONS DEFINITION
// ─────────────────────────────────────────────

export type Action =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'execute'
  | 'share'
  | 'manage'
  | 'invite'

export type ResourceType =
  | 'organization'
  | 'project'
  | 'database_connection'
  | 'conversation'
  | 'query'
  | 'dashboard'
  | 'knowledge'
  | 'api_key'
  | 'member'
  | 'settings'
  | 'billing'
  | 'audit_log'

export interface TenantContext {
  userId: string
  organizationId: string
  projectId?: string | null
  role: MembershipRole
  plan: OrgPlan
  permissions: PermissionCheckers
}

export interface AuthorizeOptions {
  tenant: TenantContext
  resourceType: ResourceType
  action: Action
  resourceId?: string
  projectScopeId?: string | null
  databaseConnectionId?: string
}

// Entitlement matrix per plan
export interface Entitlements {
  maxDatabases: number
  maxProjects: number
  maxMembers: number
  maxAiRequestsPerMonth: number
  maxKnowledgeStorageMb: number
  allowCustomRoles: boolean
  allowAuditExport: boolean
  allowApiKeys: boolean
}

export const PLAN_ENTITLEMENTS: Record<OrgPlan, Entitlements> = {
  FREE: {
    maxDatabases: 3,
    maxProjects: 1,
    maxMembers: 3,
    maxAiRequestsPerMonth: 1000,
    maxKnowledgeStorageMb: 100,
    allowCustomRoles: false,
    allowAuditExport: false,
    allowApiKeys: false,
  },
  STARTER: {
    maxDatabases: 5,
    maxProjects: 3,
    maxMembers: 5,
    maxAiRequestsPerMonth: 2500,
    maxKnowledgeStorageMb: 500,
    allowCustomRoles: false,
    allowAuditExport: false,
    allowApiKeys: true,
  },
  PRO: {
    maxDatabases: 10,
    maxProjects: 5,
    maxMembers: 10,
    maxAiRequestsPerMonth: 10000,
    maxKnowledgeStorageMb: 1000,
    allowCustomRoles: false,
    allowAuditExport: true,
    allowApiKeys: true,
  },
  TEAM: {
    maxDatabases: 25,
    maxProjects: 20,
    maxMembers: 50,
    maxAiRequestsPerMonth: 50000,
    maxKnowledgeStorageMb: 5000,
    allowCustomRoles: true,
    allowAuditExport: true,
    allowApiKeys: true,
  },
  BUSINESS: {
    maxDatabases: 50,
    maxProjects: 50,
    maxMembers: 100,
    maxAiRequestsPerMonth: 100000,
    maxKnowledgeStorageMb: 10000,
    allowCustomRoles: true,
    allowAuditExport: true,
    allowApiKeys: true,
  },
  ENTERPRISE: {
    maxDatabases: 9999,
    maxProjects: 9999,
    maxMembers: 9999,
    maxAiRequestsPerMonth: 9999999,
    maxKnowledgeStorageMb: 50000,
    allowCustomRoles: true,
    allowAuditExport: true,
    allowApiKeys: true,
  },
}

// ─────────────────────────────────────────────
// PERMISSIONS DEFINITIONS
// ─────────────────────────────────────────────

export interface PermissionCheckers {
  canManageMembers: () => boolean
  canConnectDatabase: () => boolean
  canExecuteQuery: () => boolean
  canCreateDashboard: () => boolean
  canUploadKnowledge: () => boolean
  canManageAPIKeys: () => boolean
  canManageSettings: () => boolean
  canManageBilling: () => boolean
  canViewAuditLogs: () => boolean
}

export function createPermissionCheckers(role: MembershipRole, plan: OrgPlan): PermissionCheckers {
  const entitlements = PLAN_ENTITLEMENTS[plan]

  return {
    canManageMembers: () => role === 'OWNER' || role === 'ADMIN',
    canConnectDatabase: () => role === 'OWNER' || role === 'ADMIN',
    canExecuteQuery: () => role !== 'VIEWER',
    canCreateDashboard: () => role !== 'VIEWER',
    canUploadKnowledge: () => role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER',
    canManageAPIKeys: () => (role === 'OWNER' || role === 'ADMIN') && entitlements.allowApiKeys,
    canManageSettings: () => role === 'OWNER' || role === 'ADMIN',
    canManageBilling: () => role === 'OWNER',
    canViewAuditLogs: () => (role === 'OWNER' || role === 'ADMIN') && entitlements.allowAuditExport,
  }
}

// ─────────────────────────────────────────────
// CONTEXT RESOLUTION & TRUSTED SERVER-SIDE GUARD
// ─────────────────────────────────────────────

/**
 * Resolves and validates trusted server-side TenantContext for an authenticated request.
 * NEVER trusts frontend tenant parameters blindly.
 */
export async function getTenantContext(
  userId: string,
  requestedOrgId?: string | null,
  requestedProjectId?: string | null
): Promise<TenantContext> {
  if (!userId) {
    throw new TenantAccessDeniedError('Unauthenticated request. No user ID provided.')
  }

  // 1. Resolve organization membership
  let membership = requestedOrgId
    ? await prisma.membership.findFirst({
        where: { userId, organizationId: requestedOrgId },
        include: { organization: true },
      })
    : await prisma.membership.findFirst({
        where: { userId },
        include: { organization: true },
        orderBy: { createdAt: 'asc' },
      })

  // If user has no workspace at all, auto-provision a personal workspace
  if (!membership) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new TenantAccessDeniedError('User account not found.')
    }

    const slug = `${user.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'user'}-${Math.random().toString(36).slice(2, 7)}`

    const newOrg = await prisma.organization.create({
      data: {
        name: user.name ? `${user.name}'s Workspace` : 'Personal Workspace',
        slug,
        plan: 'FREE',
      },
    })

    membership = await prisma.membership.create({
      data: {
        userId,
        organizationId: newOrg.id,
        role: 'OWNER',
      },
      include: { organization: true },
    })
  }

  const org = membership.organization
  if (org.deletedAt) {
    throw new TenantAccessDeniedError('Organization has been deleted.')
  }

  // 2. Validate optional project scope within the verified organization
  let projectId: string | null = null
  if (requestedProjectId) {
    const project = await prisma.project.findFirst({
      where: { id: requestedProjectId, organizationId: org.id },
    })
    if (!project) {
      throw new TenantAccessDeniedError('Project not found or access denied within this workspace.')
    }
    projectId = project.id
  }

  const permissions = createPermissionCheckers(membership.role, org.plan)

  return {
    userId,
    organizationId: org.id,
    projectId,
    role: membership.role,
    plan: org.plan,
    permissions,
  }
}

// ─────────────────────────────────────────────
// CENTRAL RESOURCE AUTHORIZATION
// ─────────────────────────────────────────────

export async function authorizeResource(options: AuthorizeOptions): Promise<boolean> {
  const { tenant, resourceType, action, resourceId, databaseConnectionId } = options

  // 1. Role-based privilege checks
  if (action === 'manage' && tenant.role !== 'OWNER' && tenant.role !== 'ADMIN') {
    throw new TenantAccessDeniedError('Role prohibited from managing this resource.')
  }

  if (action === 'delete' && tenant.role === 'VIEWER') {
    throw new TenantAccessDeniedError('Viewers cannot delete resources.')
  }

  if (action === 'execute' && tenant.role === 'VIEWER') {
    throw new TenantAccessDeniedError('Viewers cannot execute queries.')
  }

  // 2. Database Connection specific isolation check
  if (databaseConnectionId) {
    const dbConn = await prisma.databaseConnection.findFirst({
      where: { id: databaseConnectionId, organizationId: tenant.organizationId, deletedAt: null },
    })

    if (!dbConn) {
      throw new TenantAccessDeniedError('Database connection not found or does not belong to your organization.')
    }
  }

  // 3. Specific resource lookup verification
  if (resourceId) {
    let exists = false

    switch (resourceType) {
      case 'database_connection': {
        const item = await prisma.databaseConnection.findFirst({
          where: { id: resourceId, organizationId: tenant.organizationId, deletedAt: null },
        })
        exists = !!item
        break
      }
      case 'conversation': {
        const item = await prisma.conversation.findFirst({
          where: { id: resourceId, organizationId: tenant.organizationId, deletedAt: null },
        })
        exists = !!item
        break
      }
      case 'query': {
        const item = await prisma.savedQuery.findFirst({
          where: { id: resourceId, organizationId: tenant.organizationId },
        })
        exists = !!item
        break
      }
      case 'dashboard': {
        const item = await prisma.dashboard.findFirst({
          where: { id: resourceId, organizationId: tenant.organizationId },
        })
        exists = !!item
        break
      }
      case 'knowledge': {
        const item = await prisma.knowledgeDocument.findFirst({
          where: { id: resourceId, organizationId: tenant.organizationId },
        })
        exists = !!item
        break
      }
      case 'project': {
        const item = await prisma.project.findFirst({
          where: { id: resourceId, organizationId: tenant.organizationId },
        })
        exists = !!item
        break
      }
      default:
        exists = true
    }

    if (!exists) {
      throw new TenantAccessDeniedError(`Access denied to ${resourceType} [ID: ${resourceId}]. Resource not found in workspace.`)
    }
  }

  return true
}

// ─────────────────────────────────────────────
// AUDIT LOGGING & ENTITLEMENTS
// ─────────────────────────────────────────────

export async function logAuditEvent(params: {
  tenant: TenantContext
  action: string
  resourceType: string
  resourceId?: string | null
  metadata?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
}) {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: params.tenant.organizationId,
        projectId: params.tenant.projectId,
        userId: params.tenant.userId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId ?? null,
        metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    })
  } catch (err) {
    console.error('[AUDIT LOG ERROR] Failed to record audit log:', err)
  }
}

export class TenantAccessDeniedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TenantAccessDeniedError'
  }
}
