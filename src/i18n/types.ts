import { pt } from './pt';

export type Lang = 'pt' | 'en';

/** Conjunto de chaves de tradução, derivado do dicionário PT. */
export type Dict = typeof pt;
export type DictKey = keyof Dict;
