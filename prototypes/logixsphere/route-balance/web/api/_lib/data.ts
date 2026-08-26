export type SubpostcodeRow = { code: string; del: number; pu: number; total: number }
export type StopCategory = 'ASR' | 'DSR' | 'STANDARD'
export type StopStatus = 'PENDING' | 'DELIVERED' | 'NO-SHOW'
export type Stop = {
  address: string
  postcode: string
  customer: string
  category: StopCategory
  status: StopStatus
}
export type Route = {
  id: string
  code: string
  driver: string
  vehicle: string
  shift: 'AM' | 'PM'
  status: 'pending' | 'validated'
  capacityState: 'default' | 'rebalance'
  stopsDone: number
  stopsTotal: number
  deliveries: number
  pickups: number
  preNoon: number
  targetPercent: number
  totalWeightKg: number
  subpostcodes: SubpostcodeRow[]
  stops: Stop[]
}
export type Driver = { id: string; name: string }
export type Kpi = {
  id: string
  label: string
  value: string
  delta?: string
  sublabel?: string
  alert?: boolean
}

/*
 * Dados mock em memória — resetam a cada restart do servidor. Valores base
 * extraídos da spec de handoff do Figma (Logix Sphere > Handoff >
 * handoff-route-balance) e do board de exploração (página Doing); onde o
 * texto original não estava totalmente legível no viewer sem login, os
 * números foram aproximados de forma plausível e marcados para conferência
 * de Design antes de qualquer promoção. Isto não é dado de produção.
 */

export const drivers: Driver[] = [
  { id: 'drv-1', name: 'Carlos Silva' },
  { id: 'drv-2', name: 'Marina Costa' },
  { id: 'drv-3', name: 'Rafael Nunes' },
  { id: 'drv-4', name: 'Juliana Alves' },
  { id: 'drv-5', name: 'Pedro Lima' },
  { id: 'drv-6', name: 'Fernanda Dias' },
  { id: 'drv-7', name: 'Bruno Teixeira' },
  { id: 'drv-8', name: 'Camila Rocha' },
  { id: 'drv-9', name: 'Diego Martins' },
  { id: 'drv-10', name: 'Larissa Prado' },
]

const STREET_NAMES = [
  'Victoria Avenue',
  'Station Road',
  'Mill Lane',
  'Church Street',
  'Kings Road',
  'Orchard Way',
  'Highfield Drive',
  'Queens Terrace',
]

function buildStops(postcodePrefix: string, count: number, customerBase: number): Stop[] {
  const categories: StopCategory[] = ['ASR', 'DSR', 'STANDARD']
  const statuses: StopStatus[] = ['PENDING', 'DELIVERED', 'NO-SHOW']
  return Array.from({ length: count }, (_, i) => ({
    address: `${100 + i * 12} ${STREET_NAMES[i % STREET_NAMES.length]}`,
    postcode: `${postcodePrefix} ${1 + (i % 9)}AB`,
    customer: `Customer ${customerBase + i}`,
    category: categories[i % categories.length],
    status: statuses[(i + 1) % statuses.length],
  }))
}

export const routes: Route[] = [
  {
    id: 'route-a01',
    code: 'ROUTE A-01',
    driver: 'Carlos Silva',
    vehicle: 'CAR-001',
    shift: 'AM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 11,
    stopsTotal: 15,
    deliveries: 10,
    pickups: 5,
    preNoon: 2,
    targetPercent: 92,
    totalWeightKg: 1842.3,
    subpostcodes: [
      { code: 'ME1', del: 2, pu: 1, total: 3 },
      { code: 'ME2', del: 1, pu: 4, total: 5 },
    ],
    stops: buildStops('ME1', 6, 381),
  },
  {
    id: 'route-a02',
    code: 'ROUTE A-02',
    driver: 'Marina Costa',
    vehicle: 'CAR-002',
    shift: 'AM',
    status: 'validated',
    capacityState: 'default',
    stopsDone: 15,
    stopsTotal: 15,
    deliveries: 12,
    pickups: 3,
    preNoon: 5,
    targetPercent: 95,
    totalWeightKg: 2210.8,
    subpostcodes: [
      { code: 'ME3', del: 3, pu: 0, total: 3 },
      { code: 'ME4', del: 2, pu: 1, total: 3 },
    ],
    stops: buildStops('ME2', 7, 962),
  },
  {
    id: 'route-a03',
    code: 'ROUTE A-03',
    driver: 'Rafael Nunes',
    vehicle: 'CAR-003',
    shift: 'PM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 9,
    stopsTotal: 14,
    deliveries: 8,
    pickups: 1,
    preNoon: 1,
    targetPercent: 70,
    totalWeightKg: 1390.5,
    subpostcodes: [{ code: 'ME7', del: 5, pu: 4, total: 9 }],
    stops: buildStops('ME7', 5, 145),
  },
  {
    id: 'route-a04',
    code: 'ROUTE A-04',
    driver: 'Juliana Alves',
    vehicle: 'CAR-004',
    shift: 'AM',
    status: 'pending',
    capacityState: 'rebalance',
    stopsDone: 17,
    stopsTotal: 17,
    deliveries: 13,
    pickups: 4,
    preNoon: 3,
    targetPercent: 100,
    totalWeightKg: 2635.0,
    subpostcodes: [
      { code: 'ME5', del: 2, pu: 0, total: 2 },
      { code: 'ME6', del: 2, pu: 2, total: 4 },
    ],
    stops: buildStops('ME5', 8, 508),
  },
  {
    id: 'route-a05',
    code: 'ROUTE A-05',
    driver: 'Pedro Lima',
    vehicle: 'CAR-005',
    shift: 'PM',
    status: 'validated',
    capacityState: 'default',
    stopsDone: 13,
    stopsTotal: 13,
    deliveries: 11,
    pickups: 2,
    preNoon: 4,
    targetPercent: 90,
    totalWeightKg: 1978.2,
    subpostcodes: [{ code: 'ME8', del: 4, pu: 1, total: 5 }],
    stops: buildStops('ME8', 6, 700),
  },
  {
    id: 'route-a06',
    code: 'ROUTE A-06',
    driver: 'Fernanda Dias',
    vehicle: 'CAR-006',
    shift: 'AM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 7,
    stopsTotal: 12,
    deliveries: 6,
    pickups: 1,
    preNoon: 0,
    targetPercent: 58,
    totalWeightKg: 987.6,
    subpostcodes: [{ code: 'ME9', del: 3, pu: 2, total: 5 }],
    stops: buildStops('ME9', 4, 210),
  },
  {
    id: 'route-a07',
    code: 'ROUTE A-07',
    driver: 'Bruno Teixeira',
    vehicle: 'CAR-007',
    shift: 'PM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 10,
    stopsTotal: 16,
    deliveries: 9,
    pickups: 1,
    preNoon: 2,
    targetPercent: 63,
    totalWeightKg: 1654.9,
    subpostcodes: [{ code: 'ME10', del: 6, pu: 0, total: 6 }],
    stops: buildStops('ME10', 5, 340),
  },
  {
    id: 'route-a08',
    code: 'ROUTE A-08',
    driver: 'Camila Rocha',
    vehicle: 'CAR-008',
    shift: 'AM',
    status: 'validated',
    capacityState: 'default',
    stopsDone: 14,
    stopsTotal: 14,
    deliveries: 12,
    pickups: 2,
    preNoon: 3,
    targetPercent: 96,
    totalWeightKg: 2087.4,
    subpostcodes: [{ code: 'ME11', del: 5, pu: 1, total: 6 }],
    stops: buildStops('ME11', 6, 880),
  },
]

export const allPostcodes: string[] = [
  'ME1 1AB',
  'ME1 3AB',
  'ME1 4AB',
  'ME1 5AB',
  'ME1 6AB',
  'ME1 7AA',
  'ME1 7AB',
  'ME1 8AB',
  'ME1 9AB',
]

export function computeKpis(): Kpi[] {
  const stopsTotal = routes.reduce((sum, r) => sum + r.stopsTotal, 0)
  const preDeliveries = routes.reduce((sum, r) => sum + r.preNoon, 0)
  const addressAdvice = Math.round(stopsTotal * 0.88)
  const delayed = routes.filter((r) => r.capacityState === 'rebalance').length * 11

  return [
    { id: 'total-stops', label: 'Total Stops', value: String(stopsTotal), delta: '+4.2%' },
    {
      id: 'pre-deliveries',
      label: 'Pre-Deliveries',
      value: String(preDeliveries),
      sublabel: `${Math.round((preDeliveries / stopsTotal) * 100)}% of stops`,
    },
    {
      id: 'address-advice-rate',
      label: 'Address Advice Rate',
      value: String(addressAdvice),
      sublabel: `${Math.round((addressAdvice / stopsTotal) * 100)}% of stops`,
    },
    {
      id: 'delayed-service-rate',
      label: 'Delayed Service Rate',
      value: String(delayed),
      sublabel: `${Math.round((delayed / stopsTotal) * 100)}% of stops`,
      alert: delayed > 0,
    },
  ]
}

export function getAsrDsrRows() {
  return routes.flatMap((r) =>
    r.stops
      .filter((s) => s.category === 'ASR' || s.category === 'DSR')
      .map((s) => ({
        route: r.code,
        driver: r.driver,
        postcode: s.postcode,
        customer: s.customer,
        category: s.category,
        status: s.status,
      })),
  )
}

export function getStopsSummary(route: Route) {
  const asr = route.stops.filter((s) => s.category === 'ASR').length
  const dsr = route.stops.filter((s) => s.category === 'DSR').length
  const noShow = route.stops.filter((s) => s.status === 'NO-SHOW').length
  return {
    routeCode: route.code,
    driver: route.driver,
    preNoon: route.preNoon,
    asrCount: asr,
    dsrCount: dsr,
    noShowCount: noShow,
    stops: route.stops,
  }
}
