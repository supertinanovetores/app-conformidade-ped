import { describe, it, expect, beforeEach } from 'vitest';
import { loadCards, saveCards, STORAGE_KEY } from './storage';
import type { Card } from '../data/types';

const card: Card = { id: 'c1', titulo: 't', categoria: 'zeta', fase: 'Validação', status: '', notas: '', criadoEm: 0, etapas: [] };

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('saveCards persiste e loadCards lê de volta', () => {
    saveCards([card]);
    expect(loadCards()).toEqual([card]);
  });

  it('loadCards retorna null quando vazio', () => {
    expect(loadCards()).toBeNull();
  });

  it('loadCards retorna null com JSON inválido', () => {
    localStorage.setItem(STORAGE_KEY, '{nao-json');
    expect(loadCards()).toBeNull();
  });
});
