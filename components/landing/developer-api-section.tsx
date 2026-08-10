'use client'

import { useState } from 'react'
import { Terminal, Copy, Check, ArrowRight } from 'lucide-react'

const CODE_SAMPLE = `import { InterniteClient } from '@internite/sdk'

const internite = new InterniteClient({
  apiKey: process.env.INTERNITE_API_KEY,
  organizationId: 'org_acme_corp',
})

// Ask any database in natural language
const response = await internite.query({
  connectionId: 'db_postgresql_prod',
  question: 'Which customers generated the most revenue this quarter?',
  format: 'json',
})

console.log(response.answer)
console.log(response.sql)
console.log(response.data)`

const RESPONSE_JSON = `{
  "answer": "Acme Corp generated the highest revenue this quarter (₹42.8L across 18,420 orders).",
  "sql": "SELECT c.name, SUM(o.amount) FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY 1 ORDER BY 2 DESC LIMIT 1;",
  "data": [
    { "customer": "Acme Corp", "revenue": 4280000, "orders": 18420 }
  ],
  "confidence": 0.994,
  "executionTimeMs": 4.2
}`

export function DeveloperApiSection() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request')

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === 'request' ? CODE_SAMPLE : RESPONSE_JSON)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="developer-api" className="py-24 border-t border-slate-800/60 bg-[#07090E] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">DEVELOPER API & SDK</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI for your database. <span className="text-[#60A5FA]">API for your product.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Embed natural language database intelligence directly into your own SaaS application, internal tools, or AI workflows with 3 lines of code.
        </p>

        {/* Code Terminal Box */}
        <div className="mt-14 max-w-3xl mx-auto bg-[#0D111A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-left font-mono">
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Terminal size={14} className="text-indigo-400" />
                <button
                  onClick={() => setActiveTab('request')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeTab === 'request' ? 'bg-slate-800 text-white font-bold' : 'hover:text-slate-200'}`}
                >
                  index.ts (SDK Request)
                </button>
                <button
                  onClick={() => setActiveTab('response')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeTab === 'response' ? 'bg-slate-800 text-white font-bold' : 'hover:text-slate-200'}`}
                >
                  response.json (API Result)
                </button>
              </div>
            </div>

            <button onClick={handleCopy} className="text-slate-400 hover:text-white p-1 text-xs flex items-center gap-1">
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-xs leading-relaxed overflow-x-auto text-indigo-200/90 bg-slate-950">
            <pre>{activeTab === 'request' ? CODE_SAMPLE : RESPONSE_JSON}</pre>
          </div>
        </div>
      </div>
    </section>
  )
}
