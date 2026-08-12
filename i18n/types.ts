export const APP_LANGUAGES = ['system', 'en', 'el'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export type ResolvedLanguage = 'en' | 'el';

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (APP_LANGUAGES as readonly string[]).includes(value);
}
