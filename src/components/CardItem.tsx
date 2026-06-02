import type { Card, Status } from '../data/types';
import { STATUS_VALUES } from '../data/constants';
import { useI18n } from '../i18n/LanguageContext';
import { categoriaKey, statusKey, faseKey } from '../i18n/labels';
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
  const { t } = useI18n();
  const nEt = card.etapas.length;
  return (
    <div className={`card ${card.status}`}>
      <div className="card-topo">
        <button className="card-titulo-btn" onClick={onAbrir} title={t('cardItem.abrirDetalhes')}>
          <span className="card-titulo">{card.titulo}</span>
        </button>
        <div className="card-acoes">
          <button className="btn-icone" title={t('cardItem.editar')} onClick={onEditar}>✎</button>
          <button className="btn-icone" title={t('comum.duplicar')} onClick={onDuplicar}>⧉</button>
          <button className="btn-icone btn-excluir" title={t('comum.excluir')} onClick={onExcluir}>✕</button>
        </div>
      </div>
      <div className="card-badges">
        <Badge tipo="cat">{t(categoriaKey(card.categoria))}</Badge>
        <Badge tipo="fase">{t(faseKey(card.fase))}</Badge>
      </div>
      {(card.solicitante || card.responsavel) && (
        <div className="card-pessoas">
          {card.solicitante && <span><b>{t('campo.solicitante')}:</b> {card.solicitante}</span>}
          {card.responsavel && <span><b>{t('campo.responsavel')}:</b> {card.responsavel}</span>}
        </div>
      )}
      <div className="card-status-row">
        <label>{t('comum.status')}</label>
        <select
          className={`status-select ${card.status}`}
          value={card.status}
          onChange={(e) => onStatus(e.target.value as Status)}
        >
          <option value="">{t('comum.semStatusOpt')}</option>
          {STATUS_VALUES.map((v) => (
            <option key={v} value={v}>{t(statusKey(v))}</option>
          ))}
        </select>
      </div>
      <textarea
        className="card-notas"
        placeholder={t('cardItem.notasPlaceholder')}
        defaultValue={card.notas}
        onBlur={(e) => onNotas(e.target.value)}
      />
      <button className="card-fluxo-info" onClick={onAbrir} title={t('cardItem.abrirDetalhes')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="6" height="6" rx="1.5" />
          <rect x="15" y="15" width="6" height="6" rx="1.5" />
          <path d="M9 6h4a2 2 0 0 1 2 2v7" />
        </svg>
        {t('cardItem.fluxo')} {nEt} {nEt !== 1 ? t('comum.etapas') : t('comum.etapa')}
      </button>
      <Autoria card={card} />
    </div>
  );
}
