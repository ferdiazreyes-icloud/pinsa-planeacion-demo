'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Home page gets full-screen treatment (no sidebar)
  if (pathname === '/') return <>{children}</>

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto" style={{ background: 'var(--bg-primary)' }}>
        {children}
      </main>
    </div>
  )
}
