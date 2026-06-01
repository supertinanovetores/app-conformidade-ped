import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

const h = vi.hoisted(() => ({ accounts: [] as Array<{ name?: string; username: string }> }));

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
      acquireTokenSilent: vi.fn(() => Promise.reject(new Error('sem token no teste'))),
    },
    accounts: h.accounts,
  }),
  useIsAuthenticated: () => h.accounts.length > 0,
}));

import { CurrentUserProvider, useAuth } from './CurrentUserContext';

const wrapper = ({ children }: { children: ReactNode }) => <CurrentUserProvider>{children}</CurrentUserProvider>;

describe('useAuth / CurrentUserProvider', () => {
  beforeEach(() => { h.accounts = []; });

  it('mapeia a conta logada para usuario { nome, email }', () => {
    h.accounts = [{ name: 'Ana Souza', username: 'ana@nanovetores.com.br' }];
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.autenticado).toBe(true);
    expect(result.current.usuario).toEqual({ nome: 'Ana Souza', email: 'ana@nanovetores.com.br' });
  });

  it('usa o username como nome quando name está ausente', () => {
    h.accounts = [{ username: 'sem-nome@nanovetores.com.br' }];
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.usuario?.nome).toBe('sem-nome@nanovetores.com.br');
  });

  it('retorna usuario null e não autenticado quando não há conta', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.autenticado).toBe(false);
    expect(result.current.usuario).toBeNull();
  });
});
