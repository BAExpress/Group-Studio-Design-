/*
  Dados transcritos de skills/group-design-studio/references/studio_os_reference.md
  (snapshot do canônico v1.0.0 de 2026-08-19, cruzado com o START_HERE v0.1).
  ISTO NÃO É A FONTE CANÔNICA. Onde o snapshot não declara algo, o valor é
  `null` e a interface mostra "⬜ LACUNA" em vez de supor.
*/

export const SOURCE = {
  file: 'skills/group-design-studio/references/studio_os_reference.md',
  canonical: 'Group_Design_Studio_OS_v1_CANONICAL.md',
  canonicalVersion: '1.0.0',
  canonicalDate: '2026-08-19',
  startHereVersion: '0.1 (ESQUELETO)',
  startHereDate: '2026-08-17',
}

export const ROLES = [
  { person: 'Thiago Brito', role: 'Sponsor / autoridade de produto', owns: 'visão, intenção, prioridade estratégica, marca, orçamento, exceções', verifies: 'o outcome' },
  { person: 'Gabriel Stefano', role: 'Project Manager / control tower', owns: 'Jira, planejamento, capacidade, prazos, dependências, bloqueios, reporting', verifies: 'o estado do trabalho' },
  { person: 'João Marcelo Santos', role: 'DesignOps / Workspace Steward', owns: 'Shared Drive, estruturas, inventários, templates, registros, acessos, documentação, registry, ponte Design–Dev', verifies: 'o estado do sistema' },
  { person: 'Aline', role: 'Product Designer / Design Owner', owns: 'UX/UI, pesquisa, jornadas, protótipos, rationale, qualidade profissional, Design Systems', verifies: 'a qualidade do Design' },
  { person: 'Dev / Engenharia', role: 'Engenharia', owns: 'feasibility, arquitetura de produção, segurança, performance, implementação, testes', verifies: 'a viabilidade técnica' },
  { person: 'IA (Claude)', role: 'Executora autorizada', owns: 'estruturar, pesquisar, documentar, prototipar, criticar', verifies: 'não é accountable por nada' },
]

// ── Fluxo B ────────────────────────────────────────────────────────────
export const READY_GATE = [
  'Problema, usuário e outcome',
  'Input original ou link',
  'Escopo e non-goals',
  'Owner, reviewer e approver',
  'Prioridade e prazo/checkpoint',
  'Critérios de aceitação',
  'Dependências, dados e riscos',
  'Links canônicos',
  'Decisão necessária marcada',
]

export const GATES = [
  { id: 1, name: 'Ready to Start', approver: 'Gabriel', criteria: ['Ready Gate completo (9 itens)', 'Capacidade existe'] },
  { id: 2, name: 'Design Approved', approver: 'Aline (Thiago só em decisão material de produto/marca)', criteria: ['Problema tratado', 'Estados principais', 'Acessibilidade', 'Responsividade', 'Reutilização', 'Rationale', 'Feedback tratado'] },
  { id: 3, name: 'Ready for Dev', approver: 'Aline + Dev', criteria: ['Figma organizado', 'Fluxo e edge cases claros', 'Componentes/tokens identificados', 'Conteúdo realista', 'Assets disponíveis', 'Decisão registrada', 'Dev confirmou viabilidade'] },
  { id: 4, name: 'Release & Outcome Accepted', approver: 'Thiago', criteria: ['Implementação testada', 'Diferenças resolvidas ou aceitas', 'Método de validação definido', 'Release registrado', 'Resultado validado ou agendado'] },
]

export const WORKFLOW = ['Brief', 'Research', 'Explore', 'Design', 'Prototype', 'Review', 'Handoff', 'Build', 'QA', 'Release', 'Learn']

// ── Fluxo C ────────────────────────────────────────────────────────────
export const SYSTEMS = [
  { system: 'Jira', canonicalFor: 'trabalho, owner, prioridade, status, prazo, dependências, aceitação', notFor: 'documentação longa, Design final, código' },
  { system: 'Figma', canonicalFor: 'UX/UI, protótipos, libraries, variables, componentes, especificação visual', notFor: 'gestão de trabalho, decisões extensas, código de produção' },
  { system: 'Google Shared Drive', canonicalFor: 'governança, SOPs, research, decisões, templates, AI Library, exports, conhecimento', notFor: 'status diário, código, biblioteca visual viva' },
  { system: 'GitHub', canonicalFor: 'código, Design Engineering Workspace, histórico, tokens implementados, documentação junto ao código', notFor: 'backlog, arquivos Figma' },
  { system: 'Claude Code', canonicalFor: 'ambiente/agente que trabalha sobre repositórios autorizados', notFor: 'fonte canônica ou owner de conhecimento' },
  { system: 'Providers de IA', canonicalFor: 'execução, exploração, análise, assistência', notFor: 'armazenamento exclusivo de IP institucional' },
  { system: 'Produto/produção', canonicalFor: 'comportamento real entregue ao usuário', notFor: 'justificativa histórica da decisão' },
] as const

// Atalhos de tipo de ativo → sistema. Cada item cita o termo literal da
// coluna "é canônico para" que justifica a escolha.
export const ASSETS: { asset: string; system: (typeof SYSTEMS)[number]['system']; term: string }[] = [
  { asset: 'Status / prazo de uma tarefa', system: 'Jira', term: 'status, prazo' },
  { asset: 'Critérios de aceitação de uma entrega', system: 'Jira', term: 'aceitação' },
  { asset: 'Tela ou protótipo de UX/UI', system: 'Figma', term: 'UX/UI, protótipos' },
  { asset: 'Componente / variables da library', system: 'Figma', term: 'libraries, variables, componentes' },
  { asset: 'Relatório de research', system: 'Google Shared Drive', term: 'research' },
  { asset: 'Decision Record (DR-)', system: 'Google Shared Drive', term: 'decisões' },
  { asset: 'SOP ou template do Studio', system: 'Google Shared Drive', term: 'SOPs, templates' },
  { asset: 'Prompt da AI Library', system: 'Google Shared Drive', term: 'AI Library' },
  { asset: 'Protótipo funcional em código', system: 'GitHub', term: 'código, Design Engineering Workspace' },
  { asset: 'Tokens já implementados', system: 'GitHub', term: 'tokens implementados' },
  { asset: 'Comportamento real em produção', system: 'Produto/produção', term: 'comportamento real entregue ao usuário' },
]

export const TRANSIENT = ['WhatsApp', 'e-mail', 'chats de IA', 'computadores pessoais']

// ── Fluxo D ────────────────────────────────────────────────────────────
export const ID_PREFIXES: Record<string, string> = {
  'DR-': 'decision record',
  'RS-': 'research',
  'DS-': 'design system',
  'AI-': 'ativo de IA',
  'SRC-': 'source/component',
  'DEBT-': 'design debt',
}

// ── Fluxo E ────────────────────────────────────────────────────────────
export const ESCALATION = [
  { cls: 'Incidente', example: 'segurança, legal, perda de dados', decider: 'autoridade técnica/executiva', sla: 'imediato', silenceRule: false },
  { cls: 'D3 estratégico', example: 'fluxo principal, marca, prioridade, exceção', decider: 'Thiago', sla: '5 dias úteis', silenceRule: true },
  { cls: 'D2 cross-functional', example: 'trade-off Design/Dev', decider: 'Aline + Dev; Gabriel facilita', sla: '3 dias úteis', silenceRule: true },
  { cls: 'D1 profissional', example: 'padrão UX reversível', decider: 'Aline', sla: '2 dias úteis', silenceRule: false },
  { cls: 'D0 operacional', example: 'naming/localização compatível', decider: 'owner do domínio', sla: 'mesmo dia útil', silenceRule: false },
] as const

export const DATA_CLASSES = [
  { cls: 'Public', example: 'site público, material publicado', ai: 'permitido com revisão normal' },
  { cls: 'Internal', example: 'SOP, roadmap não sensível', ai: 'somente conta corporativa aprovada' },
  { cls: 'Confidential', example: 'pesquisa identificável, contratos, estratégia', ai: 'apenas ambiente aprovado, mínimo necessário' },
  { cls: 'Restricted', example: 'credenciais, segredos, dados pessoais/sensíveis, produção', ai: 'proibido sem autorização e controle específico' },
]

// ── Fluxo A — decisões abertas do §28 ───────────────────────────────────
// owner/prazo null = não declarado no snapshot → LACUNA.
export const OPEN_DECISIONS: {
  n: number
  question: string
  status: 'aberta' | 'resolvida'
  evidence: string | null
  owner: string | null
  due: string | null
}[] = [
  { n: 1, question: 'Qual stack e tooling do Design Engineering Workspace melhor se encaixam no produto atual?', status: 'resolvida', evidence: 'DR-GDS-001 (Accepted, 2026-08-20) — registrada no README.md e em governance/PAPEIS_E_RACI.md deste repositório. O snapshot da skill (de 19/08) ainda a lista como aberta.', owner: 'Thiago', due: null },
  { n: 2, question: 'Quem é o backup admin nominal de cada sistema corporativo?', status: 'aberta', evidence: null, owner: null, due: null },
  { n: 3, question: 'Quais três telas/fluxos formam o primeiro piloto LogixSphere?', status: 'aberta', evidence: null, owner: null, due: null },
  { n: 4, question: 'Quais métricas de produto estão tecnicamente disponíveis para outcome validation?', status: 'aberta', evidence: null, owner: null, due: null },
  { n: 5, question: 'Qual janela de retenção/migração será usada para componentes deprecated?', status: 'aberta', evidence: null, owner: null, due: null },
  { n: 6, question: 'Quais políticas corporativas externas complementam dados, backup e procurement?', status: 'aberta', evidence: null, owner: null, due: null },
]
