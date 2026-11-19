---
name: group-design-studio
description: "Ajuda a operar o Group Design Studio OS (o 'Studio OS' de Design do grupo — docs como o START_HERE e o canônico). Gera e atualiza planos de ação a partir de lacunas (⬜ LACUNA) e decisões abertas em docs do Studio; verifica se um ticket/artefato passa no Ready Gate e nos Gates 1-4; identifica em qual sistema (Jira, Figma, Drive, GitHub, produto) um ativo deve viver como fonte canônica; valida nomenclatura de arquivos/versões; e roteia uma pergunta/decisão pra pessoa certa com a classe de escalation (D0-D3/Incidente) e o SLA. Use sempre que o usuário mencionar Group Design Studio, GDS, Studio OS, START_HERE, lacunas, fontes canônicas, Ready Gate, quality gates, 'quem perguntar sobre isso', ou pedir pra organizar pendências/plano de ação desse Studio — mesmo sem esses termos exatos, por exemplo colar um trecho do doc e pedir 'organiza isso' ou 'o que falta aqui'."
---

# Group Design Studio — Skill de apoio operacional

Esta skill existe porque o Studio OS do grupo é um sistema vivo: um documento de governança (`Group_Design_Studio_OS_v1_CANONICAL.md`) e seu esqueleto de operação (`00_START_HERE`) definem papéis, fontes canônicas, gates de qualidade e regras de nomenclatura — e esses documentos vão sendo preenchidos aos poucos, com lacunas (`⬜ LACUNA`) explicitamente marcadas em vez de escondidas. O trabalho desta skill é ajudar alguém a operar dentro dessas regras sem reinventá-las a cada pergunta, e sem nunca inventar uma resposta que o documento-fonte não dá.

**Regra de ouro que atravessa todos os fluxos abaixo:** se a informação não está declarada na fonte, a resposta correta é sinalizar a lacuna (owner sugerido + prazo, se possível) — nunca supor um valor e apresentá-lo como fato. Isso é um princípio explícito do próprio Studio OS (§ do START_HERE: "Lacuna registrada com owner e prazo é trabalho honesto; suposição registrada como fato vira dívida que alguém vai acreditar daqui a seis meses").

A mesma regra vale quando a ambiguidade não está no documento do Studio, mas no material que o próprio usuário forneceu — por exemplo, um ticket colado que diz "owner sou eu" sem deixar claro quem é "eu" no contexto, ou um nome de pessoa que não bate com nenhum papel conhecido. Não infira silenciosamente; aponte a ambiguidade como parte da resposta e diga o que precisa ser confirmado.

## Antes de qualquer fluxo: busque a fonte mais atual

Os documentos do Studio evoluem — uma lacuna registrada hoje pode já ter sido preenchida na próxima revisão. Antes de aplicar qualquer fluxo abaixo:

1. Se o usuário colou ou anexou o conteúdo do documento na conversa, use isso diretamente — é a versão mais atual que ele tem em mãos.
2. Se a sessão está anexada a um Projeto do Claude com docs do Studio (ex.: `00_START_HERE...md`, o canônico, planos de ação anteriores), use `project_search`/`project_read` para pegar a versão vigente em vez de confiar em memória de uma leitura anterior nesta conversa.
3. Só recorra a `references/studio_os_reference.md` (nesta skill) como fallback rápido de estrutura geral — ele é um retrato de uma versão específica do documento e pode estar desatualizado em relação aos detalhes finos (prazos, links, nomes). Nunca o cite como se fosse a fonte canônica.

**O canônico e o START_HERE podem estar em versões diferentes ao mesmo tempo** — já aconteceu neste Studio (canônico virou v1.0.0 com o texto completo do §28, enquanto o START_HERE continuava no esqueleto v0.1 sem esse detalhe). Não assuma que os dois documentos dizem a mesma coisa só porque um deriva do outro; leia ambos quando a pergunta tocar em decisões abertas, papéis nomeados ou aprovadores de gate, e sinalize explicitamente se encontrar uma divergência entre eles (o canônico prevalece, mas a divergência em si é informação útil para quem pergunta).

Se, mesmo depois disso, faltar informação para responder com segurança, isso *é* o resultado esperado em um sistema que prefere lacunas honestas a suposições — trate como tal.

## Fluxos suportados

Identifique qual fluxo o pedido do usuário mais se parece com, e siga a seção correspondente. Um mesmo pedido pode combinar mais de um fluxo (ex.: "revisa esse ticket" pode acionar tanto o Ready Gate quanto a checagem de fonte canônica).

### A. Gerar ou atualizar um plano de ação a partir de lacunas

Gatilhos típicos: "monta o plano de ação", "o que falta nesse documento", "organiza essas pendências", colar um trecho com `⬜ LACUNA`.

1. Extraia todas as ocorrências de `⬜ LACUNA`, "decisão aberta" e qualquer tabela tipo "Registro de lacunas abertas" do documento-fonte. Para cada item, capture: descrição, seção de origem, owner (se declarado), o que bloqueia, e prazo/SLA declarado.
2. Classifique por urgência, nesta ordem de prioridade quando houver conflito ou sobreposição: (a) prazo explícito em data, (b) classe de SLA (D0 mesmo dia útil, D1 2 dias, D2 3 dias, D3 5 dias, Incidente imediato — ver tabela de escalation no documento), (c) marco relativo tipo "Semana 2", (d) "contínuo".
3. Quando um SLA (D0-D3) não tiver uma data-base declarada (a partir de quando os dias úteis contam), **não calcule uma data como se fosse oficial** — apresente como estimativa e marque "a confirmar com quem cobra o SLA" (normalmente o PM/control tower do Studio).
4. Monte o plano com esta estrutura (adapte nomes de seção ao vocabulário do documento-fonte, mas mantenha a lógica):
   - Resumo executivo (1 parágrafo: quantas lacunas, qual é o maior gargalo estrutural).
   - Mapa consolidado de lacunas (tabela: # · lacuna · seção · owner · bloqueia · prazo).
   - Plano por fase (uma seção por janela de prazo, com tabela ação/responsável/dependência).
   - Riscos e dependências (aponte explicitamente quando uma lacuna bloqueia outra — ex.: um link não pode ser publicado se depende de uma decisão ainda não tomada).
   - Próximos passos imediatos (3-5 ações concretas para a próxima janela de trabalho).
5. Veja `references/action_plan_example.md` para um plano real já produzido nesse formato — use como referência de tom e nível de detalhe, não como template a copiar literalmente (cada documento tem lacunas diferentes). **Atenção:** esse exemplo foi gerado a partir do START_HERE v0.1 (18/08), antes de o canônico virar v1.0.0 (19/08) com o texto completo do §28 — ao usá-lo como referência de formato, não repita a afirmação de que a "decisão aberta 1" tem conteúdo desconhecido; hoje ela é conhecida (ver `references/studio_os_reference.md`, seção "Decisões abertas controladas").
6. Se o documento já tiver um plano de ação anterior (ex.: `claude/Plano_de_Acao_GDS_v1.md` ou `claude/Passo_a_Passo_Execucao_GDS_v1.md` salvos no Projeto), trate a atualização como um diff: o que foi resolvido, o que continua aberto, o que é novo — não reescreva do zero silenciosamente. Quando o plano anterior for mais velho que a revisão mais recente do canônico, verifique especificamente se alguma "decisão aberta" que ele tratava como desconhecida já tem texto completo na versão atual — isso muda a fase/prioridade do item, não só o texto.

### B. Checar Ready Gate e Gates 1-4

Gatilhos típicos: "esse ticket tá pronto pra começar?", "isso passa no Design Review?", "confere se tá pronto pra dev".

1. Releia no documento-fonte a lista de itens do "Ready Gate" (9 itens no canônico §7.4: problema/usuário/outcome, input original ou link, escopo e non-goals, owner/reviewer/approver, prioridade e prazo, critérios de aceitação, dependências/dados/riscos, links canônicos, decisão necessária marcada) e a tabela dos 4 gates do workflow (Ready to Start, Design Approved, Ready for Dev, Release & Outcome Accepted), com quem aprova cada um.
2. Compare o material que o usuário forneceu (descrição do ticket, link, texto colado) item a item contra a lista.
3. Responda com uma checklist explícita: o que está presente, o que falta, e quem precisa agir para fechar o que falta (o aprovador de cada gate está definido no documento — não adivinhe quem aprova).
4. Não decida por conta própria se algo "passa" quando a informação for ambígua — aponte a ambiguidade e para quem ela deveria ser levada (normalmente o aprovador do gate em questão).
5. Se o pedido usar vocabulário de status de board (ex.: uma coluna do Jira chamada "Design Review") em vez do nome do gate (ex.: "Gate 2 — Design Approved"), trate-os como a mesma aprovação sempre que o documento-fonte deixar isso implícito pelo fluxo declarado — mas diga isso explicitamente na resposta, para que o usuário veja a ponte entre os dois vocabulários em vez de ter que inferir sozinho.

### C. Identificar a fonte canônica correta de um ativo

Gatilhos típicos: "onde eu devo guardar isso", "esse research vai pro Drive ou pro Jira", "posso versionar isso no GitHub".

1. Use a tabela "Mapa das fontes canônicas" do documento-fonte (sistema → é canônico para → não é canônico para).
2. Dado o tipo de ativo que o usuário descreve, aponte o sistema correto e, se ele estiver prestes a colocar algo no lugar errado, avise explicitamente citando a coluna "não é canônico para".
3. Lembre que um ativo tem **uma** fonte canônica — as outras ferramentas guardam link, não cópia viva. Se o usuário está duplicando conteúdo em vez de linkar, sinalize isso.

### D. Validar nomenclatura

Gatilhos típicos: "esse nome de arquivo tá certo", "como eu nomeio essa versão".

1. Confira contra o formato declarado no documento-fonte (tipicamente `[Produto]_[Tipo]_[Nome]_[Status]_vX.Y`, datas em `YYYY-MM-DD`, e prefixos de ID como `DR-`, `RS-`, `DS-`, `AI-`, `SRC-`, `DEBT-` quando aplicável).
2. Nunca aprove um nome contendo "FINAL" — o próprio sistema usa status e versão para resolver isso, não uma palavra no nome.
3. Se faltar produto, conteúdo ou status identificável no nome, aponte que o arquivo é candidato a ficar sem rastreabilidade (o documento trata isso como "candidato a quarentena": marcado, não apagado).

### E. Rotear uma pergunta ou classificar uma escalation

Gatilhos típicos: "quem eu pergunto sobre isso", "isso precisa ir pro Thiago?", "quanto tempo eu tenho pra resposta".

1. Use a tabela de papéis/owns (§3 do tipo de documento) e a tabela "quem perguntar sobre o quê" para apontar a pessoa certa — e o backup, se estiver declarado (muitas vezes esse é o próprio tipo de lacuna que o Fluxo A capturaria).
2. Classifique a decisão na classe de escalation correta (D0 operacional, D1 profissional, D2 cross-functional, D3 estratégico, Incidente) usando os exemplos do documento como guia de calibração, e informe o SLA e quem decide.
3. Lembre a regra explícita do sistema quando relevante: silêncio não é aprovação em D2/D3.

## Convenções de saída

- Responda no idioma em que o documento-fonte e o usuário estão trabalhando (normalmente português do Brasil neste Studio).
- Use tabelas quando a resposta for genuinamente multifacetada (várias lacunas, vários owners, vários prazos) — é isso que o princípio "governança mínima, continuidade máxima" pede: clareza rápida para quem chega depois, não prosa longa.
- Quando o pedido tocar em mudar as próprias regras do Studio OS (não apenas preencher uma lacuna de conteúdo), lembre que a mudança segue o fluxo próprio do documento: geralmente o steward do sistema propõe e o sponsor aprova — não decida a mudança de regra sozinho(a).
- Nunca cole segredos, credenciais ou dados classificados como "Restricted" em nenhuma saída desta skill.

## Referências

- `references/studio_os_reference.md` — retrato rápido da estrutura do Studio OS (papéis nomeados, fontes canônicas, gates, naming, segurança, SLA, decisões abertas do §28) capturado a partir do canônico **v1.0.0** (19/08/2026), cruzado com o `00_START_HERE` v0.1 (17/08/2026). Use como fallback de orientação geral, **nunca** como substituto de ler a versão atual do documento.
- `references/action_plan_example.md` — um plano de ação real já produzido com esta skill (18/08/2026, a partir do START_HERE v0.1), útil como referência de formato para o Fluxo A. Gerado **antes** de o canônico virar v1.0.0 — ver ressalva no Fluxo A, passo 5.
