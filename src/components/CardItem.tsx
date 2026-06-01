import { useNavigate } from 'react-router-dom';
import type { Card, Status } from '../data/types';
import { CATEGORIAS, STATUS_OPTS } from '../data/constants';
import { Badge } from './Badge';

interface Props {
  card: Card;
  onStatus: (status: Status) => void;
  onNotas: (notas: string) => void;
  onExcluir: () => void;
}

export function CardItem({ card, onStatus, onNotas, onExcluir }: Props) {
  const navigate = useNavigate();
  const nEt = card.etapas.length;

  return (
    <div className={`card ${card.status}`}>
      <div className="card-topo">
        <div className="card-titulo">{card.titulo}</div>
        <button className="btn-excluir" title="Excluir" onClick={onExcluir}>✕</button>
      </div>
      <div className="card-badges">
        <Badge tipo="cat">{CATEGORIAS[card.categoria]}</Badge>
        <Badge tipo="fase">{card.fase}</Badge>
      </div>
      <div className="card-status-row">
        <label>Status</label>
        <select
          className={`status-select ${card.status}`}
          value={card.status}
          onChange={(e) => onStatus(e.target.value as Status)}
        >
          <option value="">— Sem status</option>
          {STATUS_OPTS.map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>
      <textarea
        className="card-notas"
        placeholder="Notas e observações..."
        defaultValue={card.notas}
        onBlur={(e) => onNotas(e.target.value)}
      />
      <button className="btn-fluxo" onClick={() => navigate(`/conformidade/${card.id}/fluxo`)}>
        Fluxograma{nEt ? ` (${nEt} etapa${nEt > 1 ? 's' : ''})` : ''}
      </button>
    </div>
  );
}
