export const APP_LANGUAGES = ['system', 'en', 'el', 'it', 'es', 'fr'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const RESOLVED_LANGUAGES = ['en', 'el', 'it', 'es', 'fr'] as const;

export type ResolvedLanguage = (typeof RESOLVED_LANGUAGES)[number];

export const DATE_LOCALES: Record<ResolvedLanguage, string> = {
  en: 'en-GB',
  el: 'el-GR',
  it: 'it-IT',
  es: 'es-ES',
  fr: 'fr-FR',
};

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (APP_LANGUAGES as readonly string[]).includes(value);
}

export function isResolvedLanguage(value: unknown): value is ResolvedLanguage {
  return typeof value === 'string' && (RESOLVED_LANGUAGES as readonly string[]).includes(value);
}
