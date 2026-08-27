import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RouteRow } from '@/data/route-domain'

interface AddPostcodeDialogProps {
  open: boolean
  routes: RouteRow[]
  onOpenChange: (v: boolean) => void
  onConfirm: (code: string, type: 'postcode' | 'subpostcode', routeId: string) => boolean
}

// Portado de "Add Postcode" em RouteBalance.tsx — validação real de formato
// (postcode completo vs subpostcode) e seleção de rota (ou todas).
export function AddPostcodeDialog({ open, routes, onOpenChange, onConfirm }: AddPostcodeDialogProps) {
  const [type, setType] = useState<'postcode' | 'subpostcode'>('postcode')
  const [code, setCode] = useState('')
  const [routeId, setRouteId] = useState<string>('')

  function handleConfirm() {
    if (onConfirm(code, type, routeId)) {
      onOpenChange(false)
      setCode('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Postcode</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Select Type</Label>
            <div className="flex overflow-hidden rounded-sm border border-outline">
              <button
                type="button"
                onClick={() => setType('postcode')}
                className={`flex-1 px-3 py-2 font-mono text-[11px] ${type === 'postcode' ? 'bg-primary font-semibold text-on-primary' : 'bg-surface text-on-surface-variant'}`}
              >
                Postcode
              </button>
              <button
                type="button"
                onClick={() => setType('subpostcode')}
                className={`flex-1 px-3 py-2 font-mono text-[11px] ${type === 'subpostcode' ? 'bg-primary font-semibold text-on-primary' : 'bg-surface text-on-surface-variant'}`}
              >
                Subpostcode
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-on-surface-variant">
              {type === 'postcode' ? 'Full postcode, e.g. ME15 6AB' : 'Area code, e.g. ME15'}
            </p>
          </div>
          <div>
            <Label htmlFor="postcode-code" className="mb-1.5 block">
              Code
            </Label>
            <Input
              id="postcode-code"
              placeholder={type === 'postcode' ? 'e.g. ME15 6AB' : 'e.g. ME15'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Select Route (Optional)</Label>
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger>
                <SelectValue placeholder="All routes" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    Route {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="lime" onClick={handleConfirm}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
