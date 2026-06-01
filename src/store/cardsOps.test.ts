import { describe, it, expect } from 'vitest';
import { createCard, updateCard, removeCard, updateEtapas } from './cardsOps';
import type { Card, Usuario } from '../data/types';

const autor: Usuario = { nome: 'Ana Souza', email: 'ana@nanovetores.com.br' };
const outro: Usuario = { nome: 'Bia Lima', email: 'bia@nanovetores.com.br' };

const base: Card = {
  id: 'c1', titulo: 'Teste', categoria: 'materiaprima', fase: 'Desenvolvimento',
  status: '', notas: '', criadoEm: 1, etapas: [], criadoPor: autor, atualizadoPor: autor, atualizadoEm: 1,
};

describe('cardsOps', () => {
  it('createCard adiciona um card novo com id e criadoEm', () => {
    const out = createCard([], { titulo: 'Novo', categoria: 'zeta', fase: 'Validação', etapasTitulos: ['A', 'B'] }, autor);
    expect(out).toHaveLength(1);
    expect(out[0].titulo).toBe('Novo');
    expect(out[0].id).toBeTruthy();
    expect(out[0].etapas).toHaveLength(2);
    expect(out[0].etapas[0].fase).toBe('Validação');
  });
  it('createCard carimba o criador e o último editor', () => {
    const out = createCard([], { titulo: 'X', categoria: 'zeta', fase: 'Validação', etapasTitulos: [] }, autor);
    expect(out[0].criadoPor).toEqual(autor);
    expect(out[0].atualizadoPor).toEqual(autor);
    expect(out[0].atualizadoEm).toBeGreaterThan(0);
  });
  it('createCard não muta o array original', () => {
    const orig: Card[] = [];
    createCard(orig, { titulo: 'X', categoria: 'zeta', fase: 'Validação', etapasTitulos: [] }, autor);
    expect(orig).toHaveLength(0);
  });
  it('updateCard altera apenas o card alvo e registra o editor sem mexer no criador', () => {
    const out = updateCard([base], 'c1', { status: 'conforme', notas: 'ok' }, outro);
    expect(out[0].status).toBe('conforme');
    expect(out[0].notas).toBe('ok');
    expect(out[0].titulo).toBe('Teste');
    expect(out[0].criadoPor).toEqual(autor);
    expect(out[0].atualizadoPor).toEqual(outro);
    expect(out[0].atualizadoEm).toBeGreaterThan(1);
  });
  it('removeCard remove pelo id', () => {
    expect(removeCard([base], 'c1')).toHaveLength(0);
    expect(removeCard([base], 'x')).toHaveLength(1);
  });
  it('updateEtapas substitui as etapas e registra o editor', () => {
    const etapas = [{ id: 'e1', titulo: 'P', fase: '' as const, feedback: '' }];
    const out = updateEtapas([base], 'c1', etapas, outro);
    expect(out[0].etapas).toEqual(etapas);
    expect(out[0].atualizadoPor).toEqual(outro);
    expect(out[0].atualizadoEm).toBeGreaterThan(1);
  });
});
