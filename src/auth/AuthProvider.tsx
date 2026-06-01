import { useMemo, type ReactNode } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './msalConfig';

export function AuthProvider({ children }: { children: ReactNode }) {
  // PublicClientApplication é criado uma única vez.
  const instance = useMemo(() => new PublicClientApplication(msalConfig), []);
  return <MsalProvider instance={instance}>{children}</MsalProvider>;
}
