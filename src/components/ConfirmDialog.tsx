import { Modal } from './Modal';
import { useI18n } from '../i18n/LanguageContext';

export function ConfirmDialog({ mensagem, onConfirm, onCancel }: { mensagem: string; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useI18n();
  return (
    <Modal titulo={t('confirm.titulo')} onClose={onCancel}>
      <p style={{ marginBottom: 20 }}>{mensagem}</p>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onCancel}>{t('comum.cancelar')}</button>
        <button className="app-btn app-btn-danger" onClick={onConfirm}>{t('comum.excluir')}</button>
      </div>
    </Modal>
  );
}
