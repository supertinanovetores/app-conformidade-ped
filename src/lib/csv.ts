import type { Card, Usuario } from '../data/types';
import type { DictKey, Lang } from '../i18n/types';
import { categoriaKey, statusKey, faseKey } from '../i18n/labels';

type T = (key: DictKey) => string;

const q = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"';

const autorTexto = (u: Usuario | undefined, vazio: string) =>
  u ? `${u.nome} <${u.email}>` : vazio;

export function cardsToCsv(cards: Card[], t: T, lang: Lang): string {
  const cabecalho = [
    t('csv.titulo'), t('csv.categoria'), t('csv.fase'), t('csv.status'),
    t('csv.solicitante'), t('csv.responsavel'), t('csv.notas'), t('csv.etapas'),
    t('csv.fasesEtapas'), t('csv.feedbacks'), t('csv.criadoEm'), t('csv.criadoPor'),
    t('csv.editadoPor'),
  ];
  const locale = lang === 'en' ? 'en-US' : 'pt-BR';
  const cab = cabecalho.map(q).join(';');
  const linhas = cards.map((c) => {
    const etapas = c.etapas.map((e) => e.titulo).join(' | ');
    const fases = c.etapas.map((e) => (e.fase ? t(faseKey(e.fase)) : '—')).join(' | ');
    const feedbacks = c.etapas.map((e) => `${e.titulo}: ${e.feedback || '—'}`).join(' | ');
    const data = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString(locale) : '—';
    const criadoPor = autorTexto(c.criadoPor, t('autoria.sistema'));
    const editadoPor = autorTexto(c.atualizadoPor, '—');
    return [
      c.titulo, t(categoriaKey(c.categoria)), t(faseKey(c.fase)),
      c.status ? t(statusKey(c.status)) : '—',
      c.solicitante || '—', c.responsavel || '—', c.notas, etapas, fases, feedbacks,
      data, criadoPor, editadoPor,
    ]
      .map(q)
      .join(';');
  });
  return [cab, ...linhas].join('\n');
}
