import { Link, NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

const PAGES = [
  { to: '/', label: 'Route Balance', icon: '⚖' },
  { to: '/import', label: 'Import', icon: '⇧' },
]

export function SidebarNav() {
  return (
    <aside className="flex w-[175px] shrink-0 flex-col gap-6 border-r border-outline-variant bg-surface p-4 max-[860px]:w-full max-[860px]:flex-row max-[860px]:items-center max-[860px]:justify-between max-[860px]:border-b max-[860px]:border-r-0 max-[860px]:p-3">
      <div className="flex flex-col gap-1.5 max-[860px]:flex-row max-[860px]:items-center max-[860px]:gap-2">
        <Link to="/" className="font-display text-[20px] font-bold leading-[1.05] tracking-tight max-[860px]:text-[15px]">
          LOGIX /<br className="max-[860px]:hidden" /> SPHERE
        </Link>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant max-[860px]:hidden">
          W29 Terminal
        </span>
      </div>
      <nav className="flex flex-col gap-1.5 max-[860px]:flex-row">
        {PAGES.map((page) => (
          <NavLink
            key={page.to}
            to={page.to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-[11.5px] font-semibold',
                isActive ? 'bg-primary-bright text-on-primary-bright' : 'text-on-surface-variant hover:bg-surface-variant',
              )
            }
          >
            {page.icon} {page.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2.5 border-t border-outline-variant pt-3.5 text-[10.5px] text-on-surface-variant max-[860px]:hidden">
        <span>? Support</span>
        <span>▤ System Status</span>
      </div>
    </aside>
  )
}
