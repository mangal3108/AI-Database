'use client'

import { Database, Zap, Brain, PanelLeft, PanelRight, RefreshCw } from 'lucide-react'

interface ChatHeaderProps {
  databases?: { id: string; name: string; type: string; status: string }[]
  selectedDbId?: string
  onSelectDb?: (id: string) => void
  mode?: 'fast' | 'deep'
  onToggleMode?: (mode: 'fast' | 'deep') => void
  showLeftSidebar?: boolean
  onToggleLeftSidebar?: () => void
  showRightSidebar?: boolean
  onToggleRightSidebar?: () => void
}

export function ChatHeader({
  databases = [],
  selectedDbId = '',
  onSelectDb,
  mode = 'deep',
  onToggleMode,
  showLeftSidebar = true,
  onToggleLeftSidebar,
  showRightSidebar = true,
  onToggleRightSidebar,
}: ChatHeaderProps) {
  const currentDb = databases.find(d => d.id === selectedDbId) ?? databases[0]

  return (
    <div className="h-14 px-4 bg-[#090D14] border-b border-slate-800/80 flex items-center justify-between font-sans text-xs shrink-0 select-none">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLeftSidebar}
          className={`p-1.5 rounded-lg border transition-colors ${
            showLeftSidebar ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Sidebar"
        >
          <PanelLeft size={15} />
        </button>

        {/* Database selector dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200">
          <Database size={14} className="text-indigo-400 shrink-0" />
          <select
            value={selectedDbId}
            onChange={e => onSelectDb?.(e.target.value)}
            className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-1"
          >
            <option value="" className="bg-slate-900 text-slate-300">Select Database...</option>
            {databases.map(db => (
              <option key={db.id} value={db.id} className="bg-slate-900 text-white">
                ● {db.name} ({db.type})
              </option>
            ))}
          </select>
          {currentDb && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              READY
            </span>
          )}
        </div>
      </div>




      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Fast vs Deep Mode Toggle */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => onToggleMode?.('fast')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              mode === 'fast'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Fast Mode: Instant response for straightforward questions"
          >
            <Zap size={12} className={mode === 'fast' ? 'text-amber-400' : ''} />
            <span>Fast</span>
          </button>
          <button
            onClick={() => onToggleMode?.('deep')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              mode === 'deep'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Deep Mode: Multi-table graph reasoning + RAG context"
          >
            <Brain size={12} />
            <span>Deep</span>
          </button>
        </div>

        <button
          onClick={onToggleRightSidebar}
          className={`p-1.5 rounded-lg border transition-colors ${
            showRightSidebar ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Schema Inspector"
        >
          <PanelRight size={15} />
        </button>
      </div>
    </div>
  )
}
