import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Lang, DictKey } from './types';
import { pt } from './pt';
import { en } from './en';

export const LANG_KEY = 'nv-pd-lang';

const DICTS = { pt, en } as const;

interface I18nCtx {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

/** Resolve o idioma inicial: escolha salva > idioma do navegador > PT. */
export function detectLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'pt' || saved === 'en') return saved;
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'pt';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en';
  }

  const t = (key: DictKey): string => DICTS[lang][key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n deve ser usado dentro de <LanguageProvider>');
  return ctx;
}
