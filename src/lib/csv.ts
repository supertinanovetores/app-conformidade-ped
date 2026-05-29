import type { Card } from '../data/types';
import { CATEGORIAS } from '../data/constants';

const q = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"';

const CABECALHO = ['Titulo', 'Categoria', 'Fase', 'Status', 'Notas', 'Etapas', 'Fases das etapas', 'Feedbacks', 'Criado em'];

export function cardsToCsv(cards: Card[]): string {
  const cab = CABECALHO.map(q).join(';');
  const linhas = cards.map((c) => {
    const etapas = c.etapas.map((e) => e.titulo).join(' | ');
    const fases = c.etapas.map((e) => e.fase || '—').join(' | ');
    const feedbacks = c.etapas.map((e) => `${e.titulo}: ${e.feedback || '—'}`).join(' | ');
    const data = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR') : '—';
    return [c.titulo, CATEGORIAS[c.categoria], c.fase, c.status || '—', c.notas, etapas, fases, feedbacks, data]
      .map(q)
      .join(';');
  });
  return [cab, ...linhas].join('\n');
}
