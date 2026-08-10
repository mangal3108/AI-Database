'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function MatrixRainBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#04060A] ${className}`}>
      <div className="absolute inset-0 pointer-events-none aria-hidden:true" aria-hidden="true">
        {/* Deep Cyber Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/25 via-blue-600/20 to-cyan-500/15 rounded-full blur-[140px]" />
        
        {/* Terminal Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Matrix Code Stream Dots */}
        <div className="absolute inset-0 opacity-30">
          {[15, 35, 55, 75, 90].map((leftPos, i) => (
            <motion.div
              key={i}
              animate={{ y: ['-10%', '110%'] }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.7,
              }}
              className="absolute top-0 w-0.5 h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
              style={{ left: `${leftPos}%` }}
            />
          ))}
        </div>

        {/* Mouse Light Glow */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: `radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(99, 102, 241, 0.15), transparent 75%)`,
          }}
        />
      </div>

      {children}
    </div>
  )
}
