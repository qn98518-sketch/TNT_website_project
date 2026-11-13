'use client';

import { createContext, useContext, useMemo } from 'react';
import { createTranslator, type Locale } from './translate';

const LanguageContext = createContext<Locale>('vi');

export function LanguageProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const locale = useContext(LanguageContext);
  const t = useMemo(() => createTranslator(locale), [locale]);
  return { locale, t };
}
