'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Command, ChevronDown } from 'lucide-react'

export function LandingNav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Vector Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="font-extrabold text-xl tracking-tight select-none font-sans">
            <span className="text-white">INTERN</span>
            <span className="text-[#60A5FA]">ITE</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#60A5FA] border border-[#60A5FA]/30 shadow-sm shadow-indigo-500/20">AI</span>
        </Link>

        {/* Navigation Dropdown Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <div className="relative" onMouseEnter={() => setActiveDropdown('product')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="flex items-center gap-1 hover:text-white transition-colors py-2">
              <span>Product</span>
              <ChevronDown size={14} />
            </button>

            {activeDropdown === 'product' && (
              <div className="absolute top-full left-0 w-64 bg-[#0D111A] border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-1">
                <a href="#demo" className="block p-2.5 rounded-xl hover:bg-slate-800 text-white font-medium text-xs">
                  AI Database Chat
                  <p className="text-[10px] text-slate-500 font-normal">Natural language to safe SQL</p>
                </a>
                <a href="#rag" className="block p-2.5 rounded-xl hover:bg-slate-800 text-white font-medium text-xs">
                  Hybrid Vector RAG
                  <p className="text-[10px] text-slate-500 font-normal">Schema knowledge indexing</p>
                </a>
                <a href="#integrations" className="block p-2.5 rounded-xl hover:bg-slate-800 text-white font-medium text-xs">
                  Multi-Database Layer
                  <p className="text-[10px] text-slate-500 font-normal">Postgres, Mongo, Supabase, Neon</p>
                </a>
              </div>
            )}
          </div>

          <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
          <a href="#developer-api" className="hover:text-white transition-colors">Developers</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        {/* Actions & Command Palette Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-[11px] text-slate-400 font-mono">
            <Command size={12} className="text-slate-400" />
            <span>K</span>
          </div>

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
          >
            Start free →
          </Link>
        </div>
      </div>
    </header>
  )
}
