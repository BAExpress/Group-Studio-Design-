import { ID_PREFIXES } from '@/data/studio-os'

export type NamingResult = {
  ok: boolean
  quarantine: boolean
  checks: { label: string; status: 'pass' | 'warn' | 'fail'; detail: string }[]
  parts: { produto?: string; tipo?: string; nome?: string; status?: string; versao?: string }
}

// Formato declarado: [Produto]_[Tipo]_[Nome]_[Status]_vX.Y
// O snapshot NÃO declara o vocabulário de Produto, Tipo ou Status, então
// a validação confere presença/estrutura, nunca os valores.
export function validateName(raw: string): NamingResult {
  const checks: NamingResult['checks'] = []
  const name = raw.trim().replace(/\.[a-z0-9]{1,5}$/i, '') // ignora extensão
  const segs = name.split('_').filter(Boolean)
  const last = segs[segs.length - 1] ?? ''
  const hasVersion = /^v\d+\.\d+$/.test(last)

  const parts: NamingResult['parts'] = {}
  if (segs.length >= 5 && hasVersion) {
    parts.produto = segs[0]
    parts.tipo = segs[1]
    parts.status = segs[segs.length - 2]
    parts.nome = segs.slice(2, -2).join('_')
    parts.versao = last
  }

  checks.push(/final/i.test(name)
    ? { label: 'Sem "FINAL"', status: 'fail', detail: 'O nome contém "FINAL". Status e versão resolvem isso, não uma palavra no nome.' }
    : { label: 'Sem "FINAL"', status: 'pass', detail: 'Ok' })

  checks.push(hasVersion
    ? { label: 'Versão vX.Y no fim', status: 'pass', detail: last }
    : { label: 'Versão vX.Y no fim', status: 'fail', detail: `Último segmento "${last || '—'}" não segue vX.Y.` })

  checks.push(segs.length >= 5
    ? { label: '5 segmentos (Produto_Tipo_Nome_Status_vX.Y)', status: 'pass', detail: `${segs.length} segmentos` }
    : { label: '5 segmentos (Produto_Tipo_Nome_Status_vX.Y)', status: 'fail', detail: `${segs.length} segmento(s). Falta produto, tipo, nome ou status identificável.` })

  const badDates = [...name.matchAll(/\b(\d{1,2})[-./](\d{1,2})[-./](\d{2,4})\b/g)].map((m) => m[0])
  const isoDates = [...name.matchAll(/\b\d{4}-\d{2}-\d{2}\b/g)].map((m) => m[0])
  if (badDates.length) checks.push({ label: 'Datas em YYYY-MM-DD', status: 'fail', detail: `Data fora do padrão: ${badDates.join(', ')}` })
  else if (isoDates.length) checks.push({ label: 'Datas em YYYY-MM-DD', status: 'pass', detail: isoDates.join(', ') })

  const prefix = Object.keys(ID_PREFIXES).find((p) => name.toUpperCase().includes(`_${p}`) || name.toUpperCase().startsWith(p))
  if (prefix) checks.push({ label: 'Prefixo de ID', status: 'pass', detail: `${prefix} = ${ID_PREFIXES[prefix]}` })

  if (parts.status) checks.push({ label: 'Valor de status', status: 'warn', detail: `"${parts.status}" — o snapshot não declara o vocabulário de status. Confirme com o steward (João).` })

  const quarantine = segs.length < 5 || !hasVersion
  return { ok: checks.every((c) => c.status !== 'fail'), quarantine, checks, parts }
}
