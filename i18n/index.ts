import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import el from '@/i18n/locales/el';
import en from '@/i18n/locales/en';
import { AppLanguage, ResolvedLanguage } from '@/i18n/types';

export const resources = {
  en: { translation: en },
  el: { translation: el },
} as const;

export function resolveLanguage(preference: AppLanguage): ResolvedLanguage {
  if (preference === 'en' || preference === 'el') {
    return preference;
  }

  const deviceCode = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  return deviceCode === 'el' ? 'el' : 'en';
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
  if (i18n.language !== resolved) {
    await i18n.changeLanguage(resolved);
  }
  return resolved;
}

export default i18n;
