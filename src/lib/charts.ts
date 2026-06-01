export interface DonutItem {
  label: string;
  value: number;
  cor: string;
}

export interface DonutSegmento extends DonutItem {
  pct: number;
  dash: number;
  offset: number;
}

/**
 * Calcula os segmentos de um gráfico de rosca (donut) para uso com
 * stroke-dasharray/stroke-dashoffset num <circle> SVG.
 * `circunferencia` = 2πr do círculo base.
 */
export function donutSegmentos(items: DonutItem[], circunferencia: number): DonutSegmento[] {
  const total = items.reduce((soma, i) => soma + i.value, 0);
  let acumulado = 0;
  return items.map((i) => {
    const frac = total > 0 ? i.value / total : 0;
    const dash = frac * circunferencia;
    const seg: DonutSegmento = {
      ...i,
      pct: total > 0 ? Math.round(frac * 100) : 0,
      dash,
      offset: acumulado === 0 ? 0 : -acumulado,
    };
    acumulado += dash;
    return seg;
  });
}
