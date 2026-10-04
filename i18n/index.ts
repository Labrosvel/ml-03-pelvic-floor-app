import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import el from '@/i18n/locales/el';
import en from '@/i18n/locales/en';
import es from '@/i18n/locales/es';
import fr from '@/i18n/locales/fr';
import it from '@/i18n/locales/it';
import {
  AppLanguage,
  DATE_LOCALES,
  isResolvedLanguage,
  ResolvedLanguage,
} from '@/i18n/types';

export const resources = {
  en: { translation: en },
  el: { translation: el },
  it: { translation: it },
  es: { translation: es },
  fr: { translation: fr },
} as const;

export function resolveLanguage(preference: AppLanguage): ResolvedLanguage {
  if (isResolvedLanguage(preference)) {
    return preference;
  }

  const deviceCode = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  return isResolvedLanguage(deviceCode) ? deviceCode : 'en';
}

export function dateLocaleForLanguage(language: string): string {
  const code = language.split('-')[0];
  return isResolvedLanguage(code) ? DATE_LOCALES[code] : DATE_LOCALES.en;
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: resolveLanguage('system'),
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });
}

export async function applyLanguage(preference: AppLanguage): Promise<ResolvedLanguage> {
  const resolved = resolveLanguage(preference);
  const current = (i18n.language || '').split('-')[0];
  if (current !== resolved) {
    await i18n.changeLanguage(resolved);
  }
  return resolved;
}

export default i18n;
