import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import type { Route } from '@/types'

export function SendToRebalanceDialog({
  open,
  onOpenChange,
  routes,
  onConfirmed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  routes: Route[]
  onConfirmed: (routes: Route[]) => void
}) {
  const [busy, setBusy] = useState(false)
  const affected = routes.filter((r) => r.capacityState === 'rebalance')

  async function handleConfirm() {
    setBusy(true)
    try {
      const result = await api.sendToRebalance()
      onConfirmed(result.routes)
      onOpenChange(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Send to Rebalance</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          {affected.length === 0 ? (
            <p className="font-mono text-xs text-on-surface-variant">
              Nenhuma rota está em estado de rebalanceamento no momento.
            </p>
          ) : (
            <>
              <p className="font-mono text-xs text-on-surface-variant">
                {affected.length} rota{affected.length > 1 ? 's serão' : ' será'} enviada
                {affected.length > 1 ? 's' : ''} para rebalanceamento:
              </p>
              <ul className="flex flex-col gap-1 font-mono text-[11px]">
                {affected.map((r) => (
                  <li key={r.id} className="rounded-sm bg-error-container px-2 py-1 text-on-error-container">
                    {r.code} — {r.driver}
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={busy || affected.length === 0}
            onClick={handleConfirm}
          >
            {busy ? 'Enviando…' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
