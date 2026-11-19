import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CheckCircle2, Copy, Moon, Sun, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Table, TableCell, TableHead, TableRow, TableScroll } from '@/components/ui/table'
import {
  ASSETS, DATA_CLASSES, ESCALATION, GATES, OPEN_DECISIONS, READY_GATE, ROLES, SOURCE, SYSTEMS, TRANSIENT, WORKFLOW,
} from '@/data/studio-os'
import { validateName } from '@/lib/naming'
import { cn } from '@/lib/utils'

const NAV = [
  ['decisoes', 'A', 'Decisões abertas'],
  ['gates', 'B', 'Gates'],
  ['fonte', 'C', 'Fonte canônica'],
  ['naming', 'D', 'Nomenclatura'],
  ['escalation', 'E', 'Escalation'],
  ['papeis', '·', 'Papéis e dados'],
] as const

type Theme = 'light' | 'dark'
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'))
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('gds-theme', theme) } catch { /* sem storage */ }
  }, [theme])
  return [theme, setTheme] as const
}

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-md border border-outline-variant bg-surface p-5', className)} {...props} />
}

function Lacuna({ what }: { what: string }) {
  return <Badge variant="pending" title={`Não declarado no snapshot: ${what}`}>⬜ Lacuna</Badge>
}

function Section({ id, flow, title, lead, children }: { id: string; flow: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-primary-bright font-display text-[22px] font-bold text-on-primary-bright">{flow}</span>
        <div>
          <h2 className="text-[24px] leading-tight">{title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-on-surface-variant">{lead}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function CheckRow({ id, label, checked, onChange, emphasis }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; emphasis?: boolean }) {
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2.5 text-xs transition-colors', checked ? 'border-primary bg-primary-container' : 'border-outline-variant bg-background hover:bg-surface-variant')}>
      <input id={id} type="checkbox" className="size-4 accent-[var(--color-primary)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={cn('flex-1', checked && 'text-on-primary-container')}>{label}</span>
      {emphasis && !checked && <Badge variant="error">bloqueia início</Badge>}
    </label>
  )
}

/* ── A. Decisões abertas ─────────────────────────────────────────────── */
function Decisions() {
  const open = OPEN_DECISIONS.filter((d) => d.status === 'aberta').length
  return (
    <>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card><div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Abertas</div><div className="mt-1 font-display text-[36px] font-bold text-tertiary">{open}</div></Card>
        <Card><div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Resolvidas</div><div className="mt-1 font-display text-[36px] font-bold text-primary">{OPEN_DECISIONS.length - open}</div></Card>
        <Card><div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Bloqueiam a v1?</div><div className="mt-1 font-display text-[36px] font-bold">Não</div><div className="text-[11px] text-on-surface-variant">declarado no §28</div></Card>
      </div>
      <Card className="p-0">
        <TableScroll>
          <Table>
            <thead><tr><TableHead>#</TableHead><TableHead>Decisão (§28)</TableHead><TableHead>Status</TableHead><TableHead>Owner</TableHead><TableHead>Prazo</TableHead></tr></thead>
            <tbody>
              {OPEN_DECISIONS.map((d) => (
                <TableRow key={d.n}>
                  <TableCell className="align-top font-bold">{d.n}</TableCell>
                  <TableCell className="min-w-[260px] align-top">
                    <div className="font-semibold">{d.question}</div>
                    {d.evidence && <div className="mt-1 text-[11px] text-on-surface-variant">{d.evidence}</div>}
                  </TableCell>
                  <TableCell className="align-top"><Badge variant={d.status === 'resolvida' ? 'validated' : 'pending'}>{d.status}</Badge></TableCell>
                  <TableCell className="align-top">{d.owner ?? <Lacuna what="owner" />}</TableCell>
                  <TableCell className="align-top">{d.due ?? <Lacuna what="prazo" />}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </Card>
      <Card className="mt-4 grid gap-1.5 text-xs">
        <div><strong>Processo declarado:</strong> Gabriel cria os tickets de decisão → João reúne evidência → os owners decidem conforme o RACI (§6.2).</div>
        <div className="text-on-surface-variant">Owners e prazos aparecem como lacuna porque o snapshot não os declara por decisão. <strong className="text-on-surface">Lacuna registrada com owner e prazo é trabalho honesto. Suposição registrada como fato vira dívida.</strong></div>
      </Card>
    </>
  )
}

/* ── B. Gates ────────────────────────────────────────────────────────── */
function Gates() {
  const [gate, setGate] = useState(1)
  const [done, setDone] = useState<Record<string, boolean>>({})
  const g = GATES.find((x) => x.id === gate)!
  const items = gate === 1 ? [...READY_GATE, 'Capacidade existe'] : g.criteria
  const key = (i: string) => `${gate}:${i}`
  const checked = items.filter((i) => done[key(i)]).length
  const missing = items.filter((i) => !done[key(i)])
  const blockers = gate === 1 ? ['Owner, reviewer e approver', 'Critérios de aceitação', 'Capacidade existe'] : []
  const blocked = blockers.some((b) => !done[key(b)])
  const pct = Math.round((checked / items.length) * 100)

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Gate">
        {GATES.map((x) => (
          <button key={x.id} role="tab" aria-selected={gate === x.id} onClick={() => setGate(x.id)}
            className={cn('rounded-sm border px-3 py-2 text-left font-mono text-[11px] font-semibold', gate === x.id ? 'border-primary bg-primary text-on-primary' : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-variant')}>
            Gate {x.id} · {x.name}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide">{gate === 1 ? 'Ready Gate — 9 itens + capacidade' : `Critérios do Gate ${gate}`}</h3>
            <Button size="sm" variant="ghost" onClick={() => setDone((d) => Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith(`${gate}:`))))}>Limpar</Button>
          </div>
          <div className="grid gap-1.5">
            {items.map((i) => <CheckRow key={key(i)} id={key(i)} label={i} checked={!!done[key(i)]} onChange={(v) => setDone((d) => ({ ...d, [key(i)]: v }))} emphasis={blockers.includes(i)} />)}
          </div>
        </Card>
        <div className="grid content-start gap-4">
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Resultado</div>
            <div className={cn('mt-1 flex items-center gap-2 font-display text-[22px] font-bold', missing.length === 0 ? 'text-primary' : blocked ? 'text-error' : 'text-tertiary')}>
              {missing.length === 0 ? <><CheckCircle2 className="size-5" /> Pronto para aprovação</> : blocked ? <><XCircle className="size-5" /> Não começa</> : <><AlertTriangle className="size-5" /> Faltam {missing.length}</>}
            </div>
            <Progress className="mt-3" value={pct} aria-label="Itens atendidos" />
            <div className="mt-1.5 text-[11px] tabular-nums text-on-surface-variant">{checked}/{items.length} itens</div>
            {blocked && <p className="mt-3 text-[11.5px] text-error">Trabalho sem owner, critério de aceitação ou capacidade não começa.</p>}
          </Card>
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Quem aprova</div>
            <div className="mt-1 font-semibold">{g.approver}</div>
            <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
              A checklist mostra o que falta. <strong className="text-on-surface">Quem decide se passa é o aprovador</strong>, não esta página. Item ambíguo deve ser levado a ele.
            </p>
          </Card>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1 text-[10.5px] text-on-surface-variant">
        {WORKFLOW.map((s, i) => <span key={s} className="flex items-center gap-1">{i > 0 && <ArrowRight className="size-3" />}<span className="rounded-sm bg-chip px-1.5 py-0.5">{s}</span></span>)}
      </div>
    </>
  )
}

/* ── C. Fonte canônica ───────────────────────────────────────────────── */
function CanonicalSource() {
  const [asset, setAsset] = useState(0)
  const [dest, setDest] = useState<string>('')
  const a = ASSETS[asset]
  const right = SYSTEMS.find((s) => s.system === a.system)!
  const chosen = SYSTEMS.find((s) => s.system === dest)
  const wrong = chosen && chosen.system !== a.system

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="p-3">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">O que você quer guardar?</div>
        <div className="grid gap-1" role="listbox" aria-label="Tipo de ativo">
          {ASSETS.map((x, i) => (
            <button key={x.asset} role="option" aria-selected={asset === i} onClick={() => { setAsset(i); setDest('') }}
              className={cn('rounded-sm px-2.5 py-2 text-left text-xs', asset === i ? 'bg-primary-bright font-semibold text-on-primary-bright' : 'hover:bg-surface-variant')}>
              {x.asset}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid content-start gap-4">
        <Card>
          <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Fonte canônica</div>
          <div className="mt-1 font-display text-[30px] font-bold leading-tight">{right.system}</div>
          <p className="mt-2 text-xs">É canônico para: <mark className="rounded-sm bg-primary-container px-1 text-on-primary-container">{a.term}</mark> — {right.canonicalFor}.</p>
          <p className="mt-1 text-xs text-on-surface-variant">Não é canônico para: {right.notFor}.</p>
          <p className="mt-3 text-[11.5px] text-on-surface-variant">Um ativo tem <strong className="text-on-surface">uma</strong> fonte canônica. As outras ferramentas guardam o link, não uma cópia viva.</p>
        </Card>
        <Card>
          <Label htmlFor="dest">Onde você ia guardar?</Label>
          <select id="dest" value={dest} onChange={(e) => setDest(e.target.value)}
            className="mt-1.5 h-9 w-full rounded-md border border-outline bg-surface px-3 font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Escolha um sistema…</option>
            {SYSTEMS.map((s) => <option key={s.system} value={s.system}>{s.system}</option>)}
            {TRANSIENT.map((t) => <option key={t} value={`t:${t}`}>{t} (canal transitório)</option>)}
          </select>
          {dest.startsWith('t:') && <p role="status" className="mt-3 flex gap-2 text-xs text-error"><XCircle className="size-4 shrink-0" />{dest.slice(2)} é canal transitório. Informação material deve ser promovida para {right.system}.</p>}
          {wrong && <p role="status" className="mt-3 flex gap-2 text-xs text-error"><XCircle className="size-4 shrink-0" />{chosen.system} não é canônico para: {chosen.notFor}. Guarde em {right.system} e, em {chosen.system}, só o link.</p>}
          {chosen && !wrong && <p role="status" className="mt-3 flex gap-2 text-xs text-primary"><CheckCircle2 className="size-4 shrink-0" />Lugar certo.</p>}
        </Card>
      </div>
    </div>
  )
}

/* ── D. Nomenclatura ─────────────────────────────────────────────────── */
const NAME_EXAMPLES = ['LGX_Proto_RouteBalance_Draft_v0.3', 'RouteBalance_FINAL_v2', 'BAX_RS_Entrevistas_Review_v1.0', 'tela nova 19-11-26']

function Naming() {
  const [name, setName] = useState(NAME_EXAMPLES[0])
  const r = useMemo(() => validateName(name), [name])
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Label htmlFor="name">Nome do arquivo ou versão</Label>
        <Input id="name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="[Produto]_[Tipo]_[Nome]_[Status]_vX.Y" />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {NAME_EXAMPLES.map((e) => <button key={e} onClick={() => setName(e)} className="rounded-sm bg-chip px-2 py-1 font-mono text-[10.5px] text-on-surface-variant hover:text-on-surface">{e}</button>)}
        </div>
        <div className="mt-5 grid grid-cols-5 gap-1 text-center">
          {(['produto', 'tipo', 'nome', 'status', 'versao'] as const).map((k) => (
            <div key={k} className={cn('rounded-sm border px-1 py-2', r.parts[k] ? 'border-secondary bg-secondary-container' : 'border-dashed border-outline')}>
              <div className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">{k === 'versao' ? 'versão' : k}</div>
              <div className="mt-0.5 truncate font-mono text-[11px] font-semibold text-on-secondary-container">{r.parts[k] ?? '—'}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className={cn('mb-3 flex items-center gap-2 font-display text-[20px] font-bold', r.ok ? 'text-primary' : 'text-error')}>
          {r.ok ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}{r.ok ? 'Nome válido' : 'Nome fora do padrão'}
        </div>
        <ul className="grid gap-2">
          {r.checks.map((c) => (
            <li key={c.label} className="flex gap-2.5 text-xs">
              {c.status === 'pass' ? <Check className="mt-0.5 size-4 shrink-0 text-primary" /> : c.status === 'warn' ? <AlertTriangle className="mt-0.5 size-4 shrink-0 text-tertiary" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-error" />}
              <span><strong>{c.label}</strong> — <span className="text-on-surface-variant">{c.detail}</span></span>
            </li>
          ))}
        </ul>
        {r.quarantine && <p className="mt-4 rounded-sm bg-tertiary-container px-3 py-2 text-[11.5px] text-on-tertiary-container">Sem produto, conteúdo ou status identificável, o arquivo é <strong>candidato a quarentena</strong>: marcado, não apagado.</p>}
      </Card>
    </div>
  )
}

/* ── E. Escalation ───────────────────────────────────────────────────── */
const QUESTIONS = [
  { q: 'Envolve segurança, questão legal ou perda de dados?', cls: 'Incidente' },
  { q: 'Mexe em fluxo principal, marca, prioridade estratégica ou é uma exceção?', cls: 'D3 estratégico' },
  { q: 'É um trade-off entre Design e Dev?', cls: 'D2 cross-functional' },
  { q: 'É um padrão de UX reversível?', cls: 'D1 profissional' },
  { q: 'É naming ou localização compatível com o sistema?', cls: 'D0 operacional' },
] as const

function Escalation() {
  const [step, setStep] = useState(0)
  const [cls, setCls] = useState<string | null>(null)
  const [form, setForm] = useState({ decisao: '', recomendacao: '', alternativas: '', tradeoffs: '', prazo: '', consequencia: '' })
  const [copied, setCopied] = useState(false)
  const e = ESCALATION.find((x) => x.cls === cls)
  const exhausted = step >= QUESTIONS.length && !cls

  const text = e ? [
    `Pedido de decisão — ${e.cls}`,
    `Decisor: ${e.decider} · SLA: ${e.sla}`,
    `Decisão: ${form.decisao || '⬜ LACUNA'}`,
    `Recomendação: ${form.recomendacao || '⬜ LACUNA'}`,
    `Alternativas: ${form.alternativas || '⬜ LACUNA'}`,
    `Trade-offs: ${form.tradeoffs || '⬜ LACUNA'}`,
    `Prazo-limite: ${form.prazo || '⬜ LACUNA'}`,
    `Consequência de não decidir: ${form.consequencia || '⬜ LACUNA'}`,
    ...(e.silenceRule ? ['Atenção: silêncio não é aprovação em D2/D3.'] : []),
  ].join('\n') : ''

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { setCopied(false) }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wide">Classificar</h3>
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setCls(null) }}>Recomeçar</Button>
        </div>
        <ol className="grid gap-2">
          {QUESTIONS.map((x, i) => {
            const state = cls === x.cls ? 'yes' : i < step ? 'no' : i === step && !cls ? 'current' : 'idle'
            return (
              <li key={x.q} className={cn('rounded-sm border px-3 py-2.5 text-xs', state === 'current' ? 'border-primary bg-background' : state === 'yes' ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant', state === 'idle' && 'opacity-50', state === 'no' && 'text-on-surface-variant line-through')}>
                <div>{x.q}</div>
                {state === 'current' && (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => setCls(x.cls)}>Sim</Button>
                    <Button size="sm" variant="secondary" onClick={() => setStep(step + 1)}>Não</Button>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
        {exhausted && <p className="mt-3 text-xs text-tertiary">Nenhuma classe se aplica com clareza. Trate como a classe superior plausível e leve ao Gabriel (control tower).</p>}
      </Card>
      <Card>
        {e ? (
          <>
            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Classe</div>
            <div className="mt-1 font-display text-[26px] font-bold">{e.cls}</div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
              <div><div className="text-on-surface-variant">Decide</div><div className="font-semibold">{e.decider}</div></div>
              <div><div className="text-on-surface-variant">SLA</div><div className="font-semibold">{e.sla}</div></div>
            </div>
            {e.silenceRule && <p className="mt-3 rounded-sm bg-error-container px-3 py-2 text-[11.5px] font-semibold text-on-error-container">Silêncio não é aprovação em D2/D3. Vencido o SLA, Gabriel relembra uma vez e escala.</p>}
            <p className="mt-2 text-[11px] text-on-surface-variant">O snapshot não declara a partir de quando os dias úteis contam. Qualquer data calculada é estimativa a confirmar com o Gabriel.</p>
            <div className="mt-4 grid gap-2">
              {([['decisao', 'Decisão'], ['recomendacao', 'Recomendação'], ['alternativas', 'Alternativas'], ['tradeoffs', 'Trade-offs'], ['prazo', 'Prazo-limite'], ['consequencia', 'Consequência de não decidir']] as const).map(([k, l]) => (
                <div key={k} className="grid gap-1">
                  <Label htmlFor={`f-${k}`}>{l}</Label>
                  <Input id={`f-${k}`} value={form[k]} onChange={(ev) => setForm((f) => ({ ...f, [k]: ev.target.value }))} />
                </div>
              ))}
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-sm bg-background p-3 font-mono text-[11px] leading-relaxed">{text}</pre>
            <Button className="mt-2" size="sm" variant="secondary" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Copiado' : 'Copiar pedido'}</Button>
          </>
        ) : (
          <div className="grid h-full place-items-center py-10 text-center text-xs text-on-surface-variant">Responda as perguntas para ver decisor, SLA e o modelo de pedido de decisão.</div>
        )}
      </Card>
    </div>
  )
}

/* ── Papéis e dados ──────────────────────────────────────────────────── */
function RolesAndData() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <Card className="p-0">
        <TableScroll>
          <Table>
            <thead><tr><TableHead>Pessoa</TableHead><TableHead>Papel</TableHead><TableHead>Owns</TableHead><TableHead>Verifica</TableHead></tr></thead>
            <tbody>{ROLES.map((r) => <TableRow key={r.person}><TableCell className="whitespace-nowrap align-top font-semibold">{r.person}</TableCell><TableCell className="align-top">{r.role}</TableCell><TableCell className="min-w-[240px] align-top text-on-surface-variant">{r.owns}</TableCell><TableCell className="align-top">{r.verifies}</TableCell></TableRow>)}</tbody>
          </Table>
        </TableScroll>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DATA_CLASSES.map((d, i) => (
          <Card key={d.cls} className={cn('p-4', i === 3 && 'border-error/50')}>
            <Badge variant={(['validated', 'info', 'pending', 'error'] as const)[i]}>{d.cls}</Badge>
            <div className="mt-2 text-[11px] text-on-surface-variant">{d.example}</div>
            <div className="mt-2 text-xs font-semibold">IA externa: {d.ai}</div>
          </Card>
        ))}
      </div>
      <p className="text-[11.5px] text-on-surface-variant">Em dúvida, trate como a classe superior e escale. Nunca cole credenciais ou segredos numa sessão de IA.</p>
    </div>
  )
}

export function App() {
  const [theme, setTheme] = useTheme()
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 max-[640px]:px-4">
          <div className="whitespace-nowrap font-display text-[15px] font-bold tracking-tight">Studio OS</div>
          <nav aria-label="Fluxos" className="flex flex-1 gap-1 overflow-x-auto">
            {NAV.map(([id, f, label]) => (
              <a key={id} href={`#${id}`} className="flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-[11px] font-semibold text-on-surface-variant hover:bg-surface-variant hover:text-on-surface">
                <span className="text-primary">{f}</span>{label}
              </a>
            ))}
          </nav>
          <Button size="icon" variant="secondary" aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-16 px-6 pb-20 pt-10 max-[640px]:px-4">
        <div>
          <div className="mb-3 flex flex-wrap gap-2"><Badge variant="outline-tertiary">Experimental</Badge><Badge variant="chip">skill · group-design-studio</Badge></div>
          <h1 className="max-w-3xl text-[44px] leading-[1.02] max-[640px]:text-[32px]">Operar o Studio OS sem reinventar as regras</h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-on-surface-variant">
            Os cinco fluxos da skill viram ferramentas: plano de lacunas, gates, fonte canônica, nomenclatura e escalation. Onde a fonte não declara algo, a página mostra a lacuna em vez de supor.
          </p>
          <Card className="mt-6 flex gap-3 border-tertiary/50 bg-tertiary-container/40">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-tertiary" />
            <div className="text-[11.5px] leading-relaxed">
              <strong>Snapshot, não fonte canônica.</strong> Dados de <code>{SOURCE.file}</code>, capturado do canônico v{SOURCE.canonicalVersion} ({SOURCE.canonicalDate}) e cruzado com o START_HERE v{SOURCE.startHereVersion} ({SOURCE.startHereDate}). Os dois documentos não estão sincronizados, e o canônico prevalece. Antes de decidir, leia a versão atual no Shared Drive.
            </div>
          </Card>
        </div>

        <Section id="decisoes" flow="A" title="Decisões abertas e lacunas" lead="As seis decisões controladas do §28, com o status atualizado pelo que este repositório já registra. Nenhuma bloqueia a adoção da v1.">
          <Decisions />
        </Section>
        <Section id="gates" flow="B" title="Ready Gate e Gates 1–4" lead="Compare o ticket item a item. A página mostra o que falta e quem precisa agir; a aprovação continua com o aprovador do gate.">
          <Gates />
        </Section>
        <Section id="fonte" flow="C" title="Onde este ativo deve viver" lead="Cada ativo tem uma fonte canônica. Escolha o tipo de ativo e confira se o destino que você tinha em mente está certo.">
          <CanonicalSource />
        </Section>
        <Section id="naming" flow="D" title="Validar nomenclatura" lead="Formato [Produto]_[Tipo]_[Nome]_[Status]_vX.Y, datas em YYYY-MM-DD e nunca FINAL. O vocabulário de produto, tipo e status não está declarado, então só a estrutura é validada.">
          <Naming />
        </Section>
        <Section id="escalation" flow="E" title="Quem decide e em quanto tempo" lead="Responda de cima para baixo: a primeira classe que se aplica vence. O resultado traz o decisor, o SLA e um pedido de decisão pronto para copiar.">
          <Escalation />
        </Section>
        <Section id="papeis" flow="·" title="Papéis e classificação de dados" lead="Quem é dono de quê, e o que pode ou não ir para uma IA externa.">
          <RolesAndData />
        </Section>
      </main>

      <footer className="border-t border-outline-variant py-6 text-center text-[10.5px] text-on-surface-variant">
        Protótipo experimental, não é produção. Fonte: <code>{SOURCE.file}</code>.
      </footer>
    </div>
  )
}
