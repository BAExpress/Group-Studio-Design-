import { ArrowUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { RouteRow, ShiftKey, SortKey } from '@/data/route-domain'

interface RouteSummaryTableProps {
  routes: RouteRow[]
  shift: ShiftKey
  sortKey: SortKey | null
  focusRouteId: number | null
  onSort: (key: SortKey) => void
  onToggleFocus: (routeId: number) => void
}

function SortableHead({
  label,
  sortKeyValue,
  activeKey,
  onSort,
}: {
  label: string
  sortKeyValue: SortKey
  activeKey: SortKey | null
  onSort: (key: SortKey) => void
}) {
  return (
    <th
      onClick={() => onSort(sortKeyValue)}
      className={cn(
        'cursor-pointer select-none border-b border-outline px-2.5 py-2 text-left text-[10px] uppercase tracking-wide text-on-surface-variant hover:text-on-surface',
        activeKey === sortKeyValue && 'text-on-surface',
      )}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="size-3" />
      </span>
    </th>
  )
}

// Portado de "summaryTable" + toggleFocusRoute()/handleSort() em
// RouteBalance.tsx — resumo de rotas ordenável, clicar numa linha escopa os
// KPIs do dashboard a essa rota só.
export function RouteSummaryTable({ routes, shift, sortKey, focusRouteId, onSort, onToggleFocus }: RouteSummaryTableProps) {
  if (!routes.length) return null

  return (
    <div className="mb-[22px] overflow-x-auto rounded-[3px] border border-outline-variant bg-surface shadow-[var(--rb-card-shadow)]">
      <table className="w-full border-collapse font-mono text-[11.5px]">
        <thead>
          <tr>
            <SortableHead label="Route" sortKeyValue="name" activeKey={sortKey} onSort={onSort} />
            <SortableHead label="Driver" sortKeyValue="driver" activeKey={sortKey} onSort={onSort} />
            <SortableHead label="Target (%)" sortKeyValue="target" activeKey={sortKey} onSort={onSort} />
            <SortableHead label="Total Stops" sortKeyValue="totalStops" activeKey={sortKey} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => {
            const isFocus = focusRouteId === route.id
            const isMuted = focusRouteId != null && !isFocus
            const stopCount = route.stops.filter((s) => (shift === 'pm' ? s.pm : !s.pm)).length
            return (
              <tr
                key={route.id}
                role="button"
                tabIndex={0}
                aria-pressed={isFocus}
                title={isFocus ? 'Click to clear the route focus' : `Click to scope the dashboard to Route ${route.name}`}
                onClick={() => onToggleFocus(route.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onToggleFocus(route.id)
                  }
                }}
                className={cn(
                  'cursor-pointer hover:bg-surface-variant',
                  isFocus && 'bg-primary-container',
                  isMuted && 'opacity-50',
                )}
              >
                <td className="border-b border-outline-variant px-2.5 py-2 font-bold">{route.name}</td>
                <td className="border-b border-outline-variant px-2.5 py-2">{route.driver}</td>
                <td className="border-b border-outline-variant px-2.5 py-2 tabular-nums">{route.target}%</td>
                <td className="border-b border-outline-variant px-2.5 py-2 tabular-nums">{stopCount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
