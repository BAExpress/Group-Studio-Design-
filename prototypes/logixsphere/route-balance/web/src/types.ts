export type Kpi = {
  id: string
  label: string
  value: string
  delta?: string
  sublabel?: string
  alert?: boolean
}

export type SubpostcodeRow = {
  code: string
  del: number
  pu: number
  total: number
}

export type RouteStatus = 'pending' | 'validated'
export type RouteShift = 'AM' | 'PM'
export type RouteCapacityState = 'default' | 'rebalance'

export type Route = {
  id: string
  code: string
  driver: string
  vehicle: string
  shift: RouteShift
  status: RouteStatus
  capacityState: RouteCapacityState
  stopsDone: number
  stopsTotal: number
  deliveries: number
  pickups: number
  preNoon: number
  targetPercent: number
  totalWeightKg: number
  subpostcodes: SubpostcodeRow[]
}

export type Driver = {
  id: string
  name: string
}

export type ImportedShipment = {
  routeCode: string
  weightKg: number
  pieces: number
  stops: number
}

export type ImportResult = {
  shipments: ImportedShipment[]
  totalCreated: number
  fileName: string
}

export type RebalancePreview = {
  routeId: string
  routeCode: string
  driver: string
  totalStops: number
  progressPercent: number
  subpostcodes: SubpostcodeRow[]
}

export type StopCategory = 'ASR' | 'DSR' | 'STANDARD'
export type StopStatus = 'PENDING' | 'DELIVERED' | 'NO-SHOW'

export type Stop = {
  address: string
  postcode: string
  customer: string
  category: StopCategory
  status: StopStatus
}

export type StopsSummary = {
  routeCode: string
  driver: string
  preNoon: number
  asrCount: number
  dsrCount: number
  noShowCount: number
  stops: Stop[]
}

export type ShipmentDetails = {
  routeId: string
  driver: string
  vehicle: string
  totalStops: number
  deliveries: number
  pickups: number
  totalWeightKg: number
}

export type AsrDsrRow = {
  route: string
  driver: string
  postcode: string
  customer: string
  category: StopCategory
  status: StopStatus
}

export type SendToRebalanceResult = {
  updatedCount: number
  routes: Route[]
}
