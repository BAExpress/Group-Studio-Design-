# Design Engineering Task — Route Balance (LogixSphere)

Preenchido conforme `templates/DESIGN_ENGINEERING_TASK.md` (canônico §15.4).

```markdown
Problem/outcome: Validar em tela, com interações reais, o módulo "Route Balance" do
LogixSphere (dashboard de balanceamento de rotas logísticas) especificado no handoff
do Figma, antes de qualquer decisão de promoção para produção.

Repository/path/scope authorized: prototypes/logixsphere/route-balance/ (web/ e server/).
Não toca em código de produção nem em outras pastas do repositório.

References and license status: Figma "Logix Sphere", página Handoff, frame
handoff-route-balance (node-id 141-7042), v1.0 STABLE, ago/2026.
https://www.figma.com/design/4emNFZL0KFWcXlYce6B7L5/Logix-Sphere?node-id=87-3&p=f
Conteúdo interno do Studio — sem dependência de asset externo de terceiros.

Existing tokens/components to reuse: nenhum token/componente LogixSphere ainda
publicado em design-system/ neste repositório (é o primeiro protótipo). Tokens de
cor e tipografia extraídos diretamente do Handoff (seção "Token Documentation") e
promovidos para design-system/tokens/ como parte desta tarefa.

Constraints: stack, accessibility, security, performance
- Stack: Vite + React + TypeScript + Tailwind CSS + Radix UI/shadcn (componentes
  copiados) — segue DR-GDS-001 (Accepted, 2026-08-20), sem framework alternativo.
- Node.js entra também como backend Express local/dev-only (mock API, dados em
  memória, sem persistência) para servir dados e processar a importação do
  arquivo de rotas — decisão pedida explicitamente pelo solicitante em
  2026-08-26. Isso é peça nova que DR-GDS-001 não cobre (a decisão só definiu o
  front-end); registrado aqui como nota de governança, não escalado a D3 por ser
  local, reversível e específico deste protótipo (dentro da autoridade de
  organização/protótipo do steward — ver governance/PAPEIS_E_RACI.md).
- Sem persistência real, sem autenticação, sem chamadas a sistemas de produção.
- Acessibilidade: usar primitives Radix (foco, teclado, aria) como base; sem
  auditoria formal WCAG nesta rodada.
- Performance: fora de escopo — é protótipo de validação visual/interação.

Expected prototype/tests: Dashboard funcional rodando localmente (web + server)
reproduzindo: importação de arquivo (.xlsx real, parseado no server), barra de
KPIs, grade de route cards (estados default/expanded/rebalance), modal de
rebalance preview, modal de nova rota flexível. Validação manual no navegador
(dev server) — sem suíte de testes automatizada nesta rodada.

Forbidden changes: não editar components/approved/, não editar design-system/
fora da adição dos tokens desta tarefa, não editar nenhum outro prototypes/*.

Owner/reviewers: Owner — João Marcelo Santos (solicitante). Reviewer de
UX/UI — Aline (Product Designer / Design Owner, per RACI). Reviewer técnico —
Dev/Engenharia, se e quando houver intenção de promoção.

Promotion path if successful: Fica em prototypes/logixsphere/route-balance/
(experimental) até revisão de Design (Aline). Componentes só migram para
components/approved/ e design-system/ após esse review. Nenhuma promoção para
produção acontece a partir deste repositório.

Evidence required: captura de tela ou gravação do dev server rodando localmente
com os fluxos acima navegáveis; link desta pasta no registro de trabalho (Jira)
correspondente, quando existir.
```
