import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AddFlexRouteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [code, setCode] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Flex Route</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Label htmlFor="route-code" className="mb-1.5 block">
              Route Name (e.g. ME15 6AB)
            </Label>
            <Input id="route-code" placeholder="Enter route code..." value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Assigned Driver</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carlos">Carlos Silva</SelectItem>
                <SelectItem value="ana">Ana Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="lime" onClick={() => onOpenChange(false)}>
            Create Route
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
