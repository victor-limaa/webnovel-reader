import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { getAppSettings, updateAppSettings } from '@/features/settings/api/settings.repository';
import { useDatabase } from '@/infra/storage/useDatabase';
import { I18nContext, type I18nContextValue } from '@/shared/i18n/I18nContext';

import { DEFAULT_LANGUAGE, isAppLanguage, translations, type AppLanguage } from '@/shared/i18n/translations';

export function I18nProvider({ children }: { children: ReactNode }) {
  const db = useDatabase();
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
