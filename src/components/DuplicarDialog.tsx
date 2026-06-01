import type { Card } from '../data/types';
import { CATEGORIAS } from '../data/constants';
import { Modal } from './Modal';

export function DuplicarDialog({ card, onConfirm, onCancel }: { card: Card; onConfirm: () => void; onCancel: () => void }) {
  const nEt = card.etapas.length;
  return (
    <Modal titulo="Duplicar card" onClose={onCancel}>
      <p className="dup-intro">Uma cópia <strong>como modelo</strong> será criada com:</p>
      <ul className="dup-lista">
        <li><span>Título</span><strong>{card.titulo} (cópia)</strong></li>
        <li><span>Categoria</span><strong>{CATEGORIAS[card.categoria]}</strong></li>
        <li><span>Fase</span><strong>{card.fase}</strong></li>
        <li><span>Etapas do fluxo</span><strong>{nEt} (títulos e fases)</strong></li>
      </ul>
      <p className="dup-reset">
        Será <strong>zerado</strong> na cópia: status, notas e os feedbacks das etapas.
      </p>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onCancel}>Cancelar</button>
        <button className="app-btn app-btn-primary" onClick={onConfirm}>Duplicar</button>
      </div>
    </Modal>
  );
}
