import { LifeBuoy, MonitorCheck, Scale } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import { cn } from '@/lib/utils'

/* `/import` faz parte da seção Route Balance — no Figma o item segue aceso na tela de upload. */
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Route Balance', icon: Scale, matches: ['/dashboard', '/import'] },
]

export function SidebarNav() {
  const { pathname } = useLocation()

  return (
    <aside className="flex w-44 shrink-0 flex-col border-r border-outline-variant bg-surface-variant/40">
      <div className="px-4 pb-3 pt-5">
        <div className="font-display text-2xl font-bold leading-[1.1] tracking-tight">
          LOGIX /<br />
          SPHERE
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-wider text-on-surface-variant">
          W29 TERMINAL
        </div>
      </div>

      <nav className="mt-2 flex flex-col">
        {NAV_ITEMS.map(({ to, label, icon: Icon, matches }) => {
          const isActive = matches.includes(pathname)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 px-4 py-3 font-mono text-xs',
                isActive
                  ? 'bg-primary-bright text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-variant',
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="leading-tight">{label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant px-4 py-4 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <LifeBuoy className="size-3" /> Support
        </span>
        <span className="flex items-center gap-1.5">
          <MonitorCheck className="size-3" /> System Status
        </span>
      </div>
    </aside>
  )
}
