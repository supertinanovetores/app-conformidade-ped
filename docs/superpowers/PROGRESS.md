# Progresso da implementação — App Conformidade P&D

Última atualização: 2026-06-08

- **Branch:** `feat/frontend-mock`
- **Spec:** `docs/superpowers/specs/2026-05-29-app-conformidade-ped-design.md`
- **Plano:** `docs/superpowers/plans/2026-05-29-app-conformidade-ped.md`
- Execução **inline** (não via subagentes). Portões de verificação (`tsc` + testes) rodados entre unidades.

## ⚠️ Gotcha do ambiente (importante)

O caminho do projeto contém `&`, o que **quebra os shims `.cmd`** do npm/npx no Windows (cmd corta o path no `&`). **Não use** `npx`, `npm run test`, `npm run build`, `tsc -b`. Use o `node` direto, a partir do diretório do repo:

- Testes: `node ./node_modules/vitest/vitest.mjs run`
- Typecheck: `node ./node_modules/typescript/bin/tsc --noEmit`
- Build: `node ./node_modules/vite/bin/vite.js build`
- Dev: `node ./node_modules/vite/bin/vite.js`

(`npm install` funciona normal.)

## Estado atual

**Frontend mock completo e verde.** `tsc --noEmit` limpo, build OK e **64 testes passando** (15 arquivos). Todas as telas, componentes e a camada de lógica estão implementados; os dados vivem no `localStorage` (sem backend ainda).

## Status por unidade

| Unidade | Plano | Status |
|---|---|---|
| U1: Scaffold + tokens + CSS | Tasks 1-3 | ✅ feito |
| U2: Tipos e constantes | Task 4 | ✅ feito |
| U3: Camada de lógica (TDD) | Tasks 5-9 | ✅ feito |
| U4: Seed + CardsContext | Tasks 10-11 | ✅ feito |
| U5: Componentes base | Tasks 12-13 | ✅ feito |
| U6: Shell + Sidebar + Painel | Tasks 14-15 | ✅ feito |
| U7: CardItem + lista/filtros | Tasks 16-17 | ✅ feito |
| U8: Fluxo/etapas (modal detalhe) | Task 18 | ✅ feito |
| U9: Verificação + review | Task 19 | ✅ feito |

## Polimento pós-MVP (antes do backend)

Itens trabalhados em 2026-06-08, todos via TDD:

- ✅ **#4 Acessibilidade do `Modal`** — focus trap (Tab/Shift+Tab circulam dentro do modal), restauração de foco ao elemento que abriu, e `aria-labelledby` ligando o diálogo ao título. (`components/Modal.tsx`, `Modal.test.tsx`)
- ✅ **#5 Validação inline no `CardModal`** — campos obrigatórios (título/categoria/fase) marcados em vermelho com mensagem "Campo obrigatório" e limpeza do erro ao corrigir, no lugar do toast genérico. (`screens/Testes.tsx`, `screens/CardModal.test.tsx`, chave i18n `cardModal.campoObrigatorio`)
- ✅ **#8 Error boundary** — `ErrorBoundary` envolve as rotas em `App.tsx`; um erro de render mostra fallback traduzido com botão "Recarregar" sem derrubar o shell. (`components/ErrorBoundary.tsx`, `ErrorBoundary.test.tsx`, chaves i18n `erro.*`)
- ✅ **#6** — este arquivo atualizado.

### Itens propostos e ainda não feitos (candidatos antes/junto do backend)

- ⬜ **#1 Camada de dados async-ready** — tornar a interface do `CardsContext` assíncrona (Promise + estados de loading/erro) para a troca por API ser trivial.
- ⬜ **#2 Contrato da API** — desenhar endpoints/DTOs (`GET/POST/PATCH/DELETE /cards`, `/log`).
- ⬜ **#3 Estados de loading / erro / vazio** nas telas.
- ⬜ **#7 Testes de integração das screens** (`Painel`, `Log`; `Testes` já tem teste do `CardModal`).

## Próximo passo

Seguir para o **backend** (bloco #1 + #2 + #3 acima são a costura recomendada antes/junto da API).
