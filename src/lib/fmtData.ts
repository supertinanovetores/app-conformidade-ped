export function fmtData(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('pt-BR');
}

export function fmtDataHora(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
