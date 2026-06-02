import { useCards } from '../store/CardsContext';
import { Avatar } from '../components/Avatar';
import { fmtDataHora } from '../lib/fmtData';
import { useI18n } from '../i18n/LanguageContext';
import type { DictKey } from '../i18n/types';
import type { LogAcao } from '../data/types';

const ACAO_KEY: Record<LogAcao, DictKey> = {
  criou: 'log.acaoCriou',
  editou: 'log.acaoEditou',
  duplicou: 'log.acaoDuplicou',
  excluiu: 'log.acaoExcluiu',
};

export function Log() {
  const { log } = useCards();
  const { t } = useI18n();

  return (
    <>
      <header className="app-header">
        <div>
          <h1>{t('log.titulo')}</h1>
          <div className="app-header-sub">{t('log.subtitulo')}</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>{t('comum.exportarPdf')}</button>
        </div>
      </header>

      {log.length === 0 ? (
        <div className="sem-cards">{t('log.vazio')}</div>
      ) : (
        <div className="log-lista">
          {log.map((e) => (
            <div className="log-item" key={e.id}>
              <Avatar usuario={e.autor} fallbackNome={e.autor.nome} size={34} />
              <div className="log-corpo">
                <div className="log-linha1">
                  <strong>{e.autor.nome}</strong>
                  <span className={`log-acao log-${e.acao}`}>{t(ACAO_KEY[e.acao])}</span>
                  <span className="log-card">{e.cardTitulo}</span>
                </div>
                {e.detalhe && <div className="log-detalhe">{e.detalhe}</div>}
              </div>
              <div className="log-data">{fmtDataHora(e.ts)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
