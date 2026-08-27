import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableCell, TableHead, TableRow, TableScroll } from '@/components/ui/table'
import type { RouteRow, ShiftKey, Stop } from '@/data/route-domain'

interface AllStopsDialogProps {
  route: RouteRow | null
  shift: ShiftKey
  onOpenChange: (v: boolean) => void
  onEditStop: (stop: Stop) => void
}

export function AllStopsDialog({ route, shift, onOpenChange, onEditStop }: AllStopsDialogProps) {
  const stops = route ? route.stops.filter((s) => (shift === 'pm' ? s.pm : !s.pm)) : []
  const pre12 = stops.filter((s) => s.pre12).length
  const asr = stops.filter((s) => s.asr).length
  const dsr = stops.filter((s) => s.dsr).length

  return (
    <Dialog open={!!route} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>All Stops / Route {route?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="mb-3.5 flex flex-wrap gap-2">
            <div className="min-w-[88px] rounded-sm border border-outline-variant bg-surface-variant px-3 py-2 text-[10.5px]">
              <div className="text-[9.5px] uppercase tracking-wide text-on-surface-variant">Pre 12</div>
              <div className="font-display mt-0.5 text-base font-bold">{pre12}</div>
            </div>
            <div className="min-w-[88px] rounded-sm border border-secondary bg-secondary-container px-3 py-2 text-[10.5px] text-secondary">
              <div className="text-[9.5px] uppercase tracking-wide">ASR</div>
              <div className="font-display mt-0.5 text-base font-bold">{asr}</div>
            </div>
            <div className="min-w-[88px] rounded-sm border border-outline-variant bg-surface-variant px-3 py-2 text-[10.5px]">
              <div className="text-[9.5px] uppercase tracking-wide text-on-surface-variant">DSR</div>
              <div className="font-display mt-0.5 text-base font-bold">{dsr}</div>
            </div>
          </div>
          <p className="mb-2 text-[10.5px] text-on-surface-variant">Clique numa parada para editar postcode / Pre-12.</p>
          <TableScroll className="max-h-[48vh]">
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Postcode</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Flag</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {stops.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => onEditStop(s)}>
                    <TableCell>{s.address}</TableCell>
                    <TableCell>{s.postcode}</TableCell>
                    <TableCell>{s.customer}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <span className="rounded-sm border border-outline-variant bg-chip px-1 py-0.5 text-[9px] font-bold">{s.type}</span>
                        {s.pre12 && (
                          <span className="rounded-sm border border-tertiary bg-tertiary-container px-1 py-0.5 text-[9px] font-bold text-tertiary">
                            PRE 12
                          </span>
                        )}
                        {s.asr && (
                          <span className="rounded-sm border border-secondary bg-secondary-container px-1 py-0.5 text-[9px] font-bold text-secondary">
                            ASR
                          </span>
                        )}
                        {s.dsr && <span className="rounded-sm border border-outline-variant bg-chip px-1 py-0.5 text-[9px] font-bold">DSR</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
