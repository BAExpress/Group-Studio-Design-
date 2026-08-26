/*
 * Espelho de server/src/data.ts, adaptado para rodar como Vercel Serverless
 * Function (web/api). Mantido em sincronia manual — ver nota de governança
 * em DESIGN_ENGINEERING_TASK.md sobre Node/Express não estar coberto pela
 * DR-GDS-001. Dados em memória: numa função serverless isso reseta a cada
 * cold start / não é garantidamente compartilhado entre invocações — ok
 * para revisão de protótipo, não é comportamento de produção.
 */
export type SubpostcodeRow = { code: string; del: number; pu: number; total: number }
export type Route = {
  id: string
  code: string
  driver: string
  shift: 'AM' | 'PM'
  status: 'pending' | 'validated'
  capacityState: 'default' | 'rebalance'
  stopsDone: number
  stopsTotal: number
  deliveries: number
  pickups: number
  preNoon: number
  targetPercent: number
  subpostcodes: SubpostcodeRow[]
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

export const routes: Route[] = [
  {
    id: 'route-a01',
    code: 'ROUTE A-01',
    driver: 'Carlos Silva',
    shift: 'AM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 11,
    stopsTotal: 15,
    deliveries: 10,
    pickups: 5,
    preNoon: 2,
    targetPercent: 92,
    subpostcodes: [
      { code: 'ME1', del: 2, pu: 1, total: 3 },
      { code: 'ME2', del: 1, pu: 4, total: 5 },
    ],
  },
  {
    id: 'route-a02',
    code: 'ROUTE A-02',
    driver: 'Marina Costa',
    shift: 'AM',
    status: 'validated',
    capacityState: 'default',
    stopsDone: 15,
    stopsTotal: 15,
    deliveries: 12,
    pickups: 3,
    preNoon: 5,
    targetPercent: 95,
    subpostcodes: [
      { code: 'ME3', del: 3, pu: 0, total: 3 },
      { code: 'ME4', del: 2, pu: 1, total: 3 },
    ],
  },
  {
    id: 'route-a03',
    code: 'ROUTE A-03',
    driver: 'Rafael Nunes',
    shift: 'PM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 9,
    stopsTotal: 14,
    deliveries: 8,
    pickups: 1,
    preNoon: 1,
    targetPercent: 70,
    subpostcodes: [{ code: 'ME7', del: 5, pu: 4, total: 9 }],
  },
  {
    id: 'route-a04',
    code: 'ROUTE A-04',
    driver: 'Juliana Alves',
    shift: 'AM',
    status: 'pending',
    capacityState: 'rebalance',
    stopsDone: 17,
    stopsTotal: 17,
    deliveries: 13,
    pickups: 4,
    preNoon: 3,
    targetPercent: 100,
    subpostcodes: [
      { code: 'ME5', del: 2, pu: 0, total: 2 },
      { code: 'ME6', del: 2, pu: 2, total: 4 },
    ],
  },
  {
    id: 'route-a05',
    code: 'ROUTE A-05',
    driver: 'Pedro Lima',
    shift: 'PM',
    status: 'validated',
    capacityState: 'default',
    stopsDone: 13,
    stopsTotal: 13,
    deliveries: 11,
    pickups: 2,
    preNoon: 4,
    targetPercent: 90,
    subpostcodes: [{ code: 'ME8', del: 4, pu: 1, total: 5 }],
  },
  {
    id: 'route-a06',
    code: 'ROUTE A-06',
    driver: 'Fernanda Dias',
    shift: 'AM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 7,
    stopsTotal: 12,
    deliveries: 6,
    pickups: 1,
    preNoon: 0,
    targetPercent: 58,
    subpostcodes: [{ code: 'ME9', del: 3, pu: 2, total: 5 }],
  },
  {
    id: 'route-a07',
    code: 'ROUTE A-07',
    driver: 'Bruno Teixeira',
    shift: 'PM',
    status: 'pending',
    capacityState: 'default',
    stopsDone: 10,
    stopsTotal: 16,
    deliveries: 9,
    pickups: 1,
    preNoon: 2,
    targetPercent: 63,
    subpostcodes: [{ code: 'ME10', del: 6, pu: 0, total: 6 }],
  },
  {
    id: 'route-a08',
    code: 'ROUTE A-08',
    driver: 'Camila Rocha',
    shift: 'AM',
    status: 'validated',
    capacityState: 'default',
    stopsDone: 14,
    stopsTotal: 14,
    deliveries: 12,
    pickups: 2,
    preNoon: 3,
    targetPercent: 96,
    subpostcodes: [{ code: 'ME11', del: 5, pu: 1, total: 6 }],
  },
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
