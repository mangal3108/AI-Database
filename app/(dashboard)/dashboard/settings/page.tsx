import type { Metadata } from 'next'
import { User, Shield, Building2, Key, Zap } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Settings — Internite AI' }

export default async function SettingsPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
  })

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Workspace Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage profile details, team workspace, security controls, and API access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Account Profile</h3>
              <p className="text-xs text-slate-400">Personal details and preferences</p>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Name</label>
              <input type="text" readOnly value={session?.user?.name ?? ''} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address</label>
              <input type="email" readOnly value={session?.user?.email ?? ''} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
            </div>
          </div>
        </div>

        {/* Organization / Workspace */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Active Organization</h3>
              <p className="text-xs text-slate-400">Workspace multi-tenancy controls</p>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Organization Name</label>
              <input type="text" readOnly value={membership?.organization.name ?? 'Default Organization'} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 font-medium">Subscription Tier:</span>
              <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">{membership?.organization.plan ?? 'FREE'}</span>
            </div>
          </div>
        </div>

        {/* Security & Sessions */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security & Encryption</h3>
              <p className="text-xs text-slate-400">Password & encrypted connection policy</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Database credentials are encrypted using server-side AES-256-GCM. SQL execution runs exclusively in READ-ONLY mode.
          </p>
          <button className="text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white px-4 py-2 rounded-xl transition-colors">
            Manage Password
          </button>
        </div>

        {/* API Credentials */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">API Keys & Tokens</h3>
              <p className="text-xs text-slate-400">REST API access keys</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Generate secure tokens to query your databases programmatically via the Internite AI SDK.
          </p>
          <button className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-colors">
            Create API Key
          </button>
        </div>
      </div>
    </div>
  )
}
