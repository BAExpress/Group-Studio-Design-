import { AlertTriangle, ClipboardList, Flag, Truck } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { DashboardFilterKey } from '@/data/route-domain'

interface KpiGridProps {
  totalStops: number
  pre12: number
  asr: number
  dsr: number
  activeFilter: DashboardFilterKey | null
  onToggleFilter: (key: DashboardFilterKey) => void
}

export function KpiGrid({ totalStops, pre12, asr, dsr, activeFilter, onToggleFilter }: KpiGridProps) {
  const cards = [
    { key: null, label: 'Total Stops', value: totalStops, foot: `${Math.max(1, Math.round(totalStops / 16))} routes`, icon: Flag },
    { key: 'pre12' as const, label: 'Pré-Deliveries', value: pre12, foot: totalStops ? `${Math.round((pre12 / totalStops) * 100)}% of stops` : '—', icon: Truck, color: 'secondary' },
    { key: 'asr' as const, label: 'Archived Service Rate', value: asr, foot: totalStops ? `${Math.round((asr / totalStops) * 100)}% of stops` : '—', icon: ClipboardList },
    { key: 'dsr' as const, label: 'Dalayed Service Rate', value: dsr, foot: totalStops ? `${Math.round((dsr / totalStops) * 100)}% of stops` : '—', icon: AlertTriangle, color: 'tertiary', alert: true },
  ]

  return (
    <div className="mb-[22px] grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
      {cards.map((kpi) => {
        const Icon = kpi.icon
        const clickable = kpi.key !== null
        const isActive = kpi.key !== null && activeFilter === kpi.key
        return (
          <button
            key={kpi.label}
            type="button"
            disabled={!clickable}
            onClick={() => kpi.key && onToggleFilter(kpi.key)}
            className={cn(
              'rounded-[3px] border p-4 text-left shadow-[var(--rb-card-shadow)] transition-colors',
              isActive ? 'border-primary-bright ring-1 ring-primary-bright' : 'border-outline-variant',
              kpi.alert ? 'bg-surface-variant' : 'bg-surface',
              clickable && 'cursor-pointer hover:border-secondary',
              !clickable && 'cursor-default',
            )}
          >
            <div className="flex items-start justify-between text-[10.5px] uppercase tracking-wide text-on-surface-variant">
              <span>{kpi.label}</span>
              <Icon className="size-3.5" />
            </div>
            <div
              className={cn(
                'font-display mt-2 text-[30px] font-bold tabular-nums',
                kpi.color === 'secondary' && 'text-secondary',
                kpi.color === 'tertiary' && 'text-tertiary',
              )}
            >
              {kpi.value}
            </div>
            <div className="mt-1.5 text-[11px] text-on-surface-variant">{kpi.foot}</div>
          </button>
        )
      })}
    </div>
  )
}
