import type { Card, Status, Etapa, Fase } from '../data/types';
import { STATUS_VALUES, FASES, FASE_CLASSE } from '../data/constants';
import { useI18n } from '../i18n/LanguageContext';
import { categoriaKey, statusKey, faseKey } from '../i18n/labels';
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
  const { t } = useI18n();
  const nEt = card.etapas.length;
  const patchEtapa = (id: string, patch: Partial<Etapa>) =>
    onEtapas(card.etapas.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const addEtapa = () => onEtapas([...card.etapas, { id: uid(), titulo: '', fase: '', feedback: '' }]);
  const removeEtapa = (id: string) => onEtapas(card.etapas.filter((e) => e.id !== id));

  return (
    <Modal titulo={card.titulo} onClose={onClose} className="modal-largo">
      <div className="card-badges" style={{ marginBottom: 16 }}>
        <Badge tipo="cat">{t(categoriaKey(card.categoria))}</Badge>
        <Badge tipo="fase">{t(faseKey(card.fase))}</Badge>
      </div>

      {(card.solicitante || card.responsavel) && (
        <div className="card-pessoas" style={{ marginBottom: 16 }}>
          {card.solicitante && <span><b>{t('campo.solicitante')}:</b> {card.solicitante}</span>}
          {card.responsavel && <span><b>{t('campo.responsavel')}:</b> {card.responsavel}</span>}
        </div>
      )}

      <div className="campo">
        <label>{t('comum.status')}</label>
        <select
          className={`status-select ${card.status}`}
          value={card.status}
          onChange={(e) => onStatus(e.target.value as Status)}
        >
          <option value="">{t('comum.semStatusOpt')}</option>
          {STATUS_VALUES.map((v) => <option key={v} value={v}>{t(statusKey(v))}</option>)}
        </select>
      </div>

      <div className="campo">
        <label>{t('detalhe.notasLabel')}</label>
        <textarea
          className="card-notas"
          placeholder={t('cardItem.notasPlaceholder')}
          defaultValue={card.notas}
          onBlur={(e) => onNotas(e.target.value)}
        />
      </div>

      <div className="secao-label">{t('detalhe.fluxoTeste')}{nEt ? ` (${nEt} ${nEt > 1 ? t('comum.etapas') : t('comum.etapa')})` : ''}</div>
      <div className="card-fluxo" style={{ borderTop: 'none', paddingTop: 0 }}>
        {card.etapas.length === 0 && (
          <div className="card-fluxo-vazio">{t('detalhe.nenhumaEtapa')}</div>
        )}
        {card.etapas.map((e, i) => (
          <div className={`cfx-etapa ${e.fase ? FASE_CLASSE[e.fase] : ''}`} key={e.id}>
            <div className="cfx-cab">
              <span className="cfx-num">{t('detalhe.etapa')} {i + 1}</span>
              <button className="btn-rem-etapa" onClick={() => removeEtapa(e.id)}>{t('detalhe.remover')}</button>
            </div>
            <input
              className="cfx-input"
              defaultValue={e.titulo}
              placeholder={t('detalhe.descricaoEtapa')}
              onBlur={(ev) => patchEtapa(e.id, { titulo: ev.target.value })}
            />
            <select
              className="cfx-select"
              value={e.fase}
              onChange={(ev) => patchEtapa(e.id, { fase: ev.target.value as Fase | '' })}
            >
              <option value="">{t('detalhe.selecioneFase')}</option>
              {FASES.map((f) => <option key={f} value={f}>{t(faseKey(f))}</option>)}
            </select>
            <textarea
              className="cfx-textarea"
              defaultValue={e.feedback}
              placeholder={t('detalhe.feedbackPlaceholder')}
              onBlur={(ev) => patchEtapa(e.id, { feedback: ev.target.value })}
            />
          </div>
        ))}
        <button className="btn-add-etapa-inline" onClick={addEtapa}>{t('detalhe.adicionarEtapa')}</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <Autoria card={card} />
      </div>
    </Modal>
  );
}
