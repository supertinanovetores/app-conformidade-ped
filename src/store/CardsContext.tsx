import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Card, Etapa, Usuario } from '../data/types';
import { loadCards, saveCards } from './storage';
import { SEED_CARDS } from '../data/seed';
import { useAuth } from '../auth/useAuth';
import * as ops from './cardsOps';

interface CardsCtx {
  cards: Card[];
  create: (dados: ops.NovoCard) => void;
  update: (id: string, patch: Partial<Card>) => void;
  remove: (id: string) => void;
  setEtapas: (id: string, etapas: Etapa[]) => void;
}

const Ctx = createContext<CardsCtx | null>(null);

const AUTOR_FALLBACK: Usuario = { nome: 'Desconhecido', email: '' };

export function CardsProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [cards, setCards] = useState<Card[]>(() => loadCards() ?? SEED_CARDS);

  useEffect(() => { saveCards(cards); }, [cards]);

  // Autor resolvido a cada operação a partir do usuário logado.
  const autor = () => usuario ?? AUTOR_FALLBACK;

  const value: CardsCtx = {
    cards,
    create: (dados) => setCards((cs) => ops.createCard(cs, dados, autor())),
    update: (id, patch) => setCards((cs) => ops.updateCard(cs, id, patch, autor())),
    remove: (id) => setCards((cs) => ops.removeCard(cs, id)),
    setEtapas: (id, etapas) => setCards((cs) => ops.updateEtapas(cs, id, etapas, autor())),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCards(): CardsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCards deve ser usado dentro de <CardsProvider>');
  return ctx;
}
