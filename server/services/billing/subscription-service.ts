import { prisma } from '@/lib/prisma'
import { getPaymentGateway, CreateCheckoutParams } from './payment-gateway'

export class SubscriptionService {
  /**
   * Initialize default plans in database if missing.
   */
  static async seedPlans(): Promise<void> {
    const defaultPlans = [
      {
        name: 'Free',
        slug: 'free',
        description: 'Perfect for exploring Internite AI capabilities on small databases.',
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'USD',
        limits: {
          AI_QUERY: 100,
          DATABASE_CONNECTION: 1,
          RAG_DOCUMENT: 5,
          STORAGE: 50,
        },
        entitlements: [
          { featureKey: 'basic_chat', value: 'true' },
          { featureKey: 'advanced_rag', value: 'false' },
          { featureKey: 'api_access', value: 'false' },
        ],
      },
      {
        name: 'Starter',
        slug: 'starter',
        description: 'For solo developers and small teams querying production databases.',
        priceMonthly: 29,
        priceYearly: 290,
        currency: 'USD',
        limits: {
          AI_QUERY: 2500,
          DATABASE_CONNECTION: 5,
          RAG_DOCUMENT: 50,
          STORAGE: 500,
        },
        entitlements: [
          { featureKey: 'basic_chat', value: 'true' },
          { featureKey: 'advanced_rag', value: 'true' },
          { featureKey: 'api_access', value: 'true' },
        ],
      },
      {
        name: 'Pro',
        slug: 'pro',
        description: 'For growing data teams requiring high volume AI queries and custom models.',
        priceMonthly: 79,
        priceYearly: 790,
        currency: 'USD',
        limits: {
          AI_QUERY: 10000,
          DATABASE_CONNECTION: 20,
          RAG_DOCUMENT: 250,
          STORAGE: 2500,
        },
        entitlements: [
          { featureKey: 'basic_chat', value: 'true' },
          { featureKey: 'advanced_rag', value: 'true' },
          { featureKey: 'api_access', value: 'true' },
          { featureKey: 'webhooks', value: 'true' },
        ],
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Unlimited capacity, enterprise SLA, custom RAG pipelines & dedicated support.',
        priceMonthly: 199,
        priceYearly: 1990,
        currency: 'USD',
        limits: {
          AI_QUERY: -1,
          DATABASE_CONNECTION: -1,
          RAG_DOCUMENT: -1,
          STORAGE: -1,
        },
        entitlements: [
          { featureKey: 'basic_chat', value: 'true' },
          { featureKey: 'advanced_rag', value: 'true' },
          { featureKey: 'api_access', value: 'true' },
          { featureKey: 'webhooks', value: 'true' },
          { featureKey: 'sso', value: 'true' },
        ],
      },
    ]

    for (const p of defaultPlans) {
      const existing = await prisma.plan.findUnique({ where: { slug: p.slug } })
      if (!existing) {
        const created = await prisma.plan.create({
          data: {
            name: p.name,
            slug: p.slug,
            description: p.description,
            priceMonthly: p.priceMonthly,
            priceYearly: p.priceYearly,
            currency: p.currency,
            limits: p.limits,
          },
        })

        for (const ent of p.entitlements) {
          await prisma.planEntitlement.create({
            data: {
              planId: created.id,
              featureKey: ent.featureKey,
              value: ent.value,
            },
          })
        }
      }
    }
  }

  /**
   * Get active subscription & plan details for an organization.
   */
  static async getSubscription(organizationId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { organizationId, status: { in: ['ACTIVE', 'TRIALING'] } },
      include: { plan: { include: { entitlements: true } } },
      orderBy: { createdAt: 'desc' },
    })

    if (!sub) {
      const freePlan = (await prisma.plan.findUnique({
        where: { slug: 'free' },
        include: { entitlements: true },
      })) ?? {
        id: 'plan_free_default',
        name: 'Free',
        slug: 'free',
        description: 'Perfect for exploring Internite AI capabilities on small databases.',
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'USD',
        isActive: true,
        limits: { AI_QUERY: 100, DATABASE_CONNECTION: 1, RAG_DOCUMENT: 5, STORAGE: 50 },
        createdAt: new Date(),
        updatedAt: new Date(),
        entitlements: [{ id: 'ent_1', planId: 'plan_free_default', featureKey: 'basic_chat', value: 'true', createdAt: new Date() }],
      }

      return {
        id: 'sub_free',
        organizationId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        plan: freePlan,
      }
    }

    return sub
  }

  /**
   * Create Checkout Session for upgrade/downgrade.
   */
  static async createCheckoutSession(params: CreateCheckoutParams) {
    return getPaymentGateway().createCheckoutSession(params)
  }

  /**
   * Activate or change plan subscription.
   */
  static async activateSubscription(organizationId: string, planSlug: string) {
    const plan = await prisma.plan.findUnique({ where: { slug: planSlug } })
    if (!plan) throw new Error(`Plan not found: ${planSlug}`)

    const now = new Date()
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Update organization plan enum
    await prisma.organization.update({
      where: { id: organizationId },
      data: { plan: planSlug.toUpperCase() as any },
    })

    // Upsert subscription record
    const existingSub = await prisma.subscription.findFirst({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    })

    if (existingSub) {
      return prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
      })
    } else {
      return prisma.subscription.create({
        data: {
          organizationId,
          planId: plan.id,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      })
    }
  }

  /**
   * Cancel subscription at period end (preserves paid access until period ends).
   */
  static async cancelSubscription(organizationId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { organizationId, status: 'ACTIVE' },
    })

    if (!sub) throw new Error('No active subscription found')

    return prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    })
  }

  /**
   * Resume a canceled subscription before period end.
   */
  static async resumeSubscription(organizationId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { organizationId },
    })

    if (!sub) throw new Error('No subscription found')

    return prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    })
  }
}
