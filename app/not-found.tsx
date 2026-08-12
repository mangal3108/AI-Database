import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Internite AI',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-black text-muted-foreground/20 mb-4">404</div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page not found
        </h1>

        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors inline-block"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
