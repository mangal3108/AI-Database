'use client'

import { useState } from 'react'
import { Database, Search, Table, Key, ChevronRight, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react'

interface SchemaTable {
  name: string
  rowCount?: number
  columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[]
}

interface SchemaInspectorProps {
  selectedDbName?: string
  dbType?: string
  tables?: SchemaTable[]
  isLoading?: boolean
  onInsertText?: (text: string) => void
}

export function SchemaInspector({
  selectedDbName = 'Production DB',
  dbType = 'PostgreSQL',
  tables = [],
  isLoading = false,
  onInsertText,
}: SchemaInspectorProps) {
  const [search, setSearch] = useState('')
  const [expandedTable, setExpandedTable] = useState<string | null>(tables[0]?.name ?? null)

  const filteredTables = tables.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full flex flex-col bg-[#0B0F17] border-l border-slate-800/80 font-sans text-xs">
      {/* Header / Health */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-xs">{selectedDbName}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            CONNECTED
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>{dbType} · {tables.length} tables</span>
          <span className="text-slate-500">Sync 4m ago</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tables & columns..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Schema Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>SCHEMA TABLES ({filteredTables.length})</span>
          {isLoading && <RefreshCw size={10} className="animate-spin" />}
        </div>

        {filteredTables.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {search ? 'No matching tables' : 'Select a connected database'}
          </div>
        ) : (
          filteredTables.map(t => {
            const isExpanded = expandedTable === t.name
            return (
              <div key={t.name} className="bg-slate-900/50 border border-slate-800/60 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedTable(isExpanded ? null : t.name)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-slate-800/40 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Table size={13} className="text-indigo-400 shrink-0" />
                    <span className="font-semibold text-slate-200 font-mono">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.rowCount !== undefined && (
                      <span className="text-[10px] font-mono text-slate-500">{t.rowCount} rows</span>
                    )}
                    <ChevronDown size={12} className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-2.5 pt-1 border-t border-slate-800/40 space-y-1 bg-slate-950/40 font-mono text-[11px]">
                    {t.columns.map(c => (
                      <div
                        key={c.name}
                        onClick={() => onInsertText?.(`${t.name}.${c.name}`)}
                        className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-indigo-500/10 cursor-pointer text-slate-300 group"
                        title="Click to insert into prompt"
                      >
                        <div className="flex items-center gap-1.5">
                          {c.isPk && <Key size={10} className="text-amber-400 shrink-0" />}
                          {c.isFk && <span className="text-[9px] text-cyan-400 font-bold">FK</span>}
                          <span className="group-hover:text-indigo-300">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{c.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* RAG Context status footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 text-[11px] text-slate-400">
        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
        <span>Hybrid RAG Index Active</span>
      </div>
    </div>
  )
}
