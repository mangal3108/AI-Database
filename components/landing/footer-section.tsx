'use client'

import Link from 'next/link'

export function FooterSection() {
  return (
    <footer className="bg-[#050505] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <span className="font-extrabold text-xl tracking-tight select-none">
                <span className="text-white">INTERN</span>
                <span className="text-[#60A5FA]">ITE</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#60A5FA] border border-[#60A5FA]/30">AI</span>
            </Link>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed mb-4">
              The AI operating layer for your databases. Talk to your data, discover schemas, and run safe multi-tenant queries.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">© 2026 Internite AI Inc. All rights reserved.</p>
          </div>

          {/* Col 2: Product */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">PRODUCT</p>
            <ul className="space-y-2 font-medium">
              <li><a href="#demo" className="hover:text-white transition-colors">AI Database Chat</a></li>
              <li><a href="#rag" className="hover:text-white transition-colors">Hybrid Vector RAG</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">Schema Intelligence</a></li>
              <li><a href="#developer-api" className="hover:text-white transition-colors">Developer API & SDK</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Col 3: Developers */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">DEVELOPERS</p>
            <ul className="space-y-2 font-medium">
              <li><a href="#developer-api" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#developer-api" className="hover:text-white transition-colors">TypeScript SDK</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">Database Connectors</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Col 4: Company & Security */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">COMPANY</p>
            <ul className="space-y-2 font-medium">
              <li><a href="#security" className="hover:text-white transition-colors">Zero-Trust Security</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">SOC 2 Compliance</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
