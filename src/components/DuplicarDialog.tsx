import type { Card } from '../data/types';
import { Modal } from './Modal';
import { useI18n } from '../i18n/LanguageContext';
import { categoriaKey, faseKey } from '../i18n/labels';

export function DuplicarDialog({ card, onConfirm, onCancel }: { card: Card; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useI18n();
  const nEt = card.etapas.length;
  return (
    <Modal titulo={t('dup.titulo')} onClose={onCancel}>
      <p className="dup-intro">{t('dup.intro1')}<strong>{t('dup.modelo')}</strong>{t('dup.intro2')}</p>
      <ul className="dup-lista">
        <li><span>{t('campo.titulo')}</span><strong>{card.titulo} {t('dup.copia')}</strong></li>
        <li><span>{t('campo.categoria')}</span><strong>{t(categoriaKey(card.categoria))}</strong></li>
        <li><span>{t('campo.fase')}</span><strong>{t(faseKey(card.fase))}</strong></li>
        <li><span>{t('cardModal.etapasFluxo')}</span><strong>{nEt} {t('dup.titulosEFases')}</strong></li>
      </ul>
      <p className="dup-reset">
        {t('dup.reset1')}<strong>{t('dup.zerado')}</strong>{t('dup.reset2')}
      </p>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onCancel}>{t('comum.cancelar')}</button>
        <button className="app-btn app-btn-primary" onClick={onConfirm}>{t('comum.duplicar')}</button>
      </div>
    </Modal>
  );
}
