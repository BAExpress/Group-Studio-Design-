# Design Engineering Task — GDS Verificação

```markdown
Problem/outcome: Ter uma página que verifique, de forma reproduzível, a construção do repositório, da skill group-design-studio e da estilização (tokens/contraste/componentes), tornando lacunas visíveis.
Repository/path/scope authorized: prototypes/experiments/gds-verificacao/ (somente). O scanner apenas lê o resto do repositório.
References and license status: Mesmas dependências do Route Balance (Radix UI MIT, lucide-react ISC, CVA/clsx/tailwind-merge MIT, Tailwind MIT, Vite MIT, React MIT; fontes Space Grotesk e IBM Plex Mono — OFL via Google Fonts). Registradas em references/SRC-001…016 (status Discovered, revisões pendentes).
Existing tokens/components to reuse: tokens --rb-* e primitivos ui/* de prototypes/logixsphere/route-balance/web (copiados).
Constraints: stack DR-GDS-001; WCAG 2.x AA para texto; sem segredos; sem rede além de Google Fonts.
Expected prototype/tests: página única (Resumo, Repositório, Skill, Estilização, Componentes); build com typecheck; smoke test em navegador (claro/escuro, 390px sem scroll horizontal, dialog/ESC, form).
Forbidden changes: design-system/ e components/approved/. Fora desta pasta, as únicas alterações autorizadas pelo solicitante ("corrija o que for necessário", 2026-11-19) foram: correção de contraste em route-balance/web/src/index.css, npm audit fix no lockfile de route-balance/server e criação dos Source/Component Records em references/.
Owner/reviewers: ⬜ LACUNA — steward sugerido: João Marcelo; reviewer de estilização: Aline.
Promotion path if successful: virar checagem de CI (scan-repo.mjs) e/ou página de documentação do design-system; decisão D1 (Aline) / D0 (João) para a parte de estrutura.
Evidence required: screenshots claro/escuro, saída do npm run scan, build verde.
```
