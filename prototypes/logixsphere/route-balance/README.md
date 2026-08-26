# Route Balance — protótipo (LogixSphere)

Protótipo funcional do módulo **Route Balance**, especificado no handoff do Figma
"Logix Sphere" (página Handoff → `handoff-route-balance`). Não é produção — ver
`DESIGN_ENGINEERING_TASK.md` para escopo, constraints e caminho de promoção.

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
- `server/` — Express local/dev-only. Dados em memória (resetam a cada
  restart). O único fluxo com processamento real de arquivo é
  `POST /api/import`, que faz parse de verdade do `.xlsx`/`.xls`/`.xlsm`
  enviado (lib `xlsx`/SheetJS); o resto dos dados (KPIs, rotas, motoristas)
  é mock fixo. Ver nota de governança no `DESIGN_ENGINEERING_TASK.md` sobre o
  uso de Node/Express aqui não estar coberto pela DR-GDS-001 (que definiu só
  o front-end).

## O que validar em tela

- Importação de rota: arraste um `.xlsx` qualquer (ou use o seletor) sobre o
  painel de importação — o resumo "Extracted Demands by Route" reflete o
  conteúdo real do arquivo enviado.
- Barra de KPIs no topo.
- Grade de route cards: expandir (+/–) mostra o detalhamento por subcódigo
  postal; "Validate" muda o status do card; o card `ROUTE A-04` já nasce em
  estado de rebalanceamento (borda vermelha) — clicar em "Rebalance" abre o
  modal de prévia.
- "Add flex route" no topo cria uma rota nova a partir de nome + motorista.

## Pendências conhecidas

- Alguns valores exatos de tokens/copy não estavam 100% legíveis no viewer do
  Figma sem login (sinalizado inline no código) — conferir com Aline antes de
  promover qualquer coisa para `design-system/` ou `components/approved/`.
- Sem suíte de testes automatizada nesta rodada (protótipo de validação
  visual/interação).
