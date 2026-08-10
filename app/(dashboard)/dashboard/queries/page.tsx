import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Saved Queries — Internite AI' }

export default function QueriesPage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Saved Queries</h1>
      <p className="text-muted-foreground">Your bookmarked queries will appear here.</p>
    </div>
  )
}
