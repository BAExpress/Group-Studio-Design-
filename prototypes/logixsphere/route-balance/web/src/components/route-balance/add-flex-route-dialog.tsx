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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import type { Driver, Route } from '@/types'

export function AddFlexRouteDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (route: Route) => void
}) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [code, setCode] = useState('')
  const [driverId, setDriverId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) api.getDrivers().then(setDrivers)
  }, [open])

  useEffect(() => {
    if (!open) {
      setCode('')
      setDriverId('')
      setError(null)
    }
  }, [open])

  async function handleSave() {
    if (!code.trim() || !driverId) {
      setError('Informe o código da rota e o motorista.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const route = await api.createFlexRoute({ code: code.trim(), driverId })
      onCreated(route)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar rota')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add New Flex Route</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="route-name">Route name (e.g. ME16 A48)</Label>
            <Input
              id="route-name"
              placeholder="Enter route code…"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assigned-driver">Assigned driver</Label>
            <Select value={driverId} onValueChange={setDriverId}>
              <SelectTrigger id="assigned-driver">
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="font-mono text-[11px] text-error">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={saving} onClick={handleSave}>
            {saving ? 'Salvando…' : 'Save route'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
