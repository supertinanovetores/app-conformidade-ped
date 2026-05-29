# Design — App Conformidade P&D (frontend, dados mocados)

**Data:** 2026-05-29
**Status:** aprovado para implementação (fase frontend / mock)

## Objetivo e escopo

Recriar, como web app em **React + TypeScript**, o sistema atual "Testes P&D — Conformidade" (hoje um HTML único autocontido com Firebase + Netlify Functions), seguindo o **padrão de design da Nanovetores** (mesmo design system e shell do `app-treinamentos`).

Nesta fase: **somente frontend, com dados mocados**. Sem backend, sem Firebase, sem autenticação. A camada de dados fica isolada para que seja trocada por uma API real depois sem refatorar a UI.

### Em escopo

- Shell visual padrão Nanovetores: **sidebar + área de conteúdo**.
- Tela **Painel** (indicadores).
- Tela **Conformidade** (contadores + filtros + grid de cards, CRUD de cards).
- **Fluxograma** em tela cheia por card, com **edição inline** das etapas.
- **Exportar CSV** e **Exportar/Imprimir PDF**.
- Persistência dos dados mocados em **localStorage**.

### Fora de escopo (deliberado)

- Compartilhar fluxo por link (hash base64) — adiado.
- Qualquer backend, Firebase Realtime Database, Netlify Functions.
- Autenticação / controle de acesso.

## Stack e ferramentas

- **Build:** Vite.
- **UI:** React 18 + TypeScript.
- **Roteamento:** React Router.
- **Estado:** React Context + hook customizado (`useCards`) sobre localStorage. Sem Redux.
- **Estilo:** CSS global + custom properties (tokens) do Nanovetores Design System. Sem Tailwind, sem CSS-in-JS. Espelha o padrão do `app-treinamentos`.

## Estrutura de pastas

```
app-conformidade-ped/
├─ Nanovetores Design System/        (já existe — fonte dos tokens)
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ public/
│  └─ assets/  (simbolo.png e logo do Design System)
└─ src/
   ├─ main.tsx
   ├─ App.tsx                  (definição das rotas + shell)
   ├─ styles/
   │  ├─ tokens.css            (cópia de colors_and_type.css do DS)
   │  └─ app.css               (shell, sidebar, componentes — espelha app-treinamentos)
   ├─ data/
   │  ├─ types.ts              (tipos do domínio)
   │  ├─ constants.ts          (CATEGORIAS, STATUS, FASES + mapeamentos de classe)
   │  └─ seed.ts               (cards mocados iniciais)
   ├─ store/
   │  ├─ CardsContext.tsx      (provider)
   │  └─ useCards.ts           (CRUD + persistência localStorage)
   ├─ components/
   │  ├─ Sidebar.tsx
   │  ├─ Topbar.tsx            (cabeçalho de conteúdo: título + ações)
   │  ├─ StatCard.tsx
   │  ├─ Badge.tsx
   │  ├─ Modal.tsx
   │  ├─ Toast.tsx
   │  └─ ConfirmDialog.tsx
   └─ screens/
      ├─ Painel.tsx
      ├─ Conformidade.tsx
      └─ Fluxograma.tsx
```

## Modelo de dados (mock)

Mesmo shape do sistema atual, para permitir troca por API sem refatorar a UI.

```ts
type Status    = '' | 'conforme' | 'parcial' | 'reprovado';
type Fase      = 'Desenvolvimento' | 'Validação' | 'Liberação';
type Categoria = 'materiaprima' | 'compatibilidade' | 'zeta'
               | 'solubilidade' | 'homogeneidade' | 'aspectos';

interface Etapa {
  id: string;
  titulo: string;
  fase: Fase | '';
  feedback: string;
}

interface Card {
  id: string;
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  status: Status;
  notas: string;
  criadoEm: number;          // epoch ms
  etapas: Etapa[];
}
```

### Constantes de domínio

- `CATEGORIAS`: `materiaprima` → "Matérias-primas", `compatibilidade` → "Compatibilidade", `zeta` → "Potencial de Zeta", `solubilidade` → "Solubilidade", `homogeneidade` → "Homogeneidade", `aspectos` → "Aspectos Organolépticos".
- `STATUS`: `conforme`, `parcial`, `reprovado` (+ vazio = sem status).
- `FASES`: `Desenvolvimento`, `Validação`, `Liberação`.

### Camada de persistência (`useCards`)

- Na inicialização: lê `localStorage["nv-pd-cards"]`. Se vazio/ausente, popula com `seed.ts` e persiste.
- Expõe: `cards`, `create(dados)`, `update(id, patch)`, `remove(id)`, `updateEtapas(id, etapas)`.
- Toda escrita atualiza estado em memória **e** persiste no localStorage.
- `id` gerado por helper `uid()` (timestamp base36 + sufixo aleatório), espelhando o original.

## Telas e navegação

### Shell (sempre visível)

- **Sidebar** (≈220px): logo Nanovetores + nome do app; navegação (Painel, Conformidade). Espelha `.app-sidebar` / `.app-nav-item` do treinamentos.
- **Área de conteúdo**: `Topbar` com título da tela + ações contextuais, abaixo o conteúdo rolável.

### `/painel` — Painel

- Linha de **stat-cards** (estilo `.stat-card`): Conforme (verde), Parcial (amarelo), Reprovado (vermelho), Total (azul).
- Resumo complementar: contagem por **categoria** e por **fase** (cards/lista simples).
- Sem CRUD aqui — é leitura/visão geral.

### `/conformidade` — Lista de cards

- **Contadores** no topo (mesma informação dos stat-cards, formato compacto em linha).
- **Filtros**: categoria, status, fase (selects). Filtragem client-side combinável.
- **Ações** (na Topbar): "Exportar CSV", "Exportar PDF", "+ Novo card".
- **Grid de cards** (`auto-fill, minmax(300px, 1fr)`). Cada card:
  - Título; botão excluir (com `ConfirmDialog`).
  - Badges: categoria + fase.
  - Select de **status** que recolore o card (borda esquerda + acento) conforme o valor.
  - Textarea de **notas** (salva on-blur/change).
  - Botão **"Fluxograma (N etapas)"** → navega para a rota do fluxo.
- Estado vazio: mensagem "Nenhum card. Crie um novo card para começar."
- **Modal "Novo card"**: título, categoria, fase, e lista de etapas (adicionar/remover antes de criar).

### `/conformidade/:id/fluxo` — Fluxograma (tela cheia)

- Layout em **tela cheia** (rota dedicada que oculta o shell), fundo **gradiente navy de marca** (`--grad-hero`, navy→turquesa).
- **Topbar do fluxo**: voltar, título do card, badges (categoria/fase), botões "Editar" e "Exportar PDF".
- **Canvas**: etapas empilhadas verticalmente, conectadas por **setas SVG animadas** (turquesa). Cada etapa = card de vidro com borda esquerda colorida por fase:
  - Modo visualização: número, título, badge de fase, feedback (ou "nenhum feedback").
  - **Modo editar** (inline): editar título, selecionar fase, editar feedback, remover etapa, e botão "+ adicionar etapa". "Salvar" persiste via `updateEtapas` e mostra toast.
- Animação de entrada das etapas (stagger) e das setas, como no original.

## Componentes transversais

- **Modal**: overlay genérico (fecha no clique fora / Esc), usado pelo "Novo card".
- **Toast**: feedback efêmero (sucesso/erro), bottom-center.
- **ConfirmDialog**: confirmação de exclusão (substitui o `confirm()` nativo).
- **Badge / StatCard**: espelham as classes do design system.

## Design system

- Copiar `Nanovetores Design System/colors_and_type.css` para `src/styles/tokens.css` (tokens de cor, tipografia Saira/Inter, espaçamento, raio, sombra, motion).
- `src/styles/app.css` reaproveita os nomes e a estrutura de classes do `app-treinamentos` (`.app-frame`, `.app-sidebar`, `.app-content`, `.app-header`, `.app-btn*`, `.stat-card`, `.badge*`), mapeados aos tokens.
- Status visuais consistentes: verde `--nv-success`, amarelo `--nv-warning`, vermelho `--nv-danger`, azul `--nv-blue`.

## Funções e exportações

- **Exportar CSV**: gera CSV (`;` separador, BOM UTF-8) com título, categoria, fase, status, notas, etapas, fases das etapas, feedbacks e data de criação. Download client-side via Blob.
- **Exportar/Imprimir PDF**: usa `window.print()` com folhas de estilo de impressão dedicadas (lista de cards e fluxo), espelhando o comportamento do original.
- **Edição inline do fluxo**: conforme descrito na tela do fluxograma.

## Critérios de aceite (fase frontend)

1. App sobe com `npm install && npm run dev`.
2. Sidebar navega entre Painel e Conformidade; visual alinhado ao padrão Nanovetores.
3. CRUD de cards funciona e persiste no localStorage (sobrevive a reload).
4. Filtros (categoria/status/fase) funcionam de forma combinável.
5. Status recolore o card; contadores e painel refletem o estado atual.
6. Fluxograma abre em tela cheia (gradiente navy), anima etapas/setas, permite edição inline e persiste.
7. Exportar CSV gera arquivo válido; Exportar PDF aciona impressão com layout adequado.
8. Nenhuma dependência de backend/Firebase; tudo roda offline no navegador.

## Decisões e justificativas

- **CSS + tokens (não Tailwind):** fidelidade ao padrão atual da empresa (`app-treinamentos` usa CSS puro + custom properties).
- **localStorage:** demo realista (estado sobrevive a reload) e fronteira limpa para futura API.
- **Mesmo shape de dados do sistema atual:** troca por backend depois sem mexer na UI.
- **Fluxograma navy de marca:** preserva o impacto do fluxo original sem o slate escuro fora de padrão.
- **Sidebar mesmo com poucas telas:** consistência com o padrão da empresa e espaço para crescer.
