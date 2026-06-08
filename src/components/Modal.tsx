import { useEffect, useId, useRef, type ReactNode } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ titulo, onClose, children, className }: { titulo: string; onClose: () => void; children: ReactNode; className?: string }) {
  const tituloId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusables = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    // Restaura o foco ao elemento que abriu o modal quando ele fecha.
    const previousFocus = document.activeElement as HTMLElement | null;
    // Move o foco para dentro do modal, a menos que um filho já o tenha (ex.: autoFocus).
    if (!modalRef.current?.contains(document.activeElement)) {
      focusables()[0]?.focus();
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={modalRef} className={`modal${className ? ' ' + className : ''}`} role="dialog" aria-modal="true" aria-labelledby={tituloId}>
        <div className="modal-titulo" id={tituloId}>{titulo}</div>
        {children}
      </div>
    </div>
  );
}
