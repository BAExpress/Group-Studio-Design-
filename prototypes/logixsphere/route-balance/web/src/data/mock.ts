// initialRoutes/pct/kpis/RouteData/Shift/specialPostcodes/specialDeliveries
// (o dashboard antigo, com dados fixos) saíram daqui quando o dashboard
// passou a usar src/data/route-domain.ts (rotas com stops[] reais, ver
// DESIGN_ENGINEERING_TASK.md — "puxar as funções da page"). allStops abaixo
// continua em uso só pelo detalhe expandido de "Deliveries by Postcode Area"
// em Shipment Details, que não foi portado para o novo domínio.

export const allStops = Array.from({ length: 8 }, (_, i) => ({
  address: i % 2 === 0 ? '141 Victoria Avenue' : '177 Station Road',
  postcode: i % 2 === 0 ? 'ME2 2AB' : 'ME5 1AB',
  customer: `Customer ${i % 2 === 0 ? 381 + i : 402 + i}`,
  flags: i % 2 === 0 ? ['AM', 'PRE 12', 'ASR'] : ['AM', 'PRE 12', 'DSR'],
}))

export const allPostcodes = ['ME15 1AB', 'ME15 2AB', 'ME15 3AB', 'ME15 4AB', 'ME15 5AB', 'ME15 6AB', 'ME15 7AB']

export const preTwelve = [
  { code: 'ME11', name: 'THORNDIKE DENTAL CARE', address: 'NEW HYTHE BUISNESS PK, COLLEGE RD, AYLESFORD, KENT' },
  { code: 'ME12', name: 'DENISE SMITH', address: 'NEW HYTHE BUISNESS PK, COLLEGE RD, AYLESFORD, KENT' },
  { code: 'ME13', name: 'ACUTE NEW ELEVATORS', address: 'UNIT 2, WHITTINGS FARM, HALLING, ROCHESTER' },
  { code: 'ME13', name: 'APC TECHNOLOGY GROUP', address: 'KNIGHT ROAD STROOD, ROCHESTER' },
  { code: 'ME207', name: 'POLYPIPE BUILDING SERVICES', address: 'BALLARD BUSINESS PARK, STROOD, ROCHESTER' },
  { code: 'ME21', name: 'ILS LTD', address: 'UNIT 2, WHITTINGS FARM, HALLING, ROCHESTER' },
]

export const postcodeAnalysis = [
  { subpostcode: 'DA12 3', total: 3 },
  { subpostcode: 'DA13 0', total: 8 },
  { subpostcode: 'DA13 9', total: 3 },
  { subpostcode: 'DA3 7', total: 8 },
  { subpostcode: 'DA3 8', total: 15 },
  { subpostcode: 'ME1 1', total: 8 },
]

export const sizeClass = [
  { subpostcode: 'DA12 3', soma: 2.66, pieces: 4, shipments: 4, coy: 0, coyS1: 1, coyS2: 0, fly: 3, ncy: 0, pal1: 0, total: 4 },
  { subpostcode: 'DA13 0', soma: 28.99, pieces: 4, shipments: 4, coy: 0, coyS1: 1, coyS2: 0, fly: 3, ncy: 0, pal1: 0, total: 4 },
  { subpostcode: 'DA13 9', soma: 4.6, pieces: 4, shipments: 4, coy: 0, coyS1: 1, coyS2: 0, fly: 3, ncy: 0, pal1: 0, total: 4 },
  { subpostcode: 'DA3 7', soma: 14.06, pieces: 4, shipments: 4, coy: 0, coyS1: 1, coyS2: 0, fly: 3, ncy: 0, pal1: 0, total: 4 },
  { subpostcode: 'DA3 8', soma: 91.32, pieces: 4, shipments: 4, coy: 0, coyS1: 1, coyS2: 0, fly: 3, ncy: 0, pal1: 0, total: 4 },
  { subpostcode: 'ME1 1', soma: 11.31, pieces: 4, shipments: 4, coy: 0, coyS1: 1, coyS2: 0, fly: 3, ncy: 0, pal1: 0, total: 4 },
]

// Aproximação — só ME2/ME5, stops e % vistos num print do Figma que não
// consegui localizar de novo no arquivo (frame pode ter sido editado por
// outra pessoa depois). Sem acesso ao dado real por trás do %, então o
// detalhe expandido reaproveita allStops filtrado por postcode.
export const postcodeAreaDeliveries = [
  { postcode: 'ME2', stops: 4, pct: 50 },
  { postcode: 'ME5', stops: 2, pct: 100 },
]

export const shipmentBreakdown = [
  { type: 'Total', pieces: 224, shipments: 29, soma: 9972.61, pct: '100%', isTotal: true },
  { type: 'COY', pieces: 50, shipments: 5, soma: 1413.01, pct: '14%' },
  { type: 'COY-S1', pieces: 57, shipments: 6, soma: 1937.41, pct: '19%' },
  { type: 'COY-S2', pieces: 20, shipments: 6, soma: 2525.86, pct: '25%' },
  { type: 'FLY', pieces: 21, shipments: 2, soma: 512.23, pct: '5%' },
  { type: 'NCY', pieces: 20, shipments: 3, soma: 895.28, pct: '9%' },
  { type: 'PAL1', pieces: 56, shipments: 7, soma: 2688.82, pct: '27%' },
]
