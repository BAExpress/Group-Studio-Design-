import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppShell } from '@/components/route-balance/app-shell'
import { KpiGrid } from '@/components/route-balance/kpi-grid'
import { RouteSummaryTable } from '@/components/route-balance/route-summary-table'
import { RouteCard } from '@/components/route-balance/route-card'
import { AddPostcodeDialog } from '@/components/route-balance/add-postcode-dialog'
import { AddFlexRouteDialog } from '@/components/route-balance/add-flex-route-dialog'
import { SpecialDeliveriesDialog } from '@/components/route-balance/special-deliveries-dialog'
import { AllStopsDialog } from '@/components/route-balance/all-stops-dialog'
import { RebalancePreviewDialog } from '@/components/route-balance/rebalance-preview-dialog'
import { ShipmentDetailsDialog } from '@/components/route-balance/shipment-details-dialog'
import { EditStopDialog } from '@/components/route-balance/edit-stop-dialog'
import { ToastStack } from '@/components/route-balance/toast-stack'
import { cn } from '@/lib/utils'
import { useRouteBalance } from '@/hooks/use-route-balance'
import type { ShiftKey } from '@/data/route-domain'

export function DashboardPage() {
  const rb = useRouteBalance()

  const [addPostcodeOpen, setAddPostcodeOpen] = useState(false)
  const [addFlexRouteOpen, setAddFlexRouteOpen] = useState(false)
  const [specialDeliveriesRouteId, setSpecialDeliveriesRouteId] = useState<number | null>(null)
  const [allStopsRouteId, setAllStopsRouteId] = useState<number | null>(null)
  const [rebalanceOpen, setRebalanceOpen] = useState(false)
  const [shipmentDetailsRouteId, setShipmentDetailsRouteId] = useState<number | null>(null)

  const specialDeliveriesRoute = rb.routes.find((r) => r.id === specialDeliveriesRouteId) ?? null
  const allStopsRoute = rb.routes.find((r) => r.id === allStopsRouteId) ?? null
  const shipmentDetailsRoute = rb.routes.find((r) => r.id === shipmentDetailsRouteId) ?? null
  const editingStop = rb.editStopId != null ? rb.routes.flatMap((r) => r.stops).find((s) => s.id === rb.editStopId) ?? null : null

  const anyExpanded = rb.routes.some((r) => r.expanded)

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-[26px]">Route Balance</h1>
          <div className="mt-1 text-xs text-on-surface-variant">Operational route management</div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 max-[560px]:w-full">
          <Input
            className="w-[170px] max-[560px]:w-full"
            placeholder="Search routes..."
            value={rb.search}
            onChange={(e) => rb.setSearch(e.target.value)}
          />
          <div className="flex overflow-hidden rounded-sm border border-outline">
            {(['am', 'pm'] as ShiftKey[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => rb.setShiftAll(s)}
                className={cn(
                  'px-3.5 py-2 font-mono text-[11px]',
                  rb.shift === s ? 'bg-primary font-semibold text-on-primary' : 'bg-surface text-on-surface-variant',
                )}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <Button variant={rb.mode === 'rebalance' ? 'primary' : 'secondary'} onClick={() => rb.setMode('rebalance')}>
            Rebalance
          </Button>
          <Button variant={rb.mode === 'operations' ? 'primary' : 'secondary'} onClick={() => rb.setMode('operations')}>
            Operations
          </Button>
        </div>
      </div>

      <div className="mb-[22px] flex flex-wrap gap-2.5">
        <Button variant="secondary" onClick={() => setAddPostcodeOpen(true)}>
          Add Post Code
        </Button>
        <Button variant="secondary" onClick={rb.toggleColapse}>
          {anyExpanded ? 'Colapse Routes' : 'Expand Routes'}
        </Button>
        <Button variant="primary" asChild>
          <Link to="/import">Importar</Link>
        </Button>
        <Button variant="lime" onClick={() => setAddFlexRouteOpen(true)}>
          + Add New Flex Rote
        </Button>
        <Button variant="lime" onClick={rb.sendToDrivers}>
          ▷ Send to Drivers
        </Button>
      </div>

      <KpiGrid
        totalStops={rb.kpiTotals.totalStops}
        pre12={rb.kpiTotals.pre12}
        asr={rb.kpiTotals.asr}
        dsr={rb.kpiTotals.dsr}
        activeFilter={rb.dashboardFilter}
        onToggleFilter={rb.toggleDashboardFilter}
      />

      <RouteSummaryTable
        routes={rb.sortedRoutes}
        shift={rb.shift}
        sortKey={rb.sortKey}
        focusRouteId={rb.focusRouteId}
        onSort={rb.handleSort}
        onToggleFocus={rb.toggleFocusRoute}
      />

      {rb.visibleRoutes.length === 0 ? (
        <p className="mb-5 -mt-2 text-[11.5px] leading-relaxed text-on-surface-variant">
          Nenhuma rota corresponde ao filtro atual.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,252px)] items-start gap-4 max-[560px]:grid-cols-[repeat(auto-fill,minmax(252px,1fr))]">
          {rb.visibleRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              shift={rb.shift}
              onToggleExpand={() => rb.toggleExpand(route.id)}
              onShipmentDetails={() => setShipmentDetailsRouteId(route.id)}
              onSpecialDeliveries={() => setSpecialDeliveriesRouteId(route.id)}
              onAllStops={() => setAllStopsRouteId(route.id)}
              onToggleApproval={() => rb.toggleRouteApproval(route.id)}
              onExportCsv={() => rb.exportRouteCsv(route.id)}
              onRevert={() => rb.revertLastAction(route.id)}
              onCloseRoute={() => rb.closeEmptyRoute(route.id)}
              dragActive={!!rb.dragPayload}
              isDropTarget={rb.dropTargetRouteId === route.id}
              onStartDrag={(stopIds, label) => rb.startDrag(route.id, stopIds, label)}
              onEndDrag={rb.endDrag}
              onDragEnterCard={() => rb.dragPayload?.sourceRouteId !== route.id && rb.setDropTargetRouteId(route.id)}
              onDragLeaveCard={() => rb.setDropTargetRouteId(null)}
              onDropCard={() => rb.dropOnRoute(route.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-5 text-right text-[10.5px] text-on-surface-variant">© 2026 LOGIX / SPHERE OPERATIONAL SYSTEMS</div>

      <AddPostcodeDialog open={addPostcodeOpen} routes={rb.routes} onOpenChange={setAddPostcodeOpen} onConfirm={rb.confirmAddPostcode} />
      <AddFlexRouteDialog open={addFlexRouteOpen} onOpenChange={setAddFlexRouteOpen} onConfirm={rb.saveNewRoute} />
      <SpecialDeliveriesDialog route={specialDeliveriesRoute} shift={rb.shift} onOpenChange={(v) => !v && setSpecialDeliveriesRouteId(null)} />
      <AllStopsDialog
        route={allStopsRoute}
        shift={rb.shift}
        onOpenChange={(v) => !v && setAllStopsRouteId(null)}
        onEditStop={rb.openEditStop}
      />
      <RebalancePreviewDialog open={rebalanceOpen} onOpenChange={setRebalanceOpen} />
      <ShipmentDetailsDialog route={shipmentDetailsRoute} shift={rb.shift} onOpenChange={(v) => !v && setShipmentDetailsRouteId(null)} />
      <EditStopDialog
        stop={editingStop}
        postcodeVal={rb.editPostcodeVal}
        pre12Val={rb.editPre12Val}
        scope={rb.editScope}
        onPostcodeChange={rb.setEditPostcodeVal}
        onPre12Change={rb.setEditPre12Val}
        onScopeChange={rb.setEditScope}
        onCancel={rb.closeEditStop}
        onSave={rb.saveStopEdit}
      />
      <ToastStack toasts={rb.toasts} onDismiss={rb.dismissToast} />
    </AppShell>
  )
}
