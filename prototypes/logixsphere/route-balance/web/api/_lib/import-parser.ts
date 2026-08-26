import * as XLSX from 'xlsx'

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

const ROUTE_KEY_PATTERN = /route|rota/i
const WEIGHT_KEY_PATTERN = /weight|kg|peso/i
const PIECES_KEY_PATTERN = /piece|pcs|qty|quant/i

/**
 * Espelho de server/src/import-parser.ts — ver nota em web/api/_lib/data.ts.
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
  const routeKey = headers.find((h) => ROUTE_KEY_PATTERN.test(h))
  const weightKey = headers.find((h) => WEIGHT_KEY_PATTERN.test(h))
  const piecesKey = headers.find((h) => PIECES_KEY_PATTERN.test(h))

  const groups = new Map<string, Record<string, unknown>[]>()
  if (routeKey) {
    rows.forEach((row) => {
      const code = String(row[routeKey] ?? 'UNASSIGNED').trim() || 'UNASSIGNED'
      const bucket = groups.get(code) ?? []
      bucket.push(row)
      groups.set(code, bucket)
    })
  } else {
    const chunkSize = 5
    for (let i = 0; i < rows.length; i += chunkSize) {
      const code = `AUTO-${String(Math.floor(i / chunkSize) + 1).padStart(2, '0')}`
      groups.set(code, rows.slice(i, i + chunkSize))
    }
  }

  const shipments: ImportedShipment[] = Array.from(groups.entries()).map(
    ([routeCode, groupRows]) => {
      const weightKg = weightKey
        ? groupRows.reduce((sum, r) => sum + (Number(r[weightKey]) || 0), 0)
        : groupRows.length * 1.5
      const pieces = piecesKey
        ? groupRows.reduce((sum, r) => sum + (Number(r[piecesKey]) || 0), 0)
        : groupRows.length
      return {
        routeCode,
        weightKg: Math.round(weightKg * 10) / 10,
        pieces,
        stops: groupRows.length,
      }
    },
  )

  return { shipments, totalCreated: shipments.length, fileName }
}
