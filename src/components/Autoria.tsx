import type { Card, Usuario } from '../data/types';
import { fmtData } from '../lib/fmtData';
import { useAuth } from '../auth/CurrentUserContext';
import { useI18n } from '../i18n/LanguageContext';
import { Avatar } from './Avatar';

export function Autoria({ card }: { card: Card }) {
  const { usuario: atual } = useAuth();
  const { t } = useI18n();

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
        <Avatar usuario={criador} fallbackNome={t('autoria.sistema')} size={18} />
        {t('autoria.criadoPor')} {criador?.nome ?? t('autoria.sistema')}
      </span>
      <span className="autoria-pessoa">
        {editor && <Avatar usuario={editor} size={18} />}
        {t('autoria.editadoPor')} {editor?.nome ?? '—'} {t('autoria.em')} {fmtData(card.atualizadoEm ?? card.criadoEm)}
      </span>
    </div>
  );
}
