# GDS — Verificação (experimental)

Página única que verifica **a construção do repositório**, **a skill `group-design-studio`** e **a estilização** (tokens + componentes) deste Workspace. Não é produção, e não tem produto definido. Por isso vive em `prototypes/experiments/`.

## Como funciona

- `scripts/scan-repo.mjs` lê o repositório (somente leitura) e grava `src/data/repo-scan.json`, que não é versionado. Roda automaticamente antes de `dev` e de `build`.
- Checagens: arquivos-base, pastas declaradas no README raiz, `DESIGN_ENGINEERING_TASK.md` por protótipo, dependências × `references/`, tokens em `design-system/`, varredura simples de segredos, e na skill o frontmatter, os fluxos A–E, os gatilhos e os arquivos de referência citados.
- **Estilização:** a razão de contraste WCAG de cada par de tokens é medida ao vivo no navegador, nos temas claro e escuro.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run scan     # só regenera o JSON
npm run build    # scan + typecheck + build
```

## Reuso

Stack DR-GDS-001 (Vite + React + TS + Tailwind v4 + Radix/shadcn). Tokens (`src/index.css`) e primitivos (`src/components/ui/*`) foram **copiados** de `prototypes/logixsphere/route-balance/web`. Além do ajuste de contraste aplicado nos dois arquivos (2026-11-19), a única diferença é o seletor `[data-theme="light"]`, usado na medição de contraste. Quando existirem tokens em `design-system/tokens`, esta página deve passar a consumi-los.
