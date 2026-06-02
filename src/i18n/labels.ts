import type { DictKey } from './types';
import type { Categoria, Status, Fase, Ordem } from '../data/types';

// Helpers tipados para resolver a chave de tradução de um valor de domínio.
// Cada um retorna uma `DictKey` válida (o `tsc` garante que a chave existe).
export const categoriaKey = (c: Categoria): DictKey => `categoria.${c}`;
export const statusKey = (s: Exclude<Status, ''>): DictKey => `status.${s}`;
export const faseKey = (f: Fase): DictKey => `fase.${f}`;
export const ordemKey = (o: Ordem): DictKey => `ordem.${o}`;
