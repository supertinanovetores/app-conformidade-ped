import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const a = partes[0]?.[0] ?? '';
  const b = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (a + b).toUpperCase() || '?';
}

export function Sidebar() {
  const { usuario, logout } = useAuth();

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
        <NavLink to="/conformidade" className={({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '')}>Conformidade</NavLink>
        <NavLink to="/painel" className={({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '')}>Painel</NavLink>
      </nav>
      {usuario && (
        <div className="app-user">
          <div className="app-user-avatar">{iniciais(usuario.nome)}</div>
          <div className="app-user-info">
            <div className="app-user-nome" title={usuario.email}>{usuario.nome}</div>
            <button className="app-user-sair" onClick={logout}>Sair</button>
          </div>
        </div>
      )}
    </aside>
  );
}
