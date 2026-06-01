import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import type { Usuario } from '../data/types';
import { loginRequest } from './msalConfig';

interface AuthCtx {
  usuario: Usuario | null;
  autenticado: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthCtx {
  const { instance, accounts } = useMsal();
  const autenticado = useIsAuthenticated();

  const conta = accounts[0];
  const usuario: Usuario | null = conta
    ? { nome: conta.name ?? conta.username, email: conta.username }
    : null;

  return {
    usuario,
    autenticado,
    login: () => { void instance.loginRedirect(loginRequest); },
    logout: () => { void instance.logoutRedirect(); },
  };
}
