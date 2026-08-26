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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import type { Route } from '@/types'

export function AddPostcodeDialog({
  open,
  onOpenChange,
  routes,
  defaultRouteId,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  routes: Route[]
  defaultRouteId?: string
  onSaved: (route: Route) => void
}) {
  const [routeId, setRouteId] = useState(defaultRouteId ?? routes[0]?.id ?? '')
  const [postcodes, setPostcodes] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setRouteId(defaultRouteId ?? routes[0]?.id ?? '')
      setSelected([])
      setError(null)
      api.getPostcodes().then(setPostcodes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultRouteId])

  function toggle(code: string) {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }

  async function handleSave() {
    if (!routeId || selected.length === 0) {
      setError('Selecione a rota e ao menos um postcode.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const route = await api.addPostcodes(routeId, selected)
      onSaved(route)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao adicionar postcode')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add_Postcode</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="postcode-route">Route name</Label>
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger id="postcode-route">
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
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Select_Maps (all_postcode)</Label>
            <div className="max-h-48 overflow-y-auto rounded-sm border border-outline-variant">
              {postcodes.map((code) => (
                <label
                  key={code}
                  className="flex items-center gap-2 border-b border-outline-variant px-2 py-1.5 font-mono text-xs last:border-b-0 hover:bg-surface-variant"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(code)}
                    onChange={() => toggle(code)}
                    className="accent-primary"
                  />
                  {code}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="font-mono text-[11px] text-error">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={saving} onClick={handleSave}>
            {saving ? 'Salvando…' : 'OK'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
