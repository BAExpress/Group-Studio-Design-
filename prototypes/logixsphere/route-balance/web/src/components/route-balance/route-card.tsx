import { Check, CheckCircle2, MapPin, Minus, Plus, Split } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Route } from '@/types'

export function RouteCard({
  route,
  onRebalance,
  onValidate,
  onSeeDetails,
  onSeeAllStops,
  onSpecialDeliveries,
  collapseSignal,
}: {
  route: Route
  onRebalance: (route: Route) => void
  onValidate: (route: Route) => void
  onSeeDetails: (route: Route) => void
  onSeeAllStops: (route: Route) => void
  onSpecialDeliveries: (route: Route) => void
  collapseSignal: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [collapseSignal])

  const percent =
    route.stopsTotal === 0 ? 0 : Math.round((route.stopsDone / route.stopsTotal) * 100)
  const isOverCapacity = route.capacityState === 'rebalance'

  return (
    <div className="flex flex-col rounded-md border border-on-surface bg-background p-3">
      <div className="flex items-center gap-2">
        <IconToggle
          label={selected ? 'Desmarcar rota' : 'Marcar rota'}
          pressed={selected}
          onClick={() => setSelected((v) => !v)}
        >
          <Check className="size-4" />
        </IconToggle>
        <IconToggle label="Ver todas as paradas" onClick={() => onSeeAllStops(route)}>
          <MapPin className="size-4" />
        </IconToggle>
      </div>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
        <span>{route.code}</span>
        <span>•</span>
        <span>Manifest</span>
      </div>
      <div className="font-display text-xl font-bold leading-tight">{route.driver}</div>

      <div className="mt-2 flex items-center gap-1.5">
        <Badge variant="neutral" className="border border-outline">
          {route.shift}
        </Badge>
        <Badge variant={route.status === 'validated' ? 'validated' : 'pending'}>
          {route.status === 'validated' ? 'Validated' : 'Pending'}
        </Badge>
      </div>

      <div className="mt-3 rounded-sm border border-outline-variant bg-surface-variant/25 px-3 py-2.5">
        <div className="font-mono text-[11px] tracking-wide text-on-surface">
          {route.stopsDone} / {route.stopsTotal} STOPS ({percent}%)
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
          <div
            className={cn('h-full rounded-full', isOverCapacity ? 'bg-error' : 'bg-primary')}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2 rounded-sm border border-outline-variant bg-surface/60 p-2">
          {route.specialDelivery && (
            <button
              type="button"
              onClick={() => onSpecialDeliveries(route)}
              className="rounded-sm bg-secondary-container px-2 py-1 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-on-secondary-container hover:brightness-95"
            >
              Special Deliveries
            </button>
          )}
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
            <span className="text-on-surface-variant">Veículo</span>
            <span className="font-bold">{route.vehicle}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-on-surface-variant">Target</span>
            <span className="font-bold">{route.targetPercent}%</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-end border-t border-outline-variant/50 pt-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Recolher rota' : 'Expandir rota'}
          aria-expanded={expanded}
          className="flex size-6 items-center justify-center rounded-sm bg-primary-bright text-on-primary-container hover:brightness-95"
        >
          {expanded ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
        </button>
      </div>

      <div className="border-t border-outline-variant/50 pt-3">
        {isOverCapacity ? (
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-full bg-background"
            onClick={() => onRebalance(route)}
          >
            <Split /> Rebalance
          </Button>
        ) : (
          <Button
            variant="lime"
            size="sm"
            className="h-8 w-full"
            disabled={route.status === 'validated'}
            onClick={() => onValidate(route)}
          >
            <CheckCircle2 /> {route.status === 'validated' ? 'Validated' : 'Validate'}
          </Button>
        )}
      </div>
    </div>
  )
}

function IconToggle({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-sm border border-outline',
        pressed
          ? 'bg-primary-bright text-on-primary-container'
          : 'bg-background text-on-surface hover:bg-surface-variant/50',
      )}
    >
      {children}
    </button>
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
