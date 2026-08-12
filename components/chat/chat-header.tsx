'use client'

import { Database, Zap, PanelLeft, PanelRight } from 'lucide-react'

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
    <div className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between font-sans text-xs shrink-0 select-none">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLeftSidebar}
          className={`p-1.5 rounded-lg border transition-colors ${
            showLeftSidebar ? 'bg-slate-100 border-slate-200 text-slate-900' : 'border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle Sidebar"
        >
          <PanelLeft size={15} />
        </button>

        {/* Database selector dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-slate-900 shadow-sm">
          <Database size={14} className="text-indigo-600 shrink-0" />
          <select
            value={selectedDbId}
            onChange={e => onSelectDb?.(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer pr-1"
          >
            <option value="" className="bg-white text-slate-500">Select Database...</option>
            {databases.map(db => (
              <option key={db.id} value={db.id} className="bg-white text-slate-900">
                {db.status === 'CONNECTED' ? '●' : db.status === 'ERROR' ? '⚠' : '○'} {db.name} ({db.type})
              </option>
            ))}
          </select>
          {currentDb && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
              currentDb.status === 'CONNECTED'
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200 font-bold'
                : currentDb.status === 'ERROR'
                ? 'text-red-600 bg-red-50 border-red-200 font-bold'
                : 'text-amber-600 bg-amber-50 border-amber-200 font-bold'
            }`}>
              {currentDb.status === 'CONNECTED' ? 'READY' : currentDb.status}
            </span>
          )}
        </div>
      </div>





      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Fast vs Deep Mode Toggle */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 gap-1">
          <button
            onClick={() => onToggleMode?.('fast')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-[11px] transition-all ${
              mode === 'fast'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Fast Mode: Instant response for straightforward questions"
          >
            <Zap size={12} className={mode === 'fast' ? 'text-amber-500' : ''} />
            <span>Fast</span>
          </button>
          <button
            onClick={() => onToggleMode?.('deep')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-[11px] transition-all ${
              mode === 'deep'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Deep Mode: Multi-table graph reasoning + RAG context"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Deep</span>
          </button>
        </div>

        <button
          onClick={onToggleRightSidebar}
          className={`p-1.5 rounded-lg border transition-colors ${
            showRightSidebar ? 'bg-slate-100 border-slate-200 text-slate-900' : 'border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle Schema Inspector"
        >
          <PanelRight size={15} />
        </button>
      </div>
    </div>
  )
}
