import { NewConnectionWizard } from '@/components/database/connection-wizard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connect Database — Internite AI',
}

export default function NewDatabasePage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Connect a database</h1>
        <p className="text-muted-foreground mt-1">
          Your credentials are encrypted at rest and never sent to the browser.
        </p>
      </div>
      <NewConnectionWizard />
    </div>
  )
}
