import type { Card, Filtros } from './types';

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
