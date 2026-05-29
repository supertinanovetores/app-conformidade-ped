import { describe, it, expect } from 'vitest';
import { contarStatus, filtrarCards, contarPor } from './derive';
import type { Card } from './types';

function mk(p: Partial<Card>): Card {
  return { id: Math.random().toString(), titulo: 't', categoria: 'materiaprima', fase: 'Desenvolvimento', status: '', notas: '', criadoEm: 0, etapas: [], ...p };
}

describe('derive', () => {
  const cards = [
    mk({ status: 'conforme', categoria: 'zeta', fase: 'Validação' }),
    mk({ status: 'conforme', categoria: 'materiaprima' }),
    mk({ status: 'parcial' }),
    mk({ status: 'reprovado' }),
    mk({ status: '' }),
  ];

  it('contarStatus conta cada status e o total', () => {
    expect(contarStatus(cards)).toEqual({ conforme: 2, parcial: 1, reprovado: 1, total: 5 });
  });

  it('filtrarCards filtra por categoria', () => {
    expect(filtrarCards(cards, { categoria: 'zeta', status: '', fase: '' })).toHaveLength(1);
  });

  it('filtrarCards combina filtros (status + fase)', () => {
    expect(filtrarCards(cards, { categoria: '', status: 'conforme', fase: 'Validação' })).toHaveLength(1);
  });

  it('filtrarCards sem filtros retorna tudo', () => {
    expect(filtrarCards(cards, { categoria: '', status: '', fase: '' })).toHaveLength(5);
  });

  it('contarPor agrupa por chave', () => {
    expect(contarPor(cards, 'categoria').zeta).toBe(1);
    expect(contarPor(cards, 'categoria').materiaprima).toBe(4);
  });
});
