# Design — Internacionalização (PT/EN) e Responsividade

**Data:** 2026-06-02
**Projeto:** Testes P&D (`app-conformidade-ped`)
**Autor:** Nicolas Bitencurt + Claude

## Objetivo

Adicionar duas capacidades ao app:

1. **Responsividade** — funcionar bem de ~360px (celular) até desktop, com a barra
   lateral virando um menu hambúrguer em telas estreitas.
2. **Internacionalização (i18n)** — alternar a interface entre **Português (PT-BR)** e
   **Inglês (EN-US)** através de dois botões de bandeira na barra lateral.

Sem dependências novas. Mantém o padrão de Context já usado no projeto
(`CardsContext`, `Toast`) e a estratégia de testes com Vitest.

---

## 1. Núcleo do i18n

### Módulo `src/i18n/`

| Arquivo | Papel |
|---|---|
| `i18n/types.ts` | `type Lang = 'pt' \| 'en'` e o tipo `Dict` (derivado do `pt`) |
| `i18n/pt.ts` | Dicionário português — **fonte da verdade das chaves** |
| `i18n/en.ts` | Dicionário inglês, tipado como `Dict` (chave faltante/sobrando = erro de `tsc`) |
| `i18n/LanguageContext.tsx` | `LanguageProvider` + hook `useI18n()` → `{ lang, setLang, t }` |

### Formato das chaves

Objeto **plano** com chaves namespaced por string, ex.: `'nav.testes'`,
`'painel.titulo'`, `'btn.novoCard'`, `'categoria.materiaprima'`, `'status.conforme'`.

O `t` é tipado: `t: (key: keyof Dict) => string`. Autocomplete e erro de digitação
de chave são pegos em tempo de compilação. O `Dict` é derivado de `pt` (ex.:
`type Dict = typeof pt`), e `en` é declarado `const en: Dict = { ... }`, de forma que
qualquer divergência de chaves quebra o `tsc`.

### Detecção + persistência (dentro do provider)

Ordem de resolução do idioma inicial:

1. Se há idioma salvo em `localStorage` (chave `nv-pd-lang`) e válido → usa ele.
2. Senão, se `navigator.language` começa com `en` → **inglês**.
3. Caso contrário → **português** (fallback).

`setLang(lang)`:
- atualiza o estado do provider,
- grava em `localStorage` (`nv-pd-lang`),
- atualiza `document.documentElement.lang`.

### Rótulos de domínio (categoria / fase / status / ordem)

Hoje os labels em PT vivem em `data/constants.ts`. Mudança:

- **Os valores/enums permanecem em `constants.ts`** (continuam sendo o que se grava nos
  cards e o que alimenta os `<select>`).
- **Os labels saem de `constants.ts` e vão para os dicionários**, keyed pelo valor:
  - categoria `materiaprima` → `t('categoria.materiaprima')`
  - status `conforme` → `t('status.conforme')`
  - fase `Desenvolvimento` → `t('fase.Desenvolvimento')`
  - ordem `recentes` → `t('ordem.recentes')`
- Componentes que hoje iteram pares `[valor, label]` passam a iterar **valores** e
  renderizar o label via `t(prefixo + valor)`.

**Invariante:** o dado gravado no card não muda de idioma — `fase` continua
`'Desenvolvimento'` no objeto persistido; apenas a **exibição** troca. Isso garante
que alternar idioma nunca corrompe dados existentes.

### Cards de exemplo (seed)

- Criar `src/data/seed.pt.ts` e `src/data/seed.en.ts` (derivados do `seed.ts` atual).
- No **primeiro acesso** (quando ainda não há cards salvos no `localStorage`), grava-se
  o seed **no idioma inicial detectado**.
- Depois de gravado, o seed vira dado do usuário e **não** muda ao alternar idioma —
  coerente com "conteúdo real nunca é traduzido automaticamente".
- `seed.ts` atual é substituído por um seletor que devolve `seedPt`/`seedEn` conforme o
  idioma. O ponto que decide o seed inicial (hoje no `CardsContext`/`storage`) recebe o
  idioma inicial resolvido pelo i18n.

### Log de auditoria

- As ações (`criou`/`editou`/`duplicou`/`excluiu`) e os rótulos de coluna da tabela são
  traduzidos **na exibição** (mapeando o enum `LogAcao` via `t`).
- O texto livre `detalhe` já gravado permanece como foi salvo (o histórico preserva o
  idioma da época em que a ação ocorreu).

---

## 2. Seletor de idioma (botões de bandeira)

Componente novo `src/components/LanguageSwitcher.tsx`, renderizado na `Sidebar`
**logo acima do bloco `.app-user`**:

```
┌─────────────────┐
│  [BR] [US]      │  ← LanguageSwitcher (bandeira ativa destacada)
├─────────────────┤
│ 👤 Nicolas       │
│    Sair          │
└─────────────────┘
```

- Dois botões com **ícones SVG** de bandeira: `public/assets/flag-br.svg` e
  `public/assets/flag-us.svg`. **Não usar emoji de bandeira** (🇧🇷/🇺🇸) — não renderiza
  no Windows/Chrome (aparece como "BR"/"US").
- A bandeira do idioma ativo fica em destaque (opacidade cheia + leve anel/contorno); a
  inativa fica esmaecida.
- Acessibilidade: cada botão com `aria-label` ("Português" / "English") e `aria-pressed`
  refletindo o idioma ativo.
- No mobile, como a sidebar inteira vira o menu deslizante, o seletor acompanha
  naturalmente — sem posicionamento extra.

---

## 3. Responsividade

**Breakpoint principal: `768px`.** Acima disso, o layout atual permanece intacto.
Abaixo dele:

### Navegação (menu hambúrguer)

- A `.app-sidebar` sai do fluxo (off-canvas, escondida à esquerda via `transform`).
- Uma **barra superior** aparece só no mobile dentro do `.app-content`, contendo o botão
  **☰** e o nome do app.
- Tocar no ☰ desliza a sidebar por cima, com um **backdrop** escurecido.
- Tocar no backdrop **ou** em um item de navegação fecha o menu.
- O estado `menuAberto` vive no `AppShell` (`App.tsx`) e é passado para a `Sidebar`
  (classe `.open`) e para o backdrop.

### Conteúdo que se adapta (`@media (max-width: 768px)`)

- `.app-header` (título + ações): `flex-wrap` — botões de ação quebram para baixo do título.
- `.contador` (4 contadores) e `.filtros`: empilham/quebram em vez de espremer.
- `.grid-cards`: ajustar o mínimo para `min(300px, 100%)` → 1 coluna sem estouro em 360px.
- **Painel:** gráficos (donut/barras) empilham verticalmente.
- **Log:** a tabela ganha rolagem horizontal (`overflow-x: auto`).
- **Modais:** `max-width: calc(100vw - 32px)` e altura com rolagem interna.
- Padding do `.app-content` reduz (24px → ~14px).

Tudo via `@media (max-width: 768px)` no `app.css` existente + a lógica de toggle do menu
no `AppShell`/`Sidebar`. Sem libs novas.

---

## 4. Testes (Vitest)

- **`i18n/LanguageContext.test.tsx`** — detecção (navegador EN→en, outro→pt),
  persistência (salva e relê do `localStorage`), `setLang` troca o `t`. Mock de
  `navigator.language` e `localStorage`.
- **`i18n/i18n-parity.test.ts`** — garante que `pt` e `en` têm exatamente o mesmo
  conjunto de chaves (rede de segurança além do `tsc`).
- **`components/LanguageSwitcher.test.tsx`** — clicar na bandeira chama `setLang`;
  bandeira ativa recebe `aria-pressed`.
- Os 42 testes existentes continuam passando. Onde um teste renderiza componente que
  passa a usar `useI18n`, envolver no `LanguageProvider` (ou helper de render comum).
- Responsividade é CSS — validação por **smoke manual** (redimensionar o navegador),
  não por teste automatizado.

---

## 5. Arquivos

**Novos:**
- `src/i18n/types.ts`, `src/i18n/pt.ts`, `src/i18n/en.ts`, `src/i18n/LanguageContext.tsx`
- `src/data/seed.pt.ts`, `src/data/seed.en.ts`
- `src/components/LanguageSwitcher.tsx`
- `public/assets/flag-br.svg`, `public/assets/flag-us.svg`
- `src/i18n/LanguageContext.test.tsx`, `src/i18n/i18n-parity.test.ts`,
  `src/components/LanguageSwitcher.test.tsx`

**Modificados:**
- `src/main.tsx` — envolver app no `LanguageProvider`
- `src/components/Sidebar.tsx` — `LanguageSwitcher` + textos via `t` + classe `.open`
- `src/App.tsx` — estado `menuAberto` + barra superior mobile (☰) + backdrop
- `src/data/constants.ts` — manter valores/enums, remover labels PT fixos
- `src/data/seed.ts` — vira seletor `seedPt`/`seedEn` (ou é substituído pelos dois novos)
- Telas/componentes com texto literal → `t(...)`: `Testes.tsx`, `Painel.tsx`, `Log.tsx`,
  `Login.tsx`, `CardItem.tsx`, `CardDetalheModal.tsx`, `ConfirmDialog.tsx`,
  `DuplicarDialog.tsx`, e os `toast(...)` espalhados
- `src/styles/app.css` — bloco `@media (max-width: 768px)` + estilos do switcher e do
  menu mobile

## 6. Ordem de implementação sugerida

1. Núcleo i18n + dicionários (`pt`/`en`) + `LanguageProvider` + testes do provider.
2. Refactor de `constants.ts` e `seed` (valores vs. labels; seed por idioma).
3. Trocar strings literais por `t(...)` nas telas/componentes.
4. `LanguageSwitcher` + assets de bandeira + teste.
5. Responsividade: `@media` no CSS + menu mobile (☰/backdrop) no `AppShell`/`Sidebar`.
6. Verificação final: `tsc --noEmit`, `vitest run`, `vite build`, smoke manual.

## Não-objetivos (YAGNI)

- Tradução de conteúdo digitado pelo usuário (títulos/notas dos cards).
- Tradução retroativa de entradas de log já gravadas.
- Idiomas além de PT-BR e EN-US.
- Formatação de data/número por locale (mantém o `lib/fmtData.ts` atual).
