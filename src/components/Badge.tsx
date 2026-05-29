import type { ReactNode } from 'react';

export function Badge({ tipo, children }: { tipo: 'cat' | 'fase'; children: ReactNode }) {
  return <span className={`badge badge-${tipo}`}>{children}</span>;
}
