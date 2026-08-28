// Modelo de dados e funções puras portados de
// sp-portal-react/src/pages/RouteBalance/RouteBalance.tsx (produção real do
// LogixSphere) — ver DESIGN_ENGINEERING_TASK.md, atualização sobre "puxar as
// funções da page". Funções portadas quase 1:1 (rand, pick, subpostcodeOf,
// groupBySubpostcode, recomputeRoute); geração de dados e nomes de rota
// adaptados para reaproveitar o mock já existente deste protótipo.

export type StopType = 'DEL' | 'PU'
export type StopStatus = 'pending' | 'completed'
export type SendStatus = 'pending' | 'approved' | 'sent'
export type ShiftKey = 'am' | 'pm'
export type DashboardFilterKey = 'pre12' | 'asr' | 'dsr'

export interface Stop {
  id: number
  routeName: string
  stopNumber: number
  postcode: string
  address: string
  customer: string
  type: StopType
  pm: boolean
  pre12: boolean
  asr: boolean
  dsr: boolean
  status: StopStatus
}

export interface LastAction {
  field: 'sendStatus'
  shift: ShiftKey
  oldValue: SendStatus
}

export interface RouteRow {
  id: number
  name: string
  driver: string
  plate: string
  target: number
  sendStatus: { am: SendStatus; pm: SendStatus }
  lastAction: LastAction | null
  stops: Stop[]
  expanded?: boolean
}

export interface PostcodeGroup {
  postcode: string
  stops: Stop[]
  del: number
  pu: number
  pre12: boolean
}

export interface SubpostcodeGroup {
  code: string
  postcodes: PostcodeGroup[]
  del: number
  pu: number
  total: number
  pre12: boolean
}

export function rand(n: number): number {
  return Math.floor(Math.random() * n)
}
export function pick<T>(arr: T[]): T {
  return arr[rand(arr.length)]
}

export function subpostcodeOf(postcode: string): string {
  return postcode.split(' ')[0]
}

/** Ported 1:1 from groupBySubpostcode() — groups with a Pre-12 stop sort first. */
export function groupBySubpostcode(stops: Stop[]): SubpostcodeGroup[] {
  const bySub = new Map<string, Map<string, Stop[]>>()
  stops.forEach((s) => {
    const sub = subpostcodeOf(s.postcode)
    if (!bySub.has(sub)) bySub.set(sub, new Map())
    const byPc = bySub.get(sub)!
    if (!byPc.has(s.postcode)) byPc.set(s.postcode, [])
    byPc.get(s.postcode)!.push(s)
  })

  const groups: SubpostcodeGroup[] = [...bySub.entries()].map(([code, byPc]) => {
    const groupStops = [...byPc.values()].flat()
    const del = groupStops.filter((s) => s.type === 'DEL').length
    return {
      code,
      postcodes: [...byPc.entries()].map(([postcode, pcStops]) => ({
        postcode,
        stops: pcStops,
        del: pcStops.filter((s) => s.type === 'DEL').length,
        pu: pcStops.filter((s) => s.type === 'PU').length,
        pre12: pcStops.some((s) => s.pre12),
      })),
      del,
      pu: groupStops.length - del,
      total: groupStops.length,
      pre12: groupStops.some((s) => s.pre12),
    }
  })

  groups.sort((a, b) => (b.pre12 === true ? 1 : 0) - (a.pre12 === true ? 1 : 0))
  return groups
}

export const DASHBOARD_FILTER_MATCHERS: Record<DashboardFilterKey, (s: Stop) => boolean> = {
  pre12: (s) => s.pre12,
  asr: (s) => s.asr,
  dsr: (s) => s.dsr,
}

export const DASHBOARD_FILTER_LABELS: Record<DashboardFilterKey, string> = {
  pre12: 'Pre 12',
  asr: 'ASR',
  dsr: 'DSR',
}

const ADDRESSES = [
  { address: '141 Victoria Avenue', postcode: 'ME2 2AB' },
  { address: '177 Station Road', postcode: 'ME5 1AB' },
  { address: 'New Hythe Buisness Pk, College Rd', postcode: 'ME11' },
  { address: 'Unit 2, Whittings Farm, Halling', postcode: 'ME13' },
  { address: 'Knight Road Strood, Rochester', postcode: 'ME13' },
  { address: 'Ballard Business Park, Strood', postcode: 'ME207' },
]

// Sem diretório real de motorista/veículo ainda — mesma lista fixa portada
// de RouteBalance.tsx (produção) usada pra "Add New Flex Route".
export const DRIVERS = [
  'Carlos Silva', 'Ana Costa', 'João Martins', 'Maria Santos', 'Pedro Oliveira',
  'Lucas Pereira', 'Sofia Alves', 'Ricardo Dias', 'Juliana Ribeiro', 'Felipe Costa',
]
export const VEHICLES = ['YF25 OZL', 'YF25 ABC', 'YF25 DEF', 'YF25 GHI', 'YF25 JKL']

let stopIdSeq = 1
let routeIdSeq = 1

export function nextRouteId() {
  return ++routeIdSeq
}

function generateStop(routeName: string, stopNumber: number, pm: boolean): Stop {
  const loc = pick(ADDRESSES)
  const pre12 = !pm && rand(10) < 2
  return {
    id: stopIdSeq++,
    routeName,
    stopNumber,
    postcode: loc.postcode,
    address: loc.address,
    customer: `Customer ${300 + rand(400)}`,
    type: rand(10) < 8 ? 'DEL' : 'PU',
    pm,
    pre12,
    asr: rand(10) < 3,
    dsr: rand(10) < 3,
    status: 'pending',
  }
}

/** Gera as 8 rotas iniciais com paradas reais (am+pm) por rota — mesma contagem done/total (73%/100%) do mock anterior, agora com stops[] de verdade por trás para os agregados/KPIs saírem de dados reais. */
export function generateInitialRoutes(): RouteRow[] {
  const totals = [15, 15, 15, 15, 15, 15, 15, 15]
  const doneCounts = [11, 11, 15, 11, 11, 11, 15, 11]
  return totals.map((total, i) => {
    const name = `A-0${i + 1}`
    const stops: Stop[] = []
    for (let n = 1; n <= total; n++) {
      const stop = generateStop(name, n, false)
      if (n <= doneCounts[i]) stop.status = 'completed'
      stops.push(stop)
    }
    // Toda rota também ganha um conjunto de paradas PM (menor, ~metade do AM),
    // pra alternar o turno ter efeito real dos dois lados em vez de esvaziar
    // metade das rotas.
    const pmTotal = Math.round(total * 0.6)
    const pmDone = Math.round(doneCounts[i] * 0.6)
    for (let n = 1; n <= pmTotal; n++) {
      const stop = generateStop(name, total + n, true)
      if (n <= pmDone) stop.status = 'completed'
      stops.push(stop)
    }
    return {
      id: routeIdSeq++,
      name,
      driver: 'Carlos Silva',
      plate: 'YF25 OZL',
      target: 85,
      sendStatus: { am: 'pending', pm: 'pending' },
      lastAction: null,
      stops,
      expanded: i === 0,
    }
  })
}

export function recomputeStopsCompletion(route: RouteRow, shiftKey: ShiftKey) {
  const shiftStops = route.stops.filter((s) => (shiftKey === 'pm' ? s.pm : !s.pm))
  const done = shiftStops.filter((s) => s.status === 'completed').length
  return { total: shiftStops.length, done, pct: shiftStops.length ? Math.round((done / shiftStops.length) * 100) : 0 }
}
