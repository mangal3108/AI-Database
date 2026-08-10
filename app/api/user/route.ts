import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 403 })

  let body: { email: string; password: string; name?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  return NextResponse.json({ error: 'Use /api/auth/register for signup' }, { status: 400 })
}
