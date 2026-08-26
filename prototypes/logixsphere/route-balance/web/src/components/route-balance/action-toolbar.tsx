import { ArrowRightCircle, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ActionToolbar({
  search,
  onSearchChange,
  onAddPostCode,
  onCollapseRoutes,
  onPmAsrDsrListing,
  onShipmentDetails,
  onAddFlexRoute,
  onSendToRebalance,
}: {
  search: string
  onSearchChange: (value: string) => void
  onAddPostCode: () => void
  onCollapseRoutes: () => void
  onPmAsrDsrListing: () => void
  onShipmentDetails: () => void
  onAddFlexRoute: () => void
  onSendToRebalance: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant bg-surface px-6 py-3">
      <span className="rounded-sm bg-primary-container px-2 py-1.5 font-mono text-[11px] font-bold text-on-primary-container">
        Route Balance
      </span>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-on-surface-variant" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search routes…"
          className="h-8 w-48 rounded-sm border border-outline bg-background pl-7 font-mono text-[11px] text-on-surface placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <Button variant="secondary" size="sm" onClick={onAddPostCode}>
        Add Post Code
      </Button>
      <Button variant="secondary" size="sm" onClick={onCollapseRoutes}>
        Collapse Routes
      </Button>
      <Button variant="secondary" size="sm" onClick={onPmAsrDsrListing}>
        PM ASR/DSR Listing
      </Button>
      <Button variant="secondary" size="sm" onClick={onShipmentDetails}>
        Shipment Details
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" onClick={onAddFlexRoute}>
          <Plus /> Add New Flex Route
        </Button>
        <Button variant="destructive" size="sm" onClick={onSendToRebalance}>
          <ArrowRightCircle /> Send to Rebalance
        </Button>
      </div>
    </div>
  )
}
