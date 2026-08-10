'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Terminal, Database, Shield, Sparkles, BookOpen, Layers, ArrowRight, X } from 'lucide-react'

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  const items = [
    { title: 'Interactive AI Demo', category: 'Product', icon: Sparkles, action: () => { router.push('#demo'); setIsOpen(false) } },
    { title: 'Database Integrations', category: 'Product', icon: Database, action: () => { router.push('#integrations'); setIsOpen(false) } },
    { title: 'Hybrid RAG Pipeline', category: 'Architecture', icon: Layers, action: () => { router.push('#rag'); setIsOpen(false) } },
    { title: 'Developer API & SDK', category: 'Developers', icon: Terminal, action: () => { router.push('#developer-api'); setIsOpen(false) } },
    { title: 'Zero-Trust Security', category: 'Enterprise', icon: Shield, action: () => { router.push('#security'); setIsOpen(false) } },
    { title: 'Documentation', category: 'Resources', icon: BookOpen, action: () => { router.push('#docs'); setIsOpen(false) } },
  ]

  const filtered = query
    ? items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
    : items

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0D111A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="flex items-center px-4 border-b border-slate-800/80">
          <Search size={18} className="text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Internite AI... (e.g. RAG, API, Security)"
            className="w-full bg-transparent py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 text-center">No results found for &quot;{query}&quot;</p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-indigo-400 group-hover:text-indigo-300">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                </button>
              )
            })
          )}
        </div>

        <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or arrow keys</span>
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">ESC</span>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
