export function fmtData(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('pt-BR');
}
