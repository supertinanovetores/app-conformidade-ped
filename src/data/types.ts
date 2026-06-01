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
  foto?: string; // data URL da foto de perfil (Microsoft Graph), quando disponível
}

export interface Card {
  id: string;
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  status: Status;
  notas: string;
  solicitante?: string;
  responsavel?: string;
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

export type Ordem = 'recentes' | 'antigos' | 'titulo' | 'status';

export type LogAcao = 'criou' | 'editou' | 'duplicou' | 'excluiu';

export interface LogEntry {
  id: string;
  ts: number;
  autor: Usuario;
  acao: LogAcao;
  cardId: string;
  cardTitulo: string;
  detalhe?: string;
}
