import type { Usuario } from '../data/types';

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const a = partes[0]?.[0] ?? '';
  const b = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (a + b).toUpperCase() || '?';
}

interface Props {
  usuario?: Usuario | null;
  fallbackNome?: string;
  size?: number;
}

export function Avatar({ usuario, fallbackNome = '?', size = 28 }: Props) {
  const nome = usuario?.nome ?? fallbackNome;
  const dim = { width: size, height: size };

  if (usuario?.foto) {
    return <img className="avatar" src={usuario.foto} alt={nome} style={dim} />;
  }
  return (
    <span className="avatar avatar-iniciais" style={{ ...dim, fontSize: Math.round(size * 0.4) }}>
      {iniciais(nome)}
    </span>
  );
}
