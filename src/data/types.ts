export type Status = '' | 'conforme' | 'parcial' | 'reprovado';
export type Fase = 'Desenvolvimento' | 'Validação' | 'Liberação';
export type Categoria =
  | 'materiaprima' | 'compatibilidade' | 'zeta'
  | 'solubilidade' | 'homogeneidade' | 'aspectos';

export interface Etapa {
  id: string;
  titulo: string;
  fase: Fase | '';
  feedback: string;
}

export interface Usuario {
  nome: string;
  email: string;
}

export interface Card {
  id: string;
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  status: Status;
  notas: string;
  criadoEm: number;
  etapas: Etapa[];
  criadoPor?: Usuario;
  atualizadoPor?: Usuario;
  atualizadoEm?: number;
}

export interface Filtros {
  categoria: Categoria | '';
  status: Status;
  fase: Fase | '';
}
