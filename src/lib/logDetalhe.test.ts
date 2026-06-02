import { describe, it, expect } from 'vitest';
import { descreverEdicao } from './logDetalhe';
import { pt } from '../i18n/pt';
import { en } from '../i18n/en';
import type { DictKey } from '../i18n/types';

const tPt = (k: DictKey) => pt[k];
const tEn = (k: DictKey) => en[k];

describe('descreverEdicao', () => {
  it('descreve alteração de status com o rótulo legível (PT)', () => {
    expect(descreverEdicao({ status: 'conforme' }, tPt)).toBe('Alterou o status para "Conforme"');
    expect(descreverEdicao({ status: 'reprovado' }, tPt)).toBe('Alterou o status para "Reprovado"');
  });
  it('descreve alteração de status traduzida (EN)', () => {
    expect(descreverEdicao({ status: 'conforme' }, tEn)).toBe('Changed status to "Compliant"');
  });
  it('descreve remoção de status', () => {
    expect(descreverEdicao({ status: '' }, tPt)).toBe('Removeu o status');
  });
  it('descreve edição de notas e de dados', () => {
    expect(descreverEdicao({ notas: 'x' }, tPt)).toBe('Editou as notas');
    expect(descreverEdicao({ titulo: 'y' }, tPt)).toBe('Editou os dados do card');
    expect(descreverEdicao({ categoria: 'zeta' }, tPt)).toBe('Editou os dados do card');
  });
});
