import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { CardsProvider } from './store/CardsContext';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Painel } from './screens/Painel';
import { Conformidade } from './screens/Conformidade';
import { Log } from './screens/Log';

function AppShell() {
  return (
    <CardsProvider>
      <ToastProvider>
        <div className="app-frame">
          <Sidebar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/conformidade" replace />} />
              <Route path="/painel" element={<Painel />} />
              <Route path="/conformidade" element={<Conformidade />} />
              <Route path="/log" element={<Log />} />
              <Route path="*" element={<Navigate to="/conformidade" replace />} />
            </Routes>
          </main>
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
