import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Card, Etapa, Usuario, LogEntry, LogAcao } from '../data/types';
import { loadCards, saveCards, loadLog, saveLog } from './storage';
import { SEED_CARDS } from '../data/seed';
import { useAuth } from '../auth/CurrentUserContext';
import { uid } from '../lib/uid';
import { descreverEdicao } from '../lib/logDetalhe';
import * as ops from './cardsOps';

interface CardsCtx {
  cards: Card[];
  log: LogEntry[];
  create: (dados: ops.NovoCard) => void;
  update: (id: string, patch: Partial<Card>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  setEtapas: (id: string, etapas: Etapa[]) => void;
}

const Ctx = createContext<CardsCtx | null>(null);

const AUTOR_FALLBACK: Usuario = { nome: 'Desconhecido', email: '' };

export function CardsProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [cards, setCards] = useState<Card[]>(() => loadCards() ?? SEED_CARDS);
  const [log, setLog] = useState<LogEntry[]>(() => loadLog() ?? []);

  useEffect(() => { saveCards(cards); }, [cards]);
  useEffect(() => { saveLog(log); }, [log]);

  // Autor resolvido a cada operação a partir do usuário logado.
  const autor = () => usuario ?? AUTOR_FALLBACK;

  const registrar = (acao: LogAcao, alvo: { id: string; titulo: string }, detalhe?: string) =>
    setLog((ls) => [
      { id: uid(), ts: Date.now(), autor: autor(), acao, cardId: alvo.id, cardTitulo: alvo.titulo, detalhe },
      ...ls,
    ]);

  const value: CardsCtx = {
    cards,
    log,
    create: (dados) => {
      setCards((cs) => ops.createCard(cs, dados, autor()));
      registrar('criou', { id: '', titulo: dados.titulo });
    },
    update: (id, patch) => {
      const alvo = cards.find((c) => c.id === id);
      setCards((cs) => ops.updateCard(cs, id, patch, autor()));
      if (alvo) registrar('editou', alvo, descreverEdicao(patch));
    },
    remove: (id) => {
      const alvo = cards.find((c) => c.id === id);
      setCards((cs) => ops.removeCard(cs, id));
      if (alvo) registrar('excluiu', alvo);
    },
    duplicate: (id) => {
      const alvo = cards.find((c) => c.id === id);
      setCards((cs) => ops.duplicateCard(cs, id, autor()));
      if (alvo) registrar('duplicou', alvo);
    },
    setEtapas: (id, etapas) => {
      const alvo = cards.find((c) => c.id === id);
      setCards((cs) => ops.updateEtapas(cs, id, etapas, autor()));
      if (alvo) registrar('editou', alvo, `Editou o fluxo (${etapas.length} etapa${etapas.length !== 1 ? 's' : ''})`);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCards(): CardsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCards deve ser usado dentro de <CardsProvider>');
  return ctx;
}
