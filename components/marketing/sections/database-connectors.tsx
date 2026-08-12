'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { DatabaseLogo } from '@/components/database/database-logo'

const DATABASES = [
  { id: 'MYSQL', name: 'MySQL' },
  { id: 'POSTGRESQL', name: 'PostgreSQL' },
  { id: 'SQLSERVER', name: 'SQL Server' },
  { id: 'SQLITE', name: 'SQLite' },
  { id: 'MONGODB', name: 'MongoDB' },
  { id: 'ORACLE', name: 'Oracle' },
  { id: 'MARIADB', name: 'MariaDB' },
  { id: 'REDIS', name: 'Redis' },
]

export function DatabaseConnectors() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 px-4 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            WORKS WITH ALL MAJOR DATABASES
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {DATABASES.map((db, index) => (
            <motion.a
              href="/integrations"
              key={db.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center justify-center p-4 w-28 h-24 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] transition-all cursor-pointer group"
            >
              <DatabaseLogo type={db.id} className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[10px] font-semibold text-slate-500 mt-3">{db.name}</span>
            </motion.a>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: DATABASES.length * 0.05 }}
            className="flex flex-col items-center justify-center p-4 w-28 h-24 rounded-2xl bg-slate-50 border border-slate-200 transition-all cursor-pointer hover:bg-slate-100"
          >
            <div className="grid grid-cols-2 gap-1 mb-3">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <span className="text-[10px] font-semibold text-slate-500">and more</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
