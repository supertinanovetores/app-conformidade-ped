import type { Card, Status } from '../data/types';
import { CATEGORIAS, STATUS_OPTS } from '../data/constants';
import { Badge } from './Badge';
import { Autoria } from './Autoria';

interface Props {
  card: Card;
  onStatus: (status: Status) => void;
  onNotas: (notas: string) => void;
  onAbrir: () => void;
  onEditar: () => void;
  onDuplicar: () => void;
  onExcluir: () => void;
}

export function CardItem({ card, onStatus, onNotas, onAbrir, onEditar, onDuplicar, onExcluir }: Props) {
  const nEt = card.etapas.length;
  return (
    <div className={`card ${card.status}`}>
      <div className="card-topo">
        <button className="card-titulo-btn" onClick={onAbrir} title="Abrir detalhes e fluxo">
          <span className="card-titulo">{card.titulo}</span>
        </button>
        <div className="card-acoes">
          <button className="btn-icone" title="Editar" onClick={onEditar}>✎</button>
          <button className="btn-icone" title="Duplicar" onClick={onDuplicar}>⧉</button>
          <button className="btn-icone btn-excluir" title="Excluir" onClick={onExcluir}>✕</button>
        </div>
      </div>
      <div className="card-badges">
        <Badge tipo="cat">{CATEGORIAS[card.categoria]}</Badge>
        <Badge tipo="fase">{card.fase}</Badge>
      </div>
      {(card.solicitante || card.responsavel) && (
        <div className="card-pessoas">
          {card.solicitante && <span><b>Solicitante:</b> {card.solicitante}</span>}
          {card.responsavel && <span><b>Responsável:</b> {card.responsavel}</span>}
        </div>
      )}
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
      <button className="card-fluxo-info" onClick={onAbrir} title="Abrir detalhes e fluxo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="6" height="6" rx="1.5" />
          <rect x="15" y="15" width="6" height="6" rx="1.5" />
          <path d="M9 6h4a2 2 0 0 1 2 2v7" />
        </svg>
        Fluxo: {nEt} etapa{nEt !== 1 ? 's' : ''}
      </button>
      <Autoria card={card} />
    </div>
  );
}
