import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { LanguageProvider, LANG_KEY } from '../i18n/LanguageContext';

function Bomb(): JSX.Element {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  let spy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    localStorage.setItem(LANG_KEY, 'pt');
    spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => { spy.mockRestore(); });

  it('renderiza os filhos quando não há erro', () => {
    render(<ErrorBoundary><p>conteúdo ok</p></ErrorBoundary>);
    expect(screen.getByText('conteúdo ok')).toBeInTheDocument();
  });

  it('mostra o fallback quando um filho lança', () => {
    render(
      <LanguageProvider>
        <ErrorBoundary><Bomb /></ErrorBoundary>
      </LanguageProvider>,
    );
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Recarregar')).toBeInTheDocument();
  });

  it('usa o fallback customizado quando fornecido', () => {
    render(
      <ErrorBoundary fallback={<p>deu ruim</p>}><Bomb /></ErrorBoundary>,
    );
    expect(screen.getByText('deu ruim')).toBeInTheDocument();
  });
});
