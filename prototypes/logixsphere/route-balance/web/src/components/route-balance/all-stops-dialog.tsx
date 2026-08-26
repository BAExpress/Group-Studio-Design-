import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import type { StopsSummary } from '@/types'

export function AllStopsDialog({
  routeId,
  onOpenChange,
}: {
  routeId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const [summary, setSummary] = useState<StopsSummary | null>(null)

  useEffect(() => {
    if (!routeId) {
      setSummary(null)
      return
    }
    api.getStops(routeId).then(setSummary)
  }, [routeId])

  return (
    <Dialog open={routeId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>All Stops {summary ? `/ ${summary.routeCode}` : ''}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {!summary ? (
            <p className="font-mono text-xs text-on-surface-variant">Carregando…</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <Chip label="PRE 12" value={summary.preNoon} />
                <Chip label="ASR" value={summary.asrCount} />
                <Chip label="DSR" value={summary.dsrCount} />
                <Chip label="SORT: NO-SHOW" value={summary.noShowCount} tone="error" />
              </div>
              <div className="max-h-80 overflow-y-auto rounded-sm border border-outline-variant">
                <table className="w-full font-mono text-[11px]">
                  <thead className="sticky top-0 bg-surface-variant text-on-surface-variant">
                    <tr>
                      {['Address', 'Postcode', 'Customer', 'Category', 'Status'].map((h) => (
                        <th key={h} className="px-2 py-1.5 text-left font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.stops.map((stop, i) => (
                      <tr key={i} className="border-t border-outline-variant">
                        <td className="px-2 py-1.5">{stop.address}</td>
                        <td className="px-2 py-1.5">{stop.postcode}</td>
                        <td className="px-2 py-1.5">{stop.customer}</td>
                        <td className="px-2 py-1.5">
                          <Badge variant="info">{stop.category}</Badge>
                        </td>
                        <td className="px-2 py-1.5">
                          <Badge variant={stop.status === 'DELIVERED' ? 'validated' : 'pending'}>
                            {stop.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: 'error'
}) {
  return (
    <span
      className={
        tone === 'error'
          ? 'rounded-sm bg-error-container px-2 py-1 font-bold text-on-error-container'
          : 'rounded-sm bg-surface-variant px-2 py-1 text-on-surface-variant'
      }
    >
      {label}: <span className="font-bold text-on-surface">{value}</span>
    </span>
  )
}
