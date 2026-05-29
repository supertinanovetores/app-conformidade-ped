import { describe, it, expect } from 'vitest';
import { createCard, updateCard, removeCard, updateEtapas } from './cardsOps';
import type { Card } from '../data/types';

const base: Card = {
  id: 'c1', titulo: 'Teste', categoria: 'materiaprima', fase: 'Desenvolvimento',
  status: '', notas: '', criadoEm: 1, etapas: [],
};

describe('cardsOps', () => {
  it('createCard adiciona um card novo com id e criadoEm', () => {
    const out = createCard([], { titulo: 'Novo', categoria: 'zeta', fase: 'Validação', etapasTitulos: ['A', 'B'] });
    expect(out).toHaveLength(1);
    expect(out[0].titulo).toBe('Novo');
    expect(out[0].id).toBeTruthy();
    expect(out[0].etapas).toHaveLength(2);
    expect(out[0].etapas[0].fase).toBe('Validação');
  });
  it('createCard não muta o array original', () => {
    const orig: Card[] = [];
    createCard(orig, { titulo: 'X', categoria: 'zeta', fase: 'Validação', etapasTitulos: [] });
    expect(orig).toHaveLength(0);
  });
  it('updateCard altera apenas o card alvo', () => {
    const out = updateCard([base], 'c1', { status: 'conforme', notas: 'ok' });
    expect(out[0].status).toBe('conforme');
    expect(out[0].notas).toBe('ok');
    expect(out[0].titulo).toBe('Teste');
  });
  it('removeCard remove pelo id', () => {
    expect(removeCard([base], 'c1')).toHaveLength(0);
    expect(removeCard([base], 'x')).toHaveLength(1);
  });
  it('updateEtapas substitui as etapas do card', () => {
    const etapas = [{ id: 'e1', titulo: 'P', fase: '' as const, feedback: '' }];
    const out = updateEtapas([base], 'c1', etapas);
    expect(out[0].etapas).toEqual(etapas);
  });
});
