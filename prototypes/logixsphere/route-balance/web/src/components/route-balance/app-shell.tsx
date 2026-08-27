import type { ReactNode } from 'react'

import { AppFooter } from '@/components/route-balance/app-footer'
import { HeaderBar } from '@/components/route-balance/header-bar'
import { SidebarNav } from '@/components/route-balance/sidebar-nav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex min-h-screen flex-1 flex-col">
        <HeaderBar />
        {children}
        <AppFooter />
      </div>
    </div>
  )
}
