import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Stop } from '@/data/route-domain'

interface EditStopDialogProps {
  stop: Stop | null
  postcodeVal: string
  pre12Val: boolean
  scope: 'single' | 'all'
  onPostcodeChange: (v: string) => void
  onPre12Change: (v: boolean) => void
  onScopeChange: (v: 'single' | 'all') => void
  onCancel: () => void
  onSave: () => void
}

// Portado de "Edit Stop" em RouteBalance.tsx (produção) — muda postcode/Pre-12
// de uma parada só, ou de todas as paradas com o mesmo postcode na rota.
export function EditStopDialog({
  stop,
  postcodeVal,
  pre12Val,
  scope,
  onPostcodeChange,
  onPre12Change,
  onScopeChange,
  onCancel,
  onSave,
}: EditStopDialogProps) {
  return (
    <Dialog open={!!stop} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Stop</DialogTitle>
        </DialogHeader>
        {stop && (
          <DialogBody className="space-y-4">
            <div className="rounded-sm border border-outline-variant bg-surface-variant px-3 py-2.5 text-xs">
              <div className="text-on-surface-variant">{stop.address}</div>
              <div className="mt-0.5 text-on-surface-variant">{stop.customer}</div>
            </div>
            <div>
              <Label htmlFor="edit-postcode" className="mb-1.5 block">
                Postcode
              </Label>
              <Input id="edit-postcode" value={postcodeVal} onChange={(e) => onPostcodeChange(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={pre12Val}
                disabled={stop.pm}
                onChange={(e) => onPre12Change(e.target.checked)}
                className="size-4 accent-[var(--rb-olive)]"
              />
              Pre 12{stop.pm && <span className="text-on-surface-variant"> (indisponível em paradas PM)</span>}
            </label>
            <div>
              <Label className="mb-1.5 block">Scope</Label>
              <div className="flex overflow-hidden rounded-sm border border-outline">
                <button
                  type="button"
                  onClick={() => onScopeChange('single')}
                  className={`flex-1 px-3 py-2 font-mono text-[11px] ${scope === 'single' ? 'bg-primary font-semibold text-on-primary' : 'bg-surface text-on-surface-variant'}`}
                >
                  This stop
                </button>
                <button
                  type="button"
                  onClick={() => onScopeChange('all')}
                  className={`flex-1 px-3 py-2 font-mono text-[11px] ${scope === 'all' ? 'bg-primary font-semibold text-on-primary' : 'bg-surface text-on-surface-variant'}`}
                >
                  All stops at {stop.postcode}
                </button>
              </div>
            </div>
          </DialogBody>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="lime" onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
