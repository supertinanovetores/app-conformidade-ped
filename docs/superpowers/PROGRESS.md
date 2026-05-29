# Progresso da implementação — App Conformidade P&D

Última atualização: 2026-05-29

- **Branch:** `feat/frontend-mock`
- **Spec:** `docs/superpowers/specs/2026-05-29-app-conformidade-ped-design.md`
- **Plano:** `docs/superpowers/plans/2026-05-29-app-conformidade-ped.md`
- Execução **inline** (não via subagentes) por causa de instabilidade de socket; portões de verificação (`tsc` + testes) rodados entre unidades. Revisão de código independente prevista para o fim (U9).

## ⚠️ Gotcha do ambiente (importante)

O caminho do projeto contém `&`, o que **quebra os shims `.cmd`** do npm/npx no Windows (cmd corta o path no `&`). **Não use** `npx`, `npm run test`, `npm run build`, `tsc -b`. Use o `node` direto, a partir do diretório do repo:

- Testes: `node ./node_modules/vitest/vitest.mjs run`
- Typecheck: `node ./node_modules/typescript/bin/tsc --noEmit`
- Build: `node ./node_modules/vite/bin/vite.js build`
- Dev: `node ./node_modules/vite/bin/vite.js`

(`npm install` funciona normal.)

## Ajustes de scaffold já aplicados (diferenças vs. plano)

- Adicionado `src/vite-env.d.ts` (`/// <reference types="vite/client" />`) — sem ele o `tsc` falha nos imports de CSS.
- Removidas as project references do TS: deletado `tsconfig.node.json`, removido `"references"` de `tsconfig.json`, e `package.json` build virou `tsc --noEmit && vite build` (evita TS6310).
- Teste `derive.test.ts`: expectativa de `contarPor(...).materiaprima` corrigida para `4` (o `mk` usa categoria default `materiaprima`). Plano atualizado também.

## Status por unidade

| Unidade | Plano | Status |
|---|---|---|
| U1: Scaffold + tokens + CSS | Tasks 1-3 | ✅ feito |
| U2: Tipos e constantes | Task 4 | ✅ feito |
| U3: Camada de lógica (TDD) | Tasks 5-9 | ✅ feito (18 testes) |
| U4: Seed + CardsContext | Tasks 10-11 | ✅ feito |
| U5: Componentes base | Tasks 12-13 | ✅ feito (Modal test) |
| U6: Shell + Sidebar + Painel | Tasks 14-15 | ⬜ **PRÓXIMA** |
| U7: CardItem + Conformidade | Tasks 16-17 | ⬜ pendente |
| U8: Fluxograma | Task 18 | ⬜ pendente |
| U9: Verificação final + review | Task 19 | ⬜ pendente |

**Estado atual:** `tsc --noEmit` limpo e **20 testes passando** (6 arquivos). `src/App.tsx` ainda é o placeholder da Task 1.

## Como retomar (próximo passo = U6)

1. Implementar **U6** (plano Tasks 14-15): criar `src/components/Sidebar.tsx`, **substituir** `src/App.tsx` (rotas + shell), criar `src/screens/Painel.tsx`.
   - ⚠️ Ao substituir `App.tsx`, ele passa a importar `Conformidade` e `Fluxograma` (U7/U8) que ainda não existem → o `tsc` só fica verde após U8. Faça U6→U7→U8 antes do passe final de `tsc`. (Alternativa: comentar as rotas de Conformidade/Fluxograma temporariamente para validar U6 isolada.)
2. Implementar **U7** (Tasks 16-17): `src/components/CardItem.tsx` (+ teste) e `src/screens/Conformidade.tsx`.
3. Implementar **U8** (Task 18): `src/screens/Fluxograma.tsx`.
4. **U9** (Task 19): `node ./node_modules/typescript/bin/tsc --noEmit`, `node ./node_modules/vitest/vitest.mjs run`, `node ./node_modules/vite/bin/vite.js build`, smoke manual (`node ./node_modules/vite/bin/vite.js`), e revisão de código final.

Todo o código verbatim de cada unidade está no arquivo do plano. As tasks de tracking (#1-#9) refletem este mesmo mapeamento.
