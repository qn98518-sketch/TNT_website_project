import { cache } from 'react';
import { cookies } from 'next/headers';
import { createTranslator, localeCookie, type Locale } from './translate';

export const getI18n = cache(async () => {
  const value = (await cookies()).get(localeCookie)?.value;
  const locale: Locale = value === 'en' ? 'en' : 'vi';
  return { locale, t: createTranslator(locale) };
});
