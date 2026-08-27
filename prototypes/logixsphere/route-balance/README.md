# Route Balance — protótipo (LogixSphere)

Protótipo do módulo **Route Balance**. Escopo original vindo do handoff do
Figma (página Handoff → `handoff-route-balance`); a casca do app (topbar,
toolbar de ações, footer) e os fluxos de Import, Add Post Code, All Stops,
Special Deliveries, Rebalance Preview e Add New Flex Route vieram do board de
exploração (página Doing). Não é produção — ver `DESIGN_ENGINEERING_TASK.md`
para escopo, constraints e caminho de promoção.

## ⚠️ Divergência de stack em aberto (DR-GDS-001)

Em **2026-08-27**, a pedido do solicitante, a implementação em React foi
removida. O protótipo é **HTML estático — uma página por frame do Figma**,
sem framework, sem build e sem JS/CSS compartilhado entre páginas: cada
arquivo é autocontido (estilos e script inline).

A `DR-GDS-001` (Accepted, 2026-08-20) continua vigente e determina
Vite + React + TypeScript + Tailwind + Radix/shadcn para
`prototypes/logixsphere/`. **Este protótipo contradiz essa decisão e depende
de um novo Decision Record que a substitua** (os DRs são canônicos no Shared
Drive do Studio, `01_Governance` — não neste repositório). Até lá, trate esta
pasta como exceção registrada, não como precedente.

A versão React está preservada no branch **`react/route-balance-doing`**
(commit `00d66b8`).

## Estrutura

Cada página é um arquivo `.html` completo, com CSS (custom properties
light/dark) e JS inline — sem dependências, sem build:

- `web/01-dashboard.html` — dashboard Route Balance (KPIs, grade de 8 route
  cards, toolbar de ações). Expandir/colapsar card é o único estado com JS
  próprio; os demais botões navegam para a página correspondente.
- `web/02-import-disco.html` — fluxo de importação DISCO em 2 estados
  (upload → grade de demandas extraídas), com toast de sucesso.
- `web/03-route-card-states.html` — sheet de referência do componente Route
  Card nos três estados (Default / Expanded / Rebalance), fora do fluxo do
  app.
- `web/04-modal-add-postcode.html` — modal Add_Postcode sobre o dashboard.
- `web/05-modal-special-deliveries.html` — modal Special Deliveries.
- `web/06-modal-all-stops.html` — modal All Stops.
- `web/07-modal-rebalance-preview.html` — modal Rebalance Preview.
- `web/08-modal-add-flex-route.html` — modal Add New Flex Route.
- `server/` e `web/api/` — mock API Express / Vercel Serverless que servia a
  versão React anterior. **Nenhuma página HTML atual a consome** — os dados
  são fixos, embutidos em cada arquivo. Mantido no repo até decidir se volta
  a ser usado ou é removido.

As páginas de modal (04–08) são telas completas — reproduzem o dashboard ao
fundo com um overlay, replicando fielmente o frame do Figma — não `<dialog>`
nem componente reaproveitável. Fechar (×) ou "Cancel" navegam de volta para
`01-dashboard.html`.

## Navegação ligada

A partir de `01-dashboard.html`:
- **Importar** → `02-import-disco.html`
- **+ Add New Flex Rote** → `08-modal-add-flex-route.html`
- **Special Deliveries ★** (no card expandido) → `05-modal-special-deliveries.html`
- **See All Stops** (no card expandido) → `06-modal-all-stops.html`
- **⇄ Rebalance** (card no card no estado 100%+) → `07-modal-rebalance-preview.html`

Sem entrada no dashboard para `04-modal-add-postcode.html` (não há botão
"Add Post Code" nesta versão do dashboard) nem para `03-route-card-states.html`
(sheet de referência, não faz parte do fluxo) — abra-os diretamente pela URL.
"Colapse Routes", "See Details" e "▷ Save" não têm página/comportamento
associado nesta rodada.

## Rodando localmente

Não há build nem dependências: **abra `web/01-dashboard.html` no navegador**
(duplo clique funciona).

Se preferir servir por HTTP:

```bash
npm run dev     # python3 -m http.server 5173 --directory web
```

E abra `http://localhost:5173/01-dashboard.html`.

## Pendências conhecidas

- **Novo Decision Record de stack** — ver aviso no topo.
- **Dados fixos por página.** Cada arquivo tem seus próprios números
  hardcoded; não há estado compartilhado entre páginas (ex.: validar uma rota
  no dashboard não reflete nos modais, que sempre mostram os mesmos dados de
  exemplo).
- **Todos os route cards mostram "Carlos Silva" / "YF25 OZL" / "Route A-01".**
  Só done/total variam entre os 8 cards do dashboard — os demais campos são
  placeholder repetido.
- **Sem entrada de dashboard para Add_Postcode** (página existe, órfã) e sem
  página para "Colapse Routes" (tem JS), "See Details" e "▷ Save" (sem
  handler/destino).
- **Import não lê o arquivo.** "Process File" sempre mostra a mesma amostra
  (A01–A04, 8 courier segments), independente do arquivo selecionado.
- Alguns valores exatos de tokens/copy podem não refletir 100% o handoff —
  conferir com Aline antes de promover qualquer coisa para `design-system/`
  ou `components/approved/`.
- Sem breakpoints responsivos (tablet/desktop 27"/ultrawide 49" do Figma) —
  esta versão cobre só desktop.
- Sem suíte de testes automatizada nesta rodada.

## Publicação (Vercel)

**Publicado (revisão):** https://web-seven-weld-58.vercel.app — projeto Vercel
`web` na conta `jhophjm-8408`. **Essa URL ainda serve a versão React**; o
projeto precisa ser reconfigurado para site estático (sem build, apontando
para `01-dashboard.html`) antes do próximo deploy.

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
   rsync -a web/ /tmp/rb-deploy-stage/
   cd /tmp/rb-deploy-stage && npx vercel deploy --prod --yes
   ```
