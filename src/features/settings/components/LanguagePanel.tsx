import { Pressable, Text, View } from 'react-native';

import { useI18n } from '@/shared/i18n/I18nContext';
import type { AppLanguage } from '@/shared/i18n/translations';

import { styles } from '../settings.styles';

const LANGUAGE_OPTIONS: { label: string; value: AppLanguage }[] = [
  { label: 'Portugues (BR)', value: 'pt-BR' },
  { label: 'English', value: 'en' },
];

type LanguagePanelProps = {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
};

export function LanguagePanel({ language, onChange }: LanguagePanelProps) {
  const { t } = useI18n();

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{t('settings.languageSection')}</Text>
      <Text style={styles.label}>{t('settings.appLanguage')}</Text>
      <View style={styles.segment}>
        {LANGUAGE_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.segmentButton, language === option.value && styles.segmentButtonActive]}
            onPress={() => onChange(option.value)}>
            <Text style={[styles.segmentText, language === option.value && styles.segmentTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
