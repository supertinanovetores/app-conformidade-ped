# App Conformidade P&D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recriar o sistema "Testes P&D — Conformidade" como web app React + TypeScript, frontend-only com dados mocados em localStorage, seguindo o padrão de design Nanovetores.

**Architecture:** SPA Vite + React + React Router. Camada de dados isolada (funções puras de CRUD + persistência localStorage) consumida por um Context/hook (`useCards`), pronta para troca por API. UI dividida em shell (sidebar+conteúdo), telas (Painel, Conformidade, Fluxograma) e componentes reutilizáveis. Estilo via CSS global + tokens do Nanovetores Design System.

**Tech Stack:** Vite, React 18, TypeScript, React Router v6, Vitest + @testing-library/react (jsdom). CSS puro com custom properties.

**Working directory:** todos os caminhos são relativos a `app-conformidade-ped/` (o repositório git já inicializado, branch `main`).

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html` | Scaffold e config (build + Vitest) |
| `src/main.tsx` | Bootstrap React + Router + import dos estilos |
| `src/App.tsx` | Rotas e shell |
| `src/vitest.setup.ts` | Setup RTL/jsdom |
| `src/styles/tokens.css` | Cópia de `colors_and_type.css` do Design System |
| `src/styles/app.css` | Shell, sidebar, componentes, status, impressão |
| `src/data/types.ts` | Tipos de domínio |
| `src/data/constants.ts` | CATEGORIAS, STATUS, FASES + mapeamentos de classe |
| `src/data/seed.ts` | Cards mocados iniciais |
| `src/data/derive.ts` + `.test.ts` | Seletores puros: contadores e filtros |
| `src/lib/uid.ts` + `.test.ts` | Gerador de id |
| `src/lib/csv.ts` + `.test.ts` | Serialização CSV dos cards |
| `src/store/storage.ts` + `.test.ts` | load/save localStorage |
| `src/store/cardsOps.ts` + `.test.ts` | Funções puras de CRUD sobre array de cards |
| `src/store/CardsContext.tsx` | Provider + hook `useCards` |
| `src/components/Sidebar.tsx` | Navegação lateral |
| `src/components/Topbar.tsx` | Cabeçalho de conteúdo (título + ações) |
| `src/components/StatCard.tsx` | Card de indicador |
| `src/components/Badge.tsx` | Chip de categoria/fase/status |
| `src/components/Modal.tsx` | Overlay genérico |
| `src/components/Toast.tsx` + `ToastContext` | Feedback efêmero |
| `src/components/ConfirmDialog.tsx` | Confirmação de exclusão |
| `src/components/CardItem.tsx` | Card de conformidade na grid |
| `src/screens/Painel.tsx` | Tela de indicadores |
| `src/screens/Conformidade.tsx` | Lista: contadores + filtros + grid + modal |
| `src/screens/Fluxograma.tsx` | Fluxo tela cheia (view + edição inline + print) |

---

## Task 1: Scaffold Vite + React + TS + Vitest

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vitest.setup.ts`, `src/styles/app.css` (vazio por ora)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "app-conformidade-ped",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^25.0.0",
    "typescript": "^5.5.4",
    "vite": "^5.4.6",
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`** (inclui config Vitest)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    css: false,
  },
});
```

- [ ] **Step 5: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Conformidade P&D — Nanovetores</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 7: Create empty `src/styles/app.css`**

```css
/* preenchido na Task 3 */
```

- [ ] **Step 8: Create `src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/tokens.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

> `tokens.css` é criado na Task 2; o import já fica aqui para não voltar ao arquivo.

- [ ] **Step 9: Create temporary `src/App.tsx`** (placeholder que será substituído na Task 8)

```tsx
export default function App() {
  return <div>App Conformidade P&D</div>;
}
```

- [ ] **Step 10: Install and verify**

Run: `npm install`
Then: `npm run test`
Expected: Vitest roda e reporta "No test files found" (ou 0 testes) sem erro de config.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Vitest"
```

---

## Task 2: Tokens do Design System

**Files:**
- Create: `src/styles/tokens.css`
- Create: `public/assets/simbolo.png` (cópia do logo)

- [ ] **Step 1: Copiar os tokens**

Copie o conteúdo de `Nanovetores Design System/colors_and_type.css` para `src/styles/tokens.css` **sem alterações** (contém `:root` com cores, tipografia Saira/Inter via `@import`, espaçamento, raio, sombra, motion, layout).

Run (PowerShell): `Copy-Item "Nanovetores Design System/colors_and_type.css" "src/styles/tokens.css"`

- [ ] **Step 2: Copiar o logo para `public/assets`**

Run (PowerShell): `New-Item -ItemType Directory -Force public/assets; Copy-Item "Nanovetores Design System/uploads/simbolo.png" "public/assets/simbolo.png"`

- [ ] **Step 3: Verify**

Run: `node -e "const c=require('fs').readFileSync('src/styles/tokens.css','utf8'); if(!c.includes('--nv-blue')) process.exit(1); console.log('ok')"`
Expected: imprime `ok`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: adiciona tokens do Nanovetores Design System e logo"
```

---

## Task 3: Estilos do app (shell, componentes, status, impressão)

**Files:**
- Modify: `src/styles/app.css`

- [ ] **Step 1: Escrever `src/styles/app.css`** (conteúdo completo)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --app-bg: var(--bg-2);
  --app-surface: var(--bg-1);
  --app-border: var(--border-1);
  --app-text: var(--fg-1);
  --app-text2: var(--fg-2);
  --app-accent: var(--nv-blue);
  --app-accent-light: #E6EAF4;
  --app-accent-2: var(--nv-turquoise);
  --app-green: var(--nv-success);  --app-green-light: #E6F7F2;
  --app-yellow: var(--nv-warning); --app-yellow-light: #FEF6E7;
  --app-red: var(--nv-danger);     --app-red-light: #FCEAE9;
  --app-sidebar: #F4F6F8;
  --app-sidebar-text: #5A6B7B;
  --app-sidebar-active: #E1E6EC;
  --app-sidebar-border: #E0E4EA;
}

body { font-family: var(--font-body); background: var(--app-bg); color: var(--app-text); height: 100vh; overflow: hidden; }
h1,h2,h3,h4 { font-family: var(--font-display); }

/* ===== Shell ===== */
.app-frame { width: 100vw; height: 100vh; display: flex; overflow: hidden; }
.app-sidebar { width: 220px; min-width: 220px; background: var(--app-sidebar); color: var(--app-sidebar-text); display: flex; flex-direction: column; border-right: 1px solid var(--app-sidebar-border); }
.app-logo { padding: 14px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--app-sidebar-border); }
.app-logo img { width: 32px; height: 32px; object-fit: contain; flex-shrink: 0; }
.app-logo .logo-kicker { font-size: 10px; color: #8a98a8; letter-spacing: .6px; text-transform: uppercase; }
.app-logo .logo-brand { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--nv-blue); letter-spacing: .06em; line-height: 1; }
.app-nav { padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.app-nav-item { padding: 8px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: var(--app-sidebar-text); text-decoration: none; }
.app-nav-item:hover { background: var(--app-sidebar-active); color: var(--nv-blue); }
.app-nav-item.active { background: var(--app-accent-light); color: var(--nv-blue); font-weight: 600; }

.app-content { flex: 1; padding: 24px; overflow-y: auto; }
.app-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.app-header h1 { font-size: 24px; font-weight: 700; letter-spacing: -.01em; }
.app-header-sub { font-size: 13px; color: var(--app-text2); margin-top: 2px; }
.app-header-actions { display: flex; gap: 8px; align-items: center; }

/* ===== Botões ===== */
.app-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
.app-btn-primary { background: var(--app-accent); color: #fff; }
.app-btn-primary:hover { background: #001d73; }
.app-btn-outline { background: transparent; border: 1.5px solid var(--app-border); color: var(--app-text); }
.app-btn-outline:hover { border-color: var(--app-accent); color: var(--app-accent); }
.app-btn-danger { background: var(--app-red); color: #fff; }

/* ===== Stat cards ===== */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }
.stat-card { background: var(--app-surface); border-radius: 8px; padding: 16px; border: 1px solid var(--app-border); border-top: 3px solid var(--app-border); }
.stat-card.green { border-top-color: var(--app-green); }
.stat-card.yellow { border-top-color: var(--app-yellow); }
.stat-card.red { border-top-color: var(--app-red); }
.stat-card.blue { border-top-color: var(--app-accent); }
.stat-card .label { font-size: 12px; color: var(--app-text2); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .4px; font-weight: 600; }
.stat-card .value { font-size: 28px; font-weight: 700; line-height: 1; }
.stat-card .value.green { color: var(--app-green); }
.stat-card .value.yellow { color: var(--app-yellow); }
.stat-card .value.red { color: var(--app-red); }
.stat-card .value.blue { color: var(--app-accent); }

/* ===== Contadores compactos (Conformidade) ===== */
.contador { display: flex; background: var(--app-surface); border-radius: 10px; border: 1px solid var(--app-border); margin-bottom: 20px; overflow: hidden; }
.cont-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 14px 8px; border-right: 1px solid var(--app-border); gap: 4px; }
.cont-item:last-child { border-right: none; }
.cont-dot { width: 9px; height: 9px; border-radius: 50%; }
.cont-dot.conforme { background: var(--app-green); }
.cont-dot.parcial { background: var(--app-yellow); }
.cont-dot.reprovado { background: var(--app-red); }
.cont-dot.total { background: var(--app-accent); }
.cont-num { font-size: 22px; font-weight: 700; line-height: 1; }
.cont-label { font-size: 11px; color: var(--app-text2); font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }

/* ===== Filtros ===== */
.filtros { display: flex; gap: 10px; flex-wrap: wrap; flex: 1; }
.filtros select { padding: 9px 12px; border: 1.5px solid var(--app-border); border-radius: 7px; font-size: 13px; background: #fff; font-family: inherit; min-width: 170px; color: var(--app-text); }
.filtros select:focus { outline: none; border-color: var(--app-accent); }

/* ===== Grid + Card ===== */
.grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.sem-cards { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--fg-3); font-size: 14px; }
.card { background: var(--app-surface); border-radius: 10px; border: 1.5px solid var(--app-border); padding: 16px; display: flex; flex-direction: column; gap: 10px; transition: border-color .15s, box-shadow .15s; border-left: 4px solid var(--app-border); }
.card:hover { border-color: var(--app-accent); box-shadow: var(--shadow-2); }
.card.conforme { border-left-color: var(--app-green); }
.card.parcial { border-left-color: var(--app-yellow); }
.card.reprovado { border-left-color: var(--app-red); }
.card-topo { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.card-titulo { font-size: 14px; font-weight: 700; color: var(--app-text); flex: 1; line-height: 1.4; }
.btn-excluir { background: none; border: none; color: #ccc; cursor: pointer; font-size: 15px; padding: 2px 4px; border-radius: 4px; }
.btn-excluir:hover { color: var(--app-red); background: var(--app-red-light); }
.card-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.card-status-row { display: flex; align-items: center; gap: 8px; }
.card-status-row label { font-size: 12px; font-weight: 600; color: var(--app-text2); }
.status-select { flex: 1; padding: 7px 10px; border: 1.5px solid var(--app-border); border-radius: 6px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; background: #fff; }
.status-select:focus { outline: none; border-color: var(--app-accent); }
.status-select.conforme { border-color: var(--app-green); color: var(--app-green); background: var(--app-green-light); }
.status-select.parcial { border-color: var(--app-yellow); color: #8a5a00; background: var(--app-yellow-light); }
.status-select.reprovado { border-color: var(--app-red); color: var(--app-red); background: var(--app-red-light); }
.card-notas { width: 100%; padding: 8px 10px; border: 1.5px solid var(--app-border); border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical; min-height: 58px; color: var(--app-text); background: #fafbfc; }
.card-notas:focus { outline: none; border-color: var(--app-accent); background: #fff; }
.btn-fluxo { background: var(--app-accent-light); border: 1.5px solid var(--app-accent); border-radius: 6px; padding: 9px 14px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--app-accent); text-align: center; font-family: inherit; }
.btn-fluxo:hover { background: #d8e0f4; }

/* ===== Badges ===== */
.badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: .3px; }
.badge-cat { background: var(--app-accent-light); color: var(--app-accent); }
.badge-fase { background: #f0f7ff; color: var(--app-accent); border: 1px solid #cce0ff; }

/* ===== Modal ===== */
.overlay { position: fixed; inset: 0; background: rgba(17,33,46,.45); z-index: 100; display: flex; justify-content: center; align-items: center; padding: 16px; }
.modal { background: #fff; border-radius: 12px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 26px 24px; box-shadow: var(--shadow-3); }
.modal-titulo { font-size: 17px; font-weight: 700; margin-bottom: 20px; color: var(--app-accent); }
.campo { margin-bottom: 14px; }
.campo label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--app-text2); margin-bottom: 5px; }
.campo input, .campo select { width: 100%; padding: 9px 12px; border: 1.5px solid var(--app-border); border-radius: 6px; font-size: 14px; font-family: inherit; background: #fff; color: var(--app-text); }
.campo input:focus, .campo select:focus { outline: none; border-color: var(--app-accent); }
.secao-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--app-text2); margin-bottom: 10px; }
.lista-etapas { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.etapa-item { display: flex; align-items: center; gap: 8px; background: var(--app-bg); border-radius: 6px; padding: 8px 10px; }
.etapa-num { font-size: 11px; font-weight: 700; color: var(--app-accent); min-width: 18px; }
.etapa-texto { flex: 1; font-size: 13px; }
.btn-rem-etapa { background: none; border: none; color: #ccc; cursor: pointer; font-size: 13px; }
.btn-rem-etapa:hover { color: var(--app-red); }
.add-etapa-row { display: flex; gap: 8px; margin-bottom: 18px; }
.add-etapa-row input { flex: 1; padding: 8px 12px; border: 1.5px solid var(--app-border); border-radius: 6px; font-size: 13px; font-family: inherit; }
.modal-acoes { display: flex; gap: 10px; margin-top: 6px; }
.modal-acoes .app-btn { flex: 1; justify-content: center; }

/* ===== Toast ===== */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--app-green); color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; z-index: 300; box-shadow: var(--shadow-2); }
.toast.erro { background: var(--app-red); }

/* ===== Painel resumo ===== */
.resumo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.resumo-bloco { background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 10px; padding: 16px; }
.resumo-bloco h3 { font-size: 14px; margin-bottom: 12px; color: var(--app-text); }
.resumo-linha { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--app-border); font-size: 13px; }
.resumo-linha:last-child { border-bottom: none; }
.resumo-linha .v { font-weight: 700; }

/* ===== Fluxograma (tela cheia, navy de marca) ===== */
.fluxo-tela { position: fixed; inset: 0; background: var(--grad-hero); z-index: 200; display: flex; flex-direction: column; }
.fluxo-topbar { padding: 14px 20px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06); }
.btn-fluxo-voltar { background: none; border: 1.5px solid rgba(255,255,255,.4); color: rgba(255,255,255,.85); border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-fluxo-voltar:hover { border-color: #fff; color: #fff; }
.fluxo-topbar-titulo { flex: 1; color: #fff; font-size: 15px; font-weight: 700; }
.fluxo-topbar-badges { display: flex; gap: 6px; }
.badge-glass { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; background: rgba(255,255,255,.15); color: #fff; }
.fluxo-topbar-acoes { display: flex; gap: 8px; }
.btn-topbar { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25); color: #fff; border-radius: 6px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-topbar:hover { background: rgba(255,255,255,.22); }
.btn-topbar.editar { background: var(--app-accent-2); border-color: var(--app-accent-2); color: var(--nv-blue); }
.fluxo-canvas { flex: 1; overflow-y: auto; padding: 40px 20px 60px; display: flex; flex-direction: column; align-items: center; }
.fluxo-vazio { color: rgba(255,255,255,.7); text-align: center; padding: 60px 20px; font-size: 14px; }

@keyframes stepIn { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes arrowGrow { from { stroke-dashoffset: 30; opacity: 0; } to { stroke-dashoffset: 0; opacity: 1; } }

.fluxo-step { width: 100%; max-width: 540px; background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.22); border-radius: 12px; padding: 20px 22px; opacity: 0; animation: stepIn .45s var(--ease-out) both; backdrop-filter: blur(6px); border-left: 4px solid rgba(255,255,255,.3); }
.fluxo-step.fase-dev { border-left-color: #7CC0FF; }
.fluxo-step.fase-val { border-left-color: var(--app-yellow); }
.fluxo-step.fase-lib { border-left-color: var(--app-accent-2); }
.fsb-num { font-size: 10px; font-weight: 700; color: rgba(255,255,255,.55); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px; }
.fsb-titulo { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; }
.fsb-fase-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 14px; text-transform: uppercase; background: rgba(255,255,255,.15); color: #fff; }
.fsb-feedback-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: rgba(255,255,255,.55); margin-bottom: 6px; }
.fsb-feedback-text { font-size: 13px; color: rgba(255,255,255,.85); line-height: 1.6; font-style: italic; }
.fsb-feedback-empty { font-size: 13px; color: rgba(255,255,255,.4); font-style: italic; }
.fsb-input, .fsb-select, .fsb-textarea { width: 100%; padding: 8px 10px; border: 1.5px solid rgba(255,255,255,.3); border-radius: 6px; font-size: 13px; font-family: inherit; color: #fff; background: rgba(255,255,255,.1); margin-bottom: 10px; }
.fsb-input::placeholder, .fsb-textarea::placeholder { color: rgba(255,255,255,.5); }
.fsb-select option { color: var(--app-text); }
.fsb-input:focus, .fsb-select:focus, .fsb-textarea:focus { outline: none; border-color: var(--app-accent-2); }
.fsb-textarea { resize: vertical; min-height: 64px; }
.fsb-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.btn-fsb-rem { background: none; border: 1px solid rgba(255,255,255,.5); color: #fff; border-radius: 5px; padding: 5px 10px; font-size: 12px; cursor: pointer; }
.fluxo-seta { display: flex; justify-content: center; margin: 4px 0; }
.seta-linha { stroke: var(--app-accent-2); stroke-width: 2.5; fill: none; stroke-dasharray: 30; stroke-dashoffset: 30; animation: arrowGrow .4s ease both; }
.seta-ponta { fill: var(--app-accent-2); opacity: 0; animation: stepIn .3s ease both; }
.btn-add-step { margin-top: 16px; width: 100%; max-width: 540px; background: none; border: 1.5px dashed rgba(255,255,255,.35); border-radius: 10px; padding: 12px; color: rgba(255,255,255,.7); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-add-step:hover { border-color: var(--app-accent-2); color: #fff; }

/* ===== Impressão ===== */
@media print {
  body { overflow: visible; height: auto; }
  .app-sidebar, .app-header-actions, .filtros, .btn-excluir, .btn-fluxo { display: none !important; }
  .app-content { overflow: visible; padding: 0; }
  .grid-cards { grid-template-columns: repeat(2, 1fr); }
  .card { break-inside: avoid; box-shadow: none; }
  /* Fluxo: imprime fundo branco com texto escuro */
  body.imprimindo-fluxo .fluxo-tela { position: static; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body.imprimindo-fluxo .fluxo-topbar-acoes, body.imprimindo-fluxo .btn-fluxo-voltar { display: none !important; }
  body.imprimindo-fluxo .fluxo-topbar { background: var(--app-accent) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body.imprimindo-fluxo .fluxo-step { background: #fff !important; border-color: #d0d0d0 !important; opacity: 1 !important; animation: none !important; break-inside: avoid; backdrop-filter: none; }
  body.imprimindo-fluxo .fsb-num { color: #666 !important; }
  body.imprimindo-fluxo .fsb-titulo { color: #111 !important; }
  body.imprimindo-fluxo .fsb-fase-badge { background: #eef2ff !important; color: #1d4ed8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body.imprimindo-fluxo .fsb-feedback-text { color: #444 !important; }
}
```

- [ ] **Step 2: Verify**

Run: `node -e "const c=require('fs').readFileSync('src/styles/app.css','utf8'); ['.app-frame','.fluxo-tela','.stat-card','.status-select.conforme'].forEach(s=>{if(!c.includes(s)){console.error('faltou',s);process.exit(1)}}); console.log('ok')"`
Expected: imprime `ok`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: estilos do app (shell, cards, fluxo, impressao)"
```

---

## Task 4: Tipos e constantes de domínio

**Files:**
- Create: `src/data/types.ts`, `src/data/constants.ts`

- [ ] **Step 1: Create `src/data/types.ts`**

```ts
export type Status = '' | 'conforme' | 'parcial' | 'reprovado';
export type Fase = 'Desenvolvimento' | 'Validação' | 'Liberação';
export type Categoria =
  | 'materiaprima' | 'compatibilidade' | 'zeta'
  | 'solubilidade' | 'homogeneidade' | 'aspectos';

export interface Etapa {
  id: string;
  titulo: string;
  fase: Fase | '';
  feedback: string;
}

export interface Card {
  id: string;
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  status: Status;
  notas: string;
  criadoEm: number;
  etapas: Etapa[];
}

export interface Filtros {
  categoria: Categoria | '';
  status: Status;
  fase: Fase | '';
}
```

- [ ] **Step 2: Create `src/data/constants.ts`**

```ts
import type { Categoria, Status, Fase } from './types';

export const CATEGORIAS: Record<Categoria, string> = {
  materiaprima: 'Matérias-primas',
  compatibilidade: 'Compatibilidade',
  zeta: 'Potencial de Zeta',
  solubilidade: 'Solubilidade',
  homogeneidade: 'Homogeneidade',
  aspectos: 'Aspectos Organolépticos',
};

export const CATEGORIA_OPTS = Object.entries(CATEGORIAS) as [Categoria, string][];

export const STATUS_LABEL: Record<Exclude<Status, ''>, string> = {
  conforme: 'Conforme',
  parcial: 'Parcial',
  reprovado: 'Reprovado',
};

export const STATUS_OPTS = Object.entries(STATUS_LABEL) as [Exclude<Status, ''>, string][];

export const FASES: Fase[] = ['Desenvolvimento', 'Validação', 'Liberação'];

// Mapeia fase -> sufixo de classe usado no fluxograma (.fase-dev/-val/-lib)
export const FASE_CLASSE: Record<Fase, string> = {
  Desenvolvimento: 'fase-dev',
  Validação: 'fase-val',
  Liberação: 'fase-lib',
};
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc -b`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: tipos e constantes de dominio"
```

---

## Task 5: `uid()` helper (TDD)

**Files:**
- Create: `src/lib/uid.ts`, `src/lib/uid.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `src/lib/uid.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { uid } from './uid';

describe('uid', () => {
  it('gera string não vazia', () => {
    expect(uid().length).toBeGreaterThan(5);
  });
  it('gera ids únicos em sequência', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => uid()));
    expect(ids.size).toBe(1000);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/uid.test.ts`
Expected: FAIL — "Failed to resolve import './uid'".

- [ ] **Step 3: Implementar `src/lib/uid.ts`**

```ts
let counter = 0;
export function uid(): string {
  counter = (counter + 1) % 1_000_000;
  return Date.now().toString(36) + counter.toString(36) + Math.random().toString(36).slice(2, 7);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/uid.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: helper uid com teste"
```

---

## Task 6: Funções puras de CRUD (TDD)

**Files:**
- Create: `src/store/cardsOps.ts`, `src/store/cardsOps.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `src/store/cardsOps.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { createCard, updateCard, removeCard, updateEtapas } from './cardsOps';
import type { Card } from '../data/types';

const base: Card = {
  id: 'c1', titulo: 'Teste', categoria: 'materiaprima', fase: 'Desenvolvimento',
  status: '', notas: '', criadoEm: 1, etapas: [],
};

describe('cardsOps', () => {
  it('createCard adiciona um card novo com id e criadoEm', () => {
    const out = createCard([], { titulo: 'Novo', categoria: 'zeta', fase: 'Validação', etapasTitulos: ['A', 'B'] });
    expect(out).toHaveLength(1);
    expect(out[0].titulo).toBe('Novo');
    expect(out[0].id).toBeTruthy();
    expect(out[0].etapas).toHaveLength(2);
    expect(out[0].etapas[0].fase).toBe('Validação');
  });
  it('createCard não muta o array original', () => {
    const orig: Card[] = [];
    createCard(orig, { titulo: 'X', categoria: 'zeta', fase: 'Validação', etapasTitulos: [] });
    expect(orig).toHaveLength(0);
  });
  it('updateCard altera apenas o card alvo', () => {
    const out = updateCard([base], 'c1', { status: 'conforme', notas: 'ok' });
    expect(out[0].status).toBe('conforme');
    expect(out[0].notas).toBe('ok');
    expect(out[0].titulo).toBe('Teste');
  });
  it('removeCard remove pelo id', () => {
    expect(removeCard([base], 'c1')).toHaveLength(0);
    expect(removeCard([base], 'x')).toHaveLength(1);
  });
  it('updateEtapas substitui as etapas do card', () => {
    const etapas = [{ id: 'e1', titulo: 'P', fase: '' as const, feedback: '' }];
    const out = updateEtapas([base], 'c1', etapas);
    expect(out[0].etapas).toEqual(etapas);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/store/cardsOps.test.ts`
Expected: FAIL — import não resolvido.

- [ ] **Step 3: Implementar `src/store/cardsOps.ts`**

```ts
import type { Card, Categoria, Fase, Etapa } from '../data/types';
import { uid } from '../lib/uid';

export interface NovoCard {
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  etapasTitulos: string[];
}

export function createCard(cards: Card[], dados: NovoCard): Card[] {
  const card: Card = {
    id: uid(),
    titulo: dados.titulo,
    categoria: dados.categoria,
    fase: dados.fase,
    status: '',
    notas: '',
    criadoEm: Date.now(),
    etapas: dados.etapasTitulos.map((t) => ({ id: uid(), titulo: t, fase: dados.fase, feedback: '' })),
  };
  return [...cards, card];
}

export function updateCard(cards: Card[], id: string, patch: Partial<Card>): Card[] {
  return cards.map((c) => (c.id === id ? { ...c, ...patch } : c));
}

export function removeCard(cards: Card[], id: string): Card[] {
  return cards.filter((c) => c.id !== id);
}

export function updateEtapas(cards: Card[], id: string, etapas: Etapa[]): Card[] {
  return cards.map((c) => (c.id === id ? { ...c, etapas } : c));
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/store/cardsOps.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: funcoes puras de CRUD de cards com testes"
```

---

## Task 7: Seletores derivados — contadores e filtros (TDD)

**Files:**
- Create: `src/data/derive.ts`, `src/data/derive.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `src/data/derive.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { contarStatus, filtrarCards, contarPor } from './derive';
import type { Card } from './types';

function mk(p: Partial<Card>): Card {
  return { id: Math.random().toString(), titulo: 't', categoria: 'materiaprima', fase: 'Desenvolvimento', status: '', notas: '', criadoEm: 0, etapas: [], ...p };
}

describe('derive', () => {
  const cards = [
    mk({ status: 'conforme', categoria: 'zeta', fase: 'Validação' }),
    mk({ status: 'conforme', categoria: 'materiaprima' }),
    mk({ status: 'parcial' }),
    mk({ status: 'reprovado' }),
    mk({ status: '' }),
  ];

  it('contarStatus conta cada status e o total', () => {
    expect(contarStatus(cards)).toEqual({ conforme: 2, parcial: 1, reprovado: 1, total: 5 });
  });

  it('filtrarCards filtra por categoria', () => {
    expect(filtrarCards(cards, { categoria: 'zeta', status: '', fase: '' })).toHaveLength(1);
  });

  it('filtrarCards combina filtros (status + fase)', () => {
    expect(filtrarCards(cards, { categoria: '', status: 'conforme', fase: 'Validação' })).toHaveLength(1);
  });

  it('filtrarCards sem filtros retorna tudo', () => {
    expect(filtrarCards(cards, { categoria: '', status: '', fase: '' })).toHaveLength(5);
  });

  it('contarPor agrupa por chave', () => {
    expect(contarPor(cards, 'categoria').zeta).toBe(1);
    expect(contarPor(cards, 'categoria').materiaprima).toBe(2);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/data/derive.test.ts`
Expected: FAIL — import não resolvido.

- [ ] **Step 3: Implementar `src/data/derive.ts`**

```ts
import type { Card, Filtros } from './types';

export interface ContagemStatus {
  conforme: number;
  parcial: number;
  reprovado: number;
  total: number;
}

export function contarStatus(cards: Card[]): ContagemStatus {
  return {
    conforme: cards.filter((c) => c.status === 'conforme').length,
    parcial: cards.filter((c) => c.status === 'parcial').length,
    reprovado: cards.filter((c) => c.status === 'reprovado').length,
    total: cards.length,
  };
}

export function filtrarCards(cards: Card[], f: Filtros): Card[] {
  return cards.filter(
    (c) =>
      (!f.categoria || c.categoria === f.categoria) &&
      (!f.status || c.status === f.status) &&
      (!f.fase || c.fase === f.fase),
  );
}

export function contarPor<K extends keyof Card>(cards: Card[], chave: K): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of cards) {
    const k = String(c[chave]);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/data/derive.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seletores de contagem e filtro com testes"
```

---

## Task 8: Exportação CSV (TDD)

**Files:**
- Create: `src/lib/csv.ts`, `src/lib/csv.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `src/lib/csv.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { cardsToCsv } from './csv';
import type { Card } from '../data/types';

const card: Card = {
  id: 'c1', titulo: 'pH "A"', categoria: 'materiaprima', fase: 'Desenvolvimento',
  status: 'conforme', notas: 'ok; ver', criadoEm: 0,
  etapas: [{ id: 'e1', titulo: 'Coleta', fase: 'Desenvolvimento', feedback: 'sem contaminação' }],
};

describe('cardsToCsv', () => {
  it('inclui cabeçalho e uma linha por card', () => {
    const csv = cardsToCsv([card]);
    const linhas = csv.trim().split('\n');
    expect(linhas).toHaveLength(2);
    expect(linhas[0]).toContain('Titulo');
  });
  it('escapa aspas duplicando e usa separador ;', () => {
    const csv = cardsToCsv([card]);
    expect(csv).toContain('"pH ""A"""');
    expect(csv).toContain('Matérias-primas');
  });
  it('serializa etapas e feedbacks', () => {
    const csv = cardsToCsv([card]);
    expect(csv).toContain('Coleta');
    expect(csv).toContain('sem contaminação');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/csv.test.ts`
Expected: FAIL — import não resolvido.

- [ ] **Step 3: Implementar `src/lib/csv.ts`**

```ts
import type { Card } from '../data/types';
import { CATEGORIAS } from '../data/constants';

const q = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"';

const CABECALHO = ['Titulo', 'Categoria', 'Fase', 'Status', 'Notas', 'Etapas', 'Fases das etapas', 'Feedbacks', 'Criado em'];

export function cardsToCsv(cards: Card[]): string {
  const cab = CABECALHO.map(q).join(';');
  const linhas = cards.map((c) => {
    const etapas = c.etapas.map((e) => e.titulo).join(' | ');
    const fases = c.etapas.map((e) => e.fase || '—').join(' | ');
    const feedbacks = c.etapas.map((e) => `${e.titulo}: ${e.feedback || '—'}`).join(' | ');
    const data = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR') : '—';
    return [c.titulo, CATEGORIAS[c.categoria], c.fase, c.status || '—', c.notas, etapas, fases, feedbacks, data]
      .map(q)
      .join(';');
  });
  return [cab, ...linhas].join('\n');
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/csv.test.ts`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: serializacao CSV dos cards com testes"
```

---

## Task 9: Persistência localStorage (TDD)

**Files:**
- Create: `src/store/storage.ts`, `src/store/storage.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `src/store/storage.test.ts`

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { loadCards, saveCards, STORAGE_KEY } from './storage';
import type { Card } from '../data/types';

const card: Card = { id: 'c1', titulo: 't', categoria: 'zeta', fase: 'Validação', status: '', notas: '', criadoEm: 0, etapas: [] };

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('saveCards persiste e loadCards lê de volta', () => {
    saveCards([card]);
    expect(loadCards()).toEqual([card]);
  });

  it('loadCards retorna null quando vazio', () => {
    expect(loadCards()).toBeNull();
  });

  it('loadCards retorna null com JSON inválido', () => {
    localStorage.setItem(STORAGE_KEY, '{nao-json');
    expect(loadCards()).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/store/storage.test.ts`
Expected: FAIL — import não resolvido.

- [ ] **Step 3: Implementar `src/store/storage.ts`**

```ts
import type { Card } from '../data/types';

export const STORAGE_KEY = 'nv-pd-cards';

export function loadCards(): Card[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Card[]) : null;
  } catch {
    return null;
  }
}

export function saveCards(cards: Card[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/store/storage.test.ts`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: camada de persistencia localStorage com testes"
```

---

## Task 10: Seed de dados mocados

**Files:**
- Create: `src/data/seed.ts`

- [ ] **Step 1: Create `src/data/seed.ts`**

```ts
import type { Card } from './types';

export const SEED_CARDS: Card[] = [
  {
    id: 'seed-1', titulo: 'Verificação de pH da amostra A', categoria: 'materiaprima',
    fase: 'Desenvolvimento', status: 'conforme', notas: 'pH dentro do esperado (6.5).',
    criadoEm: 1716700000000,
    etapas: [
      { id: 'seed-1-e1', titulo: 'Coleta da amostra', fase: 'Desenvolvimento', feedback: 'Amostra coletada sem contaminação.' },
      { id: 'seed-1-e2', titulo: 'Medição em bancada', fase: 'Validação', feedback: 'Leitura estável após calibração.' },
      { id: 'seed-1-e3', titulo: 'Liberação do lote', fase: 'Liberação', feedback: '' },
    ],
  },
  {
    id: 'seed-2', titulo: 'Compatibilidade com tensoativo X', categoria: 'compatibilidade',
    fase: 'Validação', status: 'parcial', notas: 'Leve turvação após 48h.',
    criadoEm: 1716800000000,
    etapas: [
      { id: 'seed-2-e1', titulo: 'Mistura 1:1', fase: 'Desenvolvimento', feedback: 'Homogênea no início.' },
      { id: 'seed-2-e2', titulo: 'Observação 48h', fase: 'Validação', feedback: 'Turvação parcial registrada.' },
    ],
  },
  {
    id: 'seed-3', titulo: 'Potencial de zeta — nanoemulsão B', categoria: 'zeta',
    fase: 'Desenvolvimento', status: 'reprovado', notas: 'Valor fora da faixa de estabilidade.',
    criadoEm: 1716900000000,
    etapas: [
      { id: 'seed-3-e1', titulo: 'Preparo da diluição', fase: 'Desenvolvimento', feedback: '' },
      { id: 'seed-3-e2', titulo: 'Leitura no zetasizer', fase: 'Desenvolvimento', feedback: '-12 mV, instável.' },
    ],
  },
  {
    id: 'seed-4', titulo: 'Solubilidade do ativo C', categoria: 'solubilidade',
    fase: 'Liberação', status: '', notas: '', criadoEm: 1717000000000, etapas: [],
  },
];
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc -b`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: seed de cards mocados"
```

---

## Task 11: CardsContext + hook `useCards`

**Files:**
- Create: `src/store/CardsContext.tsx`

- [ ] **Step 1: Implementar `src/store/CardsContext.tsx`**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Card, Etapa } from '../data/types';
import { loadCards, saveCards } from './storage';
import { SEED_CARDS } from '../data/seed';
import * as ops from './cardsOps';

interface CardsCtx {
  cards: Card[];
  create: (dados: ops.NovoCard) => void;
  update: (id: string, patch: Partial<Card>) => void;
  remove: (id: string) => void;
  setEtapas: (id: string, etapas: Etapa[]) => void;
}

const Ctx = createContext<CardsCtx | null>(null);

export function CardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>(() => loadCards() ?? SEED_CARDS);

  useEffect(() => { saveCards(cards); }, [cards]);

  const value: CardsCtx = {
    cards,
    create: (dados) => setCards((cs) => ops.createCard(cs, dados)),
    update: (id, patch) => setCards((cs) => ops.updateCard(cs, id, patch)),
    remove: (id) => setCards((cs) => ops.removeCard(cs, id)),
    setEtapas: (id, etapas) => setCards((cs) => ops.updateEtapas(cs, id, etapas)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCards(): CardsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCards deve ser usado dentro de <CardsProvider>');
  return ctx;
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc -b`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: CardsContext e hook useCards"
```

---

## Task 12: Toast (context + componente)

**Files:**
- Create: `src/components/Toast.tsx`

- [ ] **Step 1: Implementar `src/components/Toast.tsx`**

```tsx
import { createContext, useContext, useCallback, useRef, useState, type ReactNode } from 'react';

interface ToastState { msg: string; erro: boolean; }
const Ctx = createContext<(msg: string, erro?: boolean) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((msg: string, erro = false) => {
    setToast({ msg, erro });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      {toast && <div className={'toast' + (toast.erro ? ' erro' : '')}>{toast.msg}</div>}
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc -b`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: componente Toast com context"
```

---

## Task 13: Componentes Badge, StatCard, Modal, ConfirmDialog

**Files:**
- Create: `src/components/Badge.tsx`, `src/components/StatCard.tsx`, `src/components/Modal.tsx`, `src/components/ConfirmDialog.tsx`

- [ ] **Step 1: `src/components/Badge.tsx`**

```tsx
import type { ReactNode } from 'react';

export function Badge({ tipo, children }: { tipo: 'cat' | 'fase'; children: ReactNode }) {
  return <span className={`badge badge-${tipo}`}>{children}</span>;
}
```

- [ ] **Step 2: `src/components/StatCard.tsx`**

```tsx
type Cor = 'green' | 'yellow' | 'red' | 'blue';

export function StatCard({ label, value, cor }: { label: string; value: number; cor: Cor }) {
  return (
    <div className={`stat-card ${cor}`}>
      <div className="label">{label}</div>
      <div className={`value ${cor}`}>{value}</div>
    </div>
  );
}
```

- [ ] **Step 3: `src/components/Modal.tsx`**

```tsx
import { useEffect, type ReactNode } from 'react';

export function Modal({ titulo, onClose, children }: { titulo: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-titulo">{titulo}</div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `src/components/ConfirmDialog.tsx`**

```tsx
import { Modal } from './Modal';

export function ConfirmDialog({ mensagem, onConfirm, onCancel }: { mensagem: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal titulo="Confirmar" onClose={onCancel}>
      <p style={{ marginBottom: 20 }}>{mensagem}</p>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onCancel}>Cancelar</button>
        <button className="app-btn app-btn-danger" onClick={onConfirm}>Excluir</button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 5: Smoke test do Modal** — `src/components/Modal.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renderiza título e conteúdo', () => {
    render(<Modal titulo="Olá" onClose={() => {}}><p>corpo</p></Modal>);
    expect(screen.getByText('Olá')).toBeInTheDocument();
    expect(screen.getByText('corpo')).toBeInTheDocument();
  });
  it('chama onClose ao clicar no overlay', () => {
    const onClose = vi.fn();
    const { container } = render(<Modal titulo="X" onClose={onClose}><p>c</p></Modal>);
    fireEvent.click(container.querySelector('.overlay')!);
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 6: Rodar testes**

Run: `npx vitest run src/components/Modal.test.tsx`
Expected: PASS (2 testes).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: componentes Badge, StatCard, Modal, ConfirmDialog"
```

---

## Task 14: Shell — Sidebar + App (rotas)

**Files:**
- Create: `src/components/Sidebar.tsx`
- Modify: `src/App.tsx` (substitui placeholder)

- [ ] **Step 1: `src/components/Sidebar.tsx`**

```tsx
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="app-logo">
        <img src="/assets/simbolo.png" alt="Nanovetores" />
        <div>
          <div className="logo-kicker">Nanovetores</div>
          <div className="logo-brand">CONFORMIDADE P&D</div>
        </div>
      </div>
      <nav className="app-nav">
        <NavLink to="/painel" className={({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '')}>Painel</NavLink>
        <NavLink to="/conformidade" className={({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '')}>Conformidade</NavLink>
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Substituir `src/App.tsx`**

```tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CardsProvider } from './store/CardsContext';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Painel } from './screens/Painel';
import { Conformidade } from './screens/Conformidade';
import { Fluxograma } from './screens/Fluxograma';

export default function App() {
  const location = useLocation();
  const isFluxo = location.pathname.includes('/fluxo');

  return (
    <CardsProvider>
      <ToastProvider>
        <div className="app-frame">
          {!isFluxo && <Sidebar />}
          {isFluxo ? (
            <Routes>
              <Route path="/conformidade/:id/fluxo" element={<Fluxograma />} />
            </Routes>
          ) : (
            <main className="app-content">
              <Routes>
                <Route path="/" element={<Navigate to="/painel" replace />} />
                <Route path="/painel" element={<Painel />} />
                <Route path="/conformidade" element={<Conformidade />} />
                <Route path="*" element={<Navigate to="/painel" replace />} />
              </Routes>
            </main>
          )}
        </div>
      </ToastProvider>
    </CardsProvider>
  );
}
```

> As telas `Painel`, `Conformidade` e `Fluxograma` são criadas nas Tasks 15-18. Até lá o build falha — não rode `dev` ainda; siga para a próxima task.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: shell com sidebar e rotas"
```

---

## Task 15: Tela Painel

**Files:**
- Create: `src/screens/Painel.tsx`

- [ ] **Step 1: `src/screens/Painel.tsx`**

```tsx
import { useCards } from '../store/CardsContext';
import { contarStatus, contarPor } from '../data/derive';
import { StatCard } from '../components/StatCard';
import { CATEGORIAS, FASES } from '../data/constants';
import type { Categoria } from '../data/types';

export function Painel() {
  const { cards } = useCards();
  const s = contarStatus(cards);
  const porCat = contarPor(cards, 'categoria');
  const porFase = contarPor(cards, 'fase');

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Painel</h1>
          <div className="app-header-sub">Visão geral da conformidade de testes P&D</div>
        </div>
      </header>

      <div className="stats-row">
        <StatCard label="Conforme" value={s.conforme} cor="green" />
        <StatCard label="Parcial" value={s.parcial} cor="yellow" />
        <StatCard label="Reprovado" value={s.reprovado} cor="red" />
        <StatCard label="Total" value={s.total} cor="blue" />
      </div>

      <div className="resumo-grid">
        <div className="resumo-bloco">
          <h3>Por categoria</h3>
          {(Object.keys(CATEGORIAS) as Categoria[]).map((cat) => (
            <div className="resumo-linha" key={cat}>
              <span>{CATEGORIAS[cat]}</span>
              <span className="v">{porCat[cat] ?? 0}</span>
            </div>
          ))}
        </div>
        <div className="resumo-bloco">
          <h3>Por fase</h3>
          {FASES.map((fase) => (
            <div className="resumo-linha" key={fase}>
              <span>{fase}</span>
              <span className="v">{porFase[fase] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc -b`
Expected: erros apenas por `Conformidade`/`Fluxograma` ainda inexistentes (imports em App.tsx). Aceitável até a Task 18. Confirme que não há erro **dentro de** `Painel.tsx`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: tela Painel"
```

---

## Task 16: Componente CardItem

**Files:**
- Create: `src/components/CardItem.tsx`

- [ ] **Step 1: `src/components/CardItem.tsx`**

```tsx
import { useNavigate } from 'react-router-dom';
import type { Card, Status } from '../data/types';
import { CATEGORIAS, STATUS_OPTS } from '../data/constants';
import { Badge } from './Badge';

interface Props {
  card: Card;
  onStatus: (status: Status) => void;
  onNotas: (notas: string) => void;
  onExcluir: () => void;
}

export function CardItem({ card, onStatus, onNotas, onExcluir }: Props) {
  const navigate = useNavigate();
  const nEt = card.etapas.length;

  return (
    <div className={`card ${card.status}`}>
      <div className="card-topo">
        <div className="card-titulo">{card.titulo}</div>
        <button className="btn-excluir" title="Excluir" onClick={onExcluir}>✕</button>
      </div>
      <div className="card-badges">
        <Badge tipo="cat">{CATEGORIAS[card.categoria]}</Badge>
        <Badge tipo="fase">{card.fase}</Badge>
      </div>
      <div className="card-status-row">
        <label>Status</label>
        <select
          className={`status-select ${card.status}`}
          value={card.status}
          onChange={(e) => onStatus(e.target.value as Status)}
        >
          <option value="">— Sem status</option>
          {STATUS_OPTS.map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>
      <textarea
        className="card-notas"
        placeholder="Notas e observações..."
        defaultValue={card.notas}
        onBlur={(e) => onNotas(e.target.value)}
      />
      <button className="btn-fluxo" onClick={() => navigate(`/conformidade/${card.id}/fluxo`)}>
        Fluxograma{nEt ? ` (${nEt} etapa${nEt > 1 ? 's' : ''})` : ''}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Smoke test** — `src/components/CardItem.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CardItem } from './CardItem';
import type { Card } from '../data/types';

const card: Card = { id: 'c1', titulo: 'Meu teste', categoria: 'zeta', fase: 'Validação', status: 'conforme', notas: '', criadoEm: 0, etapas: [{ id: 'e', titulo: 't', fase: '', feedback: '' }] };

describe('CardItem', () => {
  it('mostra título, categoria e contagem de etapas', () => {
    render(<MemoryRouter><CardItem card={card} onStatus={() => {}} onNotas={() => {}} onExcluir={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Meu teste')).toBeInTheDocument();
    expect(screen.getByText('Potencial de Zeta')).toBeInTheDocument();
    expect(screen.getByText('Fluxograma (1 etapa)')).toBeInTheDocument();
  });
  it('dispara onStatus ao trocar o select', () => {
    const onStatus = vi.fn();
    render(<MemoryRouter><CardItem card={card} onStatus={onStatus} onNotas={() => {}} onExcluir={() => {}} /></MemoryRouter>);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reprovado' } });
    expect(onStatus).toHaveBeenCalledWith('reprovado');
  });
});
```

- [ ] **Step 3: Rodar testes**

Run: `npx vitest run src/components/CardItem.test.tsx`
Expected: PASS (2 testes).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: componente CardItem com testes"
```

---

## Task 17: Tela Conformidade (contadores + filtros + grid + modal)

**Files:**
- Create: `src/screens/Conformidade.tsx`

- [ ] **Step 1: `src/screens/Conformidade.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { useCards } from '../store/CardsContext';
import { useToast } from '../components/Toast';
import { contarStatus, filtrarCards } from '../data/derive';
import { CATEGORIA_OPTS, STATUS_OPTS, FASES } from '../data/constants';
import { cardsToCsv } from '../lib/csv';
import type { Categoria, Fase, Filtros, Status } from '../data/types';
import { CardItem } from '../components/CardItem';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Modal } from '../components/Modal';

const FILTROS_VAZIO: Filtros = { categoria: '', status: '', fase: '' };

export function Conformidade() {
  const { cards, create, update, remove } = useCards();
  const toast = useToast();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIO);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [novoAberto, setNovoAberto] = useState(false);

  const s = contarStatus(cards);
  const visiveis = useMemo(() => filtrarCards(cards, filtros), [cards, filtros]);

  function exportarCsv() {
    if (!cards.length) { toast('Nenhum card para exportar.', true); return; }
    const blob = new Blob(['﻿' + cardsToCsv(cards)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conformidade-pd-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Conformidade</h1>
          <div className="app-header-sub">Testes de P&D e seus fluxos</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={exportarCsv}>Exportar CSV</button>
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>Exportar PDF</button>
          <button className="app-btn app-btn-primary" onClick={() => setNovoAberto(true)}>+ Novo card</button>
        </div>
      </header>

      <div className="contador">
        <div className="cont-item"><span className="cont-dot conforme" /><span className="cont-num">{s.conforme}</span><span className="cont-label">Conforme</span></div>
        <div className="cont-item"><span className="cont-dot parcial" /><span className="cont-num">{s.parcial}</span><span className="cont-label">Parcial</span></div>
        <div className="cont-item"><span className="cont-dot reprovado" /><span className="cont-num">{s.reprovado}</span><span className="cont-label">Reprovado</span></div>
        <div className="cont-item"><span className="cont-dot total" /><span className="cont-num">{s.total}</span><span className="cont-label">Total</span></div>
      </div>

      <div className="app-header" style={{ marginBottom: 16 }}>
        <div className="filtros">
          <select value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as Categoria | '' })}>
            <option value="">Todas as categorias</option>
            {CATEGORIA_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <select value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value as Status })}>
            <option value="">Todos os status</option>
            {STATUS_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <select value={filtros.fase} onChange={(e) => setFiltros({ ...filtros, fase: e.target.value as Fase | '' })}>
            <option value="">Todas as fases</option>
            {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-cards">
        {visiveis.length === 0 ? (
          <div className="sem-cards">Nenhum card. Crie um novo card para começar.</div>
        ) : (
          visiveis.map((c) => (
            <CardItem
              key={c.id}
              card={c}
              onStatus={(status) => update(c.id, { status })}
              onNotas={(notas) => update(c.id, { notas })}
              onExcluir={() => setExcluindo(c.id)}
            />
          ))
        )}
      </div>

      {excluindo && (
        <ConfirmDialog
          mensagem="Excluir este card?"
          onConfirm={() => { remove(excluindo); setExcluindo(null); toast('Card excluído.'); }}
          onCancel={() => setExcluindo(null)}
        />
      )}

      {novoAberto && (
        <NovoCardModal
          onClose={() => setNovoAberto(false)}
          onCriar={(dados) => { create(dados); setNovoAberto(false); toast('Card criado!'); }}
        />
      )}
    </>
  );
}

// ── Modal de novo card ──────────────────────────────────────────────
function NovoCardModal({ onClose, onCriar }: { onClose: () => void; onCriar: (d: { titulo: string; categoria: Categoria; fase: Fase; etapasTitulos: string[] }) => void }) {
  const toast = useToast();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Categoria | ''>('');
  const [fase, setFase] = useState<Fase | ''>('');
  const [etapas, setEtapas] = useState<string[]>([]);
  const [novaEtapa, setNovaEtapa] = useState('');

  function addEtapa() {
    const v = novaEtapa.trim();
    if (!v) return;
    setEtapas([...etapas, v]);
    setNovaEtapa('');
  }

  function salvar() {
    if (!titulo.trim() || !categoria || !fase) { toast('Preencha título, categoria e fase.', true); return; }
    onCriar({ titulo: titulo.trim(), categoria, fase, etapasTitulos: etapas });
  }

  return (
    <Modal titulo="Novo card de conformidade" onClose={onClose}>
      <div className="campo">
        <label>Título do teste *</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Verificação de pH da amostra A" autoFocus />
      </div>
      <div className="campo">
        <label>Categoria *</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria | '')}>
          <option value="">Selecione...</option>
          {CATEGORIA_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>
      <div className="campo">
        <label>Fase *</label>
        <select value={fase} onChange={(e) => setFase(e.target.value as Fase | '')}>
          <option value="">Selecione...</option>
          {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="secao-label">Etapas do fluxo</div>
      <div className="lista-etapas">
        {etapas.map((t, i) => (
          <div className="etapa-item" key={i}>
            <span className="etapa-num">{i + 1}</span>
            <span className="etapa-texto">{t}</span>
            <button className="btn-rem-etapa" onClick={() => setEtapas(etapas.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div className="add-etapa-row">
        <input
          value={novaEtapa}
          onChange={(e) => setNovaEtapa(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addEtapa(); }}
          placeholder="Descreva a etapa..."
        />
        <button className="app-btn app-btn-outline" onClick={addEtapa}>Adicionar</button>
      </div>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onClose}>Cancelar</button>
        <button className="app-btn app-btn-primary" onClick={salvar}>Criar card</button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc -b`
Expected: erro apenas por `Fluxograma` ainda inexistente (import em App.tsx). Confirme que não há erro dentro de `Conformidade.tsx`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: tela Conformidade com filtros, grid e modal de novo card"
```

---

## Task 18: Tela Fluxograma (view + edição inline + PDF)

**Files:**
- Create: `src/screens/Fluxograma.tsx`

- [ ] **Step 1: `src/screens/Fluxograma.tsx`**

```tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '../store/CardsContext';
import { useToast } from '../components/Toast';
import { CATEGORIAS, FASES, FASE_CLASSE } from '../data/constants';
import type { Etapa, Fase } from '../data/types';
import { uid } from '../lib/uid';

export function Fluxograma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, setEtapas } = useCards();
  const toast = useToast();
  const card = cards.find((c) => c.id === id);

  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState<Etapa[]>(card ? card.etapas.map((e) => ({ ...e })) : []);

  if (!card) {
    return (
      <div className="fluxo-tela">
        <div className="fluxo-vazio" style={{ margin: 'auto' }}>
          Card não encontrado.
          <div style={{ marginTop: 16 }}>
            <button className="btn-fluxo-voltar" onClick={() => navigate('/conformidade')}>← Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  const etapas = editando ? rascunho : card.etapas;

  function salvar() {
    setEtapas(card!.id, rascunho);
    setEditando(false);
    toast('Fluxo salvo!');
  }

  function toggleEditar() {
    if (editando) { salvar(); }
    else { setRascunho(card!.etapas.map((e) => ({ ...e }))); setEditando(true); }
  }

  function imprimir() {
    if (editando) setEditando(false);
    document.body.classList.add('imprimindo-fluxo');
    window.print();
    setTimeout(() => document.body.classList.remove('imprimindo-fluxo'), 1000);
  }

  function patchEtapa(i: number, patch: Partial<Etapa>) {
    setRascunho((r) => r.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }

  return (
    <div className="fluxo-tela">
      <div className="fluxo-topbar">
        <button className="btn-fluxo-voltar" onClick={() => navigate('/conformidade')}>← Voltar</button>
        <div className="fluxo-topbar-titulo">{card.titulo}</div>
        <div className="fluxo-topbar-badges">
          <span className="badge-glass">{CATEGORIAS[card.categoria]}</span>
          <span className="badge-glass">{card.fase}</span>
        </div>
        <div className="fluxo-topbar-acoes">
          <button className="btn-topbar editar" onClick={toggleEditar}>{editando ? 'Salvar' : 'Editar'}</button>
          <button className="btn-topbar" onClick={imprimir}>Exportar PDF</button>
        </div>
      </div>

      <div className="fluxo-canvas">
        {etapas.length === 0 ? (
          <div className="fluxo-vazio">
            Nenhuma etapa cadastrada.
            {!editando && <><br />Clique em <strong>Editar</strong> para adicionar etapas.</>}
          </div>
        ) : (
          etapas.map((e, i) => (
            <div key={e.id}>
              {i > 0 && (
                <div className="fluxo-seta">
                  <svg width="24" height="40" viewBox="0 0 24 40" style={{ overflow: 'visible' }}>
                    <line className="seta-linha" x1="12" y1="0" x2="12" y2="30" style={{ animationDelay: `${i * 120 - 30}ms` }} />
                    <polygon className="seta-ponta" points="12,40 5,28 19,28" style={{ animationDelay: `${i * 120 + 270}ms` }} />
                  </svg>
                </div>
              )}
              <div className={`fluxo-step ${e.fase ? FASE_CLASSE[e.fase] : ''}`} style={{ animationDelay: `${i * 120}ms` }}>
                {editando ? (
                  <>
                    <div className="fsb-header">
                      <span className="fsb-num">Etapa {i + 1}</span>
                      <button className="btn-fsb-rem" onClick={() => setRascunho((r) => r.filter((_, j) => j !== i))}>Remover</button>
                    </div>
                    <input className="fsb-input" value={e.titulo} placeholder="Descrição da etapa..." onChange={(ev) => patchEtapa(i, { titulo: ev.target.value })} />
                    <select className="fsb-select" value={e.fase} onChange={(ev) => patchEtapa(i, { fase: ev.target.value as Fase | '' })}>
                      <option value="">Selecione a fase...</option>
                      {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <textarea className="fsb-textarea" value={e.feedback} placeholder="Registre sua percepção..." onChange={(ev) => patchEtapa(i, { feedback: ev.target.value })} />
                  </>
                ) : (
                  <>
                    <div className="fsb-num">Etapa {i + 1}</div>
                    <div className="fsb-titulo">{e.titulo}</div>
                    <span className="fsb-fase-badge">{e.fase || 'Fase não definida'}</span>
                    {e.feedback ? (
                      <>
                        <div className="fsb-feedback-label">Feedback / Percepção</div>
                        <div className="fsb-feedback-text">{e.feedback}</div>
                      </>
                    ) : (
                      <div className="fsb-feedback-empty">Nenhum feedback registrado.</div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}

        {editando && (
          <button className="btn-add-step" onClick={() => setRascunho((r) => [...r, { id: uid(), titulo: '', fase: '', feedback: '' }])}>
            + Adicionar etapa
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck e build**

Run: `npx tsc -b`
Expected: sem erros (todas as telas existem agora).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: tela Fluxograma com edicao inline e exportar PDF"
```

---

## Task 19: Verificação completa (testes + build + smoke manual)

**Files:** nenhum (verificação)

- [ ] **Step 1: Rodar toda a suíte de testes**

Run: `npm run test`
Expected: PASS em todos os arquivos (uid, cardsOps, derive, csv, storage, Modal, CardItem).

- [ ] **Step 2: Typecheck + build de produção**

Run: `npm run build`
Expected: build conclui sem erros, gera `dist/`.

- [ ] **Step 3: Smoke manual** (`npm run dev`, abrir no navegador)

Verifique cada item:
- App abre em `/painel`; sidebar mostra logo + Painel + Conformidade.
- Painel mostra 4 stat-cards e resumos por categoria/fase batendo com o seed (Conforme 1, Parcial 1, Reprovado 1, Total 4).
- Em Conformidade: contadores corretos; filtros (categoria/status/fase) combinam.
- Trocar status de um card recolore a borda; Painel/contadores atualizam.
- Editar notas e recarregar a página: notas persistem (localStorage).
- "+ Novo card": cria com etapas; aparece na grid.
- Excluir: abre confirmação; remove ao confirmar.
- "Fluxograma": abre tela cheia navy (gradiente), etapas com setas animadas; Editar permite add/remover/editar etapa + fase + feedback; Salvar persiste e volta ao modo view.
- "Exportar CSV": baixa arquivo com os cards.
- "Exportar PDF" (lista e fluxo): abre diálogo de impressão com layout adequado.

- [ ] **Step 4: Commit final (se houver ajustes)**

```bash
git add -A
git commit -m "chore: verificacao final do app de conformidade"
```

---

## Notas de implementação

- **Mutação de etapas no fluxo:** o modo edição opera sobre um `rascunho` (cópia) e só persiste ao Salvar — espelha o comportamento do `_fluxoEtapas` do original.
- **Notas (textarea):** usa `defaultValue` + `onBlur` (não controlado) para evitar re-render/perda de foco a cada tecla; persiste ao sair do campo, como no original (`onchange`).
- **Persistência:** o `useEffect` em `CardsProvider` salva o array inteiro a cada mudança — simples e suficiente para o volume mocado.
- **Troca por API futura:** basta reimplementar `storage.ts`/`CardsContext.tsx` para chamar a API; tipos, telas e componentes não mudam.
- **Fora de escopo confirmado:** compartilhar fluxo por link; sem backend/Firebase; sem autenticação.
