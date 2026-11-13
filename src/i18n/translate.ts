import english from './en.json';

export type Locale = 'vi' | 'en';
export const localeCookie = 'tnt-locale';
const dictionary: Record<string, string> = english;

export function translate<T>(value: T, locale: Locale): T {
  if (typeof value !== 'string' || locale === 'vi') return value;
  const key = value.replace(/\s+/g, ' ').trim();
  let result = dictionary[key];
  if (!result) {
    // Composed labels, counts and file descriptions retain their data values.
    result = key.replace(/(\d+) kết quả/g, '$1 results')
      .replace(/(\d+) phút đọc/g, '$1 min read')
      .replace(/(\d+) năm kinh nghiệm/g, '$1 years of experience');
    if (result === key) {
      for (const part of key.split(/(?<=[.!?])\s+|(?=PDF ·)/)) {
        if (dictionary[part]) result = result.replace(part, dictionary[part]);
      }
    }
  }
  const leading = /^\s/.test(value) ? ' ' : '';
  const trailing = /\s$/.test(value) ? ' ' : '';
  return (leading + result + trailing) as T;
}

export function createTranslator(locale: Locale) {
  return <T,>(value: T): T => translate(value, locale);
}
