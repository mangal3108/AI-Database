import { prisma } from '@/lib/prisma'

export interface EntitlementCheckResult {
  allowed: boolean
  reason?: string
  currentUsage?: number
  limit?: number
}

/**
 * Visualization feature keys for entitlement checks
 */
export const VISUALIZATION_FEATURES = {
  VISUALIZER: 'visualizer',
  ADVANCED_CHARTS: 'advanced_charts',
  EXPORT_CSV: 'export_csv',
  EXPORT_IMAGE: 'export_image',
  DASHBOARD_WIDGETS: 'dashboard_widgets',
  SCHEDULED_REPORTS: 'scheduled_reports',
  MAX_VISUALIZATIONS: 'max_visualizations',
} as const

/**
 * Visualization limits per plan
 */
export const VISUALIZATION_LIMITS = {
  FREE: {
    maxVisualizations: 5,
    chartTypes: ['BAR', 'LINE', 'TABLE'],
    exports: ['CSV'],
    dashboardWidgets: false,
  },
  STARTER: {
    maxVisualizations: 50,
    chartTypes: ['BAR', 'LINE', 'AREA', 'PIE', 'DONUT', 'TABLE', 'KPI', 'SCATTER'],
    exports: ['CSV', 'JSON'],
    dashboardWidgets: true,
  },
  PRO: {
    maxVisualizations: 200,
    chartTypes: ['BAR', 'LINE', 'AREA', 'PIE', 'DONUT', 'TABLE', 'KPI', 'SCATTER', 'STACKED_BAR', 'GROUPED_BAR'],
    exports: ['CSV', 'JSON', 'PNG', 'SVG'],
    dashboardWidgets: true,
  },
  BUSINESS: {
    maxVisualizations: -1, // unlimited
    chartTypes: ['BAR', 'LINE', 'AREA', 'PIE', 'DONUT', 'TABLE', 'KPI', 'SCATTER', 'STACKED_BAR', 'GROUPED_BAR', 'FUNNEL', 'GAUGE', 'HEATMAP', 'TREEMAP', 'RADAR', 'MAP'],
    exports: ['CSV', 'JSON', 'PNG', 'SVG', 'PDF', 'PPTX', 'EXCEL'],
    dashboardWidgets: true,
    scheduledReports: true,
  },
} as const

/**
 * PRODUCTION ENTITLEMENT SERVICE
 * Strictly evaluates organization plan limits, entitlements, and feature flags.
 * Never hardcodes `if (plan === "PRO")`.
 */
export class EntitlementService {
  /**
   * Require an entitlement for an organization. Throws Error if not allowed.
   */
  static async require(organizationId: string, featureKey: string, requestedQuantity = 1): Promise<void> {
    const check = await this.check(organizationId, featureKey, requestedQuantity)
    if (!check.allowed) {
      throw new Error(check.reason ?? `Organization lacks required entitlement: ${featureKey}`)
    }
  }

  /**
   * Check entitlement for an organization without throwing.
   */
  static async check(
    organizationId: string,
    featureKey: string,
    requestedQuantity = 1
  ): Promise<EntitlementCheckResult> {
    // 1. Check Global Feature Flag first
    const flag = await prisma.featureFlag.findUnique({
      where: { key: featureKey },
    })

    if (flag && !flag.isEnabled) {
      return { allowed: false, reason: `Feature ${featureKey} is disabled system-wide.` }
    }

    // 2. Fetch Active Subscription & Plan
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId, status: { in: ['ACTIVE', 'TRIALING'] } },
      include: { plan: { include: { entitlements: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // If no explicit subscription, fallback to default FREE plan
    const plan = subscription?.plan ?? await prisma.plan.findUnique({
      where: { slug: 'free' },
      include: { entitlements: true },
    })

    if (!plan) {
      // Emergency fallback if seed hasn't run
      return { allowed: true }
    }

    // 3. Check Plan Entitlement Table
    const entitlement = plan.entitlements.find(e => e.featureKey === featureKey)
    if (entitlement) {
      if (entitlement.value === 'false') {
        return { allowed: false, reason: `Plan ${plan.name} does not include ${featureKey}.` }
      }
    }

    // 4. Check Numeric Limits in Plan Json Limits
    const limits = (plan.limits as Record<string, number>) || {}
    if (featureKey in limits) {
      const limit = limits[featureKey]!
      if (limit !== -1) {
        // Query current monthly usage
        const period = new Date().toISOString().slice(0, 7) // YYYY-MM
        const usage = await prisma.usageRecord.findFirst({
          where: { organizationId, metric: featureKey, period },
        })

        const currentUsage = usage?.value ?? 0
        if (currentUsage + requestedQuantity > limit) {
          return {
            allowed: false,
            currentUsage,
            limit,
            reason: `Usage limit reached for ${featureKey}. (${currentUsage}/${limit})`,
          }
        }
      }
    }

    return { allowed: true }
  }
}
