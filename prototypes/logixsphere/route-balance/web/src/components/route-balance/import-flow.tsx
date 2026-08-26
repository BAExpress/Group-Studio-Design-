import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { ImportResult } from '@/types'

const ACCEPTED = '.xlsx,.xls,.xlsm'

function sizeClassFor(weightKg: number): 'S' | 'M' | 'L' {
  if (weightKg < 5) return 'S'
  if (weightKg < 20) return 'M'
  return 'L'
}

export function ImportFlow({ onProceed }: { onProceed: () => void }) {
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(file: File) {
    setBusy(true)
    setError(null)
    try {
      const parsed = await api.importFile(file)
      setResult(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao processar arquivo')
    } finally {
      setBusy(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) void processFile(file)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-4xl rounded-md border border-outline-variant bg-surface">
        <header className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              LogixSphere
            </div>
            <h1 className="font-display text-lg font-bold">Route Balance — Import</h1>
          </div>
          <span className="rounded-sm bg-primary-container px-2 py-1 font-mono text-[10px] font-bold text-on-primary-container">
            Route Balance
          </span>
        </header>

        {!result ? (
          <div className="p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-12 text-center transition-colors',
                dragOver
                  ? 'border-primary bg-primary-container/30'
                  : 'border-outline-variant bg-background',
              )}
            >
              <UploadCloud className="size-9 text-on-surface-variant" />
              <p className="font-mono text-sm text-on-surface-variant">
                Drag the DISCO Excel file here
                <br />
                or{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-primary underline underline-offset-2"
                >
                  open file explorer
                </button>
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void processFile(file)
                  e.target.value = ''
                }}
              />
              <Button disabled={busy} onClick={() => inputRef.current?.click()} className="mt-2">
                {busy ? 'Processando…' : 'Process File'}
              </Button>
              {error && <p className="font-mono text-[11px] text-error">{error}</p>}
            </div>
            <p className="mt-4 font-mono text-[11px] text-on-surface-variant">
              Selecione um arquivo para pré-visualizar Pre-12, Postcode Analysis e Size Class. Os
              dados brutos recebidos serão exibidos aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-sm bg-surface-variant px-2 py-1 font-mono text-[11px] text-on-surface-variant">
                {result.fileName}
              </span>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {result.totalCreated} shipments extraídos
              </span>
            </div>

            <section>
              <h2 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Pre-12
              </h2>
              <ImportTable
                headers={['Route Code', 'Stops', 'Pieces']}
                rows={result.shipments.map((s) => [s.routeCode, String(s.stops), String(s.pieces)])}
              />
            </section>

            <section>
              <h2 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Análise de Postcodes
              </h2>
              <ImportTable
                headers={['Route Code', 'Weight (KG)', 'Stops']}
                rows={result.shipments.map((s) => [
                  s.routeCode,
                  s.weightKg.toFixed(1),
                  String(s.stops),
                ])}
              />
            </section>

            <section>
              <h2 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Análise de Size Class
              </h2>
              <ImportTable
                headers={['Route Code', 'S', 'M', 'L']}
                rows={result.shipments.map((s) => {
                  const cls = sizeClassFor(s.weightKg)
                  return [s.routeCode, cls === 'S' ? '✓' : '', cls === 'M' ? '✓' : '', cls === 'L' ? '✓' : '']
                })}
              />
            </section>

            <div className="flex items-center justify-between border-t border-outline-variant pt-4">
              <Button variant="secondary" size="sm" onClick={() => setResult(null)}>
                Voltar
              </Button>
              <Button size="sm" onClick={onProceed}>
                Ir para Route Balance
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ImportTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-outline-variant">
      <table className="w-full font-mono text-[11px]">
        <thead>
          <tr className="bg-surface-variant text-on-surface-variant">
            {headers.map((h) => (
              <th key={h} className="px-2 py-1 text-left font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-outline-variant">
              {row.map((cell, j) => (
                <td key={j} className="px-2 py-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
