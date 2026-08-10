import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Check, ShieldCheck, Zap, Database, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { SubscriptionService } from '@/server/services/billing/subscription-service'

export const metadata: Metadata = {
  title: 'Pricing — Internite AI',
}

async function getPricingPlans() {
  // Try to seed plans, but don't fail if DB schema is outdated
  try {
    await SubscriptionService.seedPlans()
  } catch (error) {
    console.warn('[Pricing] Could not seed plans - database may need migration:', error)
  }

  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      include: { entitlements: true },
      orderBy: { priceMonthly: 'asc' },
    })
    return plans
  } catch (error) {
    console.warn('[Pricing] Could not fetch plans:', error)
    return []
  }
}

export default async function PricingPage() {
  const plans = await getPricingPlans()

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Flexible Pricing for AI-Powered Data Intelligence
        </h1>
        <p className="text-muted-foreground text-lg">
          Query PostgreSQL, Neon, Supabase, MySQL, MongoDB, SQLite, and SQL Server in natural language with enterprise-grade isolation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {plans.map((p) => (
          <div key={p.id} className="bg-card/40 border border-border/60 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
            <div>
              <h2 className="text-xl font-bold mb-2">{p.name}</h2>
              <p className="text-xs text-muted-foreground mb-6 min-h-[40px]">{p.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">${p.priceMonthly}</span>
                <span className="text-sm text-muted-foreground">/month</span>
                {p.priceYearly > 0 && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ${Math.round(p.priceYearly / 12)}/mo billed annually
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {p.entitlements.map((e) => (
                  <div key={e.id} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{e.featureKey.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              {p.slug === 'free' ? (
                <Link
                  href="/signup"
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-border hover:border-foreground/20 transition-colors text-sm font-medium"
                >
                  Get Started Free
                </Link>
              ) : (
                <Link
                  href="/dashboard/billing"
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-sm font-medium text-white"
                >
                  Upgrade to {p.name}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/50 pt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Enterprise Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <ShieldCheck className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
            <p className="text-sm text-muted-foreground">Enterprise-grade security compliance</p>
          </div>
          <div className="text-center">
            <Zap className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">99.9% Uptime SLA</h3>
            <p className="text-sm text-muted-foreground">Guaranteed reliability for production workloads</p>
          </div>
          <div className="text-center">
            <Database className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Unlimited Connections</h3>
            <p className="text-sm text-muted-foreground">Scale without limits on Business plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
