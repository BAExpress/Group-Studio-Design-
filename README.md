# Group Design Studio — Design Engineering Workspace

Design Engineering Workspace for Group Design Studio — shared design system, governed prototypes (LogixSphere + BA Express), and design-to-dev handoff for the studio.

> Este repositório é a camada canônica de **código** do Group Design Studio (ver `Group_Design_Studio_OS_v1_CANONICAL.md` §5 e §15). Jira é canônico para trabalho, Figma para design, Google Shared Drive para conhecimento/governança. Este GitHub é canônico para código, protótipos versionados, tokens implementados e documentação junto ao código.

## Stack técnico (decidido — DR-GDS-001, 2026-08-20)

| Produto | Stack | Status |
|---|---|---|
| **LogixSphere** (`prototypes/logixsphere`, `design-system/`) | Vite + React + TypeScript + Tailwind CSS + Radix UI/shadcn (componentes copiados, não dependência fechada) + Storybook | Accepted — segue a stack de produção atual do LogixSphere |
| **BA Express** (`prototypes/ba-express`) | Tokens compartilhados com o LogixSphere, sem framework de aplicação por trás (Astro ou HTML/Tailwind estático — formato exato a confirmar no primeiro trabalho real) | Accepted em princípio (Hipótese D) — formato final aberto |

Justificativa completa, alternativas descartadas e critérios de avaliação: ver `DR-GDS-001_Stack_Tecnico_Design_Engineering_Workspace.md` no Shared Drive do Studio (`01_Governance`).

## Estrutura do repositório

```text
group-design-studio/
├── README.md                         # este arquivo
├── CLAUDE.md                         # instruções operacionais para agentes de IA neste repo
├── .gitignore
├── governance/
│   └── PAPEIS_E_RACI.md              # papéis e matriz RACI (espelha o canônico §6)
├── references/                       # Source & Component Registry local (licenças, avaliação técnica)
├── components/
│   ├── experimental/                 # protótipos e ideias — nunca parecem produção
│   └── approved/                     # componentes revisados e aprovados
├── prototypes/
│   ├── logixsphere/                  # protótipos funcionais do produto LogixSphere
│   ├── ba-express/                   # protótipos de marca/comunicação da BA Express
│   └── experiments/                  # explorações pontuais, claramente descartáveis
├── design-system/
│   ├── tokens/                       # tokens (Style Dictionary), fonte única para ambos os produtos
│   ├── foundations/                  # cor, tipografia, spacing, grid, elevation, motion
│   ├── components/                   # componentes documentados (anatomy, variants, states)
│   └── patterns/                     # combinações para tarefas recorrentes
├── prompts/                          # Prompt Library institucional (ver canônico §14)
├── evaluations/                      # Evaluation Library de prompts/agentes
├── templates/
│   └── DESIGN_ENGINEERING_TASK.md    # template de tarefa (canônico §15.4)
└── archive/                          # protótipos rejeitados ou descontinuados (read-only)
```

Cada pasta tem um `README.md` próprio explicando seu propósito específico e citando a seção correspondente do canônico.

## Regras essenciais

- Código gerado neste repositório **não é production-ready por padrão** — protótipos e experimentos vivem em `components/experimental/` e `prototypes/`, nunca são promovidos automaticamente.
- Reaproveitar antes de criar: consultar `references/` e `design-system/` antes de adicionar um componente ou dependência nova.
- Nenhuma dependência entra sem documentar fonte, licença e impacto (ver `references/README.md`).
- Não editar código de produção a partir deste repositório sem autorização explícita da Engenharia.
- Ver `CLAUDE.md` para as instruções que qualquer agente de IA (Claude Code ou outro) deve seguir ao operar neste repositório.

## Papéis e ownership

Ver `governance/PAPEIS_E_RACI.md` para a matriz completa. Resumo: João Marcelo é o steward deste Workspace e do repositório; Aline é quality owner do Design System e dos protótipos; Dev é accountable pela arquitetura de produção e pelo código do Design System; Gabriel controla capacidade/prazo; Thiago é accountable pela visão e por mudanças materiais de produto/marca.

## Links

- Studio OS canônico: `Group_Design_Studio_OS_v1_CANONICAL.md` (Shared Drive, `00_START_HERE`)
- Decisão de stack: `DR-GDS-001_Stack_Tecnico_Design_Engineering_Workspace.md`
- Mapa do Shared Drive: `Mapa_Google_Drive_BA_Express.md`
