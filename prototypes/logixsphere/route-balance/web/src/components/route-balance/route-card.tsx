import { Download, RotateCcw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { groupBySubpostcode, type RouteRow, type ShiftKey } from '@/data/route-domain'

interface RouteCardProps {
  route: RouteRow
  shift: ShiftKey
  onToggleExpand: () => void
  onShipmentDetails: () => void
  onSpecialDeliveries: () => void
  onAllStops: () => void
  onToggleApproval: () => void
  onExportCsv: () => void
  onRevert: () => void
  dragActive: boolean
  isDropTarget: boolean
  onStartDrag: (stopIds: number[], label: string) => void
  onEndDrag: () => void
  onDragEnterCard: () => void
  onDragLeaveCard: () => void
  onDropCard: () => void
}

export function RouteCard({
  route,
  shift,
  onToggleExpand,
  onShipmentDetails,
  onSpecialDeliveries,
  onAllStops,
  onToggleApproval,
  onExportCsv,
  onRevert,
  dragActive,
  isDropTarget,
  onStartDrag,
  onEndDrag,
  onDragEnterCard,
  onDragLeaveCard,
  onDropCard,
}: RouteCardProps) {
  const stops = route.stops.filter((s) => (shift === 'pm' ? s.pm : !s.pm))
  const done = stops.filter((s) => s.status === 'completed').length
  const p = stops.length ? Math.round((done / stops.length) * 100) : 0
  const over = p >= 100
  const allGroups = groupBySubpostcode(stops)
  const groups = allGroups.slice(0, 2)
  const specialCount = stops.filter((s) => s.pre12 || s.asr || s.dsr).length
  const sendStatus = route.sendStatus[shift]

  return (
    <article
      onDragOver={(e) => {
        if (!dragActive) return
        e.preventDefault()
      }}
      onDragEnter={() => dragActive && onDragEnterCard()}
      onDragLeave={(e) => {
        if (!dragActive) return
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        onDragLeaveCard()
      }}
      onDrop={(e) => {
        if (!dragActive) return
        e.preventDefault()
        onDropCard()
      }}
      className={cn(
        'flex flex-col gap-3 rounded-[3px] border bg-surface p-4 shadow-[var(--rb-card-shadow)] transition-colors',
        isDropTarget ? 'border-primary-bright ring-2 ring-primary-bright' : 'border-outline-variant',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onToggleApproval}
            aria-pressed={sendStatus !== 'pending'}
            title={
              sendStatus === 'sent'
                ? `Sent to ${route.driver} (${shift.toUpperCase()})`
                : sendStatus === 'approved'
                  ? 'Approved for sending — click to withdraw'
                  : 'Click to approve for sending'
            }
            className={cn(
              'flex size-[26px] items-center justify-center rounded-sm border text-on-surface-variant',
              sendStatus === 'sent' && 'border-primary bg-primary text-on-primary',
              sendStatus === 'approved' && 'border-primary-bright bg-primary-container text-primary',
              sendStatus === 'pending' && 'border-outline hover:border-secondary hover:text-secondary',
            )}
          >
            ✓
          </button>
          <button
            type="button"
            onClick={onShipmentDetails}
            aria-label="Shipment Details"
            className="flex size-[26px] items-center justify-center rounded-sm border border-outline text-on-surface-variant hover:border-secondary hover:text-secondary"
          >
            ⚲
          </button>
        </div>
        <div className="flex gap-1.5">
          {route.lastAction && (
            <button
              type="button"
              onClick={onRevert}
              aria-label="Revert last action"
              title="Revert last action"
              className="flex size-[26px] items-center justify-center rounded-sm border border-outline text-on-surface-variant hover:border-tertiary hover:text-tertiary"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
          {over && (
            <button
              type="button"
              className="flex size-[26px] items-center justify-center rounded-sm border border-outline text-on-surface-variant hover:border-secondary hover:text-secondary"
            >
              ⇄
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-primary">Route {route.name} • Manifest</div>
        <div className="font-display mt-0.5 text-lg font-bold">{route.driver}</div>
        <div className="mt-0.5 text-[11.5px] text-on-surface-variant">{route.plate}</div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="chip">{shift.toUpperCase()}</Badge>
        {!over && <Badge variant="pending">Pending</Badge>}
        {sendStatus === 'sent' && (
          <Badge variant="validated" className="border border-primary">
            Sent
          </Badge>
        )}
      </div>

      <div className="rounded-sm border border-outline-variant bg-surface-variant px-3 py-2.5">
        <div className="text-xs font-semibold">
          {done} / {stops.length} stops ({p}%)
        </div>
        <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-outline-variant">
          <div className={cn('h-full', over ? 'bg-error' : 'bg-primary')} style={{ width: `${Math.min(p, 100)}%` }} />
        </div>
      </div>

      {route.expanded && (
        <div>
          <button
            type="button"
            onClick={onSpecialDeliveries}
            className="w-full justify-center rounded-sm border border-secondary bg-secondary-container px-3 py-2 text-center font-mono text-[11.5px] font-bold tracking-wide text-secondary"
          >
            Special Deliveries ★ {specialCount > 0 && `(${specialCount})`}
          </button>
          <table className="mt-2 w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Subpostcode</th>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Del</th>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Pu</th>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Total</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr
                  key={g.code}
                  draggable
                  title={`Drag to move ${g.code} to another route`}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move'
                    const stopIds = g.postcodes.flatMap((pc) => pc.stops.map((s) => s.id))
                    onStartDrag(stopIds, g.code)
                  }}
                  onDragEnd={onEndDrag}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">{g.code}</td>
                  <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">{g.del}</td>
                  <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">{g.pu}</td>
                  <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">
                    <Badge variant="outline-secondary">
                      {g.postcodes.length} POSTCODE{g.postcodes.length === 1 ? '' : 'S'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allGroups.length > 0 && (
            <p className="mt-1.5 text-[9.5px] text-on-surface-variant">Arraste um postcode pra outra rota pra mover.</p>
          )}
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1 gap-1.5 text-[10.5px]" onClick={onExportCsv}>
              <Download className="size-3" /> Export CSV
            </Button>
            <Button variant="primary" size="sm" className="flex-1 text-[10.5px]" onClick={onAllStops}>
              See All Stops
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <div className="rounded-sm border border-outline-variant bg-surface-variant px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-wide text-on-surface-variant">Deliveries</div>
              <div className="font-display mt-0.5 text-[15px] font-bold">{stops.filter((s) => s.type === 'DEL').length}</div>
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface-variant px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-wide text-on-surface-variant">Pickups</div>
              <div className="font-display mt-0.5 text-[15px] font-bold">{stops.filter((s) => s.type === 'PU').length}</div>
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface-variant px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-wide text-on-surface-variant">Pre 12</div>
              <div className="font-display mt-0.5 text-[15px] font-bold">{stops.filter((s) => s.pre12).length}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-sm border border-outline-variant bg-surface-variant px-2.5 py-2 text-[11px]">
            <span>Target</span>
            <b className="font-display text-sm">{route.target}%</b>
          </div>
        </div>
      )}

      <hr className="border-outline-variant" />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex size-[26px] items-center justify-center rounded-sm border border-primary-bright bg-primary-container text-primary"
        >
          {route.expanded ? '−' : '+'}
        </button>
      </div>

      {over ? (
        <Button variant="secondary" className="w-full justify-center">
          ⇄ Rebalance
        </Button>
      ) : (
        <Button variant="lime" className="w-full justify-center">
          ✓ Validate
        </Button>
      )}
    </article>
  )
}
