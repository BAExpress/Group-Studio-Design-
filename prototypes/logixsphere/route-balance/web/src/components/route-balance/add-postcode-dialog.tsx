import { Check, ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
import { cn } from '@/lib/utils'
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setRouteId(defaultRouteId ?? routes[0]?.id ?? '')
      setSelected([])
      setPickerOpen(false)
      setError(null)
      api.getPostcodes().then(setPostcodes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultRouteId])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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
            <Label htmlFor="postcode-route">Code_Input</Label>
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

          <div ref={pickerRef} className="relative flex flex-col gap-1.5">
            <Label>Select_Route [opt]</Label>
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-outline bg-surface px-2 py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {selected.length === 0 ? (
                <span className="font-mono text-xs text-on-surface-variant">ALL_POSTCODES</span>
              ) : (
                selected.map((code) => (
                  <span
                    key={code}
                    className="flex items-center gap-1 rounded-sm bg-surface-variant px-1.5 py-0.5 font-mono text-[11px] text-on-surface-variant"
                  >
                    {code}
                    <X
                      className="size-3 hover:text-error"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(code)
                      }}
                    />
                  </span>
                ))
              )}
              <ChevronDown className="ml-auto size-4 shrink-0 text-on-surface-variant" />
            </button>

            {pickerOpen && (
              <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-sm border border-outline-variant bg-surface shadow-md">
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-left font-mono text-xs hover:bg-surface-variant"
                >
                  <Check className={cn('size-3.5', selected.length > 0 && 'invisible')} />
                  ALL_POSTCODES
                </button>
                {postcodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggle(code)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left font-mono text-xs hover:bg-surface-variant"
                  >
                    <Check className={cn('size-3.5', !selected.includes(code) && 'invisible')} />
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="font-mono text-[11px] text-error">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={saving} onClick={handleSave}>
            {saving ? 'Salvando…' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
