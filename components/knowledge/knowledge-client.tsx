'use client'

import React, { useState, useEffect } from 'react'
import { Plus, BookOpen, Clock, BrainCircuit, X, Loader2, Sparkles, FileText, CheckCircle2 } from 'lucide-react'
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
    <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans space-y-8 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
            <BrainCircuit size={13} />
            <span>AI HYBRID RAG CONTEXT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Schema &amp; Knowledge Base</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Provide domain rules, business glossary definitions, and custom calculations to guide AI query generation.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-indigo-600/20 shrink-0 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Knowledge</span>
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="bg-[#111113] border border-white/5 rounded-3xl p-12 text-center max-w-md mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit size={24} />
          </div>
          <h3 className="text-base font-bold text-white">No business rules defined</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Add custom business definitions (e.g. &ldquo;Revenue means completed orders only&rdquo;) so the AI understands your specific data context.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Plus size={15} />
            <span>Add Business Context</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-[#111113]/90 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {doc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{doc.sourceType}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>Added {new Date(doc.createdAt).toLocaleDateString()}</span>
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Vector RAG Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">Add Business Context / Rule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">Rule Title / Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Active Customer Definition"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">Business Logic / Context Details</label>
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Explain business rules, formulas, or jargon so the AI applies correct SQL filters..."
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !title.trim() || !content.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Save &amp; Index Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
