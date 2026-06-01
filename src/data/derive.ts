import type { Card, Filtros, Ordem, Status } from './types';

export interface ContagemStatus {
  conforme: number;
  parcial: number;
  reprovado: number;
  total: number;
}

export function contarStatus(cards: Card[]): ContagemStatus {
  return {
    conforme: cards.filter((c) => c.status === 'conforme').length,
    parcial: cards.filter((c) => c.status === 'parcial').length,
    reprovado: cards.filter((c) => c.status === 'reprovado').length,
    total: cards.length,
  };
}

export function filtrarCards(cards: Card[], f: Filtros): Card[] {
  return cards.filter(
    (c) =>
      (!f.categoria || c.categoria === f.categoria) &&
      (!f.status || c.status === f.status) &&
      (!f.fase || c.fase === f.fase),
  );
}

export function contarPor<K extends keyof Card>(cards: Card[], chave: K): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of cards) {
    const k = String(c[chave]);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

/** Agrupa e conta cards por um campo de texto (solicitante/responsável), do maior para o menor. */
export function contarTexto(cards: Card[], campo: 'solicitante' | 'responsavel'): { label: string; value: number }[] {
  const mapa = new Map<string, number>();
  for (const c of cards) {
    const v = c[campo]?.trim() || 'Não informado';
    mapa.set(v, (mapa.get(v) ?? 0) + 1);
  }
  return [...mapa.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

// minúsculas e sem acentos, para busca tolerante
function normalizarBusca(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function buscarCards(cards: Card[], termo: string): Card[] {
  const t = normalizarBusca(termo.trim());
  if (!t) return cards;
  return cards.filter(
    (c) => normalizarBusca(c.titulo).includes(t) || normalizarBusca(c.notas).includes(t),
  );
}

// Ordena por status surfaceando o que precisa de atenção primeiro.
const STATUS_RANK: Record<Status, number> = { reprovado: 0, parcial: 1, conforme: 2, '': 3 };

export function ordenarCards(cards: Card[], ordem: Ordem): Card[] {
  const arr = [...cards];
  switch (ordem) {
    case 'antigos':
      return arr.sort((a, b) => a.criadoEm - b.criadoEm);
    case 'titulo':
      return arr.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
    case 'status':
      return arr.sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
    case 'recentes':
    default:
      return arr.sort((a, b) => b.criadoEm - a.criadoEm);
  }
}
