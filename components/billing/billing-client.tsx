'use client'

import { useState, useEffect } from 'react'
import { Check, ShieldCheck, Zap, CreditCard, ArrowUpRight, AlertTriangle, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function BillingClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')

  const fetchBilling = async () => {
    try {
      const res = await fetch('/api/billing')
      const json = await res.json()
      if (res.ok) {
        setData(json)
      } else {
        toast.error(json.error || 'Failed to load billing details')
      }
    } catch {
      toast.error('Network error loading billing data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBilling()
  }, [])

  const handleCheckout = async (planSlug: string) => {
    setActionLoading(planSlug)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout', planSlug, billingCycle: cycle }),
      })
      const json = await res.json()
      if (res.ok) {
        // Redirect to Stripe checkout or handle mock checkout
        if (json.url) {
          window.location.href = json.url
        } else {
          toast.success(`Redirecting to checkout for ${planSlug.toUpperCase()} plan...`)
          fetchBilling()
        }
      } else {
        toast.error(json.error || 'Failed to initiate checkout')
      }
    } catch {
      toast.error('Failed to start checkout')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription at the end of the current billing cycle? Access will remain active until the period ends.')) return

    setActionLoading('cancel')
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      const json = await res.json()
      if (res.ok) {
        toast.success('Subscription will be canceled at period end.')
        fetchBilling()
      } else {
        toast.error(json.error || 'Failed to cancel subscription')
      }
    } catch {
      toast.error('Failed to cancel subscription')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    )
  }

  const { subscription, plans = [], invoices = [], usage, role } = data || {}
  const currentPlan = subscription?.plan || { name: 'Free', slug: 'free' }
  const isOwnerOrAdmin = role === 'OWNER' || role === 'ADMIN'

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-card/80 via-card/50 to-muted/20 border border-border/60 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
                Current Plan
              </span>
              {subscription?.cancelAtPeriodEnd && (
                <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-md">
                  Cancels at period end
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{currentPlan.name} Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organization isolation with enterprise security & high information density.
            </p>
          </div>

          {isOwnerOrAdmin && currentPlan.slug !== 'free' && !subscription?.cancelAtPeriodEnd && (
            <button
              onClick={handleCancelSubscription}
              disabled={actionLoading === 'cancel'}
              className="text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 px-4 py-2 rounded-xl transition-all"
            >
              {actionLoading === 'cancel' ? 'Canceling...' : 'Cancel Subscription'}
            </button>
          )}
        </div>

        {/* Usage Bar & Warnings */}
        <div className="space-y-2 pt-4 border-t border-border/40">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-muted-foreground">Monthly AI Query Usage</span>
            <span className="text-foreground">
              {usage?.current ?? 0} / {usage?.limit === -1 ? 'Unlimited' : (usage?.limit ?? 100)} used ({usage?.percentage ?? 0}%)
            </span>
          </div>

          <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all rounded-full ${
                (usage?.percentage ?? 0) >= 100
                  ? 'bg-destructive'
                  : (usage?.percentage ?? 0) >= 80
                  ? 'bg-yellow-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, usage?.percentage ?? 0)}%` }}
            />
          </div>

          {(usage?.percentage ?? 0) >= 80 && (
            <div className="flex items-center gap-2 text-xs text-yellow-400 pt-1">
              <AlertTriangle size={14} />
              <span>
                {(usage?.percentage ?? 0) >= 100
                  ? 'Limit reached! Upgrade your plan to continue asking database questions.'
                  : 'Usage warning: You have reached 80%+ of your monthly query limit.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Selector / Pricing Table */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-foreground">Available Plans</h3>
          <div className="bg-muted/50 p-1 rounded-xl border border-border/50 flex items-center gap-1">
            <button
              onClick={() => setCycle('monthly')}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                cycle === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle('yearly')}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                cycle === 'yearly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p: any) => {
            const isCurrent = currentPlan.slug === p.slug
            const price = cycle === 'yearly' ? p.priceYearly / 12 : p.priceMonthly

            return (
              <div
                key={p.id}
                className={`bg-card/40 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isCurrent ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-indigo-500/5' : 'border-border/50 hover:border-border'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-foreground">{p.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 min-h-[32px]">{p.description}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-black text-foreground">${price}</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check size={12} className="text-indigo-400 flex-shrink-0" />
                      <span>{p.limits?.AI_QUERY === -1 ? 'Unlimited' : p.limits?.AI_QUERY} AI Queries</span>
                    </li>
                    <li className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check size={12} className="text-indigo-400 flex-shrink-0" />
                      <span>{p.limits?.DATABASE_CONNECTION === -1 ? 'Unlimited' : p.limits?.DATABASE_CONNECTION} DB Connections</span>
                    </li>
                    {p.entitlements?.map((ent: any) => (
                      <li key={ent.id} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Check size={12} className="text-indigo-400 flex-shrink-0" />
                        <span className="capitalize">{ent.featureKey.replace('_', ' ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isOwnerOrAdmin && (
                  <button
                    onClick={() => handleCheckout(p.slug)}
                    disabled={isCurrent || actionLoading === p.slug}
                    className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-muted/40 text-muted-foreground cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {actionLoading === p.slug ? 'Redirecting...' : isCurrent ? 'Current Plan' : `Continue to Checkout`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <FileText size={16} className="text-muted-foreground" />
            Billing Invoices
          </h3>
        </div>

        {invoices.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No invoices generated yet for this organization.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {invoices.map((inv: any) => (
              <div key={inv.id} className="px-6 py-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-foreground">{inv.number}</p>
                  <p className="text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-foreground">${inv.amount} {inv.currency}</span>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-md uppercase">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
