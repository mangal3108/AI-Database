'use client'

export function PricingGlowBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#050507] ${className}`}>
      <div className="absolute inset-0 pointer-events-none aria-hidden:true" aria-hidden="true">
        {/* High Contrast Radial Spotlight behind Pricing Cards */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-[130px]" />
        
        {/* Mouse Glow */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 40%), rgba(99, 102, 241, 0.08), transparent 80%)`,
          }}
        />
      </div>

      {children}
    </div>
  )
}
