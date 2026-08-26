import { AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Kpi } from '@/types'

export function KpiBar({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className={cn(
            'rounded-md border p-3',
            kpi.alert
              ? 'border-error-container bg-error-container/40'
              : 'border-outline-variant bg-surface',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              {kpi.label}
            </span>
            {kpi.alert && <AlertTriangle className="size-3.5 text-error" />}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={cn(
                'font-mono text-2xl font-bold',
                kpi.alert && 'text-error',
              )}
            >
              {kpi.value}
            </span>
            {(kpi.delta ?? kpi.sublabel) && (
              <span className="font-mono text-[10px] text-on-surface-variant">
                {kpi.delta ?? kpi.sublabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
