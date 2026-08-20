# Papéis, ownership e RACI — Group Design Studio

Espelha `Group_Design_Studio_OS_v1_CANONICAL.md` §6. Em caso de conflito, o canônico no Drive prevalece — este arquivo é uma cópia de referência para quem trabalha neste repositório.

## Papéis

| Pessoa | Papel | Owns | Não decide |
|---|---|---|---|
| Thiago Brito | Sponsor / autoridade de produto | visão, intenção, prioridade estratégica, marca, orçamento, exceções | detalhe visual, Jira diário |
| Gabriel Stefano | Project Manager / control tower | Jira, planejamento, capacidade, prazos, dependências, bloqueios, reporting | UX/UI, infraestrutura do Studio |
| João Marcelo Santos | DesignOps / Steward deste Workspace | estrutura deste repositório, CLAUDE.md, registry, ponte Design–Dev | qualidade de UX/UI |
| Aline | Product Designer / Design Owner | UX/UI, pesquisa, jornadas, protótipos, rationale, Design Systems | estratégia de negócio, arquitetura de produção |
| Dev / Engenharia | Engenharia | feasibility, arquitetura de produção, segurança, performance, implementação | UX sem alinhar com Design |
| IA (Claude Code) | Executora autorizada | executa tarefas autorizadas neste repositório | nada é auto-aprovado |

## Decision rights relevantes para este repositório

- **Aline decide:** componentes existentes, pequenos padrões de UX, correções de consistência no `design-system/`.
- **Aline + Dev decidem:** comportamento detalhado viável, responsividade, estados, implementação aderente ao contrato.
- **João decide:** manutenção compatível com esta arquitetura, organização das pastas, templates — sem alterar ownership ou fontes canônicas.
- **Thiago decide:** mudança material de experiência, marca, trade-off estratégico, stack técnico definitivo.

## Escalation (canônico §21)

| Classe | Exemplo | Decisor | SLA |
|---|---|---|---|
| D0 operacional | naming/localização compatível | owner do domínio | mesmo dia útil |
| D1 profissional | padrão UX reversível | Aline | 2 dias úteis |
| D2 cross-functional | trade-off Design/Dev | Aline + Dev; Gabriel facilita | 3 dias úteis |
| D3 estratégico | stack, marca, prioridade, exceção | Thiago | 5 dias úteis |
| Incidente | segurança, legal, perda de dados | autoridade técnica/executiva | imediato |

## Decisão registrada

Stack técnico do Design Engineering Workspace — **decidido em 2026-08-20** (DR-GDS-001, status Accepted): React para LogixSphere, seguindo a tecnologia de produção atual; stack leve para BA Express. Ver `00_START_HERE`, Lacuna #5 (resolvida).
