import { useCards } from '../store/CardsContext';
import { Avatar } from '../components/Avatar';
import { fmtDataHora } from '../lib/fmtData';
import type { LogAcao } from '../data/types';

const ACAO_LABEL: Record<LogAcao, string> = {
  criou: 'Criou',
  editou: 'Editou',
  duplicou: 'Duplicou',
  excluiu: 'Excluiu',
};

export function Log() {
  const { log } = useCards();

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Log de atividades</h1>
          <div className="app-header-sub">Histórico de quem criou, editou, duplicou e excluiu</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>Exportar PDF</button>
        </div>
      </header>

      {log.length === 0 ? (
        <div className="sem-cards">Nenhuma atividade registrada ainda.</div>
      ) : (
        <div className="log-lista">
          {log.map((e) => (
            <div className="log-item" key={e.id}>
              <Avatar usuario={e.autor} fallbackNome={e.autor.nome} size={34} />
              <div className="log-corpo">
                <div className="log-linha1">
                  <strong>{e.autor.nome}</strong>
                  <span className={`log-acao log-${e.acao}`}>{ACAO_LABEL[e.acao]}</span>
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
