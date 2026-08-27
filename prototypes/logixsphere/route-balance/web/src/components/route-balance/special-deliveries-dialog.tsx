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
import type { SpecialDeliveryRow } from '@/types'

export function SpecialDeliveriesDialog({
  routeId,
  onOpenChange,
}: {
  routeId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const [rows, setRows] = useState<SpecialDeliveryRow[] | null>(null)

  useEffect(() => {
    if (!routeId) {
      setRows(null)
      return
    }
    api.getSpecialDeliveries(routeId).then(setRows)
  }, [routeId])

  return (
    <Dialog open={routeId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Special Deliveries</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {!rows ? (
            <p className="font-mono text-xs text-on-surface-variant">Carregando…</p>
          ) : rows.length === 0 ? (
            <p className="font-mono text-xs text-on-surface-variant">
              Nenhuma entrega especial nesta rota.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto rounded-sm border border-outline-variant">
              <table className="w-full font-mono text-[11px]">
                <thead className="sticky top-0 bg-surface-variant text-on-surface-variant">
                  <tr>
                    {['Postcode', 'Customer', 'Category'].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-outline-variant">
                      <td className="px-2 py-1.5">{row.postcode}</td>
                      <td className="px-2 py-1.5">{row.customer}</td>
                      <td className="px-2 py-1.5">
                        <Badge variant="info">{row.category}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
