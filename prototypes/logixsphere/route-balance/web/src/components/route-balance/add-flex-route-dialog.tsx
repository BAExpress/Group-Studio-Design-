import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DRIVERS } from '@/data/route-domain'

interface AddFlexRouteDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (name: string, driver: string, target: string) => boolean
}

// Portado de "Add New Flex Route" / saveNewRoute() em RouteBalance.tsx —
// nome obrigatório + único, motorista da mesma lista fixa da produção
// (ainda sem diretório real de motoristas), target em %.
export function AddFlexRouteDialog({ open, onOpenChange, onConfirm }: AddFlexRouteDialogProps) {
  const [name, setName] = useState('')
  const [driver, setDriver] = useState(DRIVERS[0])
  const [target, setTarget] = useState('85')

  function handleConfirm() {
    if (onConfirm(name, driver, target)) {
      onOpenChange(false)
      setName('')
      setTarget('85')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Flex Route</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Label htmlFor="route-code" className="mb-1.5 block">
              Route Name (e.g. FX-01)
            </Label>
            <Input id="route-code" placeholder="Enter route code..." value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Assigned Driver</Label>
            <Select value={driver} onValueChange={setDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {DRIVERS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="route-target" className="mb-1.5 block">
              Target (%)
            </Label>
            <Input id="route-target" type="number" min={0} max={100} value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="lime" onClick={handleConfirm}>
            Create Route
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
