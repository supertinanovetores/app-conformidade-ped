# Testes P&D — Nanovetores

Aplicação web para **gestão de testes de Pesquisa & Desenvolvimento**. Recria o sistema "Testes P&D" como SPA React + TypeScript, seguindo o **Nanovetores Design System**.

É **frontend-only**: todos os dados são mocados e persistidos no `localStorage` do navegador — não há backend, banco de dados ou autenticação. A camada de dados é isolada em funções puras, pronta para ser trocada por uma API real no futuro sem alterar telas nem componentes.

---

## Funcionalidades

- **Painel** — visão geral com indicadores (Conforme / Parcial / Reprovado / Total) e resumos por categoria e por fase.
- **Testes** — lista de cards de teste com:
  - contadores de status;
  - filtros combináveis por categoria, status e fase;
  - criação de novos cards (com etapas) via modal;
  - edição inline de status e notas;
  - exclusão com diálogo de confirmação;
  - exportação para **CSV** e **PDF** (impressão).
- **Fluxograma** — tela cheia por card, exibindo as etapas do teste como um fluxo vertical com setas animadas, colorido por fase (Desenvolvimento / Validação / Liberação). Permite **edição inline** de etapas (adicionar, remover, editar título/fase/feedback) e **exportar PDF**.
- **Persistência automática** — qualquer alteração é salva no `localStorage`; ao recarregar a página, os dados permanecem.

### Domínio

- **Categorias:** Matérias-primas, Compatibilidade, Potencial de Zeta, Solubilidade, Homogeneidade, Aspectos Organolépticos.
- **Fases:** Desenvolvimento, Validação, Liberação.
- **Status:** Conforme, Parcial, Reprovado (ou sem status).

---

## Stack

- **Vite** 5 — bundler / dev server
- **React** 18 + **TypeScript** 5
- **React Router** v6 — navegação entre telas
- **Vitest** + **@testing-library/react** (jsdom) — testes
- **CSS puro** com custom properties (tokens do Design System)

---

## Estrutura do projeto

```
app-conformidade-ped/
├── index.html
├── vite.config.ts            # config Vite + Vitest
├── tsconfig.json
├── src/
│   ├── main.tsx              # bootstrap React + Router + estilos
│   ├── App.tsx               # rotas e shell (sidebar + conteúdo)
│   ├── vitest.setup.ts       # setup RTL/jsdom
│   ├── styles/
│   │   ├── tokens.css        # tokens do Nanovetores Design System
│   │   └── app.css           # shell, cards, fluxo, impressão
│   ├── data/
│   │   ├── types.ts          # tipos de domínio (Card, Etapa, Filtros...)
│   │   ├── constants.ts      # CATEGORIAS, STATUS, FASES + mapeamentos
│   │   ├── seed.ts           # cards mocados iniciais
│   │   └── derive.ts         # seletores puros: contadores e filtros
│   ├── lib/
│   │   ├── uid.ts            # gerador de id
│   │   └── csv.ts            # serialização CSV dos cards
│   ├── store/
│   │   ├── storage.ts        # load/save no localStorage
│   │   ├── cardsOps.ts       # CRUD puro sobre array de cards
│   │   └── CardsContext.tsx  # Provider + hook useCards
│   ├── components/
│   │   ├── Sidebar.tsx       # navegação lateral
│   │   ├── StatCard.tsx      # card de indicador (Painel)
│   │   ├── Badge.tsx         # chip de categoria/fase
│   │   ├── Modal.tsx         # overlay genérico
│   │   ├── Toast.tsx         # feedback efêmero (context)
│   │   ├── ConfirmDialog.tsx # confirmação de exclusão
│   │   └── CardItem.tsx      # card de teste na grid
│   └── screens/
│       ├── Painel.tsx        # tela de indicadores
│       ├── Testes.tsx        # lista + filtros + grid + modal
│       └── Fluxograma.tsx    # fluxo tela cheia (view + edição + print)
└── docs/superpowers/         # spec, plano e progresso da implementação
```

### Arquitetura em camadas

A lógica não conhece o React: `data/`, `lib/` e `store/cardsOps.ts`/`storage.ts` são **funções puras** testadas isoladamente. O `CardsContext` apenas conecta essa camada ao React via `useState` + `useEffect` (que persiste no `localStorage`). As telas e componentes consomem o hook `useCards()`.

> **Troca por API futura:** basta reimplementar `store/storage.ts` e `store/CardsContext.tsx` para chamar uma API; tipos, telas e componentes permanecem inalterados.

---

## Como rodar

Pré-requisitos: **Node.js 18+**.

```bash
npm install
```

### Scripts

| Comando            | O que faz                                  |
|--------------------|--------------------------------------------|
| `npm run dev`      | Sobe o dev server (Vite) com hot reload    |
| `npm run build`    | Typecheck (`tsc --noEmit`) + build de produção em `dist/` |
| `npm run preview`  | Serve localmente o build de produção       |
| `npm run test`     | Roda toda a suíte de testes (Vitest)       |
| `npm run test:watch` | Testes em modo watch                     |

> ⚠️ **Atenção ao caminho com `&`**
> O caminho deste projeto contém o caractere `&` (`...ConformidadesP&D...`), que **quebra os shims `.cmd` do npm/npx no Windows** (o `cmd` corta o caminho no `&`). Se `npx`, `npm run build` ou `npm run test` falharem por causa disso, rode as ferramentas chamando o `node` diretamente, a partir da pasta do repositório:
>
> ```bash
> node ./node_modules/vite/bin/vite.js            # dev
> node ./node_modules/vite/bin/vite.js build      # build
> node ./node_modules/typescript/bin/tsc --noEmit # typecheck
> node ./node_modules/vitest/vitest.mjs run       # testes
> ```
>
> (`npm install` funciona normalmente.)

---

## Testes

A suíte cobre a camada de lógica e os componentes principais:

- `lib/uid` — geração de ids únicos
- `store/cardsOps` — CRUD puro de cards
- `data/derive` — contadores e filtros
- `lib/csv` — serialização CSV
- `store/storage` — persistência no localStorage
- `components/Modal` e `components/CardItem` — smoke tests de UI

Execute com `npm run test` (ou o equivalente via `node` acima).

---

## Documentação interna

A especificação, o plano de implementação detalhado e o registro de progresso estão em `docs/superpowers/`:

- `specs/` — design e requisitos
- `plans/` — plano de implementação task-a-task
- `PROGRESS.md` — estado da implementação por unidade

---

## Fora de escopo

- Backend / banco de dados / Firebase
- Autenticação de usuários
- Compartilhamento de fluxo por link
