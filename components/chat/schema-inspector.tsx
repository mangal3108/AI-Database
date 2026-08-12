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
    <div className="h-full flex flex-col bg-white border-l border-slate-200 font-sans text-xs">
      {/* Header / Health */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 text-xs">{selectedDbName}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
            CONNECTED
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>{dbType} · {tables.length} tables</span>
          <span className="text-slate-500">Sync 4m ago</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tables & columns..."
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Schema Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Schema tables ({filteredTables.length})</span>
          {isLoading && <RefreshCw size={10} className="animate-spin text-slate-400" />}
        </div>

        {filteredTables.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {search ? 'No matching tables' : 'Select a connected database'}
          </div>
        ) : (
          filteredTables.map(t => {
            const isExpanded = expandedTable === t.name
            return (
              <div key={t.name} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedTable(isExpanded ? null : t.name)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Table size={13} className="text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900 font-mono">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.rowCount !== undefined && (
                      <span className="text-[10px] font-mono text-slate-500">{t.rowCount} rows</span>
                    )}
                    <ChevronDown size={12} className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-2.5 pt-1 border-t border-slate-100 space-y-1 bg-slate-50 font-mono text-[11px]">
                    {t.columns.map(c => (
                      <div
                        key={c.name}
                        onClick={() => onInsertText?.(`${t.name}.${c.name}`)}
                        className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-indigo-50 cursor-pointer text-slate-600 group"
                        title="Click to insert into prompt"
                      >
                        <div className="flex items-center gap-1.5">
                          {c.isPk && <Key size={10} className="text-amber-500 shrink-0" />}
                          {c.isFk && <span className="text-[9px] text-cyan-600 font-bold">FK</span>}
                          <span className="group-hover:text-indigo-600">{c.name}</span>
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
      <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 text-[11px] text-slate-600">
        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
        <span>Schema index active</span>
      </div>
    </div>
  )
}
