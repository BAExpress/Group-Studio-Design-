// Inspeciona o repositório Group Design Studio e a skill group-design-studio
// e grava src/data/repo-scan.json para a página de verificação.
// Somente leitura: não altera nenhum arquivo fora de src/data/.
import fs from 'node:fs'
import path from 'node:path'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const APP = path.resolve(HERE, '..')
const ROOT = path.resolve(APP, '../../..')
const OUT = path.join(APP, 'src/data/repo-scan.json')
const SKIP = new Set(['.git', 'node_modules', 'dist', '.vercel'])

const rel = (p) => path.relative(ROOT, p) || '.'
const exists = (p) => fs.existsSync(path.join(ROOT, p))
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const lines = (s) => s.split('\n').filter((l) => l.trim()).length

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const checks = []
const add = (group, label, status, detail, path_ = null) => checks.push({ group, label, status, detail, path: path_ })

// ── 1. Arquivos-base do repositório ─────────────────────────────────────
for (const [f, why] of [
  ['README.md', 'visão geral, stack e estrutura'],
  ['CLAUDE.md', 'instruções para agentes de IA'],
  ['.gitignore', 'evita versionar artefatos'],
  ['governance/PAPEIS_E_RACI.md', 'papéis e matriz de decisão'],
  ['templates/DESIGN_ENGINEERING_TASK.md', 'template obrigatório de tarefa (§15.4)'],
]) add('Arquivos-base', f, exists(f) ? 'pass' : 'fail', exists(f) ? why : `ausente — ${why}`, f)

// ── 2. Pastas declaradas no README ──────────────────────────────────────
const FOLDERS = [
  'references', 'components/experimental', 'components/approved',
  'prototypes/logixsphere', 'prototypes/ba-express', 'prototypes/experiments',
  'design-system/tokens', 'design-system/foundations', 'design-system/components', 'design-system/patterns',
  'prompts', 'evaluations', 'archive',
]
const folders = FOLDERS.map((f) => {
  const abs = path.join(ROOT, f)
  if (!fs.existsSync(abs)) {
    add('Estrutura de pastas', f, 'fail', 'pasta declarada no README não existe', f)
    return { path: f, exists: false, readmeLines: 0, files: 0 }
  }
  const files = walk(abs).filter((p) => path.basename(p) !== 'README.md')
  const hasReadme = fs.existsSync(path.join(abs, 'README.md'))
  const readmeLines = hasReadme ? lines(read(`${f}/README.md`)) : 0
  let status = 'pass', detail = `${files.length} arquivo(s) além do README`
  if (!hasReadme) { status = 'fail'; detail = 'sem README.md (regra do README raiz)' }
  else if (files.length === 0) { status = 'warn'; detail = 'só o README — pasta ainda vazia' }
  add('Estrutura de pastas', f, status, detail, f)
  return { path: f, exists: true, readmeLines, files: files.length }
})

// ── 3. Protótipos: template de tarefa + dependências registradas ────────
const refRecords = walk(path.join(ROOT, 'references')).filter((p) => path.basename(p) !== 'README.md')
const refText = refRecords.map((p) => fs.readFileSync(p, 'utf8').toLowerCase()).join('\n')
const pkgFiles = walk(path.join(ROOT, 'prototypes')).filter((p) => path.basename(p) === 'package.json')
const prototypes = []
for (const pkgPath of pkgFiles) {
  const dir = path.dirname(pkgPath)
  // raiz do protótipo = primeiro diretório (subindo) que tem README.md ou DESIGN_ENGINEERING_TASK.md
  let protoRoot = dir
  while (protoRoot !== ROOT && !fs.existsSync(path.join(protoRoot, 'DESIGN_ENGINEERING_TASK.md')) && !fs.existsSync(path.join(protoRoot, 'README.md'))) protoRoot = path.dirname(protoRoot)
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const deps = Object.keys(pkg.dependencies ?? {})
  const undocumented = deps.filter((d) => !refText.includes(d.toLowerCase()))
  prototypes.push({ package: rel(pkgPath), root: rel(protoRoot), deps, undocumented })
}
const protoRoots = [...new Set(prototypes.map((p) => p.root))]
for (const r of protoRoots) {
  const ok = exists(`${r}/DESIGN_ENGINEERING_TASK.md`)
  add('Protótipos', `${r} — template de tarefa`, ok ? 'pass' : 'fail', ok ? 'DESIGN_ENGINEERING_TASK.md presente' : 'falta DESIGN_ENGINEERING_TASK.md (CLAUDE.md exige)', r)
}
for (const p of prototypes) {
  if (p.deps.length === 0) continue
  add('Dependências × references/', p.package,
    p.undocumented.length ? 'fail' : 'pass',
    p.undocumented.length ? `${p.undocumented.length}/${p.deps.length} sem registro em references/` : 'todas registradas',
    p.package)
}
const REQUIRED = ['name', 'url', 'license', 'license_evidence_url', 'commercial_use', 'status']
for (const r of refRecords) {
  const txt = fs.readFileSync(r, 'utf8')
  const missing = REQUIRED.filter((k) => !new RegExp(`^${k}:[ \\t]*[^\\s#]`, 'm').test(txt))
  const risk = /RISCO/.test(txt)
  add('Source/Component Records', path.basename(r),
    missing.length ? 'fail' : risk ? 'warn' : 'pass',
    missing.length ? `campos vazios: ${missing.join(', ')}` : risk ? 'registro completo, mas aponta RISCO aberto (ver notes)' : 'campos obrigatórios preenchidos',
    rel(r))
}
if (refRecords.length === 0) add('Dependências × references/', 'references/', 'warn', 'nenhum Source/Component Record criado ainda (só o README)', 'references')

// ── 4. Design system / tokens ───────────────────────────────────────────
const tokenFiles = walk(path.join(ROOT, 'design-system/tokens')).filter((p) => !p.endsWith('README.md'))
add('Design System', 'design-system/tokens', tokenFiles.length ? 'pass' : 'warn',
  tokenFiles.length ? `${tokenFiles.length} arquivo(s) de token` : 'nenhum token versionado — protótipos definem tokens localmente (index.css)', 'design-system/tokens')
const cssWithTokens = walk(path.join(ROOT, 'prototypes')).filter((p) => p.endsWith('.css') && fs.readFileSync(p, 'utf8').includes('@theme'))
add('Design System', 'Tokens locais em protótipos', cssWithTokens.length ? 'warn' : 'pass',
  cssWithTokens.length ? `${cssWithTokens.length} protótipo(s) com @theme próprio: ${cssWithTokens.map(rel).join(', ')}` : 'nenhum', null)

// ── 5. Varredura simples de segredos ────────────────────────────────────
const SECRET_RES = [
  [/AKIA[0-9A-Z]{16}/, 'chave AWS'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'chave privada'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'token estilo sk-'],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, 'token GitHub'],
  [/(password|passwd|secret|api[_-]?key)\s*[:=]\s*['"][^'"\s]{8,}['"]/i, 'credencial literal'],
]
const hits = []
for (const f of walk(ROOT)) {
  if (/\.(png|jpe?g|gif|svg|ico|woff2?|lock)$|package-lock\.json$/.test(f) || f.startsWith(APP)) continue
  const txt = fs.readFileSync(f, 'utf8')
  for (const [re, kind] of SECRET_RES) if (re.test(txt)) hits.push(`${rel(f)} (${kind})`)
}
add('Segurança', 'Varredura de segredos', hits.length ? 'fail' : 'pass', hits.length ? hits.join('; ') : 'nenhum padrão de credencial encontrado', null)

// ── 6. Skill group-design-studio ────────────────────────────────────────
const SKILL_DIR = 'skills/group-design-studio'
const skillMd = exists(`${SKILL_DIR}/SKILL.md`) ? read(`${SKILL_DIR}/SKILL.md`) : ''
const fm = /^---\n([\s\S]*?)\n---\n/.exec(skillMd)
const front = {}
if (fm) for (const m of fm[1].matchAll(/^(\w[\w-]*):\s*(.*)$/gm)) front[m[1]] = m[2].replace(/^"|"$/g, '')
const body = fm ? skillMd.slice(fm[0].length) : skillMd
const flows = [...body.matchAll(/^### ([A-Z])\. (.+)$/gm)].map((m) => {
  const start = m.index + m[0].length
  const next = body.slice(start).search(/^#{2,3} /m)
  const section = next === -1 ? body.slice(start) : body.slice(start, start + next)
  const trig = /Gatilhos típicos:\s*(.+)/.exec(section)
  return { id: m[1], title: m[2], triggers: trig ? trig[1].trim() : '', steps: (section.match(/^\d+\. /gm) ?? []).length }
})
const refMentions = [...new Set([...skillMd.matchAll(/`(references\/[\w.-]+)`/g)].map((m) => m[1]))]
const refFiles = refMentions.map((r) => ({ path: r, exists: exists(`${SKILL_DIR}/${r}`), lines: exists(`${SKILL_DIR}/${r}`) ? lines(read(`${SKILL_DIR}/${r}`)) : 0 }))
const bodyLines = body.split('\n').length

add('Skill', 'SKILL.md', skillMd ? 'pass' : 'fail', skillMd ? `${bodyLines} linhas de corpo` : 'ausente', `${SKILL_DIR}/SKILL.md`)
add('Skill', 'Frontmatter: name', front.name === 'group-design-studio' ? 'pass' : 'fail', front.name ? `"${front.name}" ${front.name === 'group-design-studio' ? '= nome da pasta' : '≠ nome da pasta'}` : 'ausente', null)
const dlen = (front.description ?? '').length
add('Skill', 'Frontmatter: description', !dlen ? 'fail' : dlen > 1024 ? 'fail' : 'pass', dlen ? `${dlen} caracteres (limite 1024)` : 'ausente', null)
add('Skill', 'Tamanho do corpo', bodyLines <= 500 ? 'pass' : 'warn', `${bodyLines} linhas (recomendado ≤ 500)`, null)
add('Skill', 'Fluxos documentados', flows.length ? 'pass' : 'fail', `${flows.length} fluxo(s): ${flows.map((f) => f.id).join(', ')}`, null)
for (const f of flows) add('Skill', `Fluxo ${f.id} — gatilhos`, f.triggers ? 'pass' : 'warn', f.triggers ? `${f.steps} passos` : 'sem linha "Gatilhos típicos"', null)
for (const r of refFiles) add('Skill', r.path, r.exists ? 'pass' : 'fail', r.exists ? `${r.lines} linhas` : 'citado no SKILL.md mas não existe', `${SKILL_DIR}/${r.path}`)

// ── saída ───────────────────────────────────────────────────────────────
const readmeTitle = /^# (.+)$/m.exec(read('README.md'))?.[1] ?? ''
const scan = {
  generatedAt: new Date().toISOString(),
  repo: { title: readmeTitle, files: walk(ROOT).filter((f) => !f.startsWith(APP)).length },
  checks,
  folders,
  prototypes,
  skill: { name: front.name ?? '', description: front.description ?? '', bodyLines, flows, references: refFiles },
}
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(scan, null, 2))
const count = (s) => checks.filter((c) => c.status === s).length
console.log(`repo-scan: ${checks.length} checagens — ${count('pass')} ok, ${count('warn')} atenção, ${count('fail')} falha → ${rel(OUT)}`)
