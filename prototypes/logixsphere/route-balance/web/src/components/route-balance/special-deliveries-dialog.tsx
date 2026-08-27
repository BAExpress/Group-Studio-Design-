import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableCell, TableHead, TableRow, TableScroll } from '@/components/ui/table'
import type { RouteRow, ShiftKey } from '@/data/route-domain'

export function SpecialDeliveriesDialog({
  route,
  shift,
  onOpenChange,
}: {
  route: RouteRow | null
  shift: ShiftKey
  onOpenChange: (v: boolean) => void
}) {
  const stops = route
    ? route.stops.filter((s) => (shift === 'pm' ? s.pm : !s.pm)).filter((s) => s.pre12 || s.asr || s.dsr)
    : []

  return (
    <Dialog open={!!route} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Special Deliveries — Route {route?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TableScroll className="max-h-[60vh]">
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Postcode</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {stops.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-on-surface-variant">
                      Nenhuma parada Pre-12/ASR/DSR neste turno.
                    </TableCell>
                  </TableRow>
                )}
                {stops.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.postcode}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {row.pre12 && (
                          <span className="rounded-sm bg-tertiary-container px-1.5 py-0.5 text-[10px] font-bold text-tertiary">PRE 12</span>
                        )}
                        {row.dsr && <span className="rounded-sm bg-secondary-container px-1.5 py-0.5 text-[10px] font-bold text-secondary">DSR</span>}
                        {row.asr && <span className="rounded-sm bg-chip px-1.5 py-0.5 text-[10px] font-bold text-on-surface">ASR</span>}
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
