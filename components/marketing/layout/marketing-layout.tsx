import { MarketingNav } from '@/components/marketing/navigation/marketing-nav'
import { MarketingFooter } from '@/components/marketing/navigation/marketing-footer'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
