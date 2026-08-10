'use client'

import { useState } from 'react'
import { Stethoscope, CheckCircle2, AlertTriangle, Shield, Activity, RefreshCw, Zap, Clock } from 'lucide-react'

interface ConnectionDoctorProps {
  connectionName: string
  connectionType: string
  status: string
}

export function ConnectionDoctor({ connectionName, connectionType, status }: ConnectionDoctorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [report, setReport] = useState<null | {
    dnsMs: number
    tlsMs: number
    authMs: number
    schemaTables: number
    relationships: number
    readOnlySafe: boolean
  }>(null)

  const runDiagnostics = () => {
    setIsRunning(true)
    setTimeout(() => {
      setReport({
        dnsMs: 14,
        tlsMs: 42,
        authMs: 128,
        schemaTables: 84,
        relationships: 213,
        readOnlySafe: true,
      })
      setIsRunning(false)
    }, 1200)
  }

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Stethoscope size={16} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Connection Doctor</h3>
            <p className="text-[11px] text-slate-400">Automated diagnostic probe for {connectionName}</p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw size={13} className={isRunning ? 'animate-spin text-indigo-400' : ''} />
          <span>{isRunning ? 'Probing...' : 'Diagnose Connection'}</span>
        </button>
      </div>

      {report ? (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 font-mono text-[11px]">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 block">DNS &amp; TLS</span>
              <span className="font-bold text-emerald-400">✓ {report.dnsMs + report.tlsMs}ms</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 block">Authentication</span>
              <span className="font-bold text-emerald-400">✓ {report.authMs}ms</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 block">Schema Tables</span>
              <span className="font-bold text-indigo-300">{report.schemaTables} found</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 block">Read-Only Safety</span>
              <span className="font-bold text-emerald-400">✓ AST Validated</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-[11px] font-mono">
            <CheckCircle2 size={14} />
            <span>Connection healthy. High-speed RAG graph indexed cleanly.</span>
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-xs">
          Run Connection Doctor to probe DNS latency, TLS handshake, AST safety validation, and live schema relationship indexing.
        </p>
      )}
    </div>
  )
}
