import { describe, it, expect } from 'vitest';
import { cardsToCsv } from './csv';
import type { Card } from '../data/types';
import { pt } from '../i18n/pt';
import { en } from '../i18n/en';
import type { DictKey } from '../i18n/types';

const tPt = (k: DictKey) => pt[k];
const tEn = (k: DictKey) => en[k];

const card: Card = {
  id: 'c1', titulo: 'pH "A"', categoria: 'materiaprima', fase: 'Desenvolvimento',
  status: 'conforme', notas: 'ok; ver', criadoEm: 0,
  etapas: [{ id: 'e1', titulo: 'Coleta', fase: 'Desenvolvimento', feedback: 'sem contaminação' }],
  criadoPor: { nome: 'Ana Souza', email: 'ana@nanovetores.com.br' },
  atualizadoPor: { nome: 'Bia Lima', email: 'bia@nanovetores.com.br' },
  atualizadoEm: 0,
};

describe('cardsToCsv', () => {
  it('inclui cabeçalho e uma linha por card', () => {
    const csv = cardsToCsv([card], tPt, 'pt');
    const linhas = csv.trim().split('\n');
    expect(linhas).toHaveLength(2);
    expect(linhas[0]).toContain('Titulo');
  });
  it('escapa aspas duplicando e usa separador ;', () => {
    const csv = cardsToCsv([card], tPt, 'pt');
    expect(csv).toContain('"pH ""A"""');
    expect(csv).toContain('Matérias-primas');
  });
  it('traduz cabeçalho e rótulos de domínio em inglês', () => {
    const csv = cardsToCsv([card], tEn, 'en');
    expect(csv).toContain('Title');
    expect(csv).toContain('Raw materials');
    expect(csv).toContain('Compliant');
    expect(csv).toContain('Development');
  });
  it('serializa etapas e feedbacks', () => {
    const csv = cardsToCsv([card], tPt, 'pt');
    expect(csv).toContain('Coleta');
    expect(csv).toContain('sem contaminação');
  });
  it('inclui colunas e valores de autoria', () => {
    const csv = cardsToCsv([card], tPt, 'pt');
    expect(csv).toContain('Criado por');
    expect(csv).toContain('Editado por');
    expect(csv).toContain('Ana Souza');
    expect(csv).toContain('Bia Lima');
  });
  it('usa "Sistema"/"—" quando a autoria está ausente', () => {
    const semAutor: Card = { ...card, criadoPor: undefined, atualizadoPor: undefined };
    const csv = cardsToCsv([semAutor], tPt, 'pt');
    expect(csv).toContain('Sistema');
  });
});
