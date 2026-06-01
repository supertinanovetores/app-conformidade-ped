import { useEffect, type ReactNode } from 'react';

export function Modal({ titulo, onClose, children, className }: { titulo: string; onClose: () => void; children: ReactNode; className?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal${className ? ' ' + className : ''}`} role="dialog" aria-modal="true">
        <div className="modal-titulo">{titulo}</div>
        {children}
      </div>
    </div>
  );
}
