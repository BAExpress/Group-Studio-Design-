import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Table, TableCell, TableHead, TableRow, TableScroll } from '@/components/ui/table'
import { AppShell } from '@/components/route-balance/app-shell'
import { preTwelve, postcodeAnalysis, sizeClass } from '@/data/mock'

export function ImportPage() {
  const navigate = useNavigate()
  const [fileSelected, setFileSelected] = useState(false)
  const [processed, setProcessed] = useState(false)

  function handleAction() {
    if (!processed) {
      setProcessed(true)
    } else {
      navigate('/')
    }
  }

  return (
    <AppShell>
      <p className="max-w-[60ch] text-[11.5px] leading-relaxed text-on-surface-variant">
        Upload the DISCO export to build today's stops for Route Balance — extracts Pre-12, postcode totals and
        size-class breakdown, and seeds the routes below.
      </p>

      <div className="my-5 grid grid-cols-1 rounded-[3px] border border-outline bg-surface md:grid-cols-2">
        <div className="border-outline-variant p-5 md:border-r">
          {!fileSelected ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setFileSelected(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setFileSelected(true)
                }
              }}
              className="cursor-pointer rounded-md border-2 border-dashed border-outline bg-background px-5 py-9 text-center text-on-surface-variant transition-colors hover:border-primary hover:bg-surface-variant"
            >
              <span className="mb-2.5 block text-[26px]">⇧</span>
              <strong className="block text-[13px] text-on-surface">Drag the DISCO Excel file here</strong>
              <div className="mt-1.5">
                or <a className="cursor-pointer text-secondary underline">open file explorer</a>
              </div>
              <div className="mt-2.5 text-[9.5px] tracking-wide text-on-surface-variant/80">FORMATS: .XLSX, .XLS, .XLSM</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 rounded-md border-2 border-dashed border-outline bg-background px-5 py-8 text-center">
              <div className="font-display text-[15px] font-bold">arquivo.xml</div>
              <div className="text-[11px] text-on-surface-variant/80">623KB</div>
              <button
                type="button"
                onClick={() => {
                  setFileSelected(false)
                  setProcessed(false)
                }}
                aria-label="Remover arquivo"
                className="p-1 text-secondary hover:text-error"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="p-5">
          {!processed ? (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3.5 text-center text-on-surface-variant">
              <span className="text-[30px] text-on-surface-variant/80">▤</span>
              <p className="max-w-[34ch] text-xs leading-relaxed">
                Process a file to preview Pre-12, Postcode Analysis and Size Class. The raw data terminal will populate
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <section>
                <h2 className="mb-2.5 text-sm">PRE-12</h2>
                <TableScroll>
                  <Table>
                    <thead>
                      <TableRow>
                        <TableHead>Postal Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </thead>
                    <tbody>
                      {preTwelve.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.code}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.address}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableScroll>
              </section>
              <section>
                <h2 className="mb-2.5 text-sm">Análise de Postcodes</h2>
                <TableScroll>
                  <Table>
                    <thead>
                      <TableRow>
                        <TableHead>Subpostcode</TableHead>
                        <TableHead>Total de Deliveries</TableHead>
                      </TableRow>
                    </thead>
                    <tbody>
                      {postcodeAnalysis.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.subpostcode}</TableCell>
                          <TableCell>{row.total}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableScroll>
              </section>
              <section>
                <h2 className="mb-2.5 text-sm">Analise_Size_Class</h2>
                <TableScroll>
                  <Table>
                    <thead>
                      <TableRow>
                        <TableHead>Subpostcode</TableHead>
                        <TableHead>Soma Phys.</TableHead>
                        <TableHead>Total Pieces</TableHead>
                        <TableHead>Total Shipments</TableHead>
                        <TableHead>COY</TableHead>
                        <TableHead>COY-S1</TableHead>
                        <TableHead>COY-S2</TableHead>
                        <TableHead>FLY</TableHead>
                        <TableHead>NCY</TableHead>
                        <TableHead>PAL 1</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </thead>
                    <tbody>
                      {sizeClass.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.subpostcode}</TableCell>
                          <TableCell>{row.soma}</TableCell>
                          <TableCell>{row.pieces}</TableCell>
                          <TableCell>{row.shipments}</TableCell>
                          <TableCell>{row.coy}</TableCell>
                          <TableCell>{row.coyS1}</TableCell>
                          <TableCell>{row.coyS2}</TableCell>
                          <TableCell>{row.fly}</TableCell>
                          <TableCell>{row.ncy}</TableCell>
                          <TableCell>{row.pal1}</TableCell>
                          <TableCell>{row.total}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableScroll>
              </section>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-2.5">
        <Button variant="secondary" asChild>
          <Link to="/">Voltar</Link>
        </Button>
        <Button variant="lime" disabled={!fileSelected} onClick={handleAction}>
          {!processed ? 'Process →' : 'Go to Balance →'}
        </Button>
      </div>
    </AppShell>
  )
}
