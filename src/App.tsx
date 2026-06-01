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
