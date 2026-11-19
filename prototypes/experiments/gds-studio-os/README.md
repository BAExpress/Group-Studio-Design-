# Studio OS — Painel (experimental)

Página que transforma os fluxos da skill `skills/group-design-studio` em ferramentas interativas. Não é produção.

| Fluxo | Ferramenta |
|---|---|
| A | Decisões abertas do §28, com status, owner e prazo. O que não está declarado aparece como `⬜ LACUNA`. |
| B | Checklist do Ready Gate (9 itens + capacidade) e dos Gates 2–4, com o aprovador de cada gate |
| C | Tipo de ativo → fonte canônica, com alerta quando o destino é errado ou é um canal transitório |
| D | Validador de nomes `[Produto]_[Tipo]_[Nome]_[Status]_vX.Y`, que pega "FINAL", datas fora do padrão e candidatos a quarentena |
| E | Classificação de escalation (Incidente/D3–D0) → decisor, SLA e um pedido de decisão para copiar |

## Fonte dos dados

`src/data/studio-os.ts` foi transcrito de `skills/group-design-studio/references/studio_os_reference.md`, que é um snapshot do canônico v1.0.0 (2026-08-19). **Não é a fonte canônica.** Quando o canônico mudar, atualize esse arquivo.

Regras seguidas, vindas da própria skill:
- Nada que a fonte não declara é preenchido. Vocabulário de status, owners e prazos das decisões e a data-base do SLA aparecem como lacuna.
- A página mostra o que falta e quem age, mas não aprova gates.
- A decisão aberta 1 (stack) aparece como **resolvida**, pela DR-GDS-001 registrada neste repositório (2026-08-20). O snapshot da skill ainda a lista como aberta, e essa divergência aparece na página.

## Rodando

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

Tokens e primitivos foram copiados de `prototypes/experiments/gds-verificacao` (origem: Route Balance). As dependências já estão registradas em `references/SRC-*`.
