'use client'

import { Cpu, ShieldCheck, Zap, Sparkles } from 'lucide-react'

const PROVIDERS = [
  { name: 'Mistral AI', model: 'mistral-small-latest', tag: 'Primary AI', speed: 'Fast' },
  { name: 'Google Gemini', model: 'gemini-1.5-flash', tag: 'Secondary AI', speed: 'Ultra Fast' },
  { name: 'Groq', model: 'llama-3.3-70b-versatile', tag: 'High Performance', speed: 'Realtime' },
  { name: 'OpenRouter', model: 'llama-3.3-70b-instruct:free', tag: 'Multi-Model', speed: 'Adaptive' },
  { name: 'Cerebras', model: 'llama3.1-70b', tag: 'Background Engine', speed: 'Instant' },
]

export function ByoAiSection() {
  return (
    <section className="py-24 border-t border-slate-800/60 bg-[#050505] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">MULTI-PROVIDER AI GATEWAY</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Bring the intelligence <span className="text-[#60A5FA]">you prefer.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          LLM Provider ≠ Database Intelligence. Internite AI owns the schema analysis, hybrid RAG, query planner, and safety validation layers — while allowing you to route queries across 5 top AI providers.
        </p>

        {/* Providers Grid */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {PROVIDERS.map((p, idx) => (
            <div key={idx} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 relative hover:border-indigo-500/50 transition-colors">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 block w-fit mb-3">
                {p.tag}
              </span>
              <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
              <p className="text-[11px] font-mono text-slate-500 mb-3">{p.model}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                <Zap size={12} />
                <span>{p.speed} Inference</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bring Your Own Key Banner */}
        <div className="mt-8 max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-400" />
            <span>Support for custom API keys & zero data retention guarantees</span>
          </div>
          <span className="text-indigo-400 font-bold">BYO-Key Supported →</span>
        </div>
      </div>
    </section>
  )
}
