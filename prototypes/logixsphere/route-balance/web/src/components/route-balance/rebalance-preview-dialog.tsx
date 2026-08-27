import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function RebalancePreviewDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rebalance Preview - Route A-01</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="mb-4 rounded-sm border border-outline-variant bg-surface-variant p-3.5">
            <div className="font-display text-[15px] font-bold">Carlos Silva</div>
            <div className="mt-2.5 flex gap-2.5">
              <div className="flex-1 rounded-sm border border-outline-variant bg-surface px-2.5 py-2">
                <div className="text-[9.5px] uppercase tracking-wide text-on-surface-variant">Total Stops</div>
                <div className="font-display text-base font-bold">17</div>
              </div>
              <div className="flex-1 rounded-sm border border-outline-variant bg-surface px-2.5 py-2">
                <div className="text-[9.5px] uppercase tracking-wide text-on-surface-variant">Progress</div>
                <Badge variant="validated" className="mt-1 text-xs">62%</Badge>
              </div>
            </div>
          </div>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Subpostcode</th>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Del</th>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Pu</th>
                <th className="border-b border-outline-variant bg-surface-variant px-2 py-1.5 text-left text-[9.5px] uppercase tracking-wide text-on-surface-variant">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">ME5</td>
                <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">2</td>
                <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">0</td>
                <td className="border-b border-outline-variant px-2 py-1.5 tabular-nums">2</td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 tabular-nums">ME6</td>
                <td className="px-2 py-1.5 tabular-nums">2</td>
                <td className="px-2 py-1.5 tabular-nums">2</td>
                <td className="px-2 py-1.5 tabular-nums">4</td>
              </tr>
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="lime" onClick={() => onOpenChange(false)}>
            Confirm Rebalance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
