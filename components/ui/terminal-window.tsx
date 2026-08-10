import React from 'react'
import { Terminal, Shield, CheckCircle2, Circle } from 'lucide-react'

interface TerminalWindowProps {
  title?: string
  status?: string
  variant?: 'default' | 'emerald' | 'cyan' | 'indigo'
  children: React.ReactNode
  className?: string
  headerExtra?: React.ReactNode
}

export function TerminalWindow({
  title = 'internite-ai@production',
  status = 'LIVE_CONNECTION',
  variant = 'default',
  children,
  className = '',
  headerExtra,
}: TerminalWindowProps) {
  const getBorderGlow = () => {
    switch (variant) {
      case 'emerald':
        return 'border-emerald-500/30 shadow-emerald-500/10'
      case 'cyan':
        return 'border-cyan-500/30 shadow-cyan-500/10'
      case 'indigo':
        return 'border-indigo-500/30 shadow-indigo-500/10'
      default:
        return 'border-slate-800 shadow-slate-900/50'
    }
  }

  return (
    <div className={`relative bg-[#0A0D14]/95 backdrop-blur-xl border ${getBorderGlow()} rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111622]/90 border-b border-slate-800/80 font-mono text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold pl-2 border-l border-slate-800">
            <Terminal size={13} className="text-indigo-400" />
            <span className="text-slate-200">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {headerExtra}
          {status && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{status}</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-6 font-mono text-xs leading-relaxed text-slate-200">
        {children}
      </div>
    </div>
  )
}
