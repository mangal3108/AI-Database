import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Internite AI',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen bg-[#f7f7f5] overflow-hidden">
      <DashboardSidebar user={session.user} />
      <main className="dashboard-light flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
