import { useAuth } from '../auth/CurrentUserContext';
import { useI18n } from '../i18n/LanguageContext';
import { msalConfigurado } from '../auth/msalConfig';

export function Login() {
  const { login } = useAuth();
  const { t } = useI18n();

  return (
    <div className="login-tela">
      <div className="login-card">
        <img className="login-logo" src="/assets/simbolo.png" alt="Nanovetores" />
        <div className="login-kicker">Nanovetores</div>
        <h1 className="login-titulo">{t('app.nome')}</h1>
        <p className="login-sub">{t('login.subtitulo')}</p>

        {msalConfigurado ? (
          <button className="login-btn" onClick={login}>
            <span className="login-btn-ms" aria-hidden>⊞</span>
            {t('login.entrar')}
          </button>
        ) : (
          <div className="login-aviso">
            {t('login.naoConfigPre')}<code>VITE_MSAL_CLIENT_ID</code>{t('login.naoConfigMid')}
            <code>VITE_MSAL_TENANT_ID</code>{t('login.naoConfigFile')}<code>.env</code>.
          </div>
        )}
      </div>
    </div>
  );
}
