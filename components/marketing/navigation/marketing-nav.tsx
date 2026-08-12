'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Menu, X, ArrowRight, Database, Code, Shield, BarChart3, Brain, Zap, BookOpen, GitBranch, Box } from 'lucide-react'

const FEATURES = [
  {
    title: 'AI Database Chat',
    description: 'Ask your database anything in plain English.',
    href: '/product/database-chat',
    icon: Brain,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'Data Visualizer',
    description: 'Turn query results into interactive charts.',
    href: '/product/data-visualizer',
    icon: BarChart3,
    gradient: 'from-blue-400 to-cyan-500'
  },
]

const RESOURCES = [
  { title: 'API Reference', href: '/developers/api', description: 'REST endpoints', icon: Box },
  { title: 'SDK', href: '/developers/sdk', description: 'TypeScript client', icon: Code },
  { title: 'Webhooks', href: '/developers/webhooks', description: 'Event subscriptions', icon: GitBranch },
  { title: 'Blog', href: '/blog', description: 'Latest updates & guides', icon: BookOpen },
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
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-1.5 group">
            <span className="font-extrabold text-2xl tracking-tight leading-none">
              <span className="text-slate-900 group-hover:text-slate-700 transition-colors">INTERN</span>
              <span className="text-blue-600">ITE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('features')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
                <span>Features</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'features' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 pt-2 w-80">
                  <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xl">
                    {FEATURES.map((feature) => (
                      <Link
                        key={feature.href}
                        href={feature.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}>
                          <feature.icon size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{feature.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{feature.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regular Links */}
            <Link href="/use-cases" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all">
              Use Cases
            </Link>
            <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all">
              Pricing
            </Link>
            <Link href="/developers/docs" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all">
              Docs
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
                <span>Resources</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'resources' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full right-0 pt-2 w-72">
                  <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xl">
                    {RESOURCES.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <item.icon size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all shadow-sm">
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-md transition-all shadow-sm shadow-blue-600/20"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-20">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-x-0 top-20 bg-white border-b border-slate-200 shadow-2xl overflow-y-auto max-h-[calc(100vh-5rem)]">
            <div className="p-6 space-y-6">
              {/* Features Section */}
              <div>
                <button
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'features' ? null : 'features')}
                  className="flex items-center justify-between w-full py-2 text-slate-900 font-bold"
                >
                  <span>Features</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${mobileSubmenu === 'features' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'features' && (
                  <div className="pl-4 space-y-1 mt-2 border-l-2 border-slate-100">
                    {FEATURES.map((feature) => (
                      <Link
                        key={feature.href}
                        href={feature.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${feature.gradient}`}>
                          <feature.icon size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{feature.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Section */}
              <div>
                <button
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'resources' ? null : 'resources')}
                  className="flex items-center justify-between w-full py-2 text-slate-900 font-bold"
                >
                  <span>Resources</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${mobileSubmenu === 'resources' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'resources' && (
                  <div className="pl-4 space-y-1 mt-2 border-l-2 border-slate-100">
                    {RESOURCES.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <item.icon size={14} className="text-slate-500" />
                        <span className="text-sm font-semibold text-slate-700">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="space-y-1 pb-4">
                <Link href="/use-cases" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-slate-900 font-bold hover:text-blue-600">
                  Use Cases
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-slate-900 font-bold hover:text-blue-600">
                  Pricing
                </Link>
                <Link href="/developers/docs" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-slate-900 font-bold hover:text-blue-600">
                  Docs
                </Link>
              </div>

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-slate-200 space-y-3 pb-6">
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
