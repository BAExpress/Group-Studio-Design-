import { useEffect, useState } from 'react'

import { ActionToolbar } from '@/components/route-balance/action-toolbar'
import { AddFlexRouteDialog } from '@/components/route-balance/add-flex-route-dialog'
import { AddPostcodeDialog } from '@/components/route-balance/add-postcode-dialog'
import { AllStopsDialog } from '@/components/route-balance/all-stops-dialog'
import { AppFooter } from '@/components/route-balance/app-footer'
import { HeaderBar } from '@/components/route-balance/header-bar'
import { ImportFlow } from '@/components/route-balance/import-flow'
import { KpiBar } from '@/components/route-balance/kpi-bar'
import { PmAsrDsrListingDialog } from '@/components/route-balance/pm-asr-dsr-listing-dialog'
import { RebalancePreviewDialog } from '@/components/route-balance/rebalance-preview-dialog'
import { RouteCard } from '@/components/route-balance/route-card'
import { SendToRebalanceDialog } from '@/components/route-balance/send-to-rebalance-dialog'
import { ShipmentDetailsDialog } from '@/components/route-balance/shipment-details-dialog'
import { api } from '@/lib/api'
import type { Kpi, Route } from '@/types'

function App() {
  const [view, setView] = useState<'import' | 'dashboard'>('import')
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [collapseSignal, setCollapseSignal] = useState(0)

  const [rebalanceTarget, setRebalanceTarget] = useState<Route | null>(null)
  const [addRouteOpen, setAddRouteOpen] = useState(false)
  const [addPostcodeOpen, setAddPostcodeOpen] = useState(false)
  const [addPostcodeRouteId, setAddPostcodeRouteId] = useState<string | undefined>()
  const [pmAsrDsrOpen, setPmAsrDsrOpen] = useState(false)
  const [shipmentDetailsOpen, setShipmentDetailsOpen] = useState(false)
  const [shipmentDetailsRouteId, setShipmentDetailsRouteId] = useState<string | undefined>()
  const [allStopsRouteId, setAllStopsRouteId] = useState<string | null>(null)
  const [sendToRebalanceOpen, setSendToRebalanceOpen] = useState(false)

  useEffect(() => {
    if (view !== 'dashboard') return
    Promise.all([api.getKpis(), api.getRoutes()])
      .then(([kpiData, routeData]) => {
        setKpis(kpiData)
        setRoutes(routeData)
      })
      .finally(() => setLoading(false))
  }, [view])

  function refreshKpis() {
    api.getKpis().then(setKpis)
  }

  function replaceRoute(updated: Route) {
    setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    refreshKpis()
  }

  function replaceAllRoutes(updated: Route[]) {
    setRoutes(updated)
    refreshKpis()
  }

  async function handleValidate(route: Route) {
    const updated = await api.validateRoute(route.id)
    replaceRoute(updated)
  }

  if (view === 'import') {
    return <ImportFlow onProceed={() => setView('dashboard')} />
  }

  const query = search.trim().toLowerCase()
  const filteredRoutes = query
    ? routes.filter(
        (r) => r.code.toLowerCase().includes(query) || r.driver.toLowerCase().includes(query),
      )
    : routes

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderBar />
      <ActionToolbar
        search={search}
        onSearchChange={setSearch}
        onAddPostCode={() => {
          setAddPostcodeRouteId(undefined)
          setAddPostcodeOpen(true)
        }}
        onCollapseRoutes={() => setCollapseSignal((s) => s + 1)}
        onPmAsrDsrListing={() => setPmAsrDsrOpen(true)}
        onShipmentDetails={() => {
          setShipmentDetailsRouteId(undefined)
          setShipmentDetailsOpen(true)
        }}
        onAddFlexRoute={() => setAddRouteOpen(true)}
        onSendToRebalance={() => setSendToRebalanceOpen(true)}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6">
        {loading ? (
          <p className="font-mono text-xs text-on-surface-variant">Carregando rotas…</p>
        ) : (
          <>
            <KpiBar kpis={kpis} />

            <div>
              <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Route cards ({filteredRoutes.length})
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {filteredRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onValidate={handleValidate}
                    onRebalance={setRebalanceTarget}
                    onSeeDetails={(r) => {
                      setShipmentDetailsRouteId(r.id)
                      setShipmentDetailsOpen(true)
                    }}
                    onSeeAllStops={(r) => setAllStopsRouteId(r.id)}
                    collapseSignal={collapseSignal}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <AppFooter />

      <RebalancePreviewDialog
        route={rebalanceTarget}
        onOpenChange={(open) => !open && setRebalanceTarget(null)}
        onConfirmed={replaceRoute}
      />
      <AddFlexRouteDialog
        open={addRouteOpen}
        onOpenChange={setAddRouteOpen}
        onCreated={(route) => setRoutes((prev) => [...prev, route])}
      />
      <AddPostcodeDialog
        open={addPostcodeOpen}
        onOpenChange={setAddPostcodeOpen}
        routes={routes}
        defaultRouteId={addPostcodeRouteId}
        onSaved={replaceRoute}
      />
      <PmAsrDsrListingDialog open={pmAsrDsrOpen} onOpenChange={setPmAsrDsrOpen} />
      <ShipmentDetailsDialog
        open={shipmentDetailsOpen}
        onOpenChange={setShipmentDetailsOpen}
        routes={routes}
        defaultRouteId={shipmentDetailsRouteId}
      />
      <AllStopsDialog
        routeId={allStopsRouteId}
        onOpenChange={(open) => !open && setAllStopsRouteId(null)}
      />
      <SendToRebalanceDialog
        open={sendToRebalanceOpen}
        onOpenChange={setSendToRebalanceOpen}
        routes={routes}
        onConfirmed={replaceAllRoutes}
      />
    </div>
  )
}

export default App
