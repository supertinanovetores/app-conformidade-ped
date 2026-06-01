import { donutSegmentos, type DonutItem } from '../lib/charts';

export function DonutChart({ data, size = 150 }: { data: DonutItem[]; size?: number }) {
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const total = data.reduce((soma, i) => soma + i.value, 0);
  const segs = donutSegmentos(data, c);

  return (
    <div className="donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
        <g transform={`rotate(-90 ${cx} ${cx})`}>
          <circle cx={cx} cy={cx} r={r} fill="none" strokeWidth={stroke} style={{ stroke: 'var(--app-border)' }} />
          {total > 0 &&
            segs.map((s) =>
              s.value > 0 ? (
                <circle
                  key={s.label}
                  cx={cx}
                  cy={cx}
                  r={r}
                  fill="none"
                  strokeWidth={stroke}
                  strokeDasharray={`${s.dash} ${c - s.dash}`}
                  strokeDashoffset={s.offset}
                  style={{ stroke: s.cor }}
                />
              ) : null,
            )}
        </g>
        <text x={cx} y={cx} textAnchor="middle" dominantBaseline="central" className="donut-total">{total}</text>
      </svg>
      <div className="donut-legenda">
        {segs.map((s) => (
          <div className="donut-leg-item" key={s.label}>
            <span className="donut-leg-dot" style={{ background: s.cor }} />
            <span className="donut-leg-label">{s.label}</span>
            <span className="donut-leg-val">{s.value} ({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
