import { FileText, Trash2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { ImportResult } from '@/types'

const ACCEPTED = '.xlsx,.xls,.xlsm'

function formatKb(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))}KB`
}

export function ImportFlow({
  onProceed,
  onBack,
}: {
  onProceed: (imported: boolean) => void
  onBack: () => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [fileSize, setFileSize] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(file: File) {
    setBusy(true)
    setError(null)
    try {
      const parsed = await api.importFile(file)
      setResult(parsed)
      setFileSize(file.size)
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
    <main className="flex flex-1 flex-col gap-4 px-6 py-6">
      <p className="max-w-5xl font-mono text-xs leading-relaxed text-on-surface-variant">
        Upload the DISCO export to build today's stops for Route Balance — extracts Pre-12,
        postcode totals and size-class breakdown, and seeds the routes below.
      </p>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[340px_1fr]">
        <div className="relative bg-surface p-4">
          <CornerBracket className="left-0 top-0 border-l border-t" />
          <CornerBracket className="bottom-0 right-0 border-b border-r" />

          {!result ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex min-h-[220px] flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-8 text-center transition-colors',
                dragOver
                  ? 'border-primary bg-primary-container/40'
                  : 'border-outline-variant bg-surface-variant/50',
              )}
            >
              <UploadCloud className="size-10 stroke-[1.5] text-outline" />
              <p className="font-mono text-[15px] font-bold leading-snug text-on-surface">
                Drag the DISCO Excel
                <br />
                file here
              </p>
              <p className="font-mono text-sm text-on-surface">
                or{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-secondary underline underline-offset-4"
                >
                  open file explorer
                </button>
              </p>
              <p className="font-mono text-[11px] tracking-wide text-outline">
                {busy ? 'PROCESSANDO…' : 'FORMATS: .XLSX, .XLS, .XLSM'}
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
              {error && <p className="font-mono text-[11px] text-error">{error}</p>}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 border-2 border-dashed border-outline-variant bg-surface-variant/50 px-6 py-8 text-center">
              <div className="font-mono text-base font-bold text-on-surface">{result.fileName}</div>
              <div className="font-mono text-xs text-outline">{formatKb(fileSize)}</div>
              <button
                type="button"
                aria-label="Remover arquivo"
                onClick={() => {
                  setResult(null)
                  setFileSize(0)
                }}
                className="text-secondary hover:text-error"
              >
                <Trash2 className="size-5 fill-current" />
              </button>
            </div>
          )}
        </div>

          <div className="flex min-h-[440px] flex-col gap-4 border border-outline-variant bg-surface p-4">
            {!result ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <FileText className="size-6 text-on-surface-variant" />
                <p className="max-w-xs text-center font-mono text-xs text-on-surface-variant">
                  Process a file to preview Pre-12, Postcode Analysis and Size Class. The raw data
                  terminal will populate here.
                </p>
              </div>
            ) : (
              <>
                <section>
                  <h2 className="mb-2 font-mono text-[13px] font-bold uppercase tracking-wide text-on-surface">
                    Pre-12
                  </h2>
                  <ImportTable
                    headers={['Postal Code', 'Name', 'Address']}
                    rows={result.demands.map((d) => [d.postcode, d.name, d.address])}
                  />
                </section>

                <section>
                  <h2 className="mb-2 font-mono text-[13px] font-bold uppercase tracking-wide text-on-surface">
                    Análise de Postcodes
                  </h2>
                  <ImportTable
                    headers={['Subpostcode', 'Total de Deliveries']}
                    rows={result.postcodeTotals.map((p) => [p.subpostcode, String(p.totalDeliveries)])}
                  />
                </section>

                <section>
                  <h2 className="mb-2 font-mono text-[13px] font-bold uppercase tracking-wide text-on-surface">
                    Analise_Size_Class
                  </h2>
                  <ImportTable
                    headers={[
                      'Subpostcode',
                      'Soma Phys.',
                      'Total Pieces',
                      'Total Shipments',
                      'COY',
                      'COY-S1',
                      'COY-S2',
                      'FLY',
                      'NCY',
                      'PAL 1',
                      'Total',
                    ]}
                    rows={result.sizeClass.map((s) => [
                      s.subpostcode,
                      s.somaPhys.toFixed(2),
                      String(s.totalPieces),
                      String(s.totalShipments),
                      String(s.coy),
                      String(s.coyS1),
                      String(s.coyS2),
                      String(s.fly),
                      String(s.ncy),
                      String(s.pal1),
                      String(s.total),
                    ])}
                  />
                </section>
              </>
            )}
          </div>
        </div>

      <div className="mt-2 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => (result ? setResult(null) : onBack())}
        >
          Voltar
        </Button>
        <Button
          size="sm"
          variant={result ? 'lime' : 'primary'}
          onClick={() => onProceed(Boolean(result))}
        >
          {result ? 'Go to Balance →' : 'Process →'}
        </Button>
      </div>
    </main>
  )
}

function ImportTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr className="border-b-2 border-on-surface">
            {headers.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-2 pb-2 text-left font-normal uppercase tracking-wider text-outline"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-outline-variant/60">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-2 py-2.5 text-on-surface">
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

function CornerBracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute size-3.5 border-on-surface', className)}
    />
  )
}
