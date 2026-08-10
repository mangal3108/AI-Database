'use client'

import React, { useState, useEffect } from 'react'
import { Plus, BookOpen, Clock, BrainCircuit, X, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Doc {
  id: string
  title: string
  sourceType: string
  status: string
  createdAt: Date | string
}

export function KnowledgeClient({ initialDocs }: { initialDocs: Doc[] }) {
  const router = useRouter()
  const [docs, setDocs] = useState<Doc[]>(initialDocs)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          sourceType: 'MANUAL_ENTRY',
        }),
      })

      if (!res.ok) throw new Error('Failed to create knowledge entry')

      const data = await res.json()
      toast.success('Knowledge rule added and indexed for AI!')
      setDocs([data.doc, ...docs])
      setTitle('')
      setContent('')
      setIsModalOpen(false)
      router.refresh()
    } catch {
      toast.error('Failed to add knowledge entry')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <BrainCircuit className="text-indigo-400" size={26} />
            <span>Knowledge Base & RAG Context</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Provide custom domain rules, jargon definitions, and business logic to enhance AI query accuracy.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Knowledge</span>
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="bg-[#0D111A] border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit size={24} />
          </div>
          <h3 className="text-base font-bold text-white">No business rules defined</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Add custom business definitions (e.g. &ldquo;Revenue means completed orders only&rdquo;) so the AI understands your specific data context.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
          >
            <Plus size={16} />
            <span>Add Business Context</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-[#0D111A] border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{doc.title}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {doc.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={12} />
                  <span>{mounted ? new Date(doc.createdAt).toLocaleDateString() : ''}</span>
                </span>
                <span className="text-indigo-400 font-mono text-[10px] uppercase">{doc.sourceType}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Knowledge Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <Sparkles className="text-indigo-400" size={20} />
              <h2 className="text-lg font-bold text-white">Add Business Context / Rule</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Rule Title / Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Revenue Definition, Active User Logic"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Business Logic / Domain Jargon</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Explain your business rule in plain English (e.g. 'MRR calculation excludes one-time setup fees' or 'Canceled orders should be filtered where status != REFUNDED')"
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{isLoading ? 'Indexing...' : 'Save & Index for AI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
