import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../auth/CurrentUserContext', () => ({
  useAuth: () => ({ usuario: null, autenticado: false, login: () => {}, logout: () => {} }),
}));

import { CardModal } from './Testes';
import { LanguageProvider, LANG_KEY } from '../i18n/LanguageContext';
import { ToastProvider } from '../components/Toast';

function renderModal(onSubmit = vi.fn()) {
  render(
    <LanguageProvider>
      <ToastProvider>
        <CardModal onClose={() => {}} onSubmit={onSubmit} />
      </ToastProvider>
    </LanguageProvider>,
  );
  return onSubmit;
}

const ERRO = 'Campo obrigatório';

describe('CardModal — validação inline', () => {
  beforeEach(() => { localStorage.setItem(LANG_KEY, 'pt'); });

  it('não envia e mostra um erro por campo obrigatório vazio', () => {
    const onSubmit = renderModal();
    fireEvent.click(screen.getByText('Criar card'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText(ERRO)).toHaveLength(3); // título, categoria, fase
  });

  it('envia quando os obrigatórios estão preenchidos', () => {
    const onSubmit = renderModal();
    fireEvent.change(screen.getByPlaceholderText('Ex: Verificação de pH da amostra A'), { target: { value: 'pH amostra A' } });
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'zeta' } });
    fireEvent.change(selects[1], { target: { value: 'Validação' } });
    fireEvent.click(screen.getByText('Criar card'));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ titulo: 'pH amostra A', categoria: 'zeta', fase: 'Validação' }));
    expect(screen.queryByText(ERRO)).not.toBeInTheDocument();
  });

  it('limpa o erro do campo ao corrigi-lo', () => {
    renderModal();
    fireEvent.click(screen.getByText('Criar card'));
    expect(screen.getAllByText(ERRO)).toHaveLength(3);
    fireEvent.change(screen.getByPlaceholderText('Ex: Verificação de pH da amostra A'), { target: { value: 'algo' } });
    expect(screen.getAllByText(ERRO)).toHaveLength(2);
  });
});
