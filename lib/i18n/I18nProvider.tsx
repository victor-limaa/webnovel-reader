import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getAppSettings, updateAppSettings } from '@/lib/data/repository';

import { DEFAULT_LANGUAGE, isAppLanguage, translations, type AppLanguage, type TranslationKey } from './translations';

type I18nContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    getAppSettings(db).then((settings) => {
      setLanguageState(isAppLanguage(settings?.language) ? settings.language : DEFAULT_LANGUAGE);
    });
  }, [db]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage: async (nextLanguage) => {
      setLanguageState(nextLanguage);
      await updateAppSettings(db, { language: nextLanguage });
    },
    t: (key, params) => {
      const dictionary = translations[language] ?? translations[DEFAULT_LANGUAGE];
      let value: string = dictionary[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;

      if (params) {
        for (const [name, paramValue] of Object.entries(params)) {
          value = value.replaceAll(`{{${name}}}`, String(paramValue));
        }
      }

      return value;
    },
  }), [db, language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}
