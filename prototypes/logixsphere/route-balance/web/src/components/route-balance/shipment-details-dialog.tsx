import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableCell, TableHead, TableRow, TableScroll } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { allStops, postcodeAreaDeliveries, shipmentBreakdown } from '@/data/mock'
import type { RouteRow, ShiftKey } from '@/data/route-domain'

function DetailCell({ label, value, border = true }: { label: string; value: ReactNode; border?: boolean }) {
  return (
    <div className={cn('flex-1 p-3', border && 'border-l border-outline-variant first:border-l-0')}>
      <div className="mb-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant">{label}</div>
      <div className="font-display text-[15px] font-bold">{value}</div>
    </div>
  )
}

function PostcodeAreaRow({ postcode, stops, pct }: { postcode: string; stops: number; pct: number }) {
  const [expanded, setExpanded] = useState(false)
  const matchingStops = allStops.filter((s) => s.postcode.startsWith(postcode))

  return (
    <div className="mb-2 overflow-hidden rounded-sm border border-outline-variant last:mb-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
        aria-expanded={expanded}
      >
        <ChevronDown className={cn('size-4 shrink-0 transition-transform', expanded && 'rotate-180')} />
        <span className="inline-block rounded-sm border border-secondary bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-secondary">
          {postcode}
        </span>
        <span className="text-xs">{stops} stops</span>
        <span className="rounded-sm border border-tertiary bg-tertiary-container px-1.5 py-0.5 text-[9px] font-bold text-tertiary">
          PRE 12
        </span>
        <span className="ml-auto rounded-sm border border-primary-bright bg-primary-container px-2 py-0.5 text-xs">{pct}%</span>
      </button>
      <div className="h-[3px] bg-outline-variant">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      {expanded && (
        <div className="border-t border-outline-variant px-3 py-2.5">
          {matchingStops.length === 0 ? (
            <p className="text-[11px] text-on-surface-variant">Sem paradas de exemplo para este postcode.</p>
          ) : (
            <ul className="space-y-1.5 text-[11px]">
              {matchingStops.map((s, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>{s.address}</span>
                  <span className="text-on-surface-variant">{s.customer}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export function ShipmentDetailsDialog({
  route,
  shift,
  onOpenChange,
}: {
  route: RouteRow | null
  shift: ShiftKey
  onOpenChange: (v: boolean) => void
}) {
  const stops = route ? route.stops.filter((s) => (shift === 'pm' ? s.pm : !s.pm)) : []
  const done = stops.filter((s) => s.status === 'completed').length
  const completion = stops.length ? Math.round((done / stops.length) * 100) : 0
  const deliveries = stops.filter((s) => s.type === 'DEL').length
  const pickups = stops.length - deliveries
  const pre12 = stops.filter((s) => s.pre12).length
  const asr = stops.filter((s) => s.asr).length
  const dsr = stops.filter((s) => s.dsr).length

  return (
    <Dialog open={!!route} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>SHIPMENT DETAILS/ ROUTE {route?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="mb-5 overflow-hidden rounded-sm border border-outline-variant">
            <div className="border-b border-outline-variant">
              <div className="flex max-[480px]:flex-col">
                <DetailCell label="Route ID" value={`ROUTE-${route?.name}`} border={false} />
                <DetailCell label="Driver" value={route?.driver} />
              </div>
              <div className="flex">
                <DetailCell label="Vehicle" value={route?.plate} border={false} />
              </div>
            </div>
            <div className="border-b border-outline-variant">
              <div className="flex max-[480px]:flex-col">
                <DetailCell label="Total Stops" value={stops.length} border={false} />
                <DetailCell label="Deliveries / Pickups" value={`${deliveries} / ${pickups}`} />
              </div>
              <div className="flex">
                <DetailCell
                  label="Completion"
                  value={<span className="rounded-sm border border-primary-bright bg-primary-container px-2 py-0.5 text-xs">{completion}%</span>}
                  border={false}
                />
              </div>
            </div>
            <div>
              <div className="flex max-[480px]:flex-col">
                <DetailCell label="Total Pieces" value="224" border={false} />
                <DetailCell label="Soma Phys (KG)" value="9972.61" />
              </div>
              <div className="flex">
                <DetailCell label="Total Shipments" value="29" border={false} />
              </div>
            </div>
          </div>

          <h3 className="font-display mb-2.5 text-sm font-bold">Shipment Breakdown by Type</h3>
          <div className="mb-3.5 rounded-sm border border-outline-variant bg-surface-variant px-3.5 py-3">
            <div className="mb-2 text-[10px] uppercase tracking-wide text-on-surface-variant">Special Indicators</div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              Pre-12: <b className="font-display text-tertiary">{pre12}</b>
              <span className="text-outline">|</span>
              ASR: <b className="font-display text-secondary">{asr}</b>
              <span className="text-outline">|</span>
              DSR: <b className="font-display">{dsr}</b>
            </div>
          </div>
          <TableScroll>
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Pieces</TableHead>
                  <TableHead>Shipments</TableHead>
                  <TableHead>Soma Phys (KG)</TableHead>
                  <TableHead>% Total</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {shipmentBreakdown.map((row) => (
                  <TableRow key={row.type}>
                    <TableCell>
                      {row.isTotal ? (
                        <b>{row.type}</b>
                      ) : (
                        <span className="inline-block rounded-sm border border-secondary bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-secondary">
                          {row.type}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{row.pieces}</TableCell>
                    <TableCell>{row.shipments}</TableCell>
                    <TableCell>{row.soma}</TableCell>
                    <TableCell>{row.pct}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableScroll>

          <h3 className="font-display mb-2.5 mt-5 text-sm font-bold">Deliveries by Postcode Area</h3>
          <div>
            {postcodeAreaDeliveries.map((row) => (
              <PostcodeAreaRow key={row.postcode} {...row} />
            ))}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
