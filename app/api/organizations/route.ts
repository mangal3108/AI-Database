import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext, logAuditEvent } from '@/server/services/auth/tenant-context'
import { z } from 'zod'

const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          logoUrl: true,
          createdAt: true,
          deletedAt: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const currentTenant = await getTenantContext(session.user.id)

  const workspaces = memberships
    .filter(m => !m.organization.deletedAt)
    .map(m => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      plan: m.organization.plan,
      role: m.role,
      isCurrent: m.organization.id === currentTenant.organizationId,
    }))

  return NextResponse.json({ workspaces, currentOrgId: currentTenant.organizationId })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createOrgSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
  }

  const existingSlug = await prisma.organization.findUnique({
    where: { slug: parsed.data.slug },
  })

  if (existingSlug) {
    return NextResponse.json({ error: 'Workspace URL/slug already taken' }, { status: 400 })
  }

  const newOrg = await prisma.organization.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      plan: 'FREE',
    },
  })

  await prisma.membership.create({
    data: {
      userId: session.user.id,
      organizationId: newOrg.id,
      role: 'OWNER',
    },
  })

  const tenant = await getTenantContext(session.user.id, newOrg.id)

  await logAuditEvent({
    tenant,
    action: 'organization.created',
    resourceType: 'organization',
    resourceId: newOrg.id,
    metadata: { name: newOrg.name, slug: newOrg.slug },
  })

  return NextResponse.json({ workspace: newOrg }, { status: 201 })
}
