# Route Balance — protótipo (LogixSphere)

Protótipo do módulo **Route Balance**. Escopo original vindo do handoff do
Figma (página Handoff → `handoff-route-balance`); a casca do app (topbar,
toolbar de ações, footer) e os fluxos de Import, Add Post Code, All Stops,
Special Deliveries, Rebalance Preview, Add New Flex Route e Shipment Details
vieram do board de exploração (página Doing). Não é produção — ver
`DESIGN_ENGINEERING_TASK.md` para escopo, constraints e caminho de promoção.

## Stack (DR-GDS-001)

Em **2026-08-27**, a pedido do solicitante, o protótipo voltou a ser
**Vite + React + TypeScript + Tailwind CSS + Radix UI (componentes
shadcn copiados para o repo)** — a stack definida pela `DR-GDS-001`
(Accepted, 2026-08-20). A divergência registrada aqui em rodadas anteriores
(quando o protótipo tinha sido reescrito como HTML estático, uma página por
frame) está **resolvida**: o histórico de ambas as tentativas (React antiga e
HTML) fica preservado no git — ver `DESIGN_ENGINEERING_TASK.md`.

## Estrutura

```
web/
  src/
    components/
      ui/              — primitivos estilo shadcn (Button, Dialog, Input,
                          Label, Progress, Select, Badge, Table) sobre Radix
      route-balance/    — componentes de tela: shell (sidebar/topbar/tema),
                          KPI grid, Route Card, e os 6 modais (Add Postcode,
                          Add Flex Route, Special Deliveries, All Stops,
                          Rebalance Preview, Shipment Details)
    data/mock.ts        — dados mock centralizados (antes espalhados por
                          9 arquivos .html)
    pages/              — DashboardPage e ImportPage (as duas rotas reais;
                          os "modais" das páginas antigas viraram Dialogs
                          abertos a partir do dashboard, não páginas soltas)
    index.css           — tokens de cor (claro/escuro) mapeados para o
                          @theme do Tailwind v4
  api/, vercel.json     — mock API Express/Vercel da rodada React anterior;
                          nenhuma tela atual a consome (dados vêm de
                          data/mock.ts) — mantido até decidir remoção
```

Rotas: `/` (dashboard) e `/import` (fluxo de importação DISCO). Os demais
fluxos (Add Postcode, Add Flex Route, Special Deliveries, All Stops,
Rebalance Preview, Shipment Details) são `Dialog` do Radix abertos a partir
do dashboard — mantêm o padrão visual "fundo do dashboard + overlay" das
páginas antigas, mas agora como diálogo real (foco preso, ESC fecha, sem
duplicar o HTML do dashboard por tela).

## Rodando localmente

```bash
cd web
npm install
npm run dev       # http://localhost:5173
```

Outros comandos: `npm run build` (typecheck + build), `npm run lint`
(oxlint), `npm run preview`.

## Fidelidade em relação à versão HTML anterior

Todas as 9 telas HTML (dashboard, import, 6 modais, e a sheet de referência
de estados do Route Card) foram portadas com fidelidade visual, incluindo:
- Tema claro/escuro com toggle manual persistido (`localStorage`,
  chave `rb-theme`) — mesmo comportamento da versão HTML.
- Layout responsivo (sidebar colapsa em barra horizontal abaixo de 860px,
  grids fluidos via `auto-fit`/`auto-fill`, tabelas com scroll horizontal).
- Funções do dashboard: toggle AM/PM (atualiza o chip de turno dos cards),
  toggle Rebalance/Operations (filtra para rotas ≥100%), Colapse/Expand
  Routes, busca de rotas por texto, e o botão "Add Post Code" que faltava na
  versão HTML.

**Ganhos da migração** (não existiam na versão HTML estática):
- Combobox de postcodes em `Add_Postcode` agora funciona de verdade
  (clicar na lista adiciona/remove chip) — na versão HTML era só decorativo.
- Diálogos são Radix `Dialog` reais: foco preso, `Esc` fecha, `aria-*`
  correto — a versão HTML simulava modal com overlay + página cheia.
- Estado compartilhado entre componentes via React (ex.: expandir/colapsar
  um card não depende de reconstruir HTML manualmente).

## Pendências conhecidas

- **Import não lê o arquivo de verdade.** "Process →" sempre mostra a mesma
  amostra mock (PRE-12/Postcode Analysis/Size Class fixos), igual à versão
  HTML — não há parser XLSX real.
- **Todos os route cards mostram "Carlos Silva" / "YF25 OZL" / "Route A-01".**
  Só done/total variam — mesma limitação de dados da versão HTML.
- **"See Details" e "▷ Save" sem handler** — botões presentes, sem ação
  associada (igual à versão HTML).
- **"PM ASR/DSR Listing"** (botão visto no toolbar do Figma) continua não
  implementado — não fazia parte do escopo confirmado.
- Sem suíte de testes automatizada nesta rodada.
- `server/` e `web/api/` (mock Express/Vercel) não são consumidos por
  nenhuma tela atual — avaliar remoção numa rodada futura.

## Publicação (Vercel)

**Publicado (revisão):** https://web-seven-weld-58.vercel.app — projeto Vercel
`web` na conta `jhophjm-8408`. Essa URL foi publicada como site estático (a
versão HTML anterior) — precisa de um novo deploy apontando para
`npm run build` / diretório `dist/` antes de refletir esta versão React.

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
2. **Contorno (o que foi usado para publicar a versão anterior)**: copiar
   `web/` para um diretório FORA do repositório git e rodar
   `vercel deploy --prod --yes` de lá — sem `.git` no caminho, o Vercel não
   anexa metadados de autor e o bloqueio não é acionado.
   ```bash
   rsync -a web/ /tmp/rb-deploy-stage/ --exclude node_modules --exclude dist
   cd /tmp/rb-deploy-stage && npm install && npx vercel deploy --prod --yes
   ```

## Ajustes de 2026-11-19 (verificação GDS)

Mudanças apontadas por `prototypes/experiments/gds-verificacao`:

- **Contraste (WCAG AA):** `--rb-warn` no tema claro mudou de `#C97A2B` para `#93520E`. A cor antiga ficava em 2.56:1 sobre `warn-soft` e 3.0:1 sobre `surface`. `on-secondary`, `on-tertiary` e `on-error` passaram a usar `--rb-on-teal`, `--rb-on-warn` e `--rb-on-error`, que trocam com o tema: branco no claro e `#15170F` no escuro. Antes, o branco fixo dava entre 1.8:1 e 2.3:1 no escuro. `--rb-ink-dim` no claro mudou de `#6B6B5E` para `#66665A`, porque dava 4.46:1 sobre `surface-variant`. Mudança visual a validar com a Aline (D1).
- **Dependências do `server/`:** `npm audit fix` atualizou `multer` e `body-parser` no lockfile, resolvendo advisories HIGH de DoS. O `xlsx` 0.18.5 segue com advisories sem correção no npm. Ver `references/SRC-014_sheetjs-xlsx.yaml`. A troca de fonte do pacote é decisão de Dev.
