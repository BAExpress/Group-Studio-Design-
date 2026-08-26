import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import type { Route, ShipmentDetails } from '@/types'

export function ShipmentDetailsDialog({
  open,
  onOpenChange,
  routes,
  defaultRouteId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  routes: Route[]
  defaultRouteId?: string
}) {
  const [routeId, setRouteId] = useState(defaultRouteId ?? routes[0]?.id ?? '')
  const [details, setDetails] = useState<ShipmentDetails | null>(null)

  useEffect(() => {
    if (open) setRouteId(defaultRouteId ?? routes[0]?.id ?? '')
  }, [open, defaultRouteId, routes])

  useEffect(() => {
    if (open && routeId) {
      setDetails(null)
      api.getShipmentDetails(routeId).then(setDetails)
    }
  }, [open, routeId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Shipment Details {details ? `/ ${details.routeId}` : ''}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          {routes.length > 1 && (
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a rota" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!details ? (
            <p className="font-mono text-xs text-on-surface-variant">Carregando…</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <Field label="Route ID" value={details.routeId} />
              <Field label="Driver" value={details.driver} />
              <Field label="Vehicle" value={details.vehicle} />
              <Field label="Total Stops" value={String(details.totalStops)} />
              <Field
                label="Deliveries / Pickups"
                value={`${details.deliveries} / ${details.pickups}`}
              />
              <Field label="Soma Peso (KG)" value={details.totalWeightKg.toFixed(2)} />
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-outline-variant p-2">
      <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  )
}
