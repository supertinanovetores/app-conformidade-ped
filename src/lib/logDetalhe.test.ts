import { describe, it, expect } from 'vitest';
import { descreverEdicao } from './logDetalhe';

describe('descreverEdicao', () => {
  it('descreve alteração de status com o rótulo legível', () => {
    expect(descreverEdicao({ status: 'conforme' })).toBe('Alterou o status para "Conforme"');
    expect(descreverEdicao({ status: 'reprovado' })).toBe('Alterou o status para "Reprovado"');
  });
  it('descreve remoção de status', () => {
    expect(descreverEdicao({ status: '' })).toBe('Removeu o status');
  });
  it('descreve edição de notas e de dados', () => {
    expect(descreverEdicao({ notas: 'x' })).toBe('Editou as notas');
    expect(descreverEdicao({ titulo: 'y' })).toBe('Editou os dados do card');
    expect(descreverEdicao({ categoria: 'zeta' })).toBe('Editou os dados do card');
  });
});
