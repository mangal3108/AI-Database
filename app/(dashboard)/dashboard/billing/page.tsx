import { BillingClient } from '@/components/billing/billing-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing & Subscriptions — Internite AI',
}

export default function BillingPage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage plans, usage limits, entitlements, and invoices.</p>
      </div>

      <BillingClient />
    </div>
  )
}
