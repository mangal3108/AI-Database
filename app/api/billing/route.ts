import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SubscriptionService } from '@/server/services/billing/subscription-service'
import { UsageService } from '@/server/services/billing/usage-service'
import { InvoiceService } from '@/server/services/billing/invoice-service'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const organizationId = membership.organizationId

    // Ensure default plans exist safely
    try {
      await SubscriptionService.seedPlans()
    } catch {
      // Continue if seeding already ran
    }

    // Fetch data with error handling
    let plans: Array<{ id: string; name: string; slug: string; priceMonthly: number; priceYearly: number; currency: string; entitlements: Array<{ featureKey: string; value: string }> }> = []
    try {
      plans = await prisma.plan.findMany({ where: { isActive: true }, include: { entitlements: true } })
      console.log('[BILLING] Plans fetched:', plans?.length ?? 0)
    } catch (planErr) {
      console.error('[BILLING] Error fetching plans:', planErr)
      plans = []
    }

    let subscription = null
    try {
      subscription = await SubscriptionService.getSubscription(organizationId)
    } catch (subErr) {
      console.error('[BILLING] Error fetching subscription:', subErr)
      subscription = null
    }

    let invoices: Array<{ id: string; number: string; amount: number; status: string }> = []
    try {
      invoices = await InvoiceService.listInvoices(organizationId)
    } catch (invErr) {
      console.error('[BILLING] Error fetching invoices:', invErr)
      invoices = []
    }

    // Get current usage metrics
    const limits = (subscription?.plan?.limits as Record<string, number>) || { AI_QUERY: 100 }
    const usageStatus = await UsageService.getUsageStatus(organizationId, 'AI_QUERY', limits.AI_QUERY ?? 100)

    return NextResponse.json({
      subscription,
      plans,
      invoices,
      usage: usageStatus,
      role: membership.role,
    })
  } catch (err) {
    console.error('GET /api/billing error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * Billing API - Server-side only operations
 *
 * SECURITY: Only checkout, cancel, and resume actions are allowed from frontend.
 * Paid plan activation MUST happen through verified payment provider webhooks.
 * The 'activate' action is disabled to prevent subscription bypass attacks.
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  })

  if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Only Organization Owners or Admins can modify billing.' }, { status: 403 })
  }

  const body = await req.json()
  const { action, planSlug, billingCycle } = body

  if (action === 'checkout') {
    // Validate plan exists and is active
    const plan = await prisma.plan.findFirst({
      where: { slug: planSlug, isActive: true },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Free plans don't need checkout
    if (plan.priceMonthly === 0 && plan.priceYearly === 0) {
      return NextResponse.json({ error: 'Free plan does not require checkout' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const checkout = await SubscriptionService.createCheckoutSession({
      organizationId: membership.organizationId,
      planSlug,
      billingCycle: billingCycle ?? 'monthly',
      successUrl: `${origin}/dashboard/billing?success=true`,
      cancelUrl: `${origin}/dashboard/billing?canceled=true`,
    })

    return NextResponse.json(checkout)
  }

  // SECURITY: 'activate' action is REMOVED
  // Paid subscriptions can ONLY be activated through verified payment webhooks
  // This prevents subscription bypass attacks

  if (action === 'cancel') {
    const canceled = await SubscriptionService.cancelSubscription(membership.organizationId)
    return NextResponse.json({ success: true, subscription: canceled })
  }

  if (action === 'resume') {
    const resumed = await SubscriptionService.resumeSubscription(membership.organizationId)
    return NextResponse.json({ success: true, subscription: resumed })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
