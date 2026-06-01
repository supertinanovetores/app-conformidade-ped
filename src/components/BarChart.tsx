export interface BarItem {
  label: string;
  value: number;
}

export function BarChart({ data, cor = 'var(--app-accent)' }: { data: BarItem[]; cor?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="barras">
      {data.map((d) => (
        <div className="barra-row" key={d.label}>
          <span className="barra-label" title={d.label}>{d.label}</span>
          <div className="barra-track">
            <div className="barra-fill" style={{ width: `${(d.value / max) * 100}%`, background: cor }} />
          </div>
          <span className="barra-val">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
