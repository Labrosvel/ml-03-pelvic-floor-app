import type { AppLanguage, ResolvedLanguage } from '@/i18n/types';

export const LANGUAGE_OPTIONS: {
  value: AppLanguage;
  labelKey:
    | 'languageSystem'
    | 'languageEn'
    | 'languageEl'
    | 'languageIt'
    | 'languageEs'
    | 'languageFr';
}[] = [
  { value: 'system', labelKey: 'languageSystem' },
  { value: 'en', labelKey: 'languageEn' },
  { value: 'el', labelKey: 'languageEl' },
  { value: 'it', labelKey: 'languageIt' },
  { value: 'es', labelKey: 'languageEs' },
  { value: 'fr', labelKey: 'languageFr' },
];

export const LANGUAGE_SHORT_CODES: Record<ResolvedLanguage, string> = {
  en: 'EN',
  el: 'EL',
  it: 'IT',
  es: 'ES',
  fr: 'FR',
};
