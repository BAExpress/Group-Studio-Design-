import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Route } from '@/types'

export function RouteCard({
  route,
  onRebalance,
  onValidate,
  onSeeDetails,
  onSeeAllStops,
  collapseSignal,
}: {
  route: Route
  onRebalance: (route: Route) => void
  onValidate: (route: Route) => void
  onSeeDetails: (route: Route) => void
  onSeeAllStops: (route: Route) => void
  collapseSignal: number
}) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [collapseSignal])
  const percent =
    route.stopsTotal === 0
      ? 0
      : Math.round((route.stopsDone / route.stopsTotal) * 100)
  const isOverCapacity = route.capacityState === 'rebalance'

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-md border bg-surface p-3',
        isOverCapacity ? 'border-error' : 'border-outline-variant',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            <span>{route.code}</span>
            <span>·</span>
            <span>MANIFEST</span>
          </div>
          <div className="font-display text-lg font-bold leading-tight">
            {route.driver}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-sm border',
            expanded
              ? 'border-outline bg-surface-variant'
              : 'border-outline text-primary',
          )}
          aria-label={expanded ? 'Recolher' : 'Expandir'}
        >
          {expanded ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <Badge variant="neutral">{route.shift}</Badge>
        <Badge variant={route.status === 'validated' ? 'validated' : 'pending'}>
          {route.status === 'validated' ? 'VALIDATED' : 'PENDING'}
        </Badge>
      </div>

      <div>
        <Progress
          value={percent}
          indicatorClassName={isOverCapacity ? 'bg-error' : undefined}
        />
        <div className="mt-1 font-mono text-[11px] text-on-surface-variant">
          {route.stopsDone} / {route.stopsTotal} STOPS ({percent}%)
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 rounded-sm border border-outline-variant bg-background/60 p-2">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Subpostcode Del / PU Total
          </div>
          <table className="w-full font-mono text-[11px]">
            <tbody>
              {route.subpostcodes.map((row) => (
                <tr key={row.code} className="border-t border-outline-variant/60">
                  <td className="py-1 pr-2">{row.code}</td>
                  <td className="py-1 pr-2 text-on-surface-variant">{row.del}</td>
                  <td className="py-1 pr-2 text-on-surface-variant">{row.pu}</td>
                  <td className="py-1 text-right font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onSeeDetails(route)}
            >
              See details
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onSeeAllStops(route)}
            >
              See all stops
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Deliveries" value={route.deliveries} />
            <MiniStat label="Pickups" value={route.pickups} />
            <MiniStat label="Pre 12h" value={route.preNoon} />
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-on-surface-variant">Target</span>
            <span className="font-bold">{route.targetPercent}%</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {isOverCapacity ? (
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onRebalance(route)}
          >
            Rebalance
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1"
            disabled={route.status === 'validated'}
            onClick={() => onValidate(route)}
          >
            {route.status === 'validated' ? 'Validated' : 'Validate'}
          </Button>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-outline-variant p-1.5">
      <div className="font-mono text-sm font-bold">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
        {label}
      </div>
    </div>
  )
}
