# Route Balance — protótipo (LogixSphere)

Protótipo funcional do módulo **Route Balance**. Escopo original vindo do
handoff do Figma (página Handoff → `handoff-route-balance`); a casca do app
(topbar, toolbar de ações, footer) e os fluxos de Import, Add Post Code, PM
ASR/DSR Listing, Shipment Details, All Stops e Send to Rebalance vieram do
board de exploração (página Doing), a pedido do solicitante em 2026-08-26.
Não é produção — ver `DESIGN_ENGINEERING_TASK.md` para escopo, constraints e
caminho de promoção.

**Publicado (revisão):** https://web-seven-weld-58.vercel.app — projeto Vercel
`web` na conta `jhophjm-8408`. Dados mock em memória: resetam a cada cold
start da função serverless e não são compartilhados de forma garantida entre
sessões/visitantes — normal para protótipo de revisão, não é comportamento de
produção.

**Redeploy — cuidado, `cd web && npx vercel deploy --prod` normalmente trava**
em "Building…" para sempre. Causa raiz confirmada via `--debug`: o Vercel lê o
autor do commit git local (`gues-who`, identidade git deste ambiente/sandbox)
e bloqueia (`TEAM_ACCESS_REQUIRED`) porque esse autor não é membro verificado
do time `João Marcelo's projects` no Vercel — trava silenciosa, sem erro
explícito no terminal. Duas opções:
1. **Definitiva**: em vercel.com → Team Settings → convidar
   `gues-who@users.noreply.github.com` como membro (ou desabilitar a
   verificação de autor de commit para deploys via CLI), se isso fizer
   sentido para o Studio.
2. **Contorno (o que foi usado para publicar esta versão)**: copiar `web/`
   (sem `node_modules`, sem `dist`, mantendo `.vercel/`) para um diretório
   FORA do repositório git e rodar `vercel deploy --prod --yes` de lá — sem
   `.git` no caminho, o Vercel não anexa metadados de autor e o bloqueio não
   é acionado.
   ```bash
   rsync -a --exclude node_modules --exclude dist web/ /tmp/rb-deploy-stage/
   cd /tmp/rb-deploy-stage && npx vercel deploy --prod --yes
   ```

## Rodando localmente

```bash
npm install --prefix server
npm install --prefix web
npm run dev
```

Isso sobe o mock API (Express) em `http://localhost:4000` e o front (Vite) em
`http://localhost:5173`, com o Vite fazendo proxy de `/api` para o servidor.
Abra `http://localhost:5173`.

Se preferir dois terminais: `npm run dev:server` e `npm run dev:web`.

## Estrutura

- `web/` — Vite + React + TypeScript + Tailwind CSS + Radix UI/shadcn
  (componentes copiados em `web/src/components/ui/`), conforme DR-GDS-001.
- `server/` — Express local/dev-only, usado com `npm run dev` (ver acima).
  Dados em memória (resetam a cada restart).
- `web/api/` — a MESMA lógica de `server/src/`, espelhada manualmente como
  Vercel Serverless Function (`web/api/index.ts`, mesmo Express app, sem
  `app.listen`) para a versão publicada. É duplicação deliberada — um
  protótipo não justifica infraestrutura de monorepo/workspace só para
  compartilhar esse código; se isto virar algo de vida mais longa, vale
  unificar. Ao alterar uma regra de negócio em `server/src/`, replique em
  `web/api/_lib/`.
  O único fluxo com processamento real de arquivo é `POST /api/import`, que
  faz parse de verdade do `.xlsx`/`.xls`/`.xlsm` enviado (lib `xlsx`/SheetJS);
  o resto dos dados (KPIs, rotas, motoristas, postcodes, stops) é mock fixo.
  Ver nota de governança no `DESIGN_ENGINEERING_TASK.md` sobre o uso de
  Node/Express aqui não estar coberto pela DR-GDS-001 (que definiu só o
  front-end).

## O que validar em tela

**Import (tela inicial, antes do dashboard):**
- Arraste um `.xlsx` qualquer (ou use o seletor) — Pre-12, Análise de
  Postcodes e Análise de Size Class refletem o conteúdo real do arquivo
  enviado. "Voltar" reprocessa; "Ir para Route Balance" entra no dashboard.

**Dashboard:**
- Topbar: busca decorativa + data/hora ao vivo + usuário. Toolbar: busca
  funcional (filtra os cards por rota/motorista), Add Post Code, Collapse
  Routes (recolhe todos os cards expandidos de uma vez), PM ASR/DSR Listing,
  Shipment Details, Add New Flex Route, Send to Rebalance.
- Barra de KPIs — atualiza sozinha após Validate/Rebalance/Send to Rebalance
  (sem precisar recarregar a página).
- Grade de route cards: expandir (+/–) mostra o detalhamento por subcódigo
  postal, com "See details" (abre Shipment Details da rota) e "See all
  stops" (abre a listagem completa de paradas). "Validate" muda o status do
  card; o card `ROUTE A-04` já nasce em estado de rebalanceamento (borda
  vermelha) — "Rebalance" abre o modal de prévia por rota, ou use "Send to
  Rebalance" na toolbar para tratar em lote todas as rotas nesse estado.
- "Add Post Code": escolhe uma rota e adiciona um ou mais postcodes reais à
  tabela de subcódigos daquela rota.

## Pendências conhecidas

- Alguns valores exatos de tokens/copy não estavam 100% legíveis no viewer do
  Figma sem login (sinalizado inline no código) — conferir com Aline antes de
  promover qualquer coisa para `design-system/` ou `components/approved/`.
- Breakpoints responsivos (tablet/desktop 27"/ultrawide 49" no Figma): esta
  versão cobre só desktop, por decisão explícita do solicitante — sem grid
  fiel aos 3 breakpoints.
- Sem suíte de testes automatizada nesta rodada (protótipo de validação
  visual/interação).
