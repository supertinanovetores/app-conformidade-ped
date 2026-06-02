import { useI18n } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/types';

const OPCOES: { lang: Lang; bandeira: string; labelKey: 'a11y.idiomaPt' | 'a11y.idiomaEn' }[] = [
  { lang: 'pt', bandeira: '/assets/flag-br.svg', labelKey: 'a11y.idiomaPt' },
  { lang: 'en', bandeira: '/assets/flag-us.svg', labelKey: 'a11y.idiomaEn' },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="lang-switcher" role="group">
      {OPCOES.map((op) => (
        <button
          key={op.lang}
          type="button"
          className={'lang-btn' + (lang === op.lang ? ' active' : '')}
          aria-label={t(op.labelKey)}
          aria-pressed={lang === op.lang}
          onClick={() => setLang(op.lang)}
        >
          <img src={op.bandeira} alt="" width={22} height={16} />
        </button>
      ))}
    </div>
  );
}
