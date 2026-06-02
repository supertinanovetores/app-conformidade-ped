import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LanguageProvider, LANG_KEY } from '../i18n/LanguageContext';

function renderSwitcher() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => { localStorage.setItem(LANG_KEY, 'pt'); });

  it('renderiza os dois botões de idioma', () => {
    renderSwitcher();
    expect(screen.getByRole('button', { name: 'Português' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('marca o idioma ativo com aria-pressed', () => {
    renderSwitcher();
    expect(screen.getByRole('button', { name: 'Português' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('troca o idioma ao clicar na bandeira inativa', () => {
    renderSwitcher();
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Português' })).toHaveAttribute('aria-pressed', 'false');
    expect(localStorage.getItem(LANG_KEY)).toBe('en');
  });
});
