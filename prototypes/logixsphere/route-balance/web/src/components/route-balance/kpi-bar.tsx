import { Archive, Truck, Zap } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Kpi } from '@/types'

const ICONS: Record<string, typeof Zap> = {
  'total-stops': Zap,
  'pre-deliveries': Truck,
  'archived-service-rate': Archive,
}

const VALUE_COLOR: Record<string, string> = {
  'pre-deliveries': 'text-secondary',
  'archived-service-rate': 'text-primary',
}

export function KpiBar({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = ICONS[kpi.id]
        return (
          <div
            key={kpi.id}
            className={cn(
              'rounded-md border border-on-surface p-3',
              kpi.alert ? 'bg-surface-variant' : 'bg-surface-variant/25',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {kpi.label}
              </span>
              {kpi.alert ? (
                <span aria-hidden className="font-mono text-sm font-bold leading-none text-error">
                  !
                </span>
              ) : (
                Icon && <Icon className="size-3.5 text-on-surface-variant" />
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={cn(
                  'font-display text-3xl font-bold leading-none',
                  kpi.alert ? 'text-error' : VALUE_COLOR[kpi.id],
                )}
              >
                {kpi.value}
              </span>
              {kpi.delta && (
                <span className="font-mono text-[10px] text-primary">{kpi.delta}</span>
              )}
            </div>
            {kpi.sublabel && (
              <div className="mt-2 font-mono text-[11px] text-on-surface-variant">{kpi.sublabel}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
