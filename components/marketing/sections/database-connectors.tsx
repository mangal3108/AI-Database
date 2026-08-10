'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DatabaseLogo } from '@/components/database/database-logo'
import { SectionBackground } from '@/components/landing/section-background'

const DATABASES = [
  { id: 'POSTGRESQL', name: 'PostgreSQL', href: '/databases/postgresql' },
  { id: 'MYSQL', name: 'MySQL', href: '/databases/mysql' },
  { id: 'MONGODB', name: 'MongoDB', href: '/databases/mongodb' },
  { id: 'SQLSERVER', name: 'SQL Server', href: '/databases/sql-server' },
  { id: 'MARIADB', name: 'MariaDB', href: '/databases/mariadb' },
  { id: 'SQLITE', name: 'SQLite', href: '/databases/sqlite' },
]

export function DatabaseConnectors() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 bg-[#050505] relative overflow-hidden" ref={ref}>
      <SectionBackground theme="cyan" opacity={0.3} />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">{'>'} DATABASE_CONNECTORS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Connect the databases you already use.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No data migration. No new tools to learn. Connect your existing database and start asking questions immediately.
          </p>
        </motion.div>

        {/* Database Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {DATABASES.map((db, index) => (
            <motion.a
              key={db.name}
              href={db.href}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#090D16]/90 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl"
            >
              <div className="w-full flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400/90 font-semibold">TLS 1.3</span>
              </div>
              <DatabaseLogo type={db.id} className="w-9 h-9 flex-shrink-0 transition-transform group-hover:scale-110 my-1" />
              <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-white transition-colors">{db.name}</span>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/integrations"
            className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
          >
            View all supported databases
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
