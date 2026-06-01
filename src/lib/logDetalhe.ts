import type { Card, Status } from '../data/types';
import { STATUS_LABEL } from '../data/constants';

/** Descreve, em texto curto, o que uma edição de card alterou (para o log). */
export function descreverEdicao(patch: Partial<Card>): string {
  if ('status' in patch) {
    const s = patch.status as Status;
    return s ? `Alterou o status para "${STATUS_LABEL[s]}"` : 'Removeu o status';
  }
  if ('notas' in patch) return 'Editou as notas';
  if ('titulo' in patch || 'categoria' in patch || 'fase' in patch) return 'Editou os dados do card';
  return 'Editou o card';
}
