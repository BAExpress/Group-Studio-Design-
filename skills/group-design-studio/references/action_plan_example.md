# Plano de Ação — Group Design Studio (baseado no 00_START_HERE v0.1)

**Baseado em:** `00_START_HERE_GDS_v1_ESQUELETO.md` (Status: ESQUELETO — v0.1)
**Data do plano:** 18/08/2026
**Preparado por:** IA, a pedido de João Marcelo Santos (System/Record Steward)
**Aprovador sugerido:** Thiago Brito, conforme §20 do canônico (mudanças no Studio OS: João propõe → Thiago aprova)

> Este plano organiza, por urgência, todas as lacunas (`⬜ LACUNA`) e decisões abertas já registradas no documento. **Não inventa prazos, owners ou respostas onde o documento não os define** — nesses casos, a ação listada é "definir/confirmar", não "executar", e isso está sinalizado explicitamente abaixo.

---

## 1. Resumo executivo

O `00_START_HERE` está formalmente estruturado (missão, papéis, workflow, naming, segurança e onboarding já preenchidos), mas **8 lacunas de conteúdo** e **2 decisões abertas citadas no §28 do canônico** ainda travam a operação prática do Studio — a mais crítica sendo o acesso às próprias fontes canônicas (Jira, Figma, Drive, GitHub), sem o qual nenhuma pessoa nova consegue passar no teste de continuidade do §1. O plano abaixo agrupa essas pendências em 5 fases por prazo, identifica quem trava o quê, e aponta os dois pontos que precisam de decisão do Thiago antes que outras tarefas possam avançar.

---

## 2. Mapa consolidado de lacunas

| # | Lacuna | Seção de origem | Owner | Bloqueia | Prazo declarado |
|---|---|---|---|---|---|
| 1 | Links de Jira, Figma, Drive, GitHub | §4 | Gabriel / Aline / João / Dev | Onboarding de qualquer pessoa nova | **21/08/2026** |
| 2 | Backup admin nominal por sistema | §7, §16.2 | Thiago decide · João registra | Continuidade real | **SLA D3** |
| 3 | Backups de "quem perguntar sobre o quê" | §10 | Thiago | Continuidade em férias/ausência | **SLA D3** |
| 4 | Termos de logística no glossário | §9 | João levanta · Thiago valida | Compreensão de quem entra | Contínuo |
| 5 | Stack do Design Engineering Workspace | §15 (via registro) | João + Dev, consultado Thiago | Pasta GitHub e §15 | **SLA D2** |
| 6 | Três telas/fluxos do piloto LogixSphere | Registro de lacunas | Thiago, consultada Aline | A Semana 2 inteira | **SLA D3** |
| 7 | Account & Access Register | §4 | João | Confirmação de acessos com MFA (checklist §8) | 21/08/2026 |
| 8 | Source & Component Registry | §4 | João | Reuso de componentes (princípio 8) | Semana 2 |
| 9 | AI Library | §4 | João | Institucionalização de prompts/ativos de IA | Semana 2+ |
| — | Decisão aberta 1 (§28, não incluída neste esqueleto) | §4 | Não definido no esqueleto | Link e estrutura do GitHub | Não declarado |

**Observação:** o item 4 do registro oficial ("Links de Jira, Figma, Drive, GitHub") tem prazo único de 21/08 na tabela consolidada do documento, mas o link de Figma isoladamente aparece em §4 com prazo `⬜ LACUNA` (não definido). Trato o prazo de 21/08 como o vigente por vir da tabela mais recente ("Registro de lacunas abertas"), mas isso vale **confirmação explícita com Aline**, não suposição.

---

## 3. Plano por fase

### Fase 0 — Decisões que destravam tudo o mais (esta semana, idealmente antes de 21/08)

| Ação | Responsável | Observação |
|---|---|---|
| Localizar/obter o §28 do `Group_Design_Studio_OS_v1_CANONICAL.md` para ler o texto completo da "decisão aberta 1" (estrutura GitHub) | João | Este esqueleto não traz o conteúdo do §28 — sem ele, não dá para saber o que exatamente falta decidir sobre o GitHub. |
| Definir data-limite para a "decisão aberta 1" | Thiago (classe D3, autoridade estratégica) | Hoje não há prazo declarado; isso deveria ser corrigido no próprio registro de lacunas. |

### Fase 1 — Prazo declarado: 21/08/2026 (sexta-feira, 3 dias úteis a partir de hoje)

| Ação | Responsável | Depende de |
|---|---|---|
| Publicar link do Jira do Studio | Gabriel | — |
| Publicar link do Figma "Group Design Studio" | Aline | Confirmar se 21/08 vale para este item (ver observação acima) |
| Publicar link raiz do Google Shared Drive | João | — |
| Criar e publicar o Account & Access Register | João | Levantamento de quem já tem acesso a Drive/Jira/Figma/GitHub com MFA ativo |
| Publicar link do GitHub (org/repo do Studio) | Dev + João | **Bloqueado pela decisão aberta 1 (Fase 0)** — sinalizar risco de não cumprir 21/08 se a decisão não sair antes |

**Risco identificado:** o item GitHub desta fase tem dependência direta da Fase 0. Se a decisão aberta 1 não for resolvida a tempo, recomenda-se registrar formalmente o atraso (com nova data) em vez de deixar o prazo estourar em silêncio — consistente com a regra do §3 de que silêncio não é aprovação em D2/D3.

### Fase 2 — SLA D2 (estimado: até 21/08/2026, a confirmar)

| Ação | Responsável | Observação |
|---|---|---|
| Definir o stack do Design Engineering Workspace | João + Dev, consultado Thiago | Diretamente ligado à Fase 0/1 (GitHub); recomenda-se resolver em conjunto |

> Prazo "SLA D2" = 3 dias úteis conforme §3, mas o documento não declara a partir de quando a contagem começou. Estimativa calculada a partir da última revisão (17/08/2026) — **a confirmar com Gabriel**, que é quem cobra o SLA.

### Fase 3 — SLA D3 (estimado: até 24/08/2026, a confirmar)

| Ação | Responsável | Prioridade |
|---|---|---|
| Definir as três telas/fluxos do piloto LogixSphere | Thiago, consultada Aline | **Alta** — mesmo sendo classe D3, este item bloqueia a Semana 2 inteira do Studio, não apenas uma tarefa pontual |
| Decidir e nomear backup admin de cada sistema | Thiago decide · João registra | Depende só de decisão do Thiago; sem dependências técnicas |
| Definir backups de "quem perguntar sobre o quê" (§10) | Thiago | Pode ser resolvido junto com o item anterior — é a mesma decisão aplicada a dois registros diferentes |

Mesma ressalva do prazo SLA D3: estimativa a partir de 17/08, a confirmar com Gabriel.

### Fase 4 — Semana 2 (24–28/08/2026, estimado)

| Ação | Responsável |
|---|---|
| Criar o Source & Component Registry | João |
| Fechar a estrutura do GitHub (pasta/repo) usando a decisão da Fase 0 e o stack da Fase 2 | João + Dev |

### Fase 5 — Semana 2+ / Contínuo

| Ação | Responsável | Cadência |
|---|---|---|
| Estruturar a AI Library | João | Início na Semana 2, sem prazo final declarado |
| Levantar termos de logística para o glossário | João levanta · Thiago valida | Contínuo, conforme os termos aparecem — **não inventar definição de negócio sem validação do Thiago** (regra explícita do documento) |

---

## 4. Dependências e riscos a destacar

- **Decisão aberta 1 (§28) é o maior gargalo estrutural**: ela trava o link do GitHub (Fase 1), o stack do Design Engineering Workspace (Fase 2) e, por consequência, o Source & Component Registry (Fase 4). Vale a pena o João levar isso ao Thiago como prioridade antes mesmo do prazo geral de 21/08.
- **Item 6 (telas do piloto LogixSphere)** está classificado como SLA D3 no registro, mas sua consequência ("bloqueia a Semana 2 inteira") é desproporcional à prioridade formal — recomenda-se tratar como quase-D3-crítico, cobrado por Gabriel assim que o SLA vencer, sem esperar o lembrete único de cortesia se o impacto for iminente.
- **Prazo do link do Figma** está inconsistente entre §4 (sem prazo) e o registro consolidado (21/08). Isso é o tipo de pequena divergência que, pelo próprio princípio do documento, deveria virar uma lacuna registrada — não uma suposição silenciosa.
- **Backups nominais (#2 e #3)** dependem exclusivamente de uma decisão do Thiago, sem bloqueios técnicos — são o item de menor esforço e maior alavancagem: resolver isso primeiro destrava dois itens do registro de uma vez.

---

## 5. Próximos passos imediatos (esta semana)

1. João leva ao Thiago, em conjunto: (a) o texto do §28 sobre a decisão do GitHub, e (b) a decisão de backups nominais — ambas cabem na mesma conversa e destravam a maior parte do plano.
2. Gabriel, Aline, João e Dev publicam os links das respectivas fontes (Jira, Figma, Drive) até 21/08, independentemente do GitHub.
3. João monta o Account & Access Register em paralelo, aproveitando o levantamento de acessos que já precisa fazer para os links.
4. Gabriel confirma as datas reais de início de contagem dos SLAs D2 e D3, para que as estimativas deste plano virem prazos oficiais.
5. Aline e Thiago agendam a definição das três telas/fluxos do piloto LogixSphere o quanto antes, dado o impacto na Semana 2 inteira.

---

**Nota de processo:** este plano é derivado do `00_START_HERE_GDS_v1_ESQUELETO.md` e não substitui o registro oficial de lacunas do documento-mãe. Qualquer prazo aqui marcado como "estimado" ou "a confirmar" deve ser validado por Gabriel (SLAs) ou Thiago (decisões estratégicas) antes de virar compromisso formal.
