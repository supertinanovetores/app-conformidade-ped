import type { Card } from '../data/types';

export const STORAGE_KEY = 'nv-pd-cards';

export function loadCards(): Card[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Card[]) : null;
  } catch {
    return null;
  }
}

export function saveCards(cards: Card[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}
