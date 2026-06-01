import type { Card, Usuario } from '../data/types';
import { CATEGORIAS } from '../data/constants';

const q = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"';

const autorTexto = (u: Usuario | undefined, vazio: string) =>
  u ? `${u.nome} <${u.email}>` : vazio;

const CABECALHO = ['Titulo', 'Categoria', 'Fase', 'Status', 'Solicitante', 'Responsavel', 'Notas', 'Etapas', 'Fases das etapas', 'Feedbacks', 'Criado em', 'Criado por', 'Editado por'];

export function cardsToCsv(cards: Card[]): string {
  const cab = CABECALHO.map(q).join(';');
  const linhas = cards.map((c) => {
    const etapas = c.etapas.map((e) => e.titulo).join(' | ');
    const fases = c.etapas.map((e) => e.fase || '—').join(' | ');
    const feedbacks = c.etapas.map((e) => `${e.titulo}: ${e.feedback || '—'}`).join(' | ');
    const data = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR') : '—';
    const criadoPor = autorTexto(c.criadoPor, 'Sistema');
    const editadoPor = autorTexto(c.atualizadoPor, '—');
    return [c.titulo, CATEGORIAS[c.categoria], c.fase, c.status || '—', c.solicitante || '—', c.responsavel || '—', c.notas, etapas, fases, feedbacks, data, criadoPor, editadoPor]
      .map(q)
      .join(';');
  });
  return [cab, ...linhas].join('\n');
}
