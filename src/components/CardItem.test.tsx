import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Card } from '../data/types';

vi.mock('../auth/CurrentUserContext', () => ({
  useAuth: () => ({ usuario: null, autenticado: false, login: () => {}, logout: () => {} }),
}));

import { CardItem } from './CardItem';

const card: Card = { id: 'c1', titulo: 'Meu teste', categoria: 'zeta', fase: 'Validação', status: 'conforme', notas: '', criadoEm: 0, etapas: [{ id: 'e', titulo: 't', fase: '', feedback: '' }] };

const noop = () => {};

function renderCard(extra: Partial<Parameters<typeof CardItem>[0]> = {}) {
  return render(
    <CardItem
      card={card}
      onStatus={noop}
      onNotas={noop}
      onAbrir={noop}
      onEditar={noop}
      onDuplicar={noop}
      onExcluir={noop}
      {...extra}
    />,
  );
}

describe('CardItem', () => {
  it('mostra título e categoria', () => {
    renderCard();
    expect(screen.getByText('Meu teste')).toBeInTheDocument();
    expect(screen.getByText('Potencial de Zeta')).toBeInTheDocument();
  });

  it('chama onAbrir ao clicar no título', () => {
    const onAbrir = vi.fn();
    renderCard({ onAbrir });
    fireEvent.click(screen.getByText('Meu teste'));
    expect(onAbrir).toHaveBeenCalled();
  });

  it('dispara onStatus ao trocar o select', () => {
    const onStatus = vi.fn();
    renderCard({ onStatus });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reprovado' } });
    expect(onStatus).toHaveBeenCalledWith('reprovado');
  });
});
