'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2, Loader2, Shield } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to send reset email')
      }
      setStatus('sent')
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="bg-[#0D111A]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-5">
            <span className="font-extrabold text-2xl tracking-tight select-none font-sans">
              <span className="text-white">INTERN</span>
              <span className="text-[#60A5FA]">ITE</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#60A5FA] border border-[#60A5FA]/30">AI</span>
          </Link>

          {status === 'sent' ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Check your inbox</h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                If <span className="text-slate-200 font-medium">{email}</span> is registered,
                we have sent a password reset link. It expires in 15 minutes.
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Did not receive it? Check your spam folder or{' '}
                <button onClick={() => setStatus('idle')} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline-offset-2 hover:underline">
                  try again
                </button>.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset your password</h1>
              <p className="text-sm text-slate-400 mt-1.5 font-medium">
                Enter your account email and we will send a reset link.
              </p>
            </>
          )}
        </div>

        {status !== 'sent' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200"
                  placeholder="you@company.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <><Loader2 size={16} className="animate-spin" /> Sending reset link...</>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 font-medium transition-colors">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-xs font-medium">
        <Shield size={12} className="text-indigo-400" />
        Reset links are single-use and expire in 15 minutes.
      </div>
    </motion.div>
  )
}