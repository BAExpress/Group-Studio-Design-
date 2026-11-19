import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Moon, RefreshCw, Sun, XCircle } from 'lucide-react'

import scanJson from '@/data/repo-scan.json'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Table, TableCell, TableHead, TableRow, TableScroll } from '@/components/ui/table'
import { contrastRatio, wcagLevel } from '@/lib/contrast'
import { cn } from '@/lib/utils'

type Status = 'pass' | 'warn' | 'fail'
type Check = { group: string; label: string; status: Status; detail: string; path: string | null }
type Scan = {
  generatedAt: string
  repo: { title: string; files: number }
  checks: Check[]
  prototypes: { package: string; root: string; deps: string[]; undocumented: string[] }[]
  skill: {
    name: string
    description: string
    bodyLines: number
    flows: { id: string; title: string; triggers: string; steps: number }[]
    references: { path: string; exists: boolean; lines: number }[]
  }
}
const scan = scanJson as Scan

const STATUS = {
  pass: { label: 'OK', icon: CheckCircle2, badge: 'validated', text: 'text-primary' },
  warn: { label: 'Atenção', icon: AlertTriangle, badge: 'pending', text: 'text-tertiary' },
  fail: { label: 'Falha', icon: XCircle, badge: 'error', text: 'text-error' },
} as const

const NAV = [
  ['resumo', 'Resumo'],
  ['repositorio', 'Repositório'],
  ['skill', 'Skill'],
  ['estilizacao', 'Estilização'],
  ['componentes', 'Componentes'],
] as const

// Pares fundo/texto exatamente como o @theme do index.css os mapeia.
// (--rb-ink-faint fica de fora: não é exposto no @theme nem usado.)
const PAIRS: { name: string; bg: string; fg: string }[] = [
  { name: 'background / on-background', bg: '--rb-bg', fg: '--rb-ink' },
  { name: 'surface / on-surface', bg: '--rb-surface', fg: '--rb-ink' },
  { name: 'surface / on-surface-variant', bg: '--rb-surface', fg: '--rb-ink-dim' },
  { name: 'surface / tertiary (texto)', bg: '--rb-surface', fg: '--rb-warn' },
  { name: 'surface-variant / on-surface-variant', bg: '--rb-surface-2', fg: '--rb-ink-dim' },
  { name: 'primary / on-primary', bg: '--rb-olive', fg: '--rb-olive-ink' },
  { name: 'primary-bright / on-primary-bright', bg: '--rb-lime', fg: '--rb-lime-ink' },
  { name: 'primary-container / on-primary-container', bg: '--rb-lime-soft', fg: '--rb-olive' },
  { name: 'secondary / on-secondary', bg: '--rb-teal', fg: '--rb-on-teal' },
  { name: 'secondary-container / on-secondary-container', bg: '--rb-teal-soft', fg: '--rb-teal' },
  { name: 'tertiary / on-tertiary', bg: '--rb-warn', fg: '--rb-on-warn' },
  { name: 'tertiary-container / on-tertiary-container', bg: '--rb-warn-soft', fg: '--rb-warn' },
  { name: 'error / on-error', bg: '--rb-error', fg: '--rb-on-error' },
  { name: 'error-container / on-error-container', bg: '--rb-error-soft', fg: '--rb-error' },
]

type Theme = 'light' | 'dark'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('gds-theme', theme) } catch { /* sem storage */ }
  }, [theme])
  return [theme, setTheme] as const
}

function StatusIcon({ status, className }: { status: Status; className?: string }) {
  const S = STATUS[status]
  return <S.icon aria-label={S.label} className={cn('size-4 shrink-0', S.text, className)} />
}

function Section({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">{kicker}</div>
      <h2 className="mb-5 text-[24px]">{title}</h2>
      {children}
    </section>
  )
}

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-md border border-outline-variant bg-surface p-5', className)} {...props} />
}

function ChecksList({ checks }: { checks: Check[] }) {
  const groups = [...new Set(checks.map((c) => c.group))]
  return (
    <div className="grid gap-4">
      {groups.map((g) => {
        const items = checks.filter((c) => c.group === g)
        const worst: Status = items.some((c) => c.status === 'fail') ? 'fail' : items.some((c) => c.status === 'warn') ? 'warn' : 'pass'
        return (
          <Card key={g} className="p-0">
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wide">{g}</h3>
              <Badge variant={STATUS[worst].badge}>{STATUS[worst].label}</Badge>
            </div>
            <ul>
              {items.map((c) => (
                <li key={c.label} className="flex items-start gap-3 border-b border-outline-variant px-5 py-2.5 last:border-b-0">
                  <StatusIcon status={c.status} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="break-words font-mono text-xs font-semibold">{c.label}</div>
                    <div className="break-words text-[11.5px] text-on-surface-variant">{c.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}

function ContrastTable() {
  const lightRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<{ name: string; light: [string, string, number | null]; dark: [string, string, number | null] }[]>([])

  useEffect(() => {
    const resolve = (el: HTMLElement, v: string) => (v.startsWith('--') ? getComputedStyle(el).getPropertyValue(v).trim() : v)
    const measure = () => {
      if (!lightRef.current || !darkRef.current) return
      const l = lightRef.current, d = darkRef.current
      setRows(PAIRS.map((p) => {
        const lb = resolve(l, p.bg), lf = resolve(l, p.fg), db = resolve(d, p.bg), df = resolve(d, p.fg)
        return { name: p.name, light: [lb, lf, contrastRatio(lb, lf)], dark: [db, df, contrastRatio(db, df)] }
      }))
    }
    measure()
    document.fonts?.ready.then(measure)
  }, [])

  const cell = ([bg, fg, ratio]: [string, string, number | null]) => {
    const level = ratio == null ? null : wcagLevel(ratio)
    return (
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-12 shrink-0 items-center justify-center rounded-sm border border-outline-variant font-display text-[13px] font-bold" style={{ background: bg, color: fg }}>Aa</span>
        <span className="tabular-nums">{ratio ? ratio.toFixed(2) : '—'}:1</span>
        {level && <Badge variant={level === 'Falha' ? 'error' : level === 'AA texto grande' ? 'pending' : 'validated'}>{level}</Badge>}
      </div>
    )
  }

  const fails = rows.filter((r) => [r.light[2], r.dark[2]].some((x) => x != null && x < 4.5)).length

  return (
    <>
      <div ref={lightRef} data-theme="light" hidden />
      <div ref={darkRef} data-theme="dark" hidden />
      <p className="mb-4 max-w-3xl text-xs text-on-surface-variant">
        Razão de contraste WCAG 2.x medida ao vivo a partir das variáveis <code>--rb-*</code> do <code>index.css</code> (cópia dos tokens do Route Balance). Corpo de texto pede ≥ 4.5:1 (AA). {rows.length > 0 && <strong className="text-on-surface">{fails} de {rows.length} pares abaixo de AA em pelo menos um tema.</strong>}
      </p>
      <Card className="p-0">
        <TableScroll>
          <Table>
            <thead>
              <tr><TableHead>Par de tokens</TableHead><TableHead>Claro</TableHead><TableHead>Escuro</TableHead></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="whitespace-nowrap font-semibold">{r.name}</TableCell>
                  <TableCell>{cell(r.light)}</TableCell>
                  <TableCell>{cell(r.dark)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </Card>
    </>
  )
}

function ComponentLab() {
  const [value, setValue] = useState(64)
  const [name, setName] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wide">Button · 5 variantes × 3 tamanhos</h3>
        <div className="flex flex-wrap gap-2">
          {(['primary', 'lime', 'secondary', 'destructive', 'ghost'] as const).map((v) => <Button key={v} variant={v}>{v}</Button>)}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm">small</Button>
          <Button size="icon" variant="secondary" aria-label="Recarregar"><RefreshCw /></Button>
          <Button disabled>disabled</Button>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wide">Badge · 8 variantes</h3>
        <div className="flex flex-wrap gap-2">
          {(['neutral', 'chip', 'pending', 'validated', 'error', 'info', 'outline-secondary', 'outline-tertiary'] as const).map((v) => <Badge key={v} variant={v}>{v}</Badge>)}
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wide">Input + Label</h3>
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); setSent(name || '(vazio)') }}>
          <div className="grid gap-1.5">
            <Label htmlFor="lab-name">Nome do arquivo (naming do Studio OS)</Label>
            <Input id="lab-name" placeholder="LGX_Proto_RouteBalance_Draft_v0.1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div><Button type="submit" variant="secondary">Enviar</Button></div>
          {sent && <div role="status" className="text-xs text-primary">Recebido: {sent}</div>}
        </form>
      </Card>
      <Card>
        <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wide">Progress + Dialog</h3>
        <div className="mb-1.5 flex justify-between text-xs"><span>Capacidade</span><span className="tabular-nums">{value}%</span></div>
        <Progress value={value} aria-label="Capacidade" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 10))}>−10</Button>
          <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.min(100, v + 10))}>+10</Button>
          <Dialog>
            <DialogTrigger asChild><Button size="sm" variant="lime">Abrir dialog</Button></DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg">
              <DialogHeader><DialogTitle>Dialog (Radix)</DialogTitle></DialogHeader>
              <DialogBody className="text-xs text-on-surface-variant">Foco preso dentro do diálogo, ESC fecha, overlay com blur.</DialogBody>
              <DialogFooter><Button size="sm">OK</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  )
}

export function App() {
  const [theme, setTheme] = useTheme()
  const checks = scan.checks
  const counts = useMemo(() => ({
    pass: checks.filter((c) => c.status === 'pass').length,
    warn: checks.filter((c) => c.status === 'warn').length,
    fail: checks.filter((c) => c.status === 'fail').length,
  }), [checks])
  const score = Math.round(((counts.pass + counts.warn * 0.5) / checks.length) * 100)
  const repoChecks = checks.filter((c) => c.group !== 'Skill')
  const skillChecks = checks.filter((c) => c.group === 'Skill')
  const generated = new Date(scan.generatedAt).toLocaleString('pt-BR')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 max-[640px]:px-4">
          <div className="font-display text-[15px] font-bold leading-none tracking-tight">GDS / Verificação</div>
          <nav aria-label="Seções" className="flex flex-1 gap-1 overflow-x-auto">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-[11px] font-semibold text-on-surface-variant hover:bg-surface-variant hover:text-on-surface">{label}</a>
            ))}
          </nav>
          <Button size="icon" variant="secondary" aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-14 px-6 pb-20 pt-10 max-[640px]:px-4">
        <section id="resumo" className="scroll-mt-20">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline-tertiary">Experimental</Badge>
            <Badge variant="chip">prototypes/experiments/gds-verificacao</Badge>
          </div>
          <h1 className="max-w-3xl text-[40px] leading-[1.05] max-[640px]:text-[30px]">Verificação do repositório e da skill</h1>
          <p className="mt-3 max-w-2xl break-words text-xs leading-relaxed text-on-surface-variant">
            {scan.repo.title} — {scan.repo.files} arquivos inspecionados por <code>scripts/scan-repo.mjs</code> em {generated}. Rode <code>npm run scan</code> para atualizar.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_repeat(3,1fr)]">
            <Card>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Índice de conformidade</div>
              <div className="mt-1 font-display text-[44px] font-bold leading-none tabular-nums">{score}<span className="text-[20px] text-on-surface-variant">%</span></div>
              <Progress className="mt-3" value={score} aria-label="Índice de conformidade" />
              <div className="mt-2 text-[10.5px] text-on-surface-variant">OK = 1 · Atenção = 0,5 · Falha = 0</div>
            </Card>
            {(['pass', 'warn', 'fail'] as const).map((s) => (
              <Card key={s} className="flex flex-col justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"><StatusIcon status={s} />{STATUS[s].label}</div>
                <div className={cn('mt-3 font-display text-[40px] font-bold leading-none tabular-nums', STATUS[s].text)}>{counts[s]}</div>
              </Card>
            ))}
          </div>

          {counts.fail > 0 && (
            <Card className="mt-4 border-error/40">
              <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-error">Falhas a resolver</h3>
              <ul className="grid gap-1.5 text-xs">
                {checks.filter((c) => c.status === 'fail').map((c) => (
                  <li key={c.label} className="flex gap-2"><StatusIcon status="fail" className="mt-0.5" /><span><strong>{c.label}</strong> — {c.detail}</span></li>
                ))}
              </ul>
            </Card>
          )}
        </section>

        <Section id="repositorio" kicker="01 · Construção" title="Repositório">
          <ChecksList checks={repoChecks} />
          <Card className="mt-4 p-0">
            <div className="border-b border-outline-variant px-5 py-3 font-mono text-xs font-bold uppercase tracking-wide">Dependências sem Source/Component Record</div>
            <TableScroll>
              <Table>
                <thead><tr><TableHead>package.json</TableHead><TableHead>Sem registro</TableHead></tr></thead>
                <tbody>
                  {scan.prototypes.filter((p) => p.deps.length).map((p) => (
                    <TableRow key={p.package}>
                      <TableCell className="align-top font-semibold">{p.package}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.undocumented.length ? p.undocumented.map((d) => <Badge key={d} variant="chip">{d}</Badge>) : <Badge variant="validated">todas registradas</Badge>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableScroll>
          </Card>
        </Section>

        <Section id="skill" kicker="02 · Construção" title={`Skill · ${scan.skill.name}`}>
          <Card className="mb-4">
            <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Description do frontmatter · {scan.skill.description.length}/1024</div>
            <p className="text-xs leading-relaxed">{scan.skill.description}</p>
          </Card>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {scan.skill.flows.map((f) => (
              <Card key={f.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-8 items-center justify-center rounded-sm bg-primary-bright font-display text-[16px] font-bold text-on-primary-bright">{f.id}</span>
                  <Badge variant="info">{f.steps} passos</Badge>
                </div>
                <div className="font-mono text-[11.5px] font-semibold leading-snug">{f.title}</div>
                <div className="text-[11px] leading-snug text-on-surface-variant">{f.triggers}</div>
              </Card>
            ))}
          </div>
          <ChecksList checks={skillChecks} />
        </Section>

        <Section id="estilizacao" kicker="03 · Estilização" title="Tokens e contraste">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Card>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Display · Space Grotesk 500/700</div>
              <div className="mt-2 font-display text-[34px] font-bold leading-tight">Route Balance 0123</div>
            </Card>
            <Card>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Corpo · IBM Plex Mono 400–700</div>
              <div className="mt-2 font-mono text-[13px] leading-relaxed">Texto de interface em 13px.<br /><strong>Semibold</strong> · tabular 1.234,56</div>
            </Card>
          </div>
          <ContrastTable />
        </Section>

        <Section id="componentes" kicker="04 · Estilização" title="Componentes (shadcn copiados)">
          <ComponentLab />
        </Section>
      </main>

      <footer className="border-t border-outline-variant py-6 text-center text-[10.5px] text-on-surface-variant">
        Protótipo experimental — não é produção. Tokens e primitivos copiados de <code>prototypes/logixsphere/route-balance/web</code>.
      </footer>
    </div>
  )
}
