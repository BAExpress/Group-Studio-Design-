import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Route } from '@/types'

export function SendToDriversDialog({
  open,
  onOpenChange,
  routes,
  onConfirmed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  routes: Route[]
  onConfirmed: (count: number) => void
}) {
  const ready = routes.filter((r) => r.status === 'validated')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Send to Drivers</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <p className="font-mono text-xs text-on-surface-variant">
            {ready.length} de {routes.length} rotas estão validadas e prontas para envio aos
            motoristas.
          </p>
          {ready.length < routes.length && (
            <p className="font-mono text-[11px] text-on-surface-variant">
              Rotas ainda pendentes não serão incluídas no envio.
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={ready.length === 0}
            onClick={() => {
              onConfirmed(ready.length)
              onOpenChange(false)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
