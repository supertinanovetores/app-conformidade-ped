import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LanguageProvider, useI18n, LANG_KEY } from './LanguageContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

function mockNavigatorLanguage(value: string) {
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(value);
}

describe('LanguageProvider / useI18n', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('usa português por padrão quando o idioma do navegador não é inglês', () => {
    mockNavigatorLanguage('es-ES');
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.lang).toBe('pt');
  });

  it('usa inglês quando o idioma do navegador começa com "en"', () => {
    mockNavigatorLanguage('en-US');
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.lang).toBe('en');
  });

  it('respeita o idioma salvo no localStorage acima do navegador', () => {
    mockNavigatorLanguage('en-US');
    localStorage.setItem(LANG_KEY, 'pt');
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.lang).toBe('pt');
  });

  it('setLang troca o idioma, a tradução e persiste no localStorage', () => {
    mockNavigatorLanguage('pt-BR');
    const { result } = renderHook(() => useI18n(), { wrapper });

    const ptLabel = result.current.t('nav.painel');

    act(() => result.current.setLang('en'));

    expect(result.current.lang).toBe('en');
    expect(result.current.t('nav.painel')).not.toBe(ptLabel);
    expect(localStorage.getItem(LANG_KEY)).toBe('en');
  });

  it('t devolve a string traduzida da chave no idioma atual', () => {
    mockNavigatorLanguage('pt-BR');
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(typeof result.current.t('nav.painel')).toBe('string');
    expect(result.current.t('nav.painel').length).toBeGreaterThan(0);
  });
});
