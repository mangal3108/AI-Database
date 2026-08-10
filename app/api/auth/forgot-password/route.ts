import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.toLowerCase().trim()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Always return 200 — never reveal whether email exists (prevents enumeration)
  // In production: generate a signed reset token, store it, and send via email service
  const user = await prisma.user.findUnique({ where: { email } })

  if (user?.passwordHash) {
    // TODO: send password reset email using your preferred email service
    // e.g. Resend, SendGrid, Nodemailer
    // For now, log the intent (remove in production)
    console.log('[forgot-password] Reset requested for:', email)
  }

  return NextResponse.json({ ok: true })
}