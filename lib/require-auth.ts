/**
 * AUTH HELPERS — Internite AI
 *
 * Server-side authentication and authorization helpers.
 * Use these in Server Components and Route Handlers.
 */

import { auth } from './auth'
import { prisma } from './prisma'
import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

export interface AuthResult {
  session: Session
  userId: string
}

export interface AdminResult {
  session: Session
  userId: string
  isPlatformAdmin: boolean
}

/**
 * Require authenticated user - returns session or throws 401
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new AuthError('Unauthorized', 401)
  }

  return {
    session,
    userId: session.user.id,
  }
}

/**
 * Require platform admin - returns session or throws 403
 */
export async function requirePlatformAdmin(): Promise<AdminResult> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new AuthError('Unauthorized', 401)
  }

  // Check if user is a platform admin
  const isPlatformAdmin = await checkIsPlatformAdmin(session.user.id)

  if (!isPlatformAdmin) {
    throw new AuthError('Forbidden: Platform admin access required', 403)
  }

  return {
    session,
    userId: session.user.id,
    isPlatformAdmin,
  }
}

/**
 * Check if user is a platform admin
 * Platform admins are stored in PlatformAdmin table
 */
export async function checkIsPlatformAdmin(userId: string): Promise<boolean> {
  try {
    const admin = await prisma.platformAdmin.findUnique({
      where: { userId },
    })
    return !!admin
  } catch {
    // If PlatformAdmin table doesn't exist, check env var (legacy support)
    const adminEmails = process.env.PLATFORM_ADMIN_EMAILS?.split(',') ?? []
    if (adminEmails.length === 0) return false

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    return !!user?.email && adminEmails.includes(user.email)
  }
}

/**
 * Custom auth error with status code
 */
export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Get current user session (returns null if not authenticated)
 */
export async function getSession(): Promise<Session | null> {
  return auth()
}

/**
 * Get current user ID (returns null if not authenticated)
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}
