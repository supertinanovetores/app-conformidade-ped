import type { Card, LogEntry } from '../data/types';

export const STORAGE_KEY = 'nv-pd-cards';
export const LOG_KEY = 'nv-pd-log';

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

export function loadLog(): LogEntry[] | null {
  const raw = localStorage.getItem(LOG_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : null;
  } catch {
    return null;
  }
}

export function saveLog(log: LogEntry[]): void {
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}
