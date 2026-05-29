import { Modal } from './Modal';

export function ConfirmDialog({ mensagem, onConfirm, onCancel }: { mensagem: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal titulo="Confirmar" onClose={onCancel}>
      <p style={{ marginBottom: 20 }}>{mensagem}</p>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onCancel}>Cancelar</button>
        <button className="app-btn app-btn-danger" onClick={onConfirm}>Excluir</button>
      </div>
    </Modal>
  );
}
