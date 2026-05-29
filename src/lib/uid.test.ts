import { describe, it, expect } from 'vitest';
import { uid } from './uid';

describe('uid', () => {
  it('gera string não vazia', () => {
    expect(uid().length).toBeGreaterThan(5);
  });
  it('gera ids únicos em sequência', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => uid()));
    expect(ids.size).toBe(1000);
  });
});
