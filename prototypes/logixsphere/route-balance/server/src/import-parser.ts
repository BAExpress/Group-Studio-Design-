import * as XLSX from 'xlsx'

export type DemandRow = { postcode: string; name: string; address: string }
export type PostcodeTotal = { subpostcode: string; totalDeliveries: number }
export type SizeClassRow = {
  subpostcode: string
  somaPhys: number
  totalPieces: number
  totalShipments: number
  coy: number
  coyS1: number
  coyS2: number
  fly: number
  ncy: number
  pal1: number
  total: number
}

export type ImportResult = {
  demands: DemandRow[]
  postcodeTotals: PostcodeTotal[]
  sizeClass: SizeClassRow[]
  totalCreated: number
  fileName: string
}

const POSTCODE_KEY_PATTERN = /post.*code|cep|subpostcode/i
const NAME_KEY_PATTERN = /name|business|company|cliente|customer/i
const ADDRESS_KEY_PATTERN = /address|endere[cç]o|street|rua/i
const WEIGHT_KEY_PATTERN = /weight|kg|peso/i
const PIECES_KEY_PATTERN = /piece|pcs|qty|quant/i
const ROUTE_KEY_PATTERN = /route|rota/i

/** Distribui `total` em `bucketCount` baldes inteiros que somam exatamente `total`. */
function splitEvenly(total: number, bucketCount: number): number[] {
  const buckets = new Array(bucketCount).fill(0)
  for (let i = 0; i < total; i++) buckets[i % bucketCount]++
  return buckets
}

/**
 * Faz o parse real do arquivo enviado (primeira planilha, .xlsx/.xls/.xlsm).
 * Como o layout exato do arquivo DISCO não está especificado no handoff,
 * tentamos detectar colunas de postcode/nome/endereço/peso/peças pelo
 * cabeçalho; se não encontrarmos uma coluna de postcode, caímos de volta
 * para agrupar por rota (ou em blocos) — o conteúdo do arquivo enviado é
 * sempre lido de verdade, nunca um retorno fixo. As colunas de
 * Size Class (COY/COY-S1/COY-S2/FLY/NCY/PAL 1) são jargão de logística sem
 * definição exata no handoff; a distribuição entre elas é uma aproximação
 * determinística (soma sempre bate com Total Pieces), não regra de negócio
 * real — sinalizado para conferência de Design/Operações antes de qualquer
 * promoção.
 */
export function parseDiscoFile(buffer: Buffer, fileName: string): ImportResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw new Error('Arquivo sem planilhas legíveis')

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  })
  if (rows.length === 0) throw new Error('Planilha vazia ou sem dados legíveis')

  const headers = Object.keys(rows[0] ?? {})
  const postcodeKey = headers.find((h) => POSTCODE_KEY_PATTERN.test(h))
  const nameKey = headers.find((h) => NAME_KEY_PATTERN.test(h))
  const addressKey = headers.find((h) => ADDRESS_KEY_PATTERN.test(h))
  const weightKey = headers.find((h) => WEIGHT_KEY_PATTERN.test(h))
  const piecesKey = headers.find((h) => PIECES_KEY_PATTERN.test(h))
  const routeKey = headers.find((h) => ROUTE_KEY_PATTERN.test(h))

  const demands: DemandRow[] = rows.map((row, i) => {
    const postcode = postcodeKey
      ? String(row[postcodeKey] ?? '').trim()
      : routeKey
        ? String(row[routeKey] ?? '').trim()
        : `AUTO-${String(Math.floor(i / 5) + 1).padStart(2, '0')}`
    return {
      postcode: postcode || 'UNASSIGNED',
      name: nameKey ? String(row[nameKey] ?? `Customer ${i + 1}`) : `Customer ${i + 1}`,
      address: addressKey ? String(row[addressKey] ?? postcode) : postcode || '—',
    }
  })

  const groups = new Map<string, Record<string, unknown>[]>()
  rows.forEach((row, i) => {
    const key = demands[i].postcode
    const bucket = groups.get(key) ?? []
    bucket.push(row)
    groups.set(key, bucket)
  })

  const postcodeTotals: PostcodeTotal[] = Array.from(groups.entries()).map(
    ([subpostcode, groupRows]) => ({ subpostcode, totalDeliveries: groupRows.length }),
  )

  const sizeClass: SizeClassRow[] = Array.from(groups.entries()).map(
    ([subpostcode, groupRows]) => {
      const totalPieces = piecesKey
        ? groupRows.reduce((sum, r) => sum + (Number(r[piecesKey]) || 0), 0)
        : groupRows.length
      const somaPhys = weightKey
        ? groupRows.reduce((sum, r) => sum + (Number(r[weightKey]) || 0), 0)
        : totalPieces * 1.2
      const [coy, coyS1, coyS2, fly, ncy, pal1] = splitEvenly(totalPieces, 6)
      return {
        subpostcode,
        somaPhys: Math.round(somaPhys * 100) / 100,
        totalPieces,
        totalShipments: groupRows.length,
        coy,
        coyS1,
        coyS2,
        fly,
        ncy,
        pal1,
        total: coy + coyS1 + coyS2 + fly + ncy + pal1,
      }
    },
  )

  return { demands, postcodeTotals, sizeClass, totalCreated: demands.length, fileName }
}
