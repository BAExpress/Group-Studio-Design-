# Studio OS — retrato rápido de estrutura

> Capturado a partir do `Group_Design_Studio_OS_v1_CANONICAL.md` (Status: baseline operacional canônica, **versão 1.0.0**, no Projeto desde 2026-08-19), cruzado com `00_START_HERE_GDS_v1_ESQUELETO.md` (ainda em **Status: ESQUELETO v0.1**, última revisão 2026-08-17) e `1_MISSAO.md`. **Isto é um snapshot, não a fonte canônica.** Sempre prefira ler a versão atual dos documentos (via Projeto/Drive) quando disponível — em especial para links, prazos e nomes de pessoas.
>
> **Atenção operacional:** o canônico e o START_HERE não estão sincronizados. O canônico já é v1.0.0 e contém o texto completo de todas as decisões abertas (§28); o START_HERE ainda é o esqueleto v0.1 de 17/08 e trata algumas dessas decisões como não detalhadas. Ao responder, confira os dois — o canônico prevalece em caso de conflito (regra explícita do próprio START_HERE), mas o START_HERE é o documento operacional do dia a dia e pode ainda não refletir o que o canônico já resolveu.

## Papéis (quem decide o quê)

Desde a v1.0.0 do canônico, os papéis já têm nomes reais associados (antes eram só títulos genéricos):

| Pessoa | Papel | Owns | Verifica |
|---|---|---|---|
| **Thiago Brito** | Sponsor / autoridade de produto | visão, intenção, prioridade estratégica, marca, orçamento, exceções | o outcome |
| **Gabriel Stefano** | Project Manager / control tower | Jira, planejamento, capacidade, prazos, dependências, bloqueios, reporting | o estado do **trabalho** |
| **João Marcelo Santos** | DesignOps / Workspace Steward | Shared Drive, estruturas, inventários, templates, registros, acessos, documentação, registry, ponte Design–Dev | o estado do **sistema** |
| **Aline** | Product Designer / Design Owner | UX/UI, pesquisa, jornadas, protótipos, rationale, qualidade profissional, Design Systems | a **qualidade do Design** |
| **Dev / Engenharia** | Engenharia | feasibility, arquitetura de produção, segurança, performance, implementação, testes | a viabilidade técnica |
| **IA (Claude)** | executora autorizada — nada além disso | estruturar, pesquisar, documentar, prototipar, criticar | **não é accountable por nada** |

Regra geral: o steward do sistema nunca decide qualidade de Design nem vira dono pessoal do conhecimento; o sponsor não administra o board diariamente nem reabre trabalho aprovado sem registrar mudança de escopo; a IA não concede licença, não aprova produção, e não recebe segredos/dados sem classificação adequada.

## Classes de escalation e SLA

Os decisores de D1–D3 agora estão nomeados no canônico (antes eram papéis genéricos tipo "Design Owner"):

| Classe | Exemplo | Decisor | SLA |
|---|---|---|---|
| D0 operacional | naming/localização compatível | owner do domínio | mesmo dia útil |
| D1 profissional | padrão UX reversível | **Aline** | 2 dias úteis |
| D2 cross-functional | trade-off Design/Dev | **Aline + Dev**; Gabriel facilita | 3 dias úteis |
| D3 estratégico | fluxo principal, marca, prioridade, exceção | **Thiago** | 5 dias úteis |
| Incidente | segurança, legal, perda de dados | autoridade técnica/executiva | imediato |

Ao vencer o SLA, Gabriel relembra **uma vez** e escala. **Silêncio não é aprovação em D2/D3.** Pedido de decisão deve conter recomendação, alternativas, trade-offs, prazo-limite e consequência de não decidir (§21 do canônico).

## Mapa das fontes canônicas

O canônico v1.0.0 separa "Claude Code" (o ambiente/agente) de "Providers de IA" (execução/exploração/assistência) em duas linhas distintas — não são a mesma coisa:

| Sistema | É canônico para | **Não** é canônico para |
|---|---|---|
| Jira | trabalho, owner, prioridade, status, prazo, dependências, aceitação | documentação longa, Design final, código |
| Figma | UX/UI, protótipos, libraries, variables, componentes, especificação visual | gestão de trabalho, decisões extensas, código de produção |
| Google Shared Drive | governança, SOPs, research, decisões, templates, AI Library, exports, conhecimento | status diário, código, biblioteca visual viva |
| GitHub | código, Design Engineering Workspace, histórico, tokens implementados, documentação junto ao código | backlog, arquivos Figma |
| Claude Code | ambiente/agente que trabalha sobre repositórios autorizados | fonte canônica ou owner de conhecimento |
| Providers de IA | execução, exploração, análise, assistência | armazenamento exclusivo de IP institucional |
| Produto/produção | comportamento real entregue ao usuário | justificativa histórica da decisão |

**Fora da arquitetura v1:** Confluence. **Opcional:** Loom, para walkthroughs relevantes.
**Canais transitórios:** WhatsApp, e-mail, chats de IA, computadores pessoais. Informação material **deve ser promovida** à fonte canônica correspondente.

## Workflow e os quatro gates

Fluxo de Design: `Brief → Research → Explore → Design → Prototype → Review → Handoff → Build → QA → Release → Learn`

Os aprovadores dos gates agora estão nomeados:

| Gate | Passa quando | Aprovador |
|---|---|---|
| 1 — Ready to Start | Ready Gate completo e capacidade existe | **Gabriel** |
| 2 — Design Approved | problema, estados principais, acessibilidade, responsividade, reutilização, rationale e feedback tratados | **Aline** (Thiago só em decisão material de produto/marca) |
| 3 — Ready for Dev | Figma organizado, fluxo e edge cases claros, componentes/tokens identificados, conteúdo realista, assets disponíveis, decisão registrada, Dev confirmou viabilidade | **Aline + Dev** |
| 4 — Release & Outcome Accepted | implementação testada, diferenças resolvidas/aceitas, método de validação definido, release registrado, resultado validado ou agendado | **Thiago** |

### Ready Gate — exatamente 9 itens (§7.4 do canônico)

problema/usuário/outcome · input original ou link · scope e non-goals · owner/reviewer/approver · prioridade e prazo/checkpoint · critérios de aceitação · dependências, dados e riscos · links canônicos · decisão necessária marcada.

**Trabalho sem owner, critério de aceitação ou capacidade não começa.**

### Limites de WIP

Aline ≤ 2 substanciais em `In Progress` + 1 em revisão · João ≤ 2 mudanças de sistema simultâneas · Expedite: 1 item do Studio por vez, autorizado por Thiago ou incidente real.

## Naming e lifecycle

- Formato: `[Produto]_[Tipo]_[Nome]_[Status]_vX.Y` quando o sistema não oferece metadados próprios.
- Datas: `YYYY-MM-DD`.
- Prefixos de ID comuns: `DR-` decision record · `RS-` research · `DS-` design system · `AI-` ativo de IA · `SRC-` source/component · `DEBT-` design debt.
- **Nunca usar "FINAL" no nome** — status e lifecycle resolvem isso.
- Arquivo sem owner, status ou última revisão é candidato a quarentena — marcado, não apagado.

## Classificação de dados para uso em IA

| Classe | Exemplo | Uso em IA externa |
|---|---|---|
| Public | site público, material publicado | permitido com revisão normal |
| Internal | SOP, roadmap não sensível | somente conta corporativa aprovada |
| Confidential | pesquisa identificável, contratos, estratégia | apenas ambiente aprovado, mínimo necessário |
| Restricted | credenciais, segredos, dados pessoais/sensíveis, produção | **proibido** sem autorização e controle específico |

Em dúvida, tratar como classe superior e escalar. Nunca colar credenciais/segredos em uma sessão de IA.

## Decisões abertas controladas (§28 do canônico) — IMPORTANTE

Diferente do que uma leitura só do START_HERE sugere, o canônico v1.0.0 já traz o texto completo das seis decisões abertas, e é explícito: **nenhuma delas bloqueia a adoção da v1.**

1. Qual stack e tooling do Design Engineering Workspace melhor se encaixam no produto atual?
2. Quem é o backup admin nominal de cada sistema corporativo?
3. Quais três telas/fluxos formam o primeiro piloto LogixSphere?
4. Quais métricas de produto estão tecnicamente disponíveis para outcome validation?
5. Qual janela de retenção/migração será usada para componentes deprecated?
6. Quais políticas corporativas externas complementam dados, backup e procurement?

Processo declarado: Gabriel cria os tickets de decisão; João reúne evidência; os owners decidem conforme o RACI (§6.2). **Não inventar respostas dentro do documento.**

Vários desses itens também aparecem no "Registro de lacunas abertas" do START_HERE (que usa SLA D2/D3 e prazos estimados). Ao gerar ou atualizar um plano de ação (Fluxo A da skill), trate as duas listas como a mesma realidade vista de dois ângulos — o §28 é a decisão de fundo, o registro do START_HERE é o rastreamento operacional dela — e não as duplique como se fossem pendências independentes.

## Princípio central que rege lacunas

Uma lacuna registrada com owner e prazo é trabalho honesto. Uma suposição registrada como fato vira dívida que alguém vai acreditar meses depois. **Nunca preencher `⬜ LACUNA` com suposição** — isso vale tanto para humanos quanto para esta skill.

## Outros documentos do Studio que podem estar no Projeto

Além do canônico e do START_HERE, o Projeto pode conter um conjunto operacional mais enxuto, derivado deles:

- `1_MISSAO.md` — rascunho de Thiago com a missão, os dois produtos (LogixSphere, BA Express) e a divisão de responsabilidade em uma página; é insumo para o plano de execução do Gabriel, não o plano em si.
- `claude/Plano_de_Acao_GDS_v1.md` e `claude/Passo_a_Passo_Execucao_GDS_v1.md` — um plano de ação e seu desdobramento em passo a passo, já gerados anteriormente com esta skill a partir do START_HERE v0.1 (datados de 18/08/2026, portanto **anteriores** à baseline canônica v1.0.0 de 19/08). Trate-os como a versão anterior do Fluxo A ao invés de recriar do zero: confira o que já foi marcado como resolvido, e atualize via diff — especialmente a análise da "decisão aberta 1", que esses documentos tratavam como texto desconhecido do §28 e que agora é conhecido (ver seção acima).
