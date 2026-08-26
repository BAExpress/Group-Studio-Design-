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
import type { AsrDsrRow } from '@/types'

export function PmAsrDsrListingDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [rows, setRows] = useState<AsrDsrRow[] | null>(null)

  useEffect(() => {
    if (open) {
      setRows(null)
      api.getAsrDsrListing().then(setRows)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>PM ASR/DSR Listing</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {!rows ? (
            <p className="font-mono text-xs text-on-surface-variant">Carregando…</p>
          ) : (
            <div className="max-h-96 overflow-y-auto rounded-sm border border-outline-variant">
              <table className="w-full font-mono text-[11px]">
                <thead className="sticky top-0 bg-surface-variant text-on-surface-variant">
                  <tr>
                    {['Route', 'Driver', 'Postcode', 'Customer', 'Category', 'Status'].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-outline-variant">
                      <td className="px-2 py-1.5">{row.route}</td>
                      <td className="px-2 py-1.5">{row.driver}</td>
                      <td className="px-2 py-1.5">{row.postcode}</td>
                      <td className="px-2 py-1.5">{row.customer}</td>
                      <td className="px-2 py-1.5">
                        <Badge variant="info">{row.category}</Badge>
                      </td>
                      <td className="px-2 py-1.5">
                        <Badge variant={row.status === 'DELIVERED' ? 'validated' : 'pending'}>
                          {row.status}
                        </Badge>
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
