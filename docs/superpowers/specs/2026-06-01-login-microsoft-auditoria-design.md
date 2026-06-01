# Login Microsoft + Auditoria de autoria — Design

**Data:** 2026-06-01
**Projeto:** App Conformidade P&D (`app-conformidade-ped`, branch `feat/frontend-mock`)

## Objetivo

Exigir login com conta Microsoft (Nanovetores) para acessar o app e registrar, em cada card, **quem criou** e **quem editou por último**, exibindo essa informação na interface.

## Contexto e restrições

- O app é **frontend-only**; dados em `localStorage`. Um backend compartilhado virá no futuro — o design deve manter a camada de dados pura para que essa troca seja simples.
- Enquanto for local, a auditoria reflete apenas as ações feitas naquele navegador (não há dados compartilhados entre usuários ainda). Isso é aceito e esperado nesta fase.

## Decisões

| Tema | Decisão |
|---|---|
| Mecanismo de login | OAuth2/PKCE via **`@azure/msal-browser` + `@azure/msal-react`** (oficial Microsoft, SPA, sem backend) |
| Tipo de conta | **Single-tenant** — apenas contas da Nanovetores (`authority = https://login.microsoftonline.com/<TENANT_ID>`) |
| Escopo de permissão | `User.Read` (nome e e-mail do usuário via conta MSAL; sem chamada extra ao Graph) |
| Auditoria | **Criador + última edição** (sem histórico completo) |
| Config | `.env` (`VITE_MSAL_CLIENT_ID`, `VITE_MSAL_TENANT_ID`, `VITE_MSAL_REDIRECT_URI`) |
| Redirect URI (dev) | `http://localhost:5173` (porta padrão do Vite, fixada) |
| Redirect URI (prod) | Adicionada depois como segunda SPA redirect URI no mesmo registro; selecionada via env no build |

## Arquitetura

### 1. Módulo de autenticação — `src/auth/`

- **`msalConfig.ts`** — monta a `Configuration` do MSAL a partir das envs:
  - `auth.clientId = import.meta.env.VITE_MSAL_CLIENT_ID`
  - `auth.authority = https://login.microsoftonline.com/${VITE_MSAL_TENANT_ID}`
  - `auth.redirectUri = import.meta.env.VITE_MSAL_REDIRECT_URI`
  - `cache.cacheLocation = 'localStorage'` (sessão persiste entre reloads)
  - `loginRequest = { scopes: ['User.Read'] }`
- **`AuthProvider.tsx`** — instancia `PublicClientApplication` e envolve a árvore com `<MsalProvider>`.
- **`useAuth.ts`** — hook que expõe:
  - `usuario: Usuario | null` — derivado da conta ativa (`{ nome, email }`)
  - `login()` — `instance.loginRedirect(loginRequest)`
  - `logout()` — `instance.logoutRedirect()`
  - `autenticado: boolean`
  - `Usuario = { nome: string; email: string }` (em `data/types.ts`); `email` vem de `account.username`, `nome` de `account.name ?? account.username`.
- **`RequireAuth.tsx`** — se não autenticado, renderiza `<Login/>`; senão, os filhos. Usa `<AuthenticatedTemplate>` / `<UnauthenticatedTemplate>` do `msal-react`.

### 2. Tela de Login — `src/screens/Login.tsx`

- Layout centralizado, branded Nanovetores (logo + gradiente de marca já existente em `--grad-hero`).
- Botão "Entrar com Microsoft" → `login()`.
- Mensagem curta: "Acesso restrito a contas Nanovetores."

### 3. Shell

- `App.tsx`: envolve tudo com `AuthProvider`; o conteúdo (rotas + sidebar) fica dentro de `RequireAuth`.
- `Sidebar.tsx`: novo rodapé fixo com nome do usuário logado (iniciais + nome) e botão **Sair**.

### 4. Modelo de dados — `src/data/types.ts`

```ts
export interface Usuario { nome: string; email: string; }

export interface Card {
  // ...campos atuais...
  criadoPor?: Usuario;
  atualizadoPor?: Usuario;
  atualizadoEm?: number;
}
```

Campos **opcionais** → cards antigos do seed/localStorage continuam válidos; UI exibe "Sistema" quando ausente.

### 5. Operações puras — `src/store/cardsOps.ts`

Assinaturas passam a receber o autor:

- `createCard(cards, dados, autor: Usuario)` → grava `criadoPor = autor`, `atualizadoPor = autor`, `criadoEm`/`atualizadoEm = Date.now()`.
- `updateCard(cards, id, patch, autor: Usuario)` → aplica patch + `atualizadoPor = autor`, `atualizadoEm = Date.now()`.
- `updateEtapas(cards, id, etapas, autor: Usuario)` → idem (editar etapas conta como edição do card).
- `removeCard` inalterada.

As funções permanecem **puras** (autor entra por parâmetro, nada de side-effect).

### 6. `CardsContext.tsx`

`useCards()` lê o usuário atual via `useAuth()` e injeta nas chamadas de `ops.*`. A API pública do contexto (`create/update/remove/setEtapas`) **não muda de assinatura** para as telas — o autor é resolvido internamente.

### 7. Exibição da autoria

- **`CardItem.tsx`** — rodapé discreto: `Criado por {criadoPor?.nome ?? 'Sistema'} • editado por {atualizadoPor?.nome ?? '—'} em {fmtData(atualizadoEm ?? criadoEm)}`.
- **`Fluxograma.tsx`** — linha resumida na topbar com criador/último editor.
- **`csv.ts`** — duas novas colunas: "Criado por", "Editado por" (nome + e-mail).
- Helper `fmtData(ts)` para `dd/mm/aaaa` (pt-BR), reaproveitável.

### 8. Configuração

- **`.env.example`**:
  ```
  VITE_MSAL_CLIENT_ID=00000000-0000-0000-0000-000000000000
  VITE_MSAL_TENANT_ID=00000000-0000-0000-0000-000000000000
  VITE_MSAL_REDIRECT_URI=http://localhost:5173
  ```
- `.gitignore` já ignora `.env` / `.env.local`.
- Se as envs estiverem ausentes, a tela de Login mostra aviso de configuração (em vez de quebrar).

## Passo a passo — registrar o app no Entra ID

(Para o time de TI Nanovetores, com acesso ao portal.)

1. Acesse **portal.azure.com** → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. **Name:** `Conformidade P&D`.
3. **Supported account types:** *Accounts in this organizational directory only (Nanovetores — Single tenant)*.
4. **Redirect URI:** plataforma **Single-page application (SPA)** → `http://localhost:5173`.
5. **Register.**
6. Na tela **Overview**, copie:
   - **Application (client) ID** → `VITE_MSAL_CLIENT_ID`
   - **Directory (tenant) ID** → `VITE_MSAL_TENANT_ID`
7. Em **API permissions**, confirme `Microsoft Graph → User.Read` (delegated). Já vem por padrão; se faltar, adicione.
8. (Produção) Em **Authentication** → **Single-page application**, adicione a URL de produção como nova redirect URI (ex.: `https://conformidade.nanovetores.com.br`). Dev e prod coexistem.

## Testes

- `cardsOps.test.ts`: `createCard` grava `criadoPor`/`atualizadoPor`; `updateCard` e `updateEtapas` atualizam `atualizadoPor`/`atualizadoEm` sem alterar `criadoPor`.
- `csv.test.ts`: cabeçalho inclui "Criado por"/"Editado por"; linha serializa nome do autor.
- `useAuth`/gate: smoke test renderizando `RequireAuth` com MSAL mockado — deslogado mostra Login; logado mostra conteúdo.
- Portões: `tsc --noEmit`, suíte Vitest, `vite build` (lembrar gotcha do `&` no caminho → rodar via `node ./node_modules/...`).

## Fora de escopo

- Histórico completo de alterações (timeline por card).
- Backend / persistência compartilhada (fase futura).
- Autorização por papéis (todos os usuários autenticados têm o mesmo acesso).
- Chamadas ao Microsoft Graph além da identidade básica (foto de perfil etc.).

## Nota para a fase de backend (futuro)

Quando o backend existir: o `CardsContext`/`storage` passam a chamar a API enviando o token MSAL (`acquireTokenSilent`); o servidor valida e grava `criadoPor`/`atualizadoPor` server-side (fonte de verdade da auditoria). Tipos, telas e componentes de exibição permanecem.
