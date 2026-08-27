import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ActionToolbar, type ModeFilter } from '@/components/route-balance/action-toolbar'
import { AddFlexRouteDialog } from '@/components/route-balance/add-flex-route-dialog'
import { AddPostcodeDialog } from '@/components/route-balance/add-postcode-dialog'
import { AllStopsDialog } from '@/components/route-balance/all-stops-dialog'
import { AppShell } from '@/components/route-balance/app-shell'
import { KpiBar } from '@/components/route-balance/kpi-bar'
import { PmAsrDsrListingDialog } from '@/components/route-balance/pm-asr-dsr-listing-dialog'
import { RebalancePreviewDialog } from '@/components/route-balance/rebalance-preview-dialog'
import { RouteCard } from '@/components/route-balance/route-card'
import { SendToDriversDialog } from '@/components/route-balance/send-to-drivers-dialog'
import { SendToRebalanceDialog } from '@/components/route-balance/send-to-rebalance-dialog'
import { ShipmentDetailsDialog } from '@/components/route-balance/shipment-details-dialog'
import { SpecialDeliveriesDialog } from '@/components/route-balance/special-deliveries-dialog'
import { SuccessToast } from '@/components/route-balance/success-toast'
import { api } from '@/lib/api'
import type { Kpi, Route, RouteShift } from '@/types'

/** Um dialog por vez — `routeId` só é usado pelos que abrem a partir de um card. */
type Dialog =
  | { kind: 'none' }
  | { kind: 'addPostcode'; routeId?: string }
  | { kind: 'addFlexRoute' }
  | { kind: 'pmAsrDsr' }
  | { kind: 'shipmentDetails'; routeId?: string }
  | { kind: 'allStops'; routeId: string }
  | { kind: 'specialDeliveries'; routeId: string }
  | { kind: 'sendToRebalance' }
  | { kind: 'sendToDrivers' }
  | { kind: 'rebalancePreview'; route: Route }

const CLOSED: Dialog = { kind: 'none' }

export function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [kpis, setKpis] = useState<Kpi[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [shiftFilter, setShiftFilter] = useState<RouteShift | null>(null)
  const [modeFilter, setModeFilter] = useState<ModeFilter | null>(null)
  const [collapseSignal, setCollapseSignal] = useState(0)
  const [dialog, setDialog] = useState<Dialog>(CLOSED)
  const [toast, setToast] = useState<string | null>(
    () => (location.state as { toast?: string } | null)?.toast ?? null,
  )

  useEffect(() => {
    Promise.all([api.getKpis(), api.getRoutes()])
      .then(([kpiData, routeData]) => {
        setKpis(kpiData)
        setRoutes(routeData)
      })
      .finally(() => setLoading(false))
  }, [])

  function replaceRoute(updated: Route) {
    setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    void api.getKpis().then(setKpis)
  }

  function replaceAllRoutes(updated: Route[]) {
    setRoutes(updated)
    void api.getKpis().then(setKpis)
  }

  const query = search.trim().toLowerCase()
  const visibleRoutes = routes
    .filter((r) =>
      query ? r.code.toLowerCase().includes(query) || r.driver.toLowerCase().includes(query) : true,
    )
    .filter((r) => (shiftFilter ? r.shift === shiftFilter : true))
    .filter((r) =>
      modeFilter === 'rebalance'
        ? r.capacityState === 'rebalance'
        : modeFilter === 'operations'
          ? r.capacityState === 'default'
          : true,
    )

  return (
    <AppShell>
      <ActionToolbar
        search={search}
        onSearchChange={setSearch}
        shiftFilter={shiftFilter}
        onShiftFilterChange={setShiftFilter}
        modeFilter={modeFilter}
        onModeFilterChange={setModeFilter}
        onImport={() => navigate('/import')}
        onAddPostCode={() => setDialog({ kind: 'addPostcode' })}
        onCollapseRoutes={() => setCollapseSignal((s) => s + 1)}
        onPmAsrDsrListing={() => setDialog({ kind: 'pmAsrDsr' })}
        onShipmentDetails={() => setDialog({ kind: 'shipmentDetails' })}
        onAddFlexRoute={() => setDialog({ kind: 'addFlexRoute' })}
        onSendToDrivers={() => setDialog({ kind: 'sendToDrivers' })}
        onSendToRebalance={() => setDialog({ kind: 'sendToRebalance' })}
      />

      <main className="flex flex-1 flex-col gap-6 px-6 py-6">
        {loading ? (
          <p className="font-mono text-xs text-on-surface-variant">Carregando rotas…</p>
        ) : (
          <>
            <KpiBar kpis={kpis} />

            <div>
              <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Route cards ({visibleRoutes.length})
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {visibleRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    collapseSignal={collapseSignal}
                    onValidate={(r) => void api.validateRoute(r.id).then(replaceRoute)}
                    onRebalance={(r) => setDialog({ kind: 'rebalancePreview', route: r })}
                    onSeeDetails={(r) => setDialog({ kind: 'shipmentDetails', routeId: r.id })}
                    onSeeAllStops={(r) => setDialog({ kind: 'allStops', routeId: r.id })}
                    onSpecialDeliveries={(r) =>
                      setDialog({ kind: 'specialDeliveries', routeId: r.id })
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <RebalancePreviewDialog
        route={dialog.kind === 'rebalancePreview' ? dialog.route : null}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
        onConfirmed={replaceRoute}
      />
      <AddPostcodeDialog
        open={dialog.kind === 'addPostcode'}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
        routes={routes}
        defaultRouteId={dialog.kind === 'addPostcode' ? dialog.routeId : undefined}
        onSaved={replaceRoute}
      />
      <AddFlexRouteDialog
        open={dialog.kind === 'addFlexRoute'}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
        onCreated={(route) => setRoutes((prev) => [...prev, route])}
      />
      <PmAsrDsrListingDialog
        open={dialog.kind === 'pmAsrDsr'}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
      />
      <ShipmentDetailsDialog
        open={dialog.kind === 'shipmentDetails'}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
        routes={routes}
        defaultRouteId={dialog.kind === 'shipmentDetails' ? dialog.routeId : undefined}
      />
      <AllStopsDialog
        routeId={dialog.kind === 'allStops' ? dialog.routeId : null}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
      />
      <SpecialDeliveriesDialog
        routeId={dialog.kind === 'specialDeliveries' ? dialog.routeId : null}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
      />
      <SendToRebalanceDialog
        open={dialog.kind === 'sendToRebalance'}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
        routes={routes}
        onConfirmed={replaceAllRoutes}
      />
      <SendToDriversDialog
        open={dialog.kind === 'sendToDrivers'}
        onOpenChange={(open) => !open && setDialog(CLOSED)}
        routes={routes}
        onConfirmed={(count) => setToast(`${count} rotas enviadas aos motoristas`)}
      />
      <SuccessToast message={toast} onDismiss={() => setToast(null)} />
    </AppShell>
  )
}
