import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useI18n } from '../i18n/LanguageContext';

function ErroFallback() {
  const { t } = useI18n();
  return (
    <div className="erro-boundary" role="alert">
      <h2 className="erro-boundary-titulo">{t('erro.titulo')}</h2>
      <p className="erro-boundary-msg">{t('erro.mensagem')}</p>
      <button className="app-btn app-btn-primary" onClick={() => window.location.reload()}>
        {t('erro.recarregar')}
      </button>
    </div>
  );
}

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { erro: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { erro: false };

  static getDerivedStateFromError(): State {
    return { erro: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log para depuração; quando houver backend, enviar para o serviço de erros.
    console.error('ErrorBoundary capturou um erro:', error, info.componentStack);
  }

  render() {
    if (this.state.erro) {
      return this.props.fallback ?? <ErroFallback />;
    }
    return this.props.children;
  }
}
