import { createContext, useContext, useCallback, useRef, useState, type ReactNode } from 'react';

interface ToastState { msg: string; erro: boolean; }
const Ctx = createContext<(msg: string, erro?: boolean) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((msg: string, erro = false) => {
    setToast({ msg, erro });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      {toast && <div className={'toast' + (toast.erro ? ' erro' : '')}>{toast.msg}</div>}
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
