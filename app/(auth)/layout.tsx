import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Internite AI',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Orbs & Glowing Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-900/20 via-purple-900/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 w-full max-w-md my-8">
        {children}
      </div>
    </div>
  )
}
