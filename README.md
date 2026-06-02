# Testes P&D — Nanovetores

Aplicação web para **gestão de testes de Pesquisa & Desenvolvimento**. Recria o sistema "Testes P&D" como SPA React + TypeScript, seguindo o **Nanovetores Design System**.

O acesso é protegido por **login Microsoft (Entra ID / MSAL)**. Os **dados** dos testes são, por enquanto, **mocados e persistidos no `localStorage`** do navegador — não há backend nem banco de dados. A camada de dados é isolada em funções puras, pronta para ser trocada por uma API real no futuro sem alterar telas nem componentes.

A interface é **bilíngue (Português / Inglês)** e **responsiva** (do celular ao desktop).

---

## Funcionalidades

- **Login Microsoft** — autenticação via MSAL (contas Nanovetores); foto e nome vêm do Microsoft Graph.
- **Painel** — visão geral com indicadores (Conforme / Parcial / Reprovado / Total) e resumos por categoria, fase, solicitante e responsável (gráficos donut e barras).
- **Testes** — lista de cards de teste com:
  - contadores de status;
  - busca por título/notas e filtros combináveis por categoria, status e fase;
  - ordenação (recentes, antigos, título, status);
  - criação de novos cards (com etapas) via modal;
  - edição inline de status e notas;
  - duplicação (como modelo) e exclusão com diálogo de confirmação;
  - exportação para **CSV** e **PDF** (impressão).
- **Detalhe do card / fluxo** — modal por card com **edição inline das etapas** do fluxo (adicionar, remover, editar título/fase/feedback), colorido por fase.
- **Log de atividades** — auditoria de quem criou, editou, duplicou e excluiu cada card, com data/hora e detalhe da alteração.
- **Idiomas (PT/EN)** — botões de bandeira na barra lateral alternam toda a interface, os rótulos de domínio e os cards de exemplo. A escolha é detectada do navegador na 1ª visita e depois lembrada no `localStorage`. Conteúdo digitado pelo usuário não é traduzido.
- **Responsividade** — em telas estreitas a barra lateral vira um menu hambúrguer deslizante; grade, painel, filtros e modais se adaptam.
- **Persistência automática** — qualquer alteração é salva no `localStorage`; ao recarregar a página, os dados permanecem.

### Domínio

- **Categorias:** Matérias-primas, Compatibilidade, Potencial de Zeta, Solubilidade, Homogeneidade, Aspectos Organolépticos.
- **Fases:** Desenvolvimento, Validação, Liberação.
- **Status:** Conforme, Parcial, Reprovado (ou sem status).

> Os rótulos acima são exibidos em PT ou EN conforme o idioma; o **valor gravado** no card não muda com o idioma.

---

## Stack

- **Vite** 5 — bundler / dev server
- **React** 18 + **TypeScript** 5
- **React Router** v6 — navegação entre telas
- **@azure/msal-browser** + **@azure/msal-react** — autenticação Microsoft
- **i18n próprio** — Context tipado + dicionários PT/EN (sem dependências externas)
- **Vitest** + **@testing-library/react** (jsdom) — testes
- **CSS puro** com custom properties (tokens do Design System)

---

## Estrutura do projeto

```
app-conformidade-ped/
├── index.html
├── vite.config.ts            # config Vite + Vitest
├── tsconfig.json
├── public/assets/            # logo + bandeiras (flag-br.svg / flag-us.svg)
├── src/
│   ├── main.tsx              # bootstrap React + LanguageProvider + Router + estilos
│   ├── App.tsx               # rotas, shell (sidebar + conteúdo) e menu mobile
│   ├── vitest.setup.ts       # setup RTL/jsdom
│   ├── styles/
│   │   ├── tokens.css        # tokens do Nanovetores Design System
│   │   └── app.css           # shell, cards, fluxo, responsivo, impressão
│   ├── i18n/
│   │   ├── pt.ts / en.ts     # dicionários (pt é a fonte da verdade das chaves)
│   │   ├── types.ts          # Lang, Dict, DictKey
│   │   ├── labels.ts         # helpers de chave p/ rótulos de domínio
│   │   └── LanguageContext.tsx  # LanguageProvider + hook useI18n + detectLang
│   ├── auth/
│   │   ├── msalConfig.ts        # config MSAL
│   │   ├── AuthProvider.tsx     # MsalProvider
│   │   ├── CurrentUserContext.tsx  # usuário logado + foto (Graph)
│   │   └── RequireAuth.tsx      # gate autenticado/não-autenticado
│   ├── data/
│   │   ├── types.ts          # tipos de domínio (Card, Etapa, LogEntry, Filtros...)
│   │   ├── constants.ts      # valores/enums de domínio (labels vêm do i18n)
│   │   ├── seed.pt.ts / seed.en.ts  # cards de exemplo por idioma
│   │   ├── seed.ts           # seleciona o seed pelo idioma inicial
│   │   └── derive.ts         # seletores puros: contadores e filtros
│   ├── lib/
│   │   ├── uid.ts            # gerador de id
│   │   ├── fmtData.ts        # formatação de data/hora
│   │   ├── charts.ts         # cálculos de donut/barras
│   │   ├── logDetalhe.ts     # texto de auditoria de uma edição
│   │   └── csv.ts            # serialização CSV dos cards
│   ├── store/
│   │   ├── storage.ts        # load/save de cards e log no localStorage
│   │   ├── cardsOps.ts       # CRUD puro sobre array de cards
│   │   └── CardsContext.tsx  # Provider + hook useCards (+ registro de log)
│   ├── components/
│   │   ├── Sidebar.tsx       # navegação lateral + seletor de idioma + usuário
│   │   ├── LanguageSwitcher.tsx # botões de bandeira PT/EN
│   │   ├── StatCard.tsx      # card de indicador (Painel)
│   │   ├── DonutChart.tsx / BarChart.tsx  # gráficos do Painel
│   │   ├── Badge.tsx         # chip de categoria/fase
│   │   ├── Avatar.tsx        # foto/iniciais do usuário
│   │   ├── Autoria.tsx       # "criado/editado por" no card
│   │   ├── Modal.tsx         # overlay genérico
│   │   ├── Toast.tsx         # feedback efêmero (context)
│   │   ├── ConfirmDialog.tsx # confirmação de exclusão
│   │   ├── DuplicarDialog.tsx   # confirmação de duplicação
│   │   ├── CardItem.tsx      # card de teste na grid
│   │   └── CardDetalheModal.tsx # detalhe + edição do fluxo de etapas
│   └── screens/
│       ├── Login.tsx         # tela de login Microsoft
│       ├── Painel.tsx        # tela de indicadores
│       ├── Testes.tsx        # lista + filtros + grid + modal de card
│       └── Log.tsx           # log de atividades
└── docs/superpowers/         # spec, plano e progresso da implementação
```

### Arquitetura em camadas

A lógica não conhece o React: `data/`, `lib/` e `store/cardsOps.ts`/`storage.ts` são **funções puras** testadas isoladamente. O `CardsContext` apenas conecta essa camada ao React via `useState` + `useEffect` (que persiste no `localStorage`). As telas e componentes consomem os hooks `useCards()`, `useI18n()` e `useAuth()`.

> **Troca por API futura:** basta reimplementar `store/storage.ts` e `store/CardsContext.tsx` para chamar uma API; tipos, telas e componentes permanecem inalterados.

### Internacionalização

`pt.ts` é a fonte da verdade das chaves; `en.ts` é tipado como `typeof pt`, então **qualquer chave faltante/sobrando quebra o `tsc`** (e há um teste de paridade adicional). Componentes usam `t('chave')` via `useI18n()`; rótulos de domínio (categoria/fase/status/ordem) são resolvidos pelos helpers em `i18n/labels.ts`.

---

## Como rodar

Pré-requisitos: **Node.js 18+**. Para o login funcionar, defina no arquivo `.env`:

```
VITE_MSAL_CLIENT_ID=...
VITE_MSAL_TENANT_ID=...
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

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

A suíte cobre a camada de lógica, o i18n e os componentes principais:

- `lib/uid` — geração de ids únicos
- `store/cardsOps` — CRUD puro de cards
- `data/derive` — contadores e filtros
- `lib/charts` — cálculos dos gráficos
- `lib/csv` — serialização CSV (PT e EN)
- `lib/logDetalhe` — texto de auditoria (PT e EN)
- `store/storage` — persistência no localStorage
- `auth/CurrentUserContext` — mapeamento do usuário logado
- `i18n/LanguageContext` — detecção/persistência de idioma e tradução
- `i18n/i18n-parity` — paridade de chaves entre `pt` e `en`
- `components/Modal`, `components/CardItem`, `components/LanguageSwitcher` — testes de UI

Execute com `npm run test` (ou o equivalente via `node` acima).

---

## Documentação interna

A especificação, os planos de implementação e o registro de progresso estão em `docs/superpowers/`:

- `specs/` — designs e requisitos (inclui o design de i18n + responsividade)
- `plans/` — planos de implementação task-a-task
- `PROGRESS.md` — estado da implementação por unidade

---

## Fora de escopo

- Backend / banco de dados (os dados ainda vivem no `localStorage`)
- Tradução automática de conteúdo digitado pelo usuário (títulos/notas dos cards)
- Compartilhamento de fluxo por link
