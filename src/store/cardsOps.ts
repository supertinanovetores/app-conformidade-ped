import type { Card, Categoria, Fase, Etapa, Usuario } from '../data/types';
import { uid } from '../lib/uid';

export interface NovoCard {
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  etapasTitulos: string[];
  solicitante?: string;
  responsavel?: string;
}

export function createCard(cards: Card[], dados: NovoCard, autor: Usuario): Card[] {
  const agora = Date.now();
  const card: Card = {
    id: uid(),
    titulo: dados.titulo,
    categoria: dados.categoria,
    fase: dados.fase,
    status: '',
    notas: '',
    solicitante: dados.solicitante,
    responsavel: dados.responsavel,
    criadoEm: agora,
    etapas: dados.etapasTitulos.map((t) => ({ id: uid(), titulo: t, fase: dados.fase, feedback: '' })),
    criadoPor: autor,
    atualizadoPor: autor,
    atualizadoEm: agora,
  };
  return [...cards, card];
}

export function updateCard(cards: Card[], id: string, patch: Partial<Card>, autor: Usuario): Card[] {
  return cards.map((c) => (c.id === id ? { ...c, ...patch, atualizadoPor: autor, atualizadoEm: Date.now() } : c));
}

export function removeCard(cards: Card[], id: string): Card[] {
  return cards.filter((c) => c.id !== id);
}

export function updateEtapas(cards: Card[], id: string, etapas: Etapa[], autor: Usuario): Card[] {
  return cards.map((c) => (c.id === id ? { ...c, etapas, atualizadoPor: autor, atualizadoEm: Date.now() } : c));
}

/**
 * Duplica um card como MODELO: copia título, categoria, fase e a estrutura de
 * etapas (títulos + fases), mas zera os resultados (status, notas, feedbacks).
 */
export function duplicateCard(cards: Card[], id: string, autor: Usuario): Card[] {
  const orig = cards.find((c) => c.id === id);
  if (!orig) return cards;
  const agora = Date.now();
  const copia: Card = {
    id: uid(),
    titulo: `${orig.titulo} (cópia)`,
    categoria: orig.categoria,
    fase: orig.fase,
    status: '',
    notas: '',
    solicitante: orig.solicitante,
    responsavel: orig.responsavel,
    criadoEm: agora,
    etapas: orig.etapas.map((e) => ({ id: uid(), titulo: e.titulo, fase: e.fase, feedback: '' })),
    criadoPor: autor,
    atualizadoPor: autor,
    atualizadoEm: agora,
  };
  return [...cards, copia];
}
