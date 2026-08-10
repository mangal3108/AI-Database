import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const records = await prisma.usageRecord.findMany({
    where: { organizationId: membership.organizationId },
  })

  const metrics: Record<string, number> = {}
  for (const r of records) {
    metrics[r.metric] = (metrics[r.metric] || 0) + r.value
  }

  return NextResponse.json({ metrics })
}
