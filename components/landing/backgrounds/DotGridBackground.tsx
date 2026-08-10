'use client'

export function DotGridBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#050507] ${className}`}>
      <div className="absolute inset-0 pointer-events-none aria-hidden:true" aria-hidden="true">
        {/* Subtle Radial Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/25 via-[#050507]/80 to-[#050507]" />

        {/* Crisp Dot Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1.2px, transparent 1.2px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Mouse Glow Overlay */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.18), transparent 75%)`,
          }}
        />
      </div>

      {children}
    </div>
  )
}
