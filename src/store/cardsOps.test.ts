import { describe, it, expect } from 'vitest';
import { createCard, updateCard, removeCard, updateEtapas, duplicateCard } from './cardsOps';
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

  it('duplicateCard copia como modelo, zerando resultados e recarimbando autor', () => {
    const orig: Card = {
      ...base, titulo: 'Ensaio Zeta', status: 'conforme', notas: 'tudo ok',
      etapas: [{ id: 'e1', titulo: 'Leitura', fase: 'Validação', feedback: 'estável' }],
    };
    const out = duplicateCard([orig], 'c1', outro);
    expect(out).toHaveLength(2);
    const copia = out[1];
    expect(copia.titulo).toBe('Ensaio Zeta (cópia)');
    expect(copia.id).not.toBe(orig.id);
    expect(copia.status).toBe('');
    expect(copia.notas).toBe('');
    expect(copia.criadoPor).toEqual(outro);
    // estrutura de etapas preservada, mas feedback e id novos
    expect(copia.etapas[0].titulo).toBe('Leitura');
    expect(copia.etapas[0].fase).toBe('Validação');
    expect(copia.etapas[0].feedback).toBe('');
    expect(copia.etapas[0].id).not.toBe('e1');
  });

  it('duplicateCard com id inexistente devolve a lista intacta', () => {
    expect(duplicateCard([base], 'x', outro)).toHaveLength(1);
  });
});
