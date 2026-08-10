'use client'

import { useState, useTransition } from 'react'
import { User, Shield, Building2, Key, Webhook, Eye, EyeOff, ChevronRight, Loader2, Check, AlertCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwStatus, setPwStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [pwMessage, setPwMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const handlePasswordSave = () => {
    if (!currentPw || !newPw || !confirmPw) {
      setPwStatus('error')
      setPwMessage('Please fill in all fields.')
      return
    }
    if (newPw.length < 8) {
      setPwStatus('error')
      setPwMessage('New password must be at least 8 characters.')
      return
    }
    if (newPw !== confirmPw) {
      setPwStatus('error')
      setPwMessage('New passwords do not match.')
      return
    }
    startTransition(async () => {
      try {
        const res = await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Failed to update password')
        }
        setPwStatus('success')
        setPwMessage('Password updated successfully.')
        setCurrentPw('')
        setNewPw('')
        setConfirmPw('')
        setTimeout(() => { setShowPasswordForm(false); setPwStatus('idle') }, 2000)
      } catch (err: unknown) {
        setPwStatus('error')
        setPwMessage(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Workspace Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage profile details, team workspace, security controls, and API access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Profile */}
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
              <input type="text" readOnly value={session?.user?.name ?? ''} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 cursor-default" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address</label>
              <input type="email" readOnly value={session?.user?.email ?? ''} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 cursor-default" />
            </div>
          </div>
        </div>

        {/* Active Organization */}
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
              <input type="text" readOnly value="Mangal Bhadouriya's Workspace" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 cursor-default" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 font-medium">Subscription Tier:</span>
              <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">FREE</span>
            </div>
            <Link href="/dashboard/billing" className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Upgrade plan <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Security & Encryption */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security &amp; Encryption</h3>
              <p className="text-xs text-slate-400">Password &amp; encrypted connection policy</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Database credentials are encrypted using server-side AES-256-GCM. SQL execution runs exclusively in READ-ONLY mode.
          </p>

          {!showPasswordForm ? (
            <button
              onClick={() => { setShowPasswordForm(true); setPwStatus('idle') }}
              className="text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 px-4 py-2 rounded-xl transition-all"
            >
              Manage Password
            </button>
          ) : (
            <div className="space-y-3">
              {/* Current password */}
              <div className="relative">
                <label className="block text-xs text-slate-400 font-medium mb-1">Current Password</label>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none pr-10"
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-7 text-slate-500 hover:text-slate-300">
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {/* New password */}
              <div className="relative">
                <label className="block text-xs text-slate-400 font-medium mb-1">New Password</label>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="min. 8 characters"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none pr-10"
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-7 text-slate-500 hover:text-slate-300">
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {/* Confirm password */}
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none"
                />
              </div>

              {/* Status message */}
              {pwStatus !== 'idle' && (
                <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${pwStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {pwStatus === 'success' ? <Check size={12} /> : <AlertCircle size={12} />}
                  {pwMessage}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handlePasswordSave}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2 rounded-xl transition-all"
                >
                  {isPending && <Loader2 size={12} className="animate-spin" />}
                  {isPending ? 'Saving...' : 'Save Password'}
                </button>
                <button
                  onClick={() => { setShowPasswordForm(false); setPwStatus('idle'); setCurrentPw(''); setNewPw(''); setConfirmPw('') }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* API Keys */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">API Keys &amp; Tokens</h3>
              <p className="text-xs text-slate-400">REST API access keys</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Generate secure tokens to query your databases programmatically via the Internite AI SDK.
          </p>
          <div className="flex gap-2">
            <Link
              href="/dashboard/settings/api-keys"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all"
            >
              <Key size={13} />
              Manage API Keys
            </Link>
            <Link
              href="/dashboard/settings/webhooks"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white px-4 py-2 rounded-xl transition-all"
            >
              <Webhook size={13} />
              Webhooks
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}