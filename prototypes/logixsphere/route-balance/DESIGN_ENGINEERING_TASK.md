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

## Atualização — 2026-08-26: publicação no Vercel

A pedido do solicitante, o protótipo foi publicado para revisão em
https://web-seven-weld-58.vercel.app (projeto Vercel `web`, conta
`jhophjm-8408`). Para viabilizar isso sem alterar o fluxo de dev local já
validado, o backend Express foi espelhado como Vercel Serverless Function em
`web/api/` (mesma lógica de `server/src/`, mantida manualmente em sincronia —
ver `README.md`). Nenhum dado real, credencial ou sistema de produção está
envolvido; dados seguem mock em memória, resetando a cada cold start da
função. Isto amplia levemente o escopo original (server local/dev-only) para
incluir uma publicação pública de revisão — decisão tomada como D0/D1
(reversível, específica deste protótipo), não escalada.

## Atualização — 2026-08-26: escopo ampliado a partir da página Doing

A pedido do solicitante ("quero uma cópia fiel das páginas da aba Doing,
quero todo o workflow funcional"), o escopo foi ampliado além do handoff
original. Mapeamento da página Doing do Figma mostrou uma casca de app mais
rica (topbar com busca/data/usuário, toolbar de ações) e cinco fluxos
adicionais: Import como página cheia de 2 passos (upload → preview com
Pre-12/Postcode Analysis/Size Class), Add Post Code, PM ASR/DSR Listing,
Shipment Details, All Stops e Send to Rebalance (ação em lote). Confirmado
com o solicitante antes de implementar: (1) construir tudo de uma vez, sem
checkpoints intermediários; (2) sem replicar os 3 breakpoints do Figma
(tablet/desktop 27"/ultrawide 49") — cobertura só desktop. O restante do
board Doing (grupos de exploração sem nome, cópias duplicadas do dashboard)
foi identificado como ruído de WIP e não foi replicado. Dados mock
estendidos (stops por rota, postcodes, veículo/peso) seguem a mesma
convenção de aproximação plausível já registrada acima.

## Atualização — 2026-08-26: ajuste fino a partir de screenshot do Figma

O solicitante enviou um screenshot com 3 frames da página Doing mostrando
detalhes que a exploração anterior não tinha capturado, e pediu para
"continuar com essas pages". Ajustes feitos: barra lateral esquerda
(sidebar nav), Import redesenhado como layout de 2 colunas com tabelas
reorganizadas por postcode/subpostcode (Pre-12 por endereço, Postcode
Analysis, Size Class com colunas COY/COY-01/COY-02/PLY/NCY/PAL 1 — jargão
de logística sem definição exata no handoff, distribuição aproximada
sinalizada no código), placa de veículo e badge "Special Deliveries" no
route card, KPI "Target" com faixa-meta (95%–105%) substituindo "Delayed
Service Rate", toast de sucesso, botão "Importar" no dashboard (volta ao
fluxo de import) e ação "Send to Drivers" (nova, distinta de "Send to
Rebalance"). Também corrigido: nome de cliente não capturado do arquivo
importado quando a coluna se chama "Customer" (regex do parser não cobria
esse termo). Adicionado `web/api/check:api` (typecheck dedicado à pasta
`api/`) depois do bug de import path que passou despercebido no build local
na rodada anterior — não deve se repetir.

## Atualização — 2026-08-26: "continue com TODAS AS PAGINAS"

Voltei ao Figma (arquivo renomeado de "Logix Sphere" para "Route Balance"
pelo time enquanto esta tarefa estava em andamento — confirma edição ativa
por outra pessoa, sem impacto no acesso) e explorei anotações ainda não
lidas na página Doing. Encontrado: badge "Special Deliveries" é na verdade
um botão clicável que abre um modal com tabela Postcode/Customer/Category
(implementado), toggle de turno AM/PM e toggle de modo Rebalance/Operations
na toolbar (implementados como filtros funcionais da grade de rotas), e o
rótulo correto do 3º KPI é "SPR" (não "Address Advice Rate", que era um
palpite da rodada anterior — corrigido). Ícones por KPI e badge "ALERT"
também ajustados por fidelidade. Ainda não explorados: alguns "Group N"
sem nome no board Doing — mantida a avaliação anterior de que são
ruído/exploração, não telas reais, mas não 100% verificado grupo a grupo.

## Atualização — 2026-08-26: exports reais do Figma (pasta local)

O solicitante exportou 15 frames direto do Figma (`~/Downloads/Route
Balance/`, JPG/PNG em alta resolução) e pediu para copiar todas as pages
dessa pasta. Isso corrigiu várias leituras erradas de rodadas anteriores
(feitas sobre o viewer sem login, em baixa resolução):
- KPI 3 e 4 são de fato **"Archived Service Rate"** e **"Dalayed Service
  Rate"** (sic — typo "Dalayed" no próprio Figma, mantido por fidelidade;
  sinalizar para Design). O tile "Target" da rodada anterior era leitura
  errada de um frame borrado — revertido.
- Colunas de Size Class corrigidas: **"Soma Phys."** (não "Sigma"),
  **"COY-S1"/"COY-S2"** (não "COY-01/02"), **"FLY"** (não "PLY").
- O campo "Select_Route [opt]" do modal Add_Postcode é um combobox
  multi-select com **chips removíveis** dentro do próprio campo — não uma
  lista de checkboxes abaixo do campo, como eu tinha construído antes.
  Reconstruído para bater com o Figma.
- Import: painel direito vazio agora usa a cópia exata do Figma ("Process
  a file to preview..."), dropzone ganhou a linha "FORMATS: .XLSX, .XLS,
  .XLSM", cartão do arquivo selecionado virou centralizado (ícone/nome/
  tamanho/lixeira empilhados), e o botão do rodapé mostra "Process →"
  (desabilitado) antes de processar e "Go to Balance →" depois.
- A camada "Exemplos de uma grande quantidade de seleção" que eu tinha
  descartado como ruído era, na verdade, um teste de QA do campo de chips
  com muitas seleções — não é uma tela nova, só confirma o comportamento
  do combobox acima.
