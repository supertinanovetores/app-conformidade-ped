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
