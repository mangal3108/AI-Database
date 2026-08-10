'use client'

import { motion } from 'framer-motion'

export function NeuralNetworkBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#050507] ${className}`}>
      <div className="absolute inset-0 pointer-events-none aria-hidden:true" aria-hidden="true">
        {/* Soft Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-cyan-500/10 rounded-full blur-[120px]" />

        {/* Abstract Floating Schema Nodes */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"
          />
        </div>
      </div>

      {children}
    </div>
  )
}
