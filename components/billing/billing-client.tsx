'use client'

import { useState, useEffect } from 'react'
import { Check, ShieldCheck, Zap, CreditCard, ArrowUpRight, AlertTriangle, FileText, Loader2, Sparkles, Database, Clock } from 'lucide-react'
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
        if (json.url) {
          window.location.assign(json.url)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 font-sans text-xs text-slate-500">
        <Loader2 className="animate-spin text-indigo-400 mr-2" size={18} />
        Loading billing details...
      </div>
    )
  }

  const { subscription, plans = [], invoices = [], usage, role } = data || {}
  const currentPlan = subscription?.plan || { name: 'Free', slug: 'free' }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans text-slate-100">
      {/* Current Plan Apple Card */}
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              CURRENT SUBSCRIPTION
            </span>
            <h2 className="text-2xl font-black text-white">{currentPlan.name} Plan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Renews automatically on {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'Next Billing Cycle'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-white font-mono">$29 <span className="text-xs text-slate-400 font-sans font-normal">/ mo</span></span>
          </div>
        </div>

        {/* Quota breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">AI Queries Quota</span>
            <span className="text-lg font-bold text-white font-mono">1,248 / 5,000</span>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-indigo-500 w-[25%]" />
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Databases Limit</span>
            <span className="text-lg font-bold text-white font-mono">Unlimited</span>
            <p className="text-[10px] text-emerald-400 mt-2 font-mono">✓ Read-only Safety active</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Visualizations</span>
            <span className="text-lg font-bold text-white font-mono">84 Charts</span>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">Auto-generated insight</p>
          </div>
        </div>
      </div>

      {/* Plan Tiers Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">AVAILABLE PLANS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { slug: 'free', name: 'Starter', price: '$0', desc: 'For testing and small databases', queries: '100 AI queries/mo' },
            { slug: 'pro', name: 'Pro', price: '$29', desc: 'For developers and growing teams', queries: '5,000 AI queries/mo', isPopular: true },
            { slug: 'enterprise', name: 'Enterprise', price: '$99', desc: 'For production data infrastructure', queries: 'Unlimited queries + dedicated RAG' },
          ].map(plan => {
            const isCurrent = currentPlan.slug === plan.slug
            return (
              <div
                key={plan.slug}
                className={`bg-[#111113] border rounded-2xl p-6 flex flex-col justify-between space-y-6 ${
                  plan.isPopular ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/5' : 'border-white/5'
                }`}
              >
                <div className="space-y-3">
                  {plan.isPopular && (
                    <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block">
                      POPULAR
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{plan.desc}</p>
                  <div className="text-2xl font-black text-white font-mono pt-2">{plan.price} <span className="text-xs text-slate-400 font-sans font-normal">/ mo</span></div>
                  <p className="text-xs text-slate-300 font-mono">✓ {plan.queries}</p>
                </div>

                <button
                  onClick={() => handleCheckout(plan.slug)}
                  disabled={isCurrent || actionLoading === plan.slug}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white/5 text-slate-400 border border-white/5 cursor-default'
                      : plan.isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {actionLoading === plan.slug ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    'Upgrade Plan →'
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
