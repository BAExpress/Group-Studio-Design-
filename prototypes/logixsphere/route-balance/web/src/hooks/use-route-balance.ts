import { useMemo, useState } from 'react'

import { useToasts } from './use-toasts'
import {
  DASHBOARD_FILTER_LABELS,
  DASHBOARD_FILTER_MATCHERS,
  generateInitialRoutes,
  nextRouteId,
  pick,
  recomputeStopsCompletion,
  VEHICLES,
  type DashboardFilterKey,
  type RouteRow,
  type SendStatus,
  type ShiftKey,
  type Stop,
} from '@/data/route-domain'

const CURRENT_USER = 'João'

// Handlers portados de RouteBalance.tsx (produção real do LogixSphere) —
// toggleRouteApproval, sendToDrivers, revertLastAction, exportRouteCsv,
// confirmAddPostcode, openEditStop/saveStopEdit, toggleDashboardFilter.
// Ver DESIGN_ENGINEERING_TASK.md para o que foi deixado de fora (drag-and-drop
// entre rotas, comparar rotas, tabela-resumo ordenável, gauges animados).
export function useRouteBalance() {
  const [routes, setRoutes] = useState<RouteRow[]>(() => generateInitialRoutes())
  const [shift, setShift] = useState<ShiftKey>('pm')
  const [mode, setMode] = useState<'operations' | 'rebalance'>('operations')
  const [search, setSearch] = useState('')
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilterKey | null>(null)

  const [editStopId, setEditStopId] = useState<number | null>(null)
  const [editPostcodeVal, setEditPostcodeVal] = useState('')
  const [editPre12Val, setEditPre12Val] = useState(false)
  const [editScope, setEditScope] = useState<'single' | 'all'>('single')

  const { toasts, showToast, dismissToast } = useToasts()

  function updateRoute(routeId: number, updater: (r: RouteRow) => RouteRow) {
    setRoutes((prev) => prev.map((r) => (r.id === routeId ? updater(r) : r)))
  }

  function visibleStops(route: RouteRow): Stop[] {
    return route.stops.filter((s) => (shift === 'pm' ? s.pm : !s.pm))
  }

  const visibleRoutes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return routes.filter((r) => {
      if (q && !(r.driver + ' ' + r.name + ' ' + r.plate).toLowerCase().includes(q)) return false
      const stops = visibleStops(r)
      if (mode === 'rebalance') {
        const { pct } = recomputeStopsCompletion(r, shift)
        return pct >= 100
      }
      if (dashboardFilter) return stops.some(DASHBOARD_FILTER_MATCHERS[dashboardFilter])
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, search, mode, shift, dashboardFilter])

  /* ---------- dashboard KPIs — agregados reais a partir de routes[].stops, não mais valor fixo ---------- */
  const allVisibleStops = routes.flatMap(visibleStops)
  const kpiTotals = {
    totalStops: allVisibleStops.length,
    pre12: allVisibleStops.filter((s) => s.pre12).length,
    asr: allVisibleStops.filter((s) => s.asr).length,
    dsr: allVisibleStops.filter((s) => s.dsr).length,
  }

  function toggleDashboardFilter(key: DashboardFilterKey) {
    setDashboardFilter((prev) => {
      const next = prev === key ? null : key
      showToast(next ? `Filtering routes by ${DASHBOARD_FILTER_LABELS[next]}` : 'Filter cleared', 'info')
      return next
    })
  }

  function setShiftAll(next: ShiftKey) {
    setShift(next)
  }

  function toggleColapse() {
    const anyExpanded = routes.some((r) => r.expanded)
    setRoutes((prev) => prev.map((r) => ({ ...r, expanded: !anyExpanded })))
  }

  function toggleExpand(routeId: number) {
    updateRoute(routeId, (r) => ({ ...r, expanded: !r.expanded }))
  }

  /** Ported from saveNewRoute() — required + unique name, driver from the fixed DRIVERS list, target %. */
  function saveNewRoute(name: string, driver: string, target: string) {
    const trimmed = name.trim()
    const targetNum = parseInt(target, 10)
    if (!trimmed) {
      showToast('Route name is required', 'error')
      return false
    }
    if (routes.some((r) => r.name === trimmed)) {
      showToast('A route with this name already exists', 'error')
      return false
    }
    setRoutes((prev) => [
      ...prev,
      {
        id: nextRouteId(),
        name: trimmed,
        driver,
        plate: pick(VEHICLES),
        target: isNaN(targetNum) ? 85 : targetNum,
        sendStatus: { am: 'pending', pm: 'pending' },
        lastAction: null,
        stops: [],
        expanded: false,
      },
    ])
    showToast(`Route ${trimmed} added`, 'success')
    return true
  }

  /* ---------- drag-and-drop: mover paradas de uma rota pra outra ---------- */
  const [dragPayload, setDragPayload] = useState<{ sourceRouteId: number; stopIds: number[]; label: string } | null>(null)
  const [dropTargetRouteId, setDropTargetRouteId] = useState<number | null>(null)

  /** Ported from transferStops() — moves a set of stops between routes, renumbering them on arrival; the toast's Undo replays the transfer in reverse. */
  function transferStops(sourceRouteId: number, targetRouteId: number, stopIds: number[], label: string) {
    if (!stopIds.length) {
      showToast('Nothing to transfer', 'error')
      return
    }
    const sourceName = routes.find((r) => r.id === sourceRouteId)?.name
    const targetName = routes.find((r) => r.id === targetRouteId)?.name
    setRoutes((prev) => {
      const source = prev.find((r) => r.id === sourceRouteId)
      const target = prev.find((r) => r.id === targetRouteId)
      if (!source || !target) return prev
      const moving = source.stops.filter((s) => stopIds.includes(s.id))
      if (!moving.length) return prev
      const remaining = source.stops.filter((s) => !stopIds.includes(s.id))
      let nextNum = target.stops.length
      const moved = moving.map((s) => ({ ...s, routeName: target.name, stopNumber: ++nextNum }))
      return prev.map((r) => {
        if (r.id === sourceRouteId) return { ...r, stops: remaining }
        if (r.id === targetRouteId) return { ...r, stops: [...target.stops, ...moved] }
        return r
      })
    })
    showToast(`✓ Moved ${label || `${stopIds.length} deliveries: ${sourceName} → ${targetName}`}`, 'success', () => {
      transferStops(targetRouteId, sourceRouteId, stopIds, `${targetName} → ${sourceName} (undo)`)
    })
  }

  function startDrag(sourceRouteId: number, stopIds: number[], label: string) {
    setDragPayload({ sourceRouteId, stopIds, label })
  }
  function endDrag() {
    setDragPayload(null)
    setDropTargetRouteId(null)
  }
  function dropOnRoute(targetRouteId: number) {
    if (dragPayload && dragPayload.sourceRouteId !== targetRouteId) {
      transferStops(dragPayload.sourceRouteId, targetRouteId, dragPayload.stopIds, dragPayload.label)
    }
    endDrag()
  }

  /** Ported from toggleRouteApproval() — the card's checkmark arms/withdraws the route for the next batch send. */
  function toggleRouteApproval(routeId: number) {
    const route = routes.find((r) => r.id === routeId)
    if (!route) return
    const oldValue = route.sendStatus[shift]
    if (oldValue === 'sent') {
      showToast(`Route ${route.name} (${shift.toUpperCase()}) was already sent to ${route.driver}`, 'info')
      return
    }
    const newValue: SendStatus = oldValue === 'approved' ? 'pending' : 'approved'
    updateRoute(routeId, (r) => ({
      ...r,
      sendStatus: { ...r.sendStatus, [shift]: newValue },
      lastAction: { field: 'sendStatus', shift, oldValue },
    }))
    showToast(
      newValue === 'approved'
        ? `Route ${route.name} approved for sending (${shift.toUpperCase()})`
        : `Approval withdrawn from route ${route.name} (${shift.toUpperCase()})`,
      newValue === 'approved' ? 'success' : 'info',
    )
  }

  /** Ported from sendToDrivers() — batch-sends every approved route for the current shift; resends if everything visible is already sent. */
  function sendToDrivers() {
    const list = routes.filter((r) => visibleStops(r).length > 0)
    if (!list.length) {
      showToast('No routes to send', 'error')
      return
    }
    const approved = list.filter((r) => r.sendStatus[shift] === 'approved')
    const resend = !approved.length && list.every((r) => r.sendStatus[shift] === 'sent')
    const targets = resend ? list : approved
    if (!targets.length) {
      showToast(`No approved routes — tick the check on each route to approve it (${shift.toUpperCase()})`, 'error')
      return
    }
    setRoutes((prev) =>
      prev.map((r) =>
        targets.some((t) => t.id === r.id)
          ? { ...r, sendStatus: { ...r.sendStatus, [shift]: 'sent' }, lastAction: { field: 'sendStatus', shift, oldValue: r.sendStatus[shift] } }
          : r,
      ),
    )
    const drivers = new Set(targets.map((r) => r.driver)).size
    showToast(
      `${targets.length} route manifest${targets.length === 1 ? '' : 's'} ${resend ? 're-sent' : 'sent'} to ${drivers} driver${drivers === 1 ? '' : 's'} (${shift.toUpperCase()})`,
      'success',
    )
  }

  /** Ported from revertLastAction() — simplified to a single last-action slot instead of a full history stack. */
  function revertLastAction(routeId: number) {
    const route = routes.find((r) => r.id === routeId)
    if (!route?.lastAction) return
    const { shift: actionShift, oldValue } = route.lastAction
    updateRoute(routeId, (r) => ({ ...r, sendStatus: { ...r.sendStatus, [actionShift]: oldValue }, lastAction: null }))
    showToast(`Reverted last action on route ${route.name}`, 'success')
  }

  /** Ported from exportRouteCsv() — real CSV file, downloaded via a Blob URL. */
  function exportRouteCsv(routeId: number) {
    const route = routes.find((r) => r.id === routeId)
    if (!route) return
    const stops = visibleStops(route)
    if (!stops.length) {
      showToast('No stops to export on this route', 'error')
      return
    }
    const header = ['Route', 'Driver', 'Stop #', 'Address', 'Postcode', 'Customer', 'Type', 'Pre 12']
    const rows = stops.map((s, i) => [route.name, route.driver, i + 1, s.address, s.postcode, s.customer, s.type, s.pre12 ? 'Yes' : 'No'])
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `route-balance-${route.name}-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    showToast(`✓ CSV export for route ${route.name} (${stops.length} stops)`, 'success')
  }

  /** Ported from confirmAddPostcode() — same UK postcode/subpostcode regex validation; still a validation-only action in production (no stop insertion), kept identical here. */
  function confirmAddPostcode(code: string, type: 'postcode' | 'subpostcode', routeId: string) {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      showToast('Please enter a postcode or subpostcode', 'error')
      return false
    }
    const affected = routeId ? routes.filter((r) => r.id === Number(routeId)) : routes
    if (!affected.length) {
      showToast('Route not found', 'error')
      return false
    }
    if (type === 'postcode') {
      if (!/^[A-Z]{2}\d{1,2} \d[A-Z]{2}$/.test(trimmed)) {
        showToast('Invalid postcode format (e.g. ME15 6AB)', 'error')
        return false
      }
    } else if (!/^[A-Z]{2}\d{1,2}$/.test(trimmed)) {
      showToast('Invalid subpostcode format (e.g. ME15)', 'error')
      return false
    }
    showToast(`✓ ${type === 'postcode' ? 'Postcode' : 'Subpostcode'} ${trimmed} added to ${affected.length} route(s)`, 'success')
    return true
  }

  function openEditStop(stop: Stop) {
    setEditStopId(stop.id)
    setEditPostcodeVal(stop.postcode)
    setEditPre12Val(stop.pre12)
    setEditScope('single')
  }
  function closeEditStop() {
    setEditStopId(null)
  }

  /** Ported from saveStopEdit() — same PM/Pre-12 conflict rule and single-vs-all-of-postcode scope. */
  function saveStopEdit() {
    const allStops = routes.flatMap((r) => r.stops)
    const stop = allStops.find((s) => s.id === editStopId)
    if (!stop) return
    const newPostcode = editPostcodeVal.trim().toUpperCase()
    if (!newPostcode) {
      showToast('Postcode is required', 'error')
      return
    }
    let pre12 = editPre12Val
    if (pre12 && stop.pm) {
      pre12 = false
      showToast('Pre 12 was cleared: a PM stop cannot also be Pre-12', 'warning')
    }
    const route = routes.find((r) => r.name === stop.routeName)
    if (!route) return
    const oldPostcode = stop.postcode

    if (editScope === 'all') {
      const affectedCount = route.stops.filter((s) => s.postcode === oldPostcode).length
      updateRoute(route.id, (r) => ({
        ...r,
        stops: r.stops.map((s) => (s.postcode === oldPostcode ? { ...s, postcode: newPostcode, pre12: s.id === stop.id ? pre12 : s.pre12 } : s)),
      }))
      showToast(`${oldPostcode} → ${newPostcode} on ${affectedCount} stop(s) of route ${route.name}`, 'success')
    } else {
      updateRoute(route.id, (r) => ({
        ...r,
        stops: r.stops.map((s) => (s.id === stop.id ? { ...s, postcode: newPostcode, pre12 } : s)),
      }))
      showToast('Stop updated', 'success')
    }
    setEditStopId(null)
  }

  return {
    routes,
    visibleRoutes,
    shift,
    mode,
    search,
    dashboardFilter,
    kpiTotals,
    toasts,
    editStopId,
    editPostcodeVal,
    editPre12Val,
    editScope,
    setSearch,
    setMode,
    setShiftAll,
    toggleColapse,
    toggleExpand,
    toggleDashboardFilter,
    toggleRouteApproval,
    sendToDrivers,
    revertLastAction,
    exportRouteCsv,
    confirmAddPostcode,
    saveNewRoute,
    openEditStop,
    closeEditStop,
    saveStopEdit,
    setEditPostcodeVal,
    setEditPre12Val,
    setEditScope,
    dismissToast,
    visibleStops,
    CURRENT_USER,
    dragPayload,
    dropTargetRouteId,
    setDropTargetRouteId,
    startDrag,
    endDrag,
    dropOnRoute,
  }
}
