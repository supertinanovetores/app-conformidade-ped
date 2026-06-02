import { describe, it, expect } from 'vitest';
import { pt } from './pt';
import { en } from './en';

// Guarda de invariante: os dois dicionários devem ter exatamente o mesmo
// conjunto de chaves. O `tsc` já garante isso via tipos, mas este teste
// dá uma mensagem clara e protege em runtime conforme os dicionários crescem.
describe('paridade dos dicionários pt/en', () => {
  const ptKeys = Object.keys(pt).sort();
  const enKeys = Object.keys(en).sort();

  it('pt e en têm o mesmo conjunto de chaves', () => {
    expect(enKeys).toEqual(ptKeys);
  });

  it('nenhuma tradução está vazia', () => {
    for (const [k, v] of [...Object.entries(pt), ...Object.entries(en)]) {
      expect(v, `chave "${k}" não pode ser vazia`).toBeTruthy();
    }
  });
});
