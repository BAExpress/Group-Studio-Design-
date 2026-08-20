# Group Design Studio — Instructions

Mission: criar e preservar Design reutilizável e de alta qualidade para LogixSphere e BA Express, como propriedade intelectual institucional — nunca dependente de uma pessoa específica.

## Canonical systems

- **Jira** = trabalho (owner, prioridade, status, prazo, dependências, aceitação)
- **Figma** = design (UX/UI, protótipos, libraries, variables, componentes)
- **Google Shared Drive** = knowledge (governança, SOPs, research, decisões, templates, AI Library)
- **GitHub (este repositório)** = code (Design Engineering Workspace, histórico, tokens implementados)

Este repositório não é fonte canônica de backlog nem de arquivos Figma. Ligue sempre Jira ↔ Figma ↔ Drive ↔ GitHub nos registros relevantes em vez de duplicar conteúdo.

## Stack (DR-GDS-001, Accepted em 2026-08-20)

- **LogixSphere:** Vite + React + TypeScript + Tailwind CSS + Radix UI/shadcn + Storybook — segue a tecnologia de produção atual do LogixSphere. Não proponha outro framework para `prototypes/logixsphere/` ou `design-system/` sem uma nova Decision Record substituindo esta.
- **BA Express:** stack leve, consumindo os mesmos tokens — formato exato ainda a confirmar.
- Componentes shadcn são copiados para dentro deste repositório (não é dependência de pacote fechada) — mantenha essa convenção para preservar `experimental/` vs `approved/`.

## Rules

- Do not overwrite approved assets without review.
- Reuse before creating — busque em `references/` e `design-system/` antes de propor algo novo.
- Separate experimental from approved — `components/experimental/` vs `components/approved/`; `prototypes/` nunca é `design-system/`.
- Do not add dependencies without documenting source, license and impact em `references/` (ver template de Source/Component Record no canônico §11.2).
- Never assume external assets are commercially reusable. "Grátis" não significa liberado para uso comercial.
- Generated code is not production-ready by default.
- Record material decisions; never expose secrets. Nada de credenciais, segredos ou dados `Confidential`/`Restricted` (canônico §16.1) neste repositório.
- Do not modify production code without explicit authorization — Engenharia decide arquitetura de produção; alterações de repositório de produção seguem processo próprio, fora deste Workspace.
- LogixSphere e BA Express têm Design Systems separados — não misturar tokens/componentes dos dois produtos sem decisão registrada.
- Toda tarefa de Design Engineering relevante deve preencher o template `templates/DESIGN_ENGINEERING_TASK.md` antes de começar.

## Usos autorizados (canônico §15.1)

- Protótipos funcionais e testes de interação.
- Experimentos responsivos e comparação de patterns.
- Documentação e tokens versionados.
- Avaliação técnica de fontes/componentes.
- Pequenas páginas e explorações separadas de produção.
- Automações e templates do Studio.

## Quando em dúvida

Escale conforme a matriz de decisão em `governance/PAPEIS_E_RACI.md`. Silêncio não é aprovação para decisões D2/D3 (canônico §21).
