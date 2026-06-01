import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import type { Usuario } from '../data/types';
import { loginRequest } from './msalConfig';

interface AuthCtx {
  usuario: Usuario | null;
  autenticado: boolean;
  login: () => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const autenticado = useIsAuthenticated();
  const conta = accounts[0];
  const [foto, setFoto] = useState<string | undefined>(undefined);

  // Busca a foto de perfil no Microsoft Graph (escopo User.Read já cobre).
  useEffect(() => {
    let cancelado = false;
    if (!conta) { setFoto(undefined); return; }
    (async () => {
      try {
        const { accessToken } = await instance.acquireTokenSilent({ ...loginRequest, account: conta });
        const resp = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!resp.ok) return; // sem foto cadastrada → cai no fallback de iniciais
        const dataUrl = await blobToDataUrl(await resp.blob());
        if (!cancelado) setFoto(dataUrl);
      } catch {
        /* falha silenciosa: usa as iniciais */
      }
    })();
    return () => { cancelado = true; };
  }, [instance, conta]);

  const usuario: Usuario | null = conta
    ? { nome: conta.name ?? conta.username, email: conta.username, foto }
    : null;

  const value: AuthCtx = {
    usuario,
    autenticado,
    login: () => { void instance.loginRedirect(loginRequest); },
    logout: () => { void instance.logoutRedirect(); },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <CurrentUserProvider>');
  return ctx;
}
