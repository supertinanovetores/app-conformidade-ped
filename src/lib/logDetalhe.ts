import type { Card, Status } from '../data/types';
import type { DictKey } from '../i18n/types';
import { statusKey } from '../i18n/labels';

type T = (key: DictKey) => string;

/** Descreve, em texto curto, o que uma edição de card alterou (para o log). */
export function descreverEdicao(patch: Partial<Card>, t: T): string {
  if ('status' in patch) {
    const s = patch.status as Status;
    return s ? `${t('logDet.statusPara')} "${t(statusKey(s))}"` : t('logDet.statusRemovido');
  }
  if ('notas' in patch) return t('logDet.notasEditadas');
  if ('titulo' in patch || 'categoria' in patch || 'fase' in patch) return t('logDet.dadosEditados');
  return t('logDet.cardEditado');
}
