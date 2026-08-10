'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const DATABASES = [
  { name: 'PostgreSQL', color: '#336791', abbr: 'PG' },
  { name: 'Supabase', color: '#3ECF8E', abbr: 'SB' },
  { name: 'Neon', color: '#00E5A0', abbr: 'NE' },
  { name: 'MySQL', color: '#4479A1', abbr: 'MY' },
  { name: 'MongoDB', color: '#47A248', abbr: 'MO' },
  { name: 'SQL Server', color: '#CC2927', abbr: 'MS' },
  { name: 'SQLite', color: '#0F80CC', abbr: 'SL' },
  { name: 'CockroachDB', color: '#6933FF', abbr: 'CR' },
  { name: 'MariaDB', color: '#003545', abbr: 'MA' },
  { name: 'MongoDB Atlas', color: '#00684A', abbr: 'AT' },
]

export function DatabaseIntegrations() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="integrations" className="py-16 px-6 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-sm text-muted-foreground mb-8 font-medium uppercase tracking-widest"
        >
          Compatible with every major database
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {DATABASES.map((db, i) => (
            <motion.div
              key={db.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 bg-card/60 border border-border/50 rounded-xl px-4 py-2.5 hover:border-border transition-all cursor-default group"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: db.color }}
              >
                {db.abbr}
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {db.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
