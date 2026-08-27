import type { ReactNode } from 'react'

import { SidebarNav } from './sidebar-nav'
import { Topbar } from './topbar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen max-[860px]:flex-col">
      <SidebarNav />
      <div className="min-w-0 flex-1">
        <Topbar />
        <div className="px-8 pb-[60px] pt-7 max-[860px]:px-4 max-[860px]:pt-5">{children}</div>
      </div>
    </div>
  )
}
