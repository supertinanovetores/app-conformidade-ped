import type { Card, Categoria, Fase, Etapa } from '../data/types';
import { uid } from '../lib/uid';

export interface NovoCard {
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  etapasTitulos: string[];
}

export function createCard(cards: Card[], dados: NovoCard): Card[] {
  const card: Card = {
    id: uid(),
    titulo: dados.titulo,
    categoria: dados.categoria,
    fase: dados.fase,
    status: '',
    notas: '',
    criadoEm: Date.now(),
    etapas: dados.etapasTitulos.map((t) => ({ id: uid(), titulo: t, fase: dados.fase, feedback: '' })),
  };
  return [...cards, card];
}

export function updateCard(cards: Card[], id: string, patch: Partial<Card>): Card[] {
  return cards.map((c) => (c.id === id ? { ...c, ...patch } : c));
}

export function removeCard(cards: Card[], id: string): Card[] {
  return cards.filter((c) => c.id !== id);
}

export function updateEtapas(cards: Card[], id: string, etapas: Etapa[]): Card[] {
  return cards.map((c) => (c.id === id ? { ...c, etapas } : c));
}
