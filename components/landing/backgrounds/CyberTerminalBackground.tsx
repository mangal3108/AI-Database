'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function CyberTerminalBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#030508] ${className}`}>
      <div className="absolute inset-0 pointer-events-none aria-hidden:true" aria-hidden="true">
        {/* Hacking Terminal Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-emerald-600/25 via-cyan-600/20 to-indigo-600/15 rounded-full blur-[130px]" />
        
        {/* Terminal Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Matrix Code Stream Lines */}
        <div className="absolute inset-0 opacity-40">
          {[10, 25, 45, 65, 85].map((leftPos, i) => (
            <motion.div
              key={i}
              animate={{ y: ['-20%', '120%'] }}
              transition={{
                duration: 4 + i * 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
              className="absolute top-0 w-0.5 h-40 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
              style={{ left: `${leftPos}%` }}
            />
          ))}
        </div>
      </div>

      {children}
    </div>
  )
}
