'use server';

import { cookies } from 'next/headers';
import { localeCookie, type Locale } from './translate';

export async function changeLanguage(locale: Locale) {
  if (locale !== 'vi' && locale !== 'en') throw new Error('Unsupported language');
  (await cookies()).set(localeCookie, locale, {
    path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}
