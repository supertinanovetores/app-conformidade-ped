import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/CurrentUserContext';
import { useI18n } from '../i18n/LanguageContext';
import { Avatar } from './Avatar';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Sidebar({ open = false, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
  const { usuario, logout } = useAuth();
  const { t } = useI18n();
  const itemCls = ({ isActive }: { isActive: boolean }) => 'app-nav-item' + (isActive ? ' active' : '');

  return (
    <aside className={'app-sidebar' + (open ? ' open' : '')}>
      <div className="app-logo">
        <img src="/assets/simbolo.png" alt="Nanovetores" />
        <div>
          <div className="logo-kicker">Nanovetores</div>
          <div className="logo-brand">{t('app.nome')}</div>
        </div>
      </div>
      <nav className="app-nav">
        <NavLink to="/testes" className={itemCls} onClick={onNavigate}>{t('nav.testes')}</NavLink>
        <NavLink to="/painel" className={itemCls} onClick={onNavigate}>{t('nav.painel')}</NavLink>
        <NavLink to="/log" className={itemCls} onClick={onNavigate}>{t('nav.log')}</NavLink>
      </nav>
      <LanguageSwitcher />
      {usuario && (
        <div className="app-user">
          <Avatar usuario={usuario} size={34} />
          <div className="app-user-info">
            <div className="app-user-nome" title={usuario.email}>{usuario.nome}</div>
            <button className="app-user-sair" onClick={logout}>{t('nav.sair')}</button>
          </div>
        </div>
      )}
    </aside>
  );
}
