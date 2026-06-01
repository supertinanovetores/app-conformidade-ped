import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CardItem } from './CardItem';
import type { Card } from '../data/types';

const card: Card = { id: 'c1', titulo: 'Meu teste', categoria: 'zeta', fase: 'Validação', status: 'conforme', notas: '', criadoEm: 0, etapas: [{ id: 'e', titulo: 't', fase: '', feedback: '' }] };

describe('CardItem', () => {
  it('mostra título, categoria e contagem de etapas', () => {
    render(<MemoryRouter><CardItem card={card} onStatus={() => {}} onNotas={() => {}} onExcluir={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Meu teste')).toBeInTheDocument();
    expect(screen.getByText('Potencial de Zeta')).toBeInTheDocument();
    expect(screen.getByText('Fluxograma (1 etapa)')).toBeInTheDocument();
  });
  it('dispara onStatus ao trocar o select', () => {
    const onStatus = vi.fn();
    render(<MemoryRouter><CardItem card={card} onStatus={onStatus} onNotas={() => {}} onExcluir={() => {}} /></MemoryRouter>);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reprovado' } });
    expect(onStatus).toHaveBeenCalledWith('reprovado');
  });
});
