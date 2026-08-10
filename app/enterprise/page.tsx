import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { EnterpriseForm } from '@/components/marketing/sections/enterprise-form'
import { Shield, Users, Lock, Activity, CreditCard, Key, Globe, Headphones, Building2 } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Enterprise — AI Database Intelligence at Scale',
  description: 'Built for serious teams. Organization isolation, role-based access, audit logging, custom limits, dedicated support, and enterprise-grade security.',
  path: '/enterprise',
  keywords: ['enterprise', 'team management', 'role-based access', 'audit logging', 'organization security'],
})

const ENTERPRISE_FEATURES = [
  {
    icon: Shield,
    title: 'Organization Isolation',
    description: 'Every database, query, and conversation is scoped to your organization. Data cannot be accessed across organizations.',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Invite team members, set roles, and manage permissions at the organization and workspace level.',
  },
  {
    icon: Lock,
    title: 'Role-Based Access Control',
    description: 'Define custom roles with granular permissions. Control who can connect databases, run queries, or manage settings.',
  },
  {
    icon: Activity,
    title: 'Audit Logging',
    description: 'Track every query, user action, and system event with a comprehensive audit trail. Export for compliance.',
  },
  {
    icon: CreditCard,
    title: 'Usage Controls',
    description: 'Set query limits per user, workspace, or organization. Monitor usage and manage billing at scale.',
  },
  {
    icon: Key,
    title: 'API Key Management',
    description: 'Programmatic access with granular API keys. IP allowlisting, expiration, and per-key rate limits.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Priority support with dedicated Slack channel, SLA guarantees, and technical onboarding assistance.',
  },
  {
    icon: Building2,
    title: 'Custom Deployments',
    description: 'Private cloud and on-premise options available for regulated industries and custom infrastructure requirements.',
  },
]

export default function EnterprisePage() {
  return (
    <MarketingLayout>
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
              <span className="text-xs font-medium text-purple-400">Enterprise</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              AI access to your data,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                built for serious teams.
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Organization isolation, role-based access, audit logging, and enterprise-grade security for teams that need more.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {ENTERPRISE_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50"
              >
                <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mb-20">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Talk to our sales team about enterprise pricing, custom deployments, and dedicated support options.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <EnterpriseForm />
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
