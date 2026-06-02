import type { Card } from './types';
import type { Lang } from '../i18n/types';
import { SEED_PT } from './seed.pt';
import { SEED_EN } from './seed.en';

/** Cards-semente no idioma inicial detectado (gravados só no primeiro acesso). */
export function seedFor(lang: Lang): Card[] {
  return lang === 'en' ? SEED_EN : SEED_PT;
}
