/**
 * Shipped app languages.
 *
 * To add a language later:
 * 1. Create `i18n/locales/<code>.ts` (copy `en.ts`, translate all strings — especially Learn articles).
 * 2. Register it in `i18n/index.ts` resources.
 * 3. Add one entry below (native name + date locale).
 *
 * Prefer clinic-needed languages with reviewed clinical copy over a long Store-style list
 * of unreviewed machine translations.
 */
export const RESOLVED_LANGUAGES = [
  { code: 'en', nativeName: 'English', dateLocale: 'en-GB' },
  { code: 'el', nativeName: 'Ελληνικά', dateLocale: 'el-GR' },
] as const;

export type ResolvedLanguage = (typeof RESOLVED_LANGUAGES)[number]['code'];

export const RESOLVED_LANGUAGE_CODES = RESOLVED_LANGUAGES.map((entry) => entry.code) as [
  ResolvedLanguage,
  ...ResolvedLanguage[],
];

export const APP_LANGUAGES = ['system', ...RESOLVED_LANGUAGE_CODES] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (APP_LANGUAGES as readonly string[]).includes(value);
}

export function isResolvedLanguage(value: unknown): value is ResolvedLanguage {
  return typeof value === 'string' && (RESOLVED_LANGUAGE_CODES as readonly string[]).includes(value);
}

export function getLanguageNativeName(code: ResolvedLanguage): string {
  const match = RESOLVED_LANGUAGES.find((entry) => entry.code === code);
  return match?.nativeName ?? code;
}

export function getDateLocale(code: string | undefined): string {
  const normalized = (code || '').split('-')[0];
  const match = RESOLVED_LANGUAGES.find((entry) => entry.code === normalized);
  return match?.dateLocale ?? 'en-GB';
}

export function languagePreferenceLabel(
  preference: AppLanguage,
  systemLabel: string,
): string {
  if (preference === 'system') return systemLabel;
  return getLanguageNativeName(preference);
}
