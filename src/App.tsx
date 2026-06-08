import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { CardsProvider } from './store/CardsContext';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { useI18n } from './i18n/LanguageContext';
import { Painel } from './screens/Painel';
import { Testes } from './screens/Testes';
import { Log } from './screens/Log';

function AppShell() {
  const { t } = useI18n();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <CardsProvider>
      <ToastProvider>
        <div className="app-frame">
          <Sidebar open={menuAberto} onNavigate={() => setMenuAberto(false)} />
          {menuAberto && <div className="app-backdrop" onClick={() => setMenuAberto(false)} />}
          <div className="app-main">
            <header className="app-topbar">
              <button
                className="app-menu-btn"
                aria-label={t(menuAberto ? 'a11y.fecharMenu' : 'a11y.abrirMenu')}
                aria-expanded={menuAberto}
                onClick={() => setMenuAberto((v) => !v)}
              >
                ☰
              </button>
              <span className="app-topbar-title">{t('app.nome')}</span>
            </header>
            <main className="app-content">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Navigate to="/testes" replace />} />
                  <Route path="/painel" element={<Painel />} />
                  <Route path="/testes" element={<Testes />} />
                  <Route path="/log" element={<Log />} />
                  <Route path="*" element={<Navigate to="/testes" replace />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </ToastProvider>
    </CardsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    </AuthProvider>
  );
}
