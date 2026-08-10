'use client'

import { motion } from 'framer-motion'

export function AuroraBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#050507] ${className}`}>
      {/* Ambient Multi-Tone Aurora Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none aria-hidden:true" aria-hidden="true">
        {/* Core Spotlight */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/50 via-blue-500/40 to-violet-600/35 rounded-full blur-[100px]"
        />

        {/* Secondary Cyan Edge Accent */}
        <motion.div
          animate={{
            x: [-30, 30, -30],
            y: [-15, 15, -15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 left-1/4 w-[600px] h-[350px] bg-cyan-500/25 rounded-full blur-[90px]"
        />

        {/* Desktop Pointer Light Glow */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none opacity-60 transition-opacity duration-500"
          style={{
            background: `radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(99, 102, 241, 0.2), transparent 75%)`,
          }}
        />

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/20 to-[#050507]" />
      </div>

      {children}
    </div>
  )
}
