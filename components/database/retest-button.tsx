'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RetestConnectionButtonProps {
  connectionId: string
}

export function RetestConnectionButton({ connectionId }: RetestConnectionButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const router = useRouter()

  const handleRetest = async () => {
    setState('loading')
    try {
      const res = await fetch(`/api/databases/${connectionId}/test`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setState('success')
        // Refresh the page to show updated status
        router.refresh()
      } else {
        setState('error')
        setTimeout(() => setState('idle'), 3000)
      }
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleRetest}
      disabled={state === 'loading'}
      className={`mt-2.5 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all border ${
        state === 'success'
          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
          : state === 'error'
          ? 'text-red-400 border-red-500/30 bg-red-500/10'
          : 'text-slate-400 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white'
      } disabled:opacity-60`}
    >
      {state === 'loading' ? (
        <>
          <RefreshCw size={11} className="animate-spin" />
          <span>Retesting...</span>
        </>
      ) : state === 'success' ? (
        <>
          <CheckCircle2 size={11} />
          <span>Connected!</span>
        </>
      ) : state === 'error' ? (
        <>
          <XCircle size={11} />
          <span>Still failing</span>
        </>
      ) : (
        <>
          <RefreshCw size={11} />
          <span>Re-test Connection</span>
        </>
      )}
    </button>
  )
}
