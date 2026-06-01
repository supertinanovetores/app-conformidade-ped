import { describe, it, expect } from 'vitest';
import { donutSegmentos } from './charts';

const C = 100; // circunferência fácil de conferir

describe('donutSegmentos', () => {
  it('distribui o comprimento proporcionalmente e soma a circunferência', () => {
    const segs = donutSegmentos(
      [
        { label: 'A', value: 3, cor: '#a' },
        { label: 'B', value: 1, cor: '#b' },
      ],
      C,
    );
    expect(segs[0].dash).toBe(75);
    expect(segs[1].dash).toBe(25);
    expect(segs.reduce((s, x) => s + x.dash, 0)).toBeCloseTo(C);
  });

  it('acumula o offset (negativo) por segmento', () => {
    const segs = donutSegmentos(
      [
        { label: 'A', value: 1, cor: '#a' },
        { label: 'B', value: 1, cor: '#b' },
      ],
      C,
    );
    expect(segs[0].offset).toBe(0);
    expect(segs[1].offset).toBe(-50);
    expect(segs[0].pct).toBe(50);
  });

  it('com total zero, tudo fica zerado (sem divisão por zero)', () => {
    const segs = donutSegmentos([{ label: 'A', value: 0, cor: '#a' }], C);
    expect(segs[0].dash).toBe(0);
    expect(segs[0].pct).toBe(0);
  });
});
