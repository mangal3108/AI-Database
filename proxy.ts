import { NextRequest, NextResponse } from 'next/server'

// Auth enforcement happens inside API routes and page server components.
// The proxy only handles simple request routing without the Prisma edge runtime issue.

const PUBLIC_PATHS = ['/', '/login', '/signup']
const API_PUBLIC = ['/api/auth']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Static files — always allow
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  // Public API routes
  if (API_PUBLIC.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // All other API routes pass through — auth is handled inside each route
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Dashboard routes: let Next.js server components handle auth redirect
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

export default proxy
