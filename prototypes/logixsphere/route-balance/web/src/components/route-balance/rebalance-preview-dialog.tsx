import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import type { RebalancePreview, Route } from '@/types'

export function RebalancePreviewDialog({
  route,
  onOpenChange,
  onConfirmed,
}: {
  route: Route | null
  onOpenChange: (open: boolean) => void
  onConfirmed: (route: Route) => void
}) {
  const [preview, setPreview] = useState<RebalancePreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!route) {
      setPreview(null)
      return
    }
    setLoading(true)
    api
      .getRebalancePreview(route.id)
      .then(setPreview)
      .finally(() => setLoading(false))
  }, [route])

  async function handleConfirm() {
    if (!route) return
    setConfirming(true)
    try {
      const updated = await api.commitRebalance(route.id)
      onConfirmed(updated)
      onOpenChange(false)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Dialog open={route !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Rebalance Preview — {route?.code ?? '···'}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {loading || !preview ? (
            <p className="font-mono text-xs text-on-surface-variant">Carregando…</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="font-display text-base font-bold">
                {preview.driver.toUpperCase()}
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="text-on-surface-variant">
                  TOTAL STOPS <span className="font-bold text-on-surface">{preview.totalStops}</span>
                </span>
                <span className="rounded-sm bg-primary-container px-1.5 py-0.5 font-bold text-on-primary-container">
                  PROGRESS {preview.progressPercent}%
                </span>
              </div>
              <Progress value={preview.progressPercent} />
              <table className="w-full font-mono text-[11px]">
                <thead>
                  <tr className="text-on-surface-variant">
                    <th className="pb-1 text-left font-normal">Subpostcode</th>
                    <th className="pb-1 text-left font-normal">Del</th>
                    <th className="pb-1 text-left font-normal">PU</th>
                    <th className="pb-1 text-right font-normal">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.subpostcodes.map((row) => (
                    <tr key={row.code} className="border-t border-outline-variant">
                      <td className="py-1">{row.code}</td>
                      <td className="py-1 text-on-surface-variant">{row.del}</td>
                      <td className="py-1 text-on-surface-variant">{row.pu}</td>
                      <td className="py-1 text-right font-bold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={confirming || loading} onClick={handleConfirm}>
            {confirming ? 'Aplicando…' : 'Confirm rebalance'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
