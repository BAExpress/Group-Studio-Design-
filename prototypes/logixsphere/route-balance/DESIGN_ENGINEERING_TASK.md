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

## Atualização — 2026-08-27: reconstrução em React e migração para HTML estático

Duas mudanças no mesmo dia, ambas a pedido do solicitante.

**1. Reconstrução em React.** A interface tinha sido zerada (só restaram
`main.tsx`, `index.css`, `types.ts` e `lib/api.ts`) para ser refeita a partir
dos frames do Figma. As nove telas/componentes da aba Doing foram
reconstruídos sobre esse setup a partir dos prompts de handoff. Nessa rodada
os rótulos dos KPIs voltaram para **Total Stops / Pré-Deliveries / Amended
Service Rate / Delayed Service Rate**, conforme os prompts — substituindo a
nomenclatura `Pré 12 Deliveries / SPR / Target` que estava na working tree.

**2. Saída do React.** Em seguida o solicitante pediu para remover o React e
refazer tudo em HTML. O protótipo passou a ser **HTML estático + CSS próprio
(sem Tailwind) + JS vanilla**, com os dados mock embutidos em
`web/assets/data.js` — sem build, sem dependências, sem servidor.

**Nota de governança — divergência em aberto.** Isto contraria diretamente a
`DR-GDS-001` (Accepted, 2026-08-20), que fixa Vite + React + TypeScript +
Tailwind + Radix/shadcn para `prototypes/logixsphere/` e exige um novo
Decision Record para qualquer troca de framework. Diferente das ampliações
anteriores (Express local, publicação no Vercel), que eram adições não
cobertas pela decisão, esta é uma **contradição direta de uma decisão
Accepted** — não cabe na autoridade de organização/protótipo do steward e
**precisa de um DR substituindo a DR-GDS-001**, registrado no Shared Drive
(`01_Governance`). A divergência foi comunicada ao solicitante antes da
execução e reafirmada por ele; fica registrada aqui e no topo do `README.md`
até que o DR exista.

A implementação em React está preservada no branch
`react/route-balance-doing` (commit `00d66b8`), então a reversão é barata se
o DR não for aprovado.

**Consequências funcionais assumidas:** sem parser XLSX real (a tela de import
mostra a amostra de ingestão do handoff qualquer que seja o arquivo), sem
persistência de "Add Post Code", e sem as primitives Radix — foco/teclado/aria
passam a depender de `<dialog>` nativo e do HTML escrito à mão, o que reduz a
garantia de acessibilidade que a constraint original assumia.

## Atualização — 2026-08-27 (cont.): páginas definitivas fornecidas pelo solicitante

O solicitante entregou os 8 arquivos `.html` que substituem a reescrita
anterior ("HTML + CSS próprio + JS vanilla" genérico) como **o protótipo
definitivo**: `01-dashboard.html`, `02-import-disco.html`,
`03-route-card-states.html`, `04-modal-add-postcode.html`,
`05-modal-special-deliveries.html`, `06-modal-all-stops.html`,
`07-modal-rebalance-preview.html`, `08-modal-add-flex-route.html`. Cada
arquivo é autocontido (CSS + JS inline, tokens light/dark em `:root`) e
reproduz um frame do Figma como página inteira — os modais (04–08) trazem o
dashboard renderizado ao fundo com overlay, não um componente de diálogo
reutilizável.

Movidos para `web/` no lugar da reescrita anterior (removida). Adicionada
navegação mínima a partir do dashboard para as páginas com destino óbvio
(Importar, Add New Flex Rote, Special Deliveries, See All Stops, Rebalance) —
ver `README.md`, seção "Navegação ligada". Corrigido `text-decoration:none`
na regra `.btn` compartilhada nas 8 páginas (faltava para os `<a class="btn">`
que o próprio design já usava em Cancel/Add/Confirm, deixando esses botões
sublinhados).

A divergência de governança sobre a DR-GDS-001 registrada na atualização
anterior permanece idêntica — trocar o formato de HTML genérico por HTML
página-por-frame não muda a natureza da divergência (ainda não é
React/Vite/Tailwind/Radix).

**Não verificado nesta rodada:** `04-modal-add-postcode.html` não tem entrada
a partir do dashboard (nenhum botão "Add Post Code" existe nesta versão do
toolbar); `03-route-card-states.html` é sheet de referência, fora do fluxo.
Ambos só abrem por URL direta.

## Atualização — 2026-08-27 (cont.): fidelidade a partir de novos exports (sidebar + tela de import)

O solicitante forneceu mais 4 exports do Figma (`Sidebar`, `Aside - SideNavBar`,
`Frame 11`, `Main Content Canvas`, cada um com uma variante `-1`; `Frame 11`/
`Frame 11-1` e `Sidebar`/`Sidebar-1` eram duplicatas byte-a-byte). Dois ajustes
de fidelidade feitos a partir deles:

- Sidebar: rótulo "W29 Terminal" adicionado sob o logo "LOGIX / SPHERE" em
  todas as 8 páginas (markup do `<aside class="sidebar">` é idêntico nas 8,
  faltava esse detalhe em todas).
- `02-import-disco.html`: o estado "processado" da tela de import mostrava um
  mock genérico ("State 2 · Extracted demands by route" com 4 cartões A01–A04)
  em vez das três tabelas reais já especificadas no handoff (ver atualização
  de 2026-08-26 "exports reais do Figma"): **PRE-12** (Postal Code/Name/
  Address), **Análise de Postcodes** (Subpostcode/Total de Deliveries) e
  **Analise_Size_Class** (Subpostcode/Soma Phys./Total Pieces/Total Shipments/
  COY/COY-S1/COY-S2/FLY/NCY/PAL 1/Total) — reconstruído com os dados exatos do
  export (`Main Content Canvas-1.png`). Também corrigidos: texto do dropzone
  ("Drag the DISCO Excel file here" + linha "FORMATS: .XLSX, .XLS, .XLSM"),
  cartão de arquivo selecionado (nome/tamanho centralizados + ícone de lixeira,
  substituindo o dropzone em vez de conviver com ele), e o rodapé com botão
  "Voltar" (link para o dashboard) + botão de ação que muda de "Process →"
  (desabilitado até selecionar arquivo) para "Go to Balance →" (navega para
  `01-dashboard.html`) após processar — antes o botão "Process File" ficava
  fixo abaixo do dropzone e não tinha estado desabilitado nem navegação de
  saída. Validado navegando o fluxo completo no navegador (seleção → process
  → tabelas → Go to Balance → dashboard).

Ambos os ajustes ficam sob a mesma divergência de governança da DR-GDS-001 já
registrada acima (HTML estático, não React/Vite/Tailwind/Radix) — sem mudança
de escopo além disso.

## Atualização — 2026-08-27 (cont.): toggle manual de tema (white mode)

A pedido do solicitante ("adicione o white mode, reveja, pois tem blocos em
branco"), foi adicionado um botão de alternância de tema (☀/☾) no topbar das
8 páginas, ao lado do relógio. Antes, o tema claro/escuro dependia só da
preferência do sistema operacional (`prefers-color-scheme`), sem controle
manual — a paleta clara ("white mode") já existia como `:root` padrão, mas só
aparecia se o SO/navegador do usuário estivesse em modo claro. Agora o clique
alterna `data-theme` entre `light`/`dark` e persiste a escolha em
`localStorage` (chave `rb-theme`), com um script inline no `<head>` aplicando
o valor salvo antes do primeiro paint (evita flash de tema errado). Estado
persiste entre as 8 páginas por serem mesma origem.

**Sobre os "blocos em branco":** revisão visual das 8 páginas em modo claro
forçado (via `data-theme="light")`) e em modo escuro (padrão do sistema usado
nesta sessão) não reproduziu blocos vazios/sem estilo — sidebar, topbar,
KPIs, cards em todos os estados, os 5 modais e a tela de import (vazia e
processada) renderizaram com fundo e texto corretos nos dois temas. Não foi
possível confirmar a causa relatada; se o problema persistir no ambiente do
solicitante, precisa de print ou página específica para reproduzir.

## Atualização — 2026-08-27 (cont.): acesso direto ao Figma via MCP + nona página (Shipment Details)

Instalado o plugin `figma@claude-plugins-official` e o servidor MCP
`figma` (`https://mcp.figma.com/mcp`, scope user) a pedido do solicitante.
Com acesso de editor liberado no arquivo `Route-Balance--Copy-`
(`LhKS6kSzY2ZxtnsKqOSHFN`), foi possível abrir a página "Doing" diretamente
pelo MCP (`node-id=87-2`) em vez de depender de exports manuais em PNG.

Comparando os grupos dessa página com os 8 arquivos existentes: **Rebalance**,
**Add flex route**, **All Stops**, **Import**, **Add Post Code** e
**Special Deliveries** já batem com o protótipo. Achado um grupo sem
implementação correspondente — **"Shipment Details / Route A-01"**
(node `132:8781`) — modal com Route ID/Driver/Vehicle, Total Stops,
Deliveries/Pickups, Completion (badge %), Total Pieces, Soma Phys (KG), Total
Shipments, e uma tabela "Shipment Breakdown by Type" com indicadores especiais
(Pre-12/ASR/DSR) e linhas por tipo (COY/COY-S1/COY-S2/FLY/NCY/PAL1). Confirmado
com o solicitante antes de construir.

Criado `09-modal-shipment-details.html` seguindo exatamente o padrão dos
outros 8 arquivos (mesmos tokens `:root`, mesmo shell sidebar+topbar, mesmo
toggle de tema). Sem `modal-foot` — o frame do Figma não tem botões de ação,
só o X de fechar. Ligado a partir do dashboard: o ícone `⚲` do cabeçalho do
route card (que antes não tinha destino/função) agora é um link para essa
página — **decisão do steward, não confirmada no Figma**, já que nenhum
botão explícito de "ver detalhes" foi encontrado ligado a esse modal; revisar
com Design se o ponto de entrada correto é outro. Adicionado
`text-decoration:none` a `.icon-btn` nas 9 páginas para suportar esse uso
como link (antes só era usado em `<button>`).

**Novos achados não implementados (fora do escopo confirmado nesta rodada):**
o toolbar do dashboard no Figma (`132:8709`) tem dois botões que não existem
no `01-dashboard.html` atual — **"Add Post Code"** (que resolveria a lacuna já
registrada acima de `04-modal-add-postcode.html` não ter entrada a partir do
dashboard) e **"PM ASR/ DSR Listinig"** [sic, typo no Figma]. Não implementados
nesta rodada; ambos precisam de confirmação do solicitante antes de entrar.

## Atualização — 2026-08-27 (cont.): responsividade + interações reais no dashboard

A pedido do solicitante ("adapte para o tamanho da tela e adicione as
funções, deixe a page com as cores originais"), confirmado por ele que o
escopo é as 9 páginas e que nenhuma cor/token muda — só layout e
comportamento.

**Responsividade (9 páginas):**
- `.kpi-grid` e `.card-grid` trocados de `repeat(4,1fr)` fixo para
  `repeat(auto-fit/auto-fill,minmax(Npx,1fr))` — reflow fluido sem depender
  de breakpoints manuais. Removida a largura fixa `width:280px` de
  `.route-card` (o grid já controla a largura da célula).
- Sidebar vira barra horizontal abaixo de 860px (logo + nav item lado a
  lado, esconde subtítulo "W29 Terminal" e o rodapé Support/System Status);
  `.shell` muda para `flex-direction:column`.
- Abaixo de 560px: busca do topbar e relógio somem, título encolhe, campo de
  busca de rotas e `.head-controls` ocupam 100%, botões do `.btn-row` viram
  flex igual.
- `09-modal-shipment-details.html`: `.detail-row` empilha em coluna abaixo de
  480px (era 2 colunas fixas, quebrava em telas muito estreitas).
- Tabelas largas (`Analise_Size_Class` em `02-import-disco.html`, breakdown
  por tipo em `09`, PRE-12) envolvidas em `.table-scroll` (`overflow-x:auto`)
  para não estourar a largura da tela; tabelas já com scroll vertical
  (`05`/`06`) ganharam scroll horizontal também.
- Validado com um iframe injetado via devtools simulando 390×844 (viewport
  de celular) — sidebar colapsa, KPIs e cards empilham em 1 coluna, nenhum
  overflow horizontal.
- **Bug pego e corrigido antes de finalizar:** ao remover o
  `style="display:grid;grid-template-columns:repeat(4,280px);gap:16px;"`
  inline dos 4 route cards "de fundo" atrás dos modais (04–09), a `<div>`
  que os envolve tinha ficado **sem nenhuma classe de grid** — esses arquivos
  nunca usavam `class="card-grid"` ali, só o inline style. Corrigido
  adicionando `class="card-grid"` nessa div nos 6 arquivos afetados
  (04, 05, 06, 07, 08, 09); confirmado visualmente em 04 e 09 que os 4 cards
  voltaram a ficar lado a lado.

**Funções ativadas (apenas `01-dashboard.html` — os outros 8 arquivos
mostram os mesmos controles só como fundo estático atrás de um modal aberto,
fora de foco, então não foram ligados):**
- **AM/PM** (`.seg`): estado real, alterna `aria-pressed` e atualiza o chip
  de turno em todos os cards. Como o mock não tem dois conjuntos de rotas
  separados por turno, cada rota recebeu um `shift` fixo alternado
  (AM/PM/AM/PM…) só para a busca e o toggle terem algo determinístico para
  mostrar — trocar o turno reatribui `shift` a todas e re-renderiza.
- **Rebalance / Operations**: toggle mutuamente exclusivo real. "Rebalance"
  filtra a grade para mostrar só as rotas com ≥100% (as que puxam
  rebalanceamento); "Operations" (padrão) mostra todas as 8. Não mexe nos
  KPIs do topo (ficariam desalinhados com o filtro se este fosse um dado
  real — assumido como limitação aceitável de protótipo).
- **Colapse Routes**: colapsa todos os cards expandidos de uma vez; se todos
  já estiverem colapsados, vira "Expand Routes" e expande todos. Rótulo do
  botão muda dinamicamente.
- **Search routes**: filtro real por texto (nome do motorista, placa, rótulo
  da rota) contra os cards visíveis; mostra aviso "Nenhuma rota corresponde
  ao filtro atual." quando zera a lista.
- **Add Post Code**: botão que faltava (achado na rodada anterior) adicionado
  ao `.btn-row`, linkando para `04-modal-add-postcode.html`. **"PM ASR/DSR
  Listing" continua não implementado** — não fazia parte da descrição de
  escopo que o solicitante confirmou.

Sem mudança de paleta/tokens em nenhum arquivo — só `grid-template-columns`,
media queries novas, `overflow-x`, e os `<script>` de interação do dashboard.

## Atualização — 2026-08-27 (cont.): migração de volta para React (resolve divergência DR-GDS-001)

A pedido do solicitante ("migre agora para react"). Antes de tocar em
qualquer arquivo, confirmado com ele: (1) commitar o estado atual das 9
páginas HTML (responsivo + funções) antes de migrar — feito no commit
`d366835`; (2) construir os componentes React do zero a partir da fidelidade
de hoje, **não** a partir do branch `react/route-balance-doing` (que é de
antes da reconstrução das 9 páginas — rótulos de KPI errados, sem Shipment
Details, sem responsividade/funções).

**O que foi reaproveitado do histórico do próprio branch** (não do branch
`react/route-balance-doing`, que ficou intocado): o commit `c9dad2a`
(imediatamente anterior à reescrita HTML) já tinha um scaffold Vite+React+TS+
Tailwind4+Radix funcional que foi deletado na virada para HTML. Reaproveitado
como infraestrutura genérica — `package.json`, `vite.config.ts`,
`tsconfig*.json`, `src/lib/utils.ts` e os primitivos `src/components/ui/`
(Button, Dialog, Badge, Progress, Select, Input, Label), que são wrappers
Radix agnósticos de conteúdo. **Todo o resto foi escrito do zero**: paleta de
cores (`src/index.css`, ver abaixo), dados mock (`src/data/mock.ts`), shell
(sidebar/topbar/tema), KPI grid, Route Card, e os 6 modais — todos batendo
com o conteúdo das 9 páginas HTML de hoje, não com as versões antigas do
scaffold deletado.

**Tokens de cor**: `src/index.css` define as mesmas cores exatas das 9
páginas HTML (claro E escuro, mesmos hex) via uma camada de indireção
`--rb-*` (redefinida sob `[data-theme]`/`prefers-color-scheme`, igual ao
padrão já usado no HTML) mapeada para o `@theme` do Tailwind v4
(`--color-primary`, `--color-surface` etc., convenção shadcn). Fonte
(`Space Grotesk`/`IBM Plex Mono` via Google Fonts) idêntica.

**Estrutura**: as 9 páginas HTML viraram 2 rotas reais
(`/` dashboard, `/import`) + 6 `Dialog` do Radix abertos a partir do
dashboard (Add Postcode, Add Flex Route, Special Deliveries, All Stops,
Rebalance Preview, Shipment Details) — não mais páginas HTML inteiras com o
dashboard duplicado ao fundo. `03-route-card-states.html` (sheet de
referência do componente, fora do fluxo do app) não foi portado — decisão
do steward, avisar se precisar recuperar (fica em `git show d366835:...`).

**Bug pego e corrigido antes de finalizar**: a variant `lime` do `Button`
reaproveitado do scaffold antigo usava `text-on-primary-container` (mapeia
pra um verde escuro de baixo contraste) em vez de um token próprio para texto
sobre o lime brilhante — botões "Validate"/"+ Add New Flex Rote"/etc.
ficavam com texto quase ilegível. Corrigido adicionando
`--color-on-primary-bright` ao tema e trocando a classe do botão.

**Validado no navegador** (dev server, `npm run build` limpo, `oxlint` sem
warning novo): claro/escuro, os 6 modais, o fluxo completo de import
(upload → process → 3 tabelas → Go to Balance → volta pro dashboard via
client-side routing), toggle AM/PM, filtro Rebalance/Operations, Colapse/
Expand Routes, e o combobox de postcodes em Add_Postcode — que agora
**funciona de verdade** (só decorativo na versão HTML).

Removidos os 9 arquivos `.html` de `web/` (preservados no commit `d366835`,
recuperáveis via `git show d366835:prototypes/logixsphere/route-balance/web/01-dashboard.html`
etc.). `README.md` e `package.json` da raiz do protótipo atualizados para a
stack React. `server/` e `web/api/` (mock Express/Vercel da rodada React
anterior) mantidos sem uso — nenhuma tela atual os consome, dados vêm de
`src/data/mock.ts`.

Isso **resolve** a divergência de governança da DR-GDS-001 registrada nas
atualizações anteriores — o protótipo volta a seguir a decisão Accepted, sem
precisar de um novo Decision Record.

## Atualização — 2026-08-27 (cont.): fundo branco por padrão + seção nova em Shipment Details

**Fundo branco por padrão.** O tema claro/escuro seguia `prefers-color-scheme`
do sistema quando não havia escolha salva em `localStorage` — em ambiente com
SO em dark mode, a primeira visita já abria escuro. A pedido do solicitante
("deixe o fundo branco?"), removida a dependência de `prefers-color-scheme`:
agora o app **sempre abre claro** por padrão; escuro só ativa se o usuário
clicar no toggle (persiste em `localStorage` como antes). Adicionado também
`color-scheme: only light`/`only dark` nos tokens — mitiga (mas não
garante 100%) navegadores com "forçar modo escuro" no nível do Chrome, que
reescreve páginas independente do CSS da própria página.

**Nota de investigação:** logo depois dessa mudança, a screenshot da
automação do navegador (Claude in Chrome) continuou parecendo escura mesmo
com `getComputedStyle` confirmando fundo `#FAFAEF` (branco) via DOM. Isso é
um filtro de "modo escuro forçado" do ambiente/navegador de automação, não
um bug do app — confirmado quando o solicitante mandou um print do Chrome
normal dele mostrando a mesma tela em claro.

**Seção "Deliveries by Postcode Area" em Shipment Details.** O print do
Chrome normal do solicitante (comparado acima) revelou uma seção que não
existia no modal `ShipmentDetailsDialog`: dois cards colapsáveis por postcode
(ME2 · 4 stops · badge PRE 12 · 50%; ME5 · 2 stops · PRE 12 · 100%), com
barra de progresso fina e chevron de expandir. Busquei essa seção no arquivo
Figma (`LhKS6kSzY2ZxtnsKqOSHFN`, frame `132:8781` e no dump completo da
página "Doing") e **não encontrei** — nem no frame específico nem em nenhum
outro ponto do documento a que tenho acesso; o solicitante confirmou que é
do Figma, mas não tinha o link do frame à mão. Reconstruído só a partir do
que é visível no print (não fabriquei dado que não aparece): badges
`ME2`/`ME5`, contagem de stops, badge `PRE 12`, `%` e barra. O clique no
chevron **expande de verdade** — em vez de inventar sub-dados novos,
reaproveita `allStops` (já mock, já usado no modal All Stops) filtrado por
postcode, já que a lista de paradas por postcode é exatamente esse dado.
Marcado com comentário no `data/mock.ts` como aproximação — se alguém achar
o node/link certo no Figma, conferir os números reais e trocar o dado.

## Atualização — 2026-08-27 (cont.): funções puxadas de `sp-portal-react` (produção real)

A pedido do solicitante ("puxe as funções da page acima"), apontando para
`/Users/mazinijoaomarcelo/Desktop/BA - LOGIX/subsystem/logix-subsistem/
sp-portal-react/src/pages/RouteBalance/RouteBalance.tsx` — a implementação
real de produção do Route Balance (2386 linhas, ~25 funções), fora deste
repositório. **Só leitura** desse arquivo; nada foi alterado lá (é código de
produção, fora da autoridade deste Workspace — ver regra do CLAUDE.md).

Escopo é grande demais pra uma rodada só; perguntado ao solicitante o que
priorizar. Resposta: tudo, com ênfase em **ações de rota** (aprovar, enviar
pros motoristas, desfazer, exportar CSV) e **editar postcode/parada**.
Implementado nesta rodada:

- **Novo modelo de dados** (`src/data/route-domain.ts`): `Stop`/`RouteRow`
  com paradas reais por rota (postcode, endereço, cliente, tipo DEL/PU,
  turno am/pm, flags pre12/asr/dsr, status pending/completed) — antes cada
  rota só tinha `done`/`total` fixos, sem paradas de verdade por trás.
  Portado quase 1:1: `rand`, `pick`, `subpostcodeOf`, `groupBySubpostcode`
  (grupos com Pre-12 ordenam primeiro). Geração de dados adaptada (endereços
  reaproveitados do mock já existente), 8 rotas A-01..A-08, contagens
  done/total mantidas iguais à versão anterior (73%/100%) pra não quebrar a
  fidelidade visual já validada com o solicitante.
- **KPIs viraram agregados reais** (`kpiTotals` no hook) em vez de string fixa
  — Total Stops/Pré-Deliveries/Archived Service Rate/Dalayed Service Rate
  agora somam `stops[]` de verdade (pre12/asr/dsr), reagem a turno AM/PM e a
  edições. Os 3 últimos KPIs viraram **filtro clicável** (toggleDashboardFilter
  portado) — clicar filtra os cards pra só mostrar rotas com pelo menos uma
  parada daquele tipo.
- **Ações de rota** (`src/hooks/use-route-balance.ts`, portado de
  `toggleRouteApproval`/`sendToDrivers`/`revertLastAction`/`exportRouteCsv`):
  o ✓ do card agora aprova/retira aprovação de verdade (pending → approved →
  sent, por turno); "▷ Save" no toolbar virou o "Send to Driver" em lote real
  (só envia rotas aprovadas; reenvia tudo se já estiver tudo enviado); botão
  de revert (↺, some quando não há ação pra desfazer) desfaz o último
  aprovar/enviar; "Export CSV" no card expandido baixa um CSV de verdade
  (Blob + `<a download>`) com as paradas visíveis da rota. **Simplificado**:
  produção mantém um array `history` completo por rota com autor/timestamp;
  aqui é só o último `lastAction` (um nível de undo, não uma timeline).
- **Editar postcode/parada**: `AddPostcodeDialog` ganhou a validação real de
  formato (regex de postcode `ME15 6AB` vs subpostcode `ME15`) e seleção de
  rota — igual à produção, é validação-only (não insere parada de verdade,
  mesmo comportamento de lá). Novo `EditStopDialog` (não existia) — clicar
  numa parada em "All Stops" abre editar postcode + Pre-12, com escopo
  "esta parada" vs "todas com esse postcode na rota", e a mesma regra de
  negócio real: turno PM nunca pode ter Pre-12 marcado (some com toast se
  tentar). `AllStopsDialog`/`SpecialDeliveriesDialog`/`ShipmentDetailsDialog`
  agora recebem a rota clicada e mostram os dados reais dela (turno, flags,
  contagens), não mais um mock global igual pra qualquer card.
- **Toasts** (`use-toasts.ts` + `ToastStack`): sistema de toast real com
  undo (portado de `showToast`/`dismissToast`), redesenhado em Tailwind
  (produção usa Bootstrap Icons/CSS que este protótipo não usa).

**Não portado nesta rodada** (fora do que foi priorizado; ficaria pra uma
próxima rodada se pedido):
- Drag-and-drop de paradas entre rotas (`transferStops`, cards com
  `draggable`) e o modal "Compare Routes" (grid lado a lado com drop zone).
- Tabela-resumo ordenável (`handleSort`, `filteredRoutes.sort`) e o "route
  focus" ao clicar uma linha dela — este protótipo não tem essa tabela.
- Gauges animados (speedômetro/anel do "Operation Summary", `useCountUp`,
  geometria SVG) — específico da UI antiga (Bootstrap), não portado pro
  design system atual.
- `history` completo por rota (autor, timestamp, timeline) — simplificado
  pra um `lastAction` único, como descrito acima.
- `saveNewRoute`/`closeEmptyRoute` (fechar rota vazia) — `AddFlexRouteDialog`
  já existia antes desta rodada e não foi religado à validação real
  (nome obrigatório + unicidade) por não ter sido reforçado no pedido.
- Import real de arquivo (`discoProcessing.ts`, parser DISCO) — a tela de
  Import continua mock, como já registrado antes.
- Pieces/peso físico/breakdown por tipo de embarque em Shipment Details
  continuam mock fixo — `Stop` neste protótipo não carrega
  `shipmentType`/`pieces`/`physicalWeight` (produção carrega); portar isso
  exigiria estender o modelo de dados, deixado de fora por não ter sido
  destacado no pedido.

Validado no navegador: aprovar rota → "▷ Save" envia (badge SENT) → revert
desfaz; abrir All Stops → clicar parada → editar postcode → reflete na
lista; Add Postcode rejeita formato inválido (modal não fecha); KPIs
recalculam com o turno. `npm run build` e `oxlint` limpos.
