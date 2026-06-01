import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/CurrentUserContext';
import { Avatar } from './Avatar';

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
        <NavLink to="/log" className={({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '')}>Log</NavLink>
      </nav>
      {usuario && (
        <div className="app-user">
          <Avatar usuario={usuario} size={34} />
          <div className="app-user-info">
            <div className="app-user-nome" title={usuario.email}>{usuario.nome}</div>
            <button className="app-user-sair" onClick={logout}>Sair</button>
          </div>
        </div>
      )}
    </aside>
  );
}
