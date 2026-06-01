import type { Card, Usuario } from '../data/types';
import { fmtData } from '../lib/fmtData';
import { useAuth } from '../auth/CurrentUserContext';
import { Avatar } from './Avatar';

export function Autoria({ card }: { card: Card }) {
  const { usuario: atual } = useAuth();

  // Se o autor for o usuário logado, usa a foto da sessão atual — assim a foto
  // aparece mesmo em cards carimbados antes de a foto ter sido carregada.
  const resolver = (u?: Usuario): Usuario | undefined => {
    if (u && atual?.foto && u.email && u.email === atual.email) {
      return { ...u, foto: atual.foto };
    }
    return u;
  };

  const criador = resolver(card.criadoPor);
  const editor = resolver(card.atualizadoPor);

  return (
    <div className="card-autoria">
      <span className="autoria-pessoa">
        <Avatar usuario={criador} fallbackNome="Sistema" size={18} />
        criado por {criador?.nome ?? 'Sistema'}
      </span>
      <span className="autoria-pessoa">
        {editor && <Avatar usuario={editor} size={18} />}
        editado por {editor?.nome ?? '—'} em {fmtData(card.atualizadoEm ?? card.criadoEm)}
      </span>
    </div>
  );
}
