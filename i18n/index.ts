import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  isResolvedLanguage,
  type AppLanguage,
  type ResolvedLanguage,
} from '@/i18n/languages';
import el from '@/i18n/locales/el';
import en from '@/i18n/locales/en';

export const resources = {
  en: { translation: en },
  el: { translation: el },
} as const;

export function resolveLanguage(preference: AppLanguage): ResolvedLanguage {
  if (isResolvedLanguage(preference)) {
    return preference;
  }

  const deviceCode = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  return isResolvedLanguage(deviceCode) ? deviceCode : 'en';
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
