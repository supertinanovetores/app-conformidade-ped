import { useCards } from '../store/CardsContext';
import { contarStatus, contarPor, contarTexto } from '../data/derive';
import { StatCard } from '../components/StatCard';
import { DonutChart } from '../components/DonutChart';
import { BarChart } from '../components/BarChart';
import { CATEGORIAS, FASES } from '../data/constants';
import type { Categoria } from '../data/types';

export function Painel() {
  const { cards } = useCards();
  const s = contarStatus(cards);
  const porCat = contarPor(cards, 'categoria');
  const porFase = contarPor(cards, 'fase');

  const semStatus = s.total - s.conforme - s.parcial - s.reprovado;
  const statusData = [
    { label: 'Conforme', value: s.conforme, cor: 'var(--app-green)' },
    { label: 'Parcial', value: s.parcial, cor: 'var(--app-yellow)' },
    { label: 'Reprovado', value: s.reprovado, cor: 'var(--app-red)' },
    { label: 'Sem status', value: semStatus, cor: 'var(--fg-3)' },
  ];

  const categoriaData = (Object.keys(CATEGORIAS) as Categoria[]).map((cat) => ({
    label: CATEGORIAS[cat],
    value: porCat[cat] ?? 0,
  }));

  const porSolicitante = contarTexto(cards, 'solicitante');
  const porResponsavel = contarTexto(cards, 'responsavel');

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Painel</h1>
          <div className="app-header-sub">Visão geral da conformidade de testes P&D</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>Exportar PDF</button>
        </div>
      </header>

      <div className="stats-row">
        <StatCard label="Conforme" value={s.conforme} cor="green" />
        <StatCard label="Parcial" value={s.parcial} cor="yellow" />
        <StatCard label="Reprovado" value={s.reprovado} cor="red" />
        <StatCard label="Total" value={s.total} cor="blue" />
      </div>

      <div className="painel-graficos">
        <div className="resumo-bloco">
          <h3>Distribuição por status</h3>
          <DonutChart data={statusData} />
        </div>
        <div className="resumo-bloco">
          <h3>Testes por categoria</h3>
          <BarChart data={categoriaData} />
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

        <div className="resumo-bloco">
          <h3>Por solicitante</h3>
          {porSolicitante.map((s) => (
            <div className="resumo-linha" key={s.label}>
              <span>{s.label}</span>
              <span className="v">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="resumo-bloco">
          <h3>Por responsável</h3>
          {porResponsavel.map((r) => (
            <div className="resumo-linha" key={r.label}>
              <span>{r.label}</span>
              <span className="v">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
