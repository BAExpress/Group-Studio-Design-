import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { AddFlexRouteDialog } from '@/components/route-balance/add-flex-route-dialog'
import { ImportPanel } from '@/components/route-balance/import-panel'
import { KpiBar } from '@/components/route-balance/kpi-bar'
import { RebalancePreviewDialog } from '@/components/route-balance/rebalance-preview-dialog'
import { RouteCard } from '@/components/route-balance/route-card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { Kpi, Route } from '@/types'

function App() {
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [rebalanceTarget, setRebalanceTarget] = useState<Route | null>(null)
  const [addRouteOpen, setAddRouteOpen] = useState(false)

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
  }

  async function handleValidate(route: Route) {
    const updated = await api.validateRoute(route.id)
    replaceRoute(updated)
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="border-b border-outline-variant bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              LogixSphere
            </div>
            <h1 className="font-display text-xl font-bold">Route Balance</h1>
          </div>
          <Button onClick={() => setAddRouteOpen(true)}>
            <Plus /> Add flex route
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        <ImportPanel
          onImported={() => {
            api.getKpis().then(setKpis)
          }}
        />

        {loading ? (
          <p className="font-mono text-xs text-on-surface-variant">Carregando rotas…</p>
        ) : (
          <>
            <KpiBar kpis={kpis} />

            <div>
              <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Route cards ({routes.length})
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onValidate={handleValidate}
                    onRebalance={setRebalanceTarget}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

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
    </div>
  )
}

export default App
