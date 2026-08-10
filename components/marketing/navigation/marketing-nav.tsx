'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Menu, X, ArrowRight, Database, Code, Shield, BarChart3, Brain, Zap, BookOpen, GitBranch, Box } from 'lucide-react'

const PRODUCTS = [
  {
    title: 'AI Database Chat',
    description: 'Ask your database anything in plain English.',
    href: '/product/database-chat',
    icon: Brain,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Data Visualizer',
    description: 'Turn query results into interactive charts.',
    href: '/product/data-visualizer',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-cyan-500'
  },
  {
    title: 'Schema Intelligence',
    description: 'AI understands your database structure.',
    href: '/product/schema-intelligence',
    icon: Database,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'Hybrid RAG',
    description: 'Grounded AI answers with retrieval augmentation.',
    href: '/product/rag',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Database Connectors',
    description: 'PostgreSQL, MySQL, MongoDB, and more.',
    href: '/integrations',
    icon: Code,
    gradient: 'from-cyan-500 to-blue-500'
  },
]

const DEVELOPERS = [
  { title: 'API Reference', href: '/developers/api', description: 'REST endpoints', icon: Box },
  { title: 'SDK', href: '/developers/sdk', description: 'TypeScript client', icon: Code },
  { title: 'Webhooks', href: '/developers/webhooks', description: 'Event subscriptions', icon: GitBranch },
  { title: 'Documentation', href: '/developers/docs', description: 'Guides & tutorials', icon: BookOpen },
  { title: 'Connectors', href: '/developers/connectors', description: 'Database drivers', icon: Database },
  { title: 'Changelog', href: '/changelog', description: 'Latest updates', icon: GitBranch },
]

export function MarketingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(dropdown)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-1.5 group">
            <span className="font-extrabold text-xl tracking-tight leading-none">
              <span className="text-white group-hover:text-slate-200 transition-colors">INTERN</span>
              <span className="text-[#60A5FA]">ITE</span>
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-[#60A5FA] border border-[#60A5FA]/30 shadow-sm leading-none flex items-center justify-center">
              AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('product')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <span>Product</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 pt-2 w-80">
                  <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Products</p>
                    </div>
                    {PRODUCTS.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${product.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                          <product.icon size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{product.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{product.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Developers Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('developers')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <span>Developers</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'developers' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'developers' && (
                <div className="absolute top-full left-0 pt-2 w-72">
                  <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">For Developers</p>
                    </div>
                    {DEVELOPERS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <item.icon size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regular Links */}
            <Link href="/integrations" className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors">
              Integrations
            </Link>
            <Link href="/security" className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/pricing" className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-slate-200 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[#0a0a0f] border-l border-white/10 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between">
                <Link href="/" className="font-bold text-xl" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-white">INTERN</span>
                  <span className="text-cyan-400">ITE</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Product Section */}
              <div>
                <button
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'product' ? null : 'product')}
                  className="flex items-center justify-between w-full py-2 text-white font-medium"
                >
                  <span>Product</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileSubmenu === 'product' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'product' && (
                  <div className="pl-4 space-y-1 mt-2">
                    {PRODUCTS.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${product.gradient}`}>
                          <product.icon size={14} className="text-white" />
                        </div>
                        <span className="text-sm text-slate-300">{product.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Developers Section */}
              <div>
                <button
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'developers' ? null : 'developers')}
                  className="flex items-center justify-between w-full py-2 text-white font-medium"
                >
                  <span>Developers</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileSubmenu === 'developers' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'developers' && (
                  <div className="pl-4 space-y-1 mt-2">
                    {DEVELOPERS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <item.icon size={14} className="text-slate-500" />
                        <span className="text-sm text-slate-300">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="space-y-1">
                <Link href="/integrations" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
                  Integrations
                </Link>
                <Link href="/security" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
                  Security
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
                  Pricing
                </Link>
                <Link href="/enterprise" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
                  Enterprise
                </Link>
              </div>

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-white text-black font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Start Free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-slate-300 font-medium rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
