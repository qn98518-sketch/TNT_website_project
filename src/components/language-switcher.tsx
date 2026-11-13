'use client';

import { useTransition } from 'react';
import { changeLanguage } from '@/i18n/actions';
import { useI18n } from '@/i18n/provider';
import type { Locale } from '@/i18n/translate';

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const [pending, startTransition] = useTransition();
  return <div className="language-switcher" role="group" aria-label={locale === 'vi' ? 'Ngôn ngữ' : 'Language'} aria-busy={pending}>
    {(['vi', 'en'] as Locale[]).map(language => <button
      key={language} type="button" lang={language} disabled={pending}
      aria-pressed={locale === language}
      aria-label={language === 'vi' ? 'Tiếng Việt' : 'English'}
      onClick={() => startTransition(async () => { await changeLanguage(language); })}
    >{language.toUpperCase()}</button>)}
  </div>;
}
