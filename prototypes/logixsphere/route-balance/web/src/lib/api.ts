import type {
  AsrDsrRow,
  Driver,
  ImportResult,
  Kpi,
  RebalancePreview,
  Route,
  SendToRebalanceResult,
  ShipmentDetails,
  SpecialDeliveryRow,
  StopsSummary,
} from '@/types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: init?.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  getKpis: () => request<Kpi[]>('/kpis'),
  getRoutes: () => request<Route[]>('/routes'),
  getDrivers: () => request<Driver[]>('/drivers'),
  getPostcodes: () => request<string[]>('/postcodes'),
  getAsrDsrListing: () => request<AsrDsrRow[]>('/asr-dsr-listing'),
  getStops: (routeId: string) => request<StopsSummary>(`/routes/${routeId}/stops`),
  getSpecialDeliveries: (routeId: string) =>
    request<SpecialDeliveryRow[]>(`/routes/${routeId}/special-deliveries`),
  getShipmentDetails: (routeId: string) =>
    request<ShipmentDetails>(`/routes/${routeId}/shipment-details`),
  addPostcodes: (routeId: string, postcodes: string[]) =>
    request<Route>(`/routes/${routeId}/postcodes`, {
      method: 'POST',
      body: JSON.stringify({ postcodes }),
    }),
  getRebalancePreview: (routeId: string) =>
    request<RebalancePreview>(`/routes/${routeId}/rebalance-preview`),
  commitRebalance: (routeId: string) =>
    request<Route>(`/routes/${routeId}/rebalance`, { method: 'POST' }),
  sendToRebalance: () =>
    request<SendToRebalanceResult>('/routes/send-to-rebalance', { method: 'POST' }),
  validateRoute: (routeId: string) =>
    request<Route>(`/routes/${routeId}/validate`, { method: 'POST' }),
  createFlexRoute: (payload: { code: string; driverId: string }) =>
    request<Route>('/routes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  importFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<ImportResult>('/import', {
      method: 'POST',
      body: formData,
    })
  },
}
