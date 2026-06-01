import type { Card, Status, Etapa, Fase } from '../data/types';
import { CATEGORIAS, STATUS_OPTS, FASES, FASE_CLASSE } from '../data/constants';
import { uid } from '../lib/uid';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Autoria } from './Autoria';

interface Props {
  card: Card;
  onClose: () => void;
  onStatus: (status: Status) => void;
  onNotas: (notas: string) => void;
  onEtapas: (etapas: Etapa[]) => void;
}

export function CardDetalheModal({ card, onClose, onStatus, onNotas, onEtapas }: Props) {
  const nEt = card.etapas.length;
  const patchEtapa = (id: string, patch: Partial<Etapa>) =>
    onEtapas(card.etapas.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const addEtapa = () => onEtapas([...card.etapas, { id: uid(), titulo: '', fase: '', feedback: '' }]);
  const removeEtapa = (id: string) => onEtapas(card.etapas.filter((e) => e.id !== id));

  return (
    <Modal titulo={card.titulo} onClose={onClose} className="modal-largo">
      <div className="card-badges" style={{ marginBottom: 16 }}>
        <Badge tipo="cat">{CATEGORIAS[card.categoria]}</Badge>
        <Badge tipo="fase">{card.fase}</Badge>
      </div>

      {(card.solicitante || card.responsavel) && (
        <div className="card-pessoas" style={{ marginBottom: 16 }}>
          {card.solicitante && <span><b>Solicitante:</b> {card.solicitante}</span>}
          {card.responsavel && <span><b>Responsável:</b> {card.responsavel}</span>}
        </div>
      )}

      <div className="campo">
        <label>Status</label>
        <select
          className={`status-select ${card.status}`}
          value={card.status}
          onChange={(e) => onStatus(e.target.value as Status)}
        >
          <option value="">— Sem status</option>
          {STATUS_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>

      <div className="campo">
        <label>Notas e observações</label>
        <textarea
          className="card-notas"
          placeholder="Notas e observações..."
          defaultValue={card.notas}
          onBlur={(e) => onNotas(e.target.value)}
        />
      </div>

      <div className="secao-label">Fluxo do teste{nEt ? ` (${nEt} etapa${nEt > 1 ? 's' : ''})` : ''}</div>
      <div className="card-fluxo" style={{ borderTop: 'none', paddingTop: 0 }}>
        {card.etapas.length === 0 && (
          <div className="card-fluxo-vazio">Nenhuma etapa cadastrada. Adicione a primeira abaixo.</div>
        )}
        {card.etapas.map((e, i) => (
          <div className={`cfx-etapa ${e.fase ? FASE_CLASSE[e.fase] : ''}`} key={e.id}>
            <div className="cfx-cab">
              <span className="cfx-num">Etapa {i + 1}</span>
              <button className="btn-rem-etapa" onClick={() => removeEtapa(e.id)}>Remover</button>
            </div>
            <input
              className="cfx-input"
              defaultValue={e.titulo}
              placeholder="Descrição da etapa..."
              onBlur={(ev) => patchEtapa(e.id, { titulo: ev.target.value })}
            />
            <select
              className="cfx-select"
              value={e.fase}
              onChange={(ev) => patchEtapa(e.id, { fase: ev.target.value as Fase | '' })}
            >
              <option value="">Selecione a fase...</option>
              {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <textarea
              className="cfx-textarea"
              defaultValue={e.feedback}
              placeholder="Registre sua percepção / feedback..."
              onBlur={(ev) => patchEtapa(e.id, { feedback: ev.target.value })}
            />
          </div>
        ))}
        <button className="btn-add-etapa-inline" onClick={addEtapa}>+ Adicionar etapa</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <Autoria card={card} />
      </div>
    </Modal>
  );
}
