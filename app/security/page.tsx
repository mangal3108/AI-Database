import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Shield, Lock, Eye, Server, Users, Key, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Security — Your Database Stays Yours',
  description: 'Learn how Internite AI protects your database credentials, ensures tenant isolation, and maintains enterprise-grade security for your data.',
  path: '/security',
  keywords: ['database security', 'credential encryption', 'tenant isolation', 'SQL safety', 'API security'],
})

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'Encrypted Credentials',
    status: 'implemented',
    description: 'All database credentials are encrypted using AES-256-GCM before storage. Encryption keys are managed server-side and never exposed to the browser.',
    details: ['AES-256-GCM encryption', 'HSM key management', 'Encrypted in transit and at rest'],
  },
  {
    icon: Eye,
    title: 'Browser-Safe Architecture',
    status: 'implemented',
    description: 'Database passwords and connection strings are never sent to the frontend. All query execution happens server-side with no credential exposure.',
    details: ['Zero credential exposure', 'Server-side only execution', 'No proxying credentials'],
  },
  {
    icon: Shield,
    title: 'Read-Only by Default',
    status: 'implemented',
    description: 'The AI query engine blocks DROP, DELETE, UPDATE, INSERT, TRUNCATE, ALTER, GRANT, and other destructive operations before execution.',
    details: ['SQL injection prevention', 'Whitelist validation', 'Admin opt-in for writes'],
  },
  {
    icon: Server,
    title: 'Tenant Isolation',
    status: 'implemented',
    description: 'Every database, query, conversation, and schema is scoped to your organization. Cross-tenant access is architecturally impossible.',
    details: ['Organization-level scoping', 'Database-level permissions', 'Query isolation'],
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    status: 'implemented',
    description: 'Define custom roles with specific permissions. Control who can connect databases, run queries, or manage settings.',
    details: ['Custom role definitions', 'Permission granularity', 'Team management'],
  },
  {
    icon: Key,
    title: 'API Key Security',
    status: 'implemented',
    description: 'API keys are hashed before storage, support IP allowlisting, and can be rotated without downtime.',
    details: ['SHA-256 hashing', 'IP restrictions', 'Instant rotation'],
  },
  {
    icon: FileText,
    title: 'Audit Logging',
    status: 'implemented',
    description: 'Every query, user action, and system event is logged with full context for compliance and debugging.',
    details: ['Query logging', 'User attribution', 'Export capabilities'],
  },
  {
    icon: Zap,
    title: 'Webhook Verification',
    status: 'implemented',
    description: 'All incoming webhooks are verified using HMAC signatures. Invalid payloads are rejected automatically.',
    details: ['HMAC-SHA256 verification', 'Timestamp validation', 'Replay attack prevention'],
  },
]

const COMPLIANCE_ITEMS = [
  { label: 'Encryption at rest', status: 'implemented' },
  { label: 'Encryption in transit', status: 'implemented' },
  { label: 'Multi-tenant isolation', status: 'implemented' },
  { label: 'Audit logging', status: 'implemented' },
  { label: 'API key management', status: 'implemented' },
  { label: 'SOC 2 Type II', status: 'planned' },
  { label: 'GDPR compliance tools', status: 'implemented' },
  { label: 'HIPAA eligibility', status: 'planned' },
]

export default function SecurityPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Your database stays yours.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Internite AI is built with security-first architecture. We treat your database credentials like nuclear launch codes.
          </p>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Security Architecture</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every security feature is implemented with production-grade engineering, not marketing claims.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SECURITY_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Table */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Compliance & Certifications</h2>
            <p className="text-slate-400">
              We are transparent about our security posture. Green means implemented. Yellow means planned.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Security Feature</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {COMPLIANCE_ITEMS.map((item) => (
                  <tr key={item.label} className="border-b border-slate-800/30 last:border-0">
                    <td className="px-6 py-4 text-sm text-slate-300">{item.label}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        item.status === 'implemented'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.status === 'implemented' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {item.status === 'implemented' ? 'Implemented' : 'Planned'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            Note: We do not claim certifications we have not obtained. SOC 2 Type II and HIPAA eligibility are planned but not yet certified.
          </p>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-12">Security Architecture</h2>
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <h4 className="text-sm font-medium text-white mb-1">Your Browser</h4>
                <p className="text-xs text-slate-500">HTTPS encrypted connection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-sm font-medium text-white mb-1">Internite Server</h4>
                <p className="text-xs text-slate-500">Query validation & execution</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 mx-auto mb-3 flex items-center justify-center">
                  <Server className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-sm font-medium text-white mb-1">Your Database</h4>
                <p className="text-xs text-slate-500">Credentials never exposed</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <div className="flex items-center justify-center gap-8 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> TLS 1.3
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Encrypted at Rest
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Zero Exposure
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
