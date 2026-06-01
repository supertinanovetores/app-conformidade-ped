import type { Configuration } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MSAL_CLIENT_ID ?? '';
const tenantId = import.meta.env.VITE_MSAL_TENANT_ID ?? '';
const redirectUri = import.meta.env.VITE_MSAL_REDIRECT_URI ?? window.location.origin;

/** Verdadeiro só quando as variáveis essenciais estão presentes. */
export const msalConfigurado = Boolean(clientId && tenantId);

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
};

/** Escopos pedidos no login: identidade básica do usuário. */
export const loginRequest = {
  scopes: ['User.Read'],
};
