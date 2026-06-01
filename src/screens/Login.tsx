import { useAuth } from '../auth/useAuth';
import { msalConfigurado } from '../auth/msalConfig';

export function Login() {
  const { login } = useAuth();

  return (
    <div className="login-tela">
      <div className="login-card">
        <img className="login-logo" src="/assets/simbolo.png" alt="Nanovetores" />
        <div className="login-kicker">Nanovetores</div>
        <h1 className="login-titulo">Conformidade P&amp;D</h1>
        <p className="login-sub">Acesso restrito a contas Nanovetores.</p>

        {msalConfigurado ? (
          <button className="login-btn" onClick={login}>
            <span className="login-btn-ms" aria-hidden>⊞</span>
            Entrar com Microsoft
          </button>
        ) : (
          <div className="login-aviso">
            Login não configurado. Defina <code>VITE_MSAL_CLIENT_ID</code> e{' '}
            <code>VITE_MSAL_TENANT_ID</code> no arquivo <code>.env</code>.
          </div>
        )}
      </div>
    </div>
  );
}
