# Design Engineering Task — Studio OS Painel

```markdown
Problem/outcome: Operar o Studio OS (gates, fonte canônica, naming, escalation, decisões abertas) sem reinventar as regras a cada pergunta, a partir da skill group-design-studio.
Repository/path/scope authorized: prototypes/experiments/gds-studio-os/ (somente).
References and license status: dependências já registradas em references/SRC-001…016 (status Discovered). Nenhuma dependência nova.
Existing tokens/components to reuse: tokens --rb-* e primitivos ui/* (Badge, Button, Input, Label, Progress, Table), copiados de gds-verificacao.
Constraints: stack DR-GDS-001; WCAG AA; não inventar dados ausentes do snapshot (regra de ouro da skill); sem segredos.
Expected prototype/tests: página única com os fluxos A–E; build com typecheck; smoke test em navegador (cada fluxo, claro/escuro, 390px).
Forbidden changes: arquivos fora desta pasta; a skill em si (skills/).
Owner/reviewers: ⬜ LACUNA — steward sugerido: João Marcelo; conteúdo de governança: Gabriel; estilização: Aline.
Promotion path if successful: dados passarem a ser lidos do canônico/START_HERE no Drive (em vez do snapshot) e a página virar ferramenta interna do Studio, por decisão D0 (João) e aprovação do sponsor para mudança de processo.
Evidence required: screenshots claro/escuro, build verde, roteiro de smoke test.
```
