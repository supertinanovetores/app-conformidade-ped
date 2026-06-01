import { useCards } from '../store/CardsContext';
import { contarStatus, contarPor } from '../data/derive';
import { StatCard } from '../components/StatCard';
import { CATEGORIAS, FASES } from '../data/constants';
import type { Categoria } from '../data/types';

export function Painel() {
  const { cards } = useCards();
  const s = contarStatus(cards);
  const porCat = contarPor(cards, 'categoria');
  const porFase = contarPor(cards, 'fase');

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Painel</h1>
          <div className="app-header-sub">Visão geral da conformidade de testes P&D</div>
        </div>
      </header>

      <div className="stats-row">
        <StatCard label="Conforme" value={s.conforme} cor="green" />
        <StatCard label="Parcial" value={s.parcial} cor="yellow" />
        <StatCard label="Reprovado" value={s.reprovado} cor="red" />
        <StatCard label="Total" value={s.total} cor="blue" />
      </div>

      <div className="resumo-grid">
        <div className="resumo-bloco">
          <h3>Por categoria</h3>
          {(Object.keys(CATEGORIAS) as Categoria[]).map((cat) => (
            <div className="resumo-linha" key={cat}>
              <span>{CATEGORIAS[cat]}</span>
              <span className="v">{porCat[cat] ?? 0}</span>
            </div>
          ))}
        </div>
        <div className="resumo-bloco">
          <h3>Por fase</h3>
          {FASES.map((fase) => (
            <div className="resumo-linha" key={fase}>
              <span>{fase}</span>
              <span className="v">{porFase[fase] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
