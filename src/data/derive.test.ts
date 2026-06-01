import { describe, it, expect } from 'vitest';
import { contarStatus, filtrarCards, contarPor, buscarCards, ordenarCards, contarTexto } from './derive';
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

  it('buscarCards acha por título, ignorando acento e caixa', () => {
    const lista = [mk({ titulo: 'Potencial de Zeta' }), mk({ titulo: 'pH da amostra' })];
    expect(buscarCards(lista, 'zeta')).toHaveLength(1);
    expect(buscarCards(lista, 'POTENCIAL')).toHaveLength(1);
  });

  it('buscarCards acha por notas e retorna tudo quando termo vazio', () => {
    const lista = [mk({ notas: 'turvação após 48h' }), mk({ notas: '' })];
    expect(buscarCards(lista, 'turvacao')).toHaveLength(1);
    expect(buscarCards(lista, '   ')).toHaveLength(2);
  });

  it('ordenarCards ordena por título e por mais recentes', () => {
    const lista = [
      mk({ titulo: 'Beta', criadoEm: 100 }),
      mk({ titulo: 'alfa', criadoEm: 300 }),
      mk({ titulo: 'Gama', criadoEm: 200 }),
    ];
    expect(ordenarCards(lista, 'titulo').map((c) => c.titulo)).toEqual(['alfa', 'Beta', 'Gama']);
    expect(ordenarCards(lista, 'recentes').map((c) => c.criadoEm)).toEqual([300, 200, 100]);
  });

  it('ordenarCards não muta o array original', () => {
    const lista = [mk({ criadoEm: 1 }), mk({ criadoEm: 2 })];
    const copia = [...lista];
    ordenarCards(lista, 'recentes');
    expect(lista).toEqual(copia);
  });

  it('contarTexto agrupa por solicitante e usa "Não informado" quando vazio', () => {
    const lista = [
      mk({ solicitante: 'Ana' }),
      mk({ solicitante: 'Ana' }),
      mk({ solicitante: 'Bia' }),
      mk({ solicitante: '' }),
      mk({}),
    ];
    const out = contarTexto(lista, 'solicitante');
    expect(out[0]).toEqual({ label: 'Ana', value: 2 });
    expect(out.find((x) => x.label === 'Bia')?.value).toBe(1);
    expect(out.find((x) => x.label === 'Não informado')?.value).toBe(2);
  });
});
