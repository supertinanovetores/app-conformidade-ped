import type { Categoria, Status, Fase, Ordem } from './types';

export const CATEGORIAS: Record<Categoria, string> = {
  materiaprima: 'Matérias-primas',
  compatibilidade: 'Compatibilidade',
  zeta: 'Potencial de Zeta',
  solubilidade: 'Solubilidade',
  homogeneidade: 'Homogeneidade',
  aspectos: 'Aspectos Organolépticos',
};

export const CATEGORIA_OPTS = Object.entries(CATEGORIAS) as [Categoria, string][];

export const STATUS_LABEL: Record<Exclude<Status, ''>, string> = {
  conforme: 'Conforme',
  parcial: 'Parcial',
  reprovado: 'Reprovado',
};

export const STATUS_OPTS = Object.entries(STATUS_LABEL) as [Exclude<Status, ''>, string][];

export const FASES: Fase[] = ['Desenvolvimento', 'Validação', 'Liberação'];

// Mapeia fase -> sufixo de classe usado no fluxograma (.fase-dev/-val/-lib)
export const FASE_CLASSE: Record<Fase, string> = {
  Desenvolvimento: 'fase-dev',
  Validação: 'fase-val',
  Liberação: 'fase-lib',
};

export const ORDEM_OPTS: [Ordem, string][] = [
  ['recentes', 'Mais recentes'],
  ['antigos', 'Mais antigos'],
  ['titulo', 'Título (A–Z)'],
  ['status', 'Status'],
];
