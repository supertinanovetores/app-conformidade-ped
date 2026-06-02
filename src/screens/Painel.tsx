import { useCards } from '../store/CardsContext';
import { contarStatus, contarPor, contarTexto } from '../data/derive';
import { StatCard } from '../components/StatCard';
import { DonutChart } from '../components/DonutChart';
import { BarChart } from '../components/BarChart';
import { CATEGORIAS, FASES } from '../data/constants';
import { useI18n } from '../i18n/LanguageContext';
import { categoriaKey, faseKey } from '../i18n/labels';

export function Painel() {
  const { cards } = useCards();
  const { t } = useI18n();
  const s = contarStatus(cards);
  const porCat = contarPor(cards, 'categoria');
  const porFase = contarPor(cards, 'fase');

  const semStatus = s.total - s.conforme - s.parcial - s.reprovado;
  const statusData = [
    { label: t('status.conforme'), value: s.conforme, cor: 'var(--app-green)' },
    { label: t('status.parcial'), value: s.parcial, cor: 'var(--app-yellow)' },
    { label: t('status.reprovado'), value: s.reprovado, cor: 'var(--app-red)' },
    { label: t('painel.semStatus'), value: semStatus, cor: 'var(--fg-3)' },
  ];

  const categoriaData = CATEGORIAS.map((cat) => ({
    label: t(categoriaKey(cat)),
    value: porCat[cat] ?? 0,
  }));

  const porSolicitante = contarTexto(cards, 'solicitante');
  const porResponsavel = contarTexto(cards, 'responsavel');

  return (
    <>
      <header className="app-header">
        <div>
          <h1>{t('painel.titulo')}</h1>
          <div className="app-header-sub">{t('painel.subtitulo')}</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>{t('comum.exportarPdf')}</button>
        </div>
      </header>

      <div className="stats-row">
        <StatCard label={t('status.conforme')} value={s.conforme} cor="green" />
        <StatCard label={t('status.parcial')} value={s.parcial} cor="yellow" />
        <StatCard label={t('status.reprovado')} value={s.reprovado} cor="red" />
        <StatCard label={t('painel.total')} value={s.total} cor="blue" />
      </div>

      <div className="painel-graficos">
        <div className="resumo-bloco">
          <h3>{t('painel.distStatus')}</h3>
          <DonutChart data={statusData} />
        </div>
        <div className="resumo-bloco">
          <h3>{t('painel.porCategoria')}</h3>
          <BarChart data={categoriaData} />
        </div>
        <div className="resumo-bloco">
          <h3>{t('painel.porFase')}</h3>
          {FASES.map((fase) => (
            <div className="resumo-linha" key={fase}>
              <span>{t(faseKey(fase))}</span>
              <span className="v">{porFase[fase] ?? 0}</span>
            </div>
          ))}
        </div>

        <div className="resumo-bloco">
          <h3>{t('painel.porSolicitante')}</h3>
          {porSolicitante.map((s) => (
            <div className="resumo-linha" key={s.label}>
              <span>{s.label}</span>
              <span className="v">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="resumo-bloco">
          <h3>{t('painel.porResponsavel')}</h3>
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
