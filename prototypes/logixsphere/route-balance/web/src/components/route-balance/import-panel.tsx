import { CheckCircle2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { ImportResult } from '@/types'

const ACCEPTED = '.xlsx,.xls,.xlsm'

export function ImportPanel({
  onImported,
}: {
  onImported: (result: ImportResult) => void
}) {
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
      onImported(parsed)
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

  if (result) {
    return (
      <div className="rounded-md border border-outline-variant bg-surface p-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Extracted Demands by Route
          </span>
          <span className="font-mono text-[11px] text-on-surface-variant">
            {result.fileName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3 lg:grid-cols-4">
          {result.shipments.map((s) => (
            <div
              key={s.routeCode}
              className="rounded-sm border border-outline-variant p-2 font-mono text-[11px]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{s.routeCode}</span>
                <span className="text-on-surface-variant">
                  {s.stops} stop{s.stops === 1 ? '' : 's'}
                </span>
              </div>
              <div className="mt-1 flex gap-1">
                <span className="rounded-sm bg-surface-variant px-1.5 py-0.5 text-on-surface-variant">
                  {s.weightKg.toFixed(1)}KG
                </span>
                <span className="rounded-sm bg-surface-variant px-1.5 py-0.5 text-on-surface-variant">
                  {s.pieces} PC
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant pt-3">
          <span className="font-mono text-[11px] text-on-surface-variant">
            TOTAL: {result.totalCreated} created shipments
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-primary">
              <CheckCircle2 className="size-3.5" /> INGESTION OK
            </span>
            <Button size="sm" onClick={() => setResult(null)}>
              Nova importação
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 text-center transition-colors',
        dragOver
          ? 'border-primary bg-primary-container/30'
          : 'border-outline-variant bg-surface',
      )}
    >
      <UploadCloud className="size-8 text-on-surface-variant" />
      <p className="font-mono text-xs text-on-surface-variant">
        Drag &amp; drop DISCO file (.XLSX, .XLS, .XLSM)
        <br />
        ou{' '}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-primary underline underline-offset-2"
        >
          abra o seletor de arquivos
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
      <Button
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="mt-2"
      >
        {busy ? 'Processando…' : 'Process File'}
      </Button>
      {error && <p className="font-mono text-[11px] text-error">{error}</p>}
    </div>
  )
}
