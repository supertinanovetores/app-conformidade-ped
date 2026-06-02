import type { Categoria, Status, Fase, Ordem } from './types';

// Valores/enums de domínio (o que é gravado nos cards e alimenta os <select>).
// Os rótulos legíveis vivem nos dicionários de i18n (src/i18n/pt.ts e en.ts) e
// são resolvidos via t(...) usando os helpers em src/i18n/labels.ts.

export const CATEGORIAS: Categoria[] = [
  'materiaprima', 'compatibilidade', 'zeta', 'solubilidade', 'homogeneidade', 'aspectos',
];

export const STATUS_VALUES: Exclude<Status, ''>[] = ['conforme', 'parcial', 'reprovado'];

export const FASES: Fase[] = ['Desenvolvimento', 'Validação', 'Liberação'];

export const ORDENS: Ordem[] = ['recentes', 'antigos', 'titulo', 'status'];

// Mapeia fase -> sufixo de classe usado no fluxograma (.fase-dev/-val/-lib)
export const FASE_CLASSE: Record<Fase, string> = {
  Desenvolvimento: 'fase-dev',
  Validação: 'fase-val',
  Liberação: 'fase-lib',
};
