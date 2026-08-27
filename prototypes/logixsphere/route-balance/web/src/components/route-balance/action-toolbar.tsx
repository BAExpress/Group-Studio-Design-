import { ArrowRightCircle, Plus, Search, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RouteShift } from '@/types'

export type ModeFilter = 'rebalance' | 'operations'

export function ActionToolbar({
  search,
  onSearchChange,
  shiftFilter,
  onShiftFilterChange,
  modeFilter,
  onModeFilterChange,
  onImport,
  onAddPostCode,
  onCollapseRoutes,
  onPmAsrDsrListing,
  onShipmentDetails,
  onAddFlexRoute,
  onSendToDrivers,
  onSendToRebalance,
}: {
  search: string
  onSearchChange: (value: string) => void
  shiftFilter: RouteShift | null
  onShiftFilterChange: (value: RouteShift | null) => void
  modeFilter: ModeFilter | null
  onModeFilterChange: (value: ModeFilter | null) => void
  onImport: () => void
  onAddPostCode: () => void
  onCollapseRoutes: () => void
  onPmAsrDsrListing: () => void
  onShipmentDetails: () => void
  onAddFlexRoute: () => void
  onSendToDrivers: () => void
  onSendToRebalance: () => void
}) {
  return (
    <div className="flex flex-col gap-4 px-6 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Route Balance</h1>
          <p className="font-mono text-xs text-on-surface-variant">
            Operational route management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-on-surface-variant" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search routes…"
          className="h-8 w-48 rounded-sm border border-outline bg-background pl-7 font-mono text-[11px] text-on-surface placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <SegmentButton
        active={shiftFilter === 'AM'}
        onClick={() => onShiftFilterChange(shiftFilter === 'AM' ? null : 'AM')}
      >
        AM
      </SegmentButton>
      <SegmentButton
        active={shiftFilter === 'PM'}
        onClick={() => onShiftFilterChange(shiftFilter === 'PM' ? null : 'PM')}
      >
        PM
      </SegmentButton>
      <SegmentButton
        active={modeFilter === 'rebalance'}
        onClick={() => onModeFilterChange(modeFilter === 'rebalance' ? null : 'rebalance')}
      >
        Rebalance
      </SegmentButton>
      <SegmentButton
        active={modeFilter === 'operations'}
        onClick={() => onModeFilterChange(modeFilter === 'operations' ? null : 'operations')}
      >
        Operations
      </SegmentButton>

        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-outline-variant pt-4">
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
      <Button size="sm" onClick={onImport}>
        <Upload /> Importar
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="lime" size="sm" className="border border-outline" onClick={onAddFlexRoute}>
          <Plus /> Add New Flex Route
        </Button>
        <Button variant="lime" size="sm" className="border border-outline" onClick={onSendToDrivers}>
          <ArrowRightCircle /> Send to Drivers
        </Button>
        <Button variant="destructive" size="sm" onClick={onSendToRebalance}>
          <ArrowRightCircle /> Send to Rebalance
        </Button>
      </div>
      </div>
    </div>
  )
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-8 rounded-sm border px-3 font-mono text-[11px] font-bold uppercase tracking-wide',
        active
          ? 'border-primary bg-primary text-on-primary'
          : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-variant',
      )}
    >
      {children}
    </button>
  )
}
